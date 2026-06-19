---
title: プラグイン開発
description: Dibao 0.2 のプラグイン manifest、capability、Host API、iframe bridge、packaging、signing、release checklist。
---

この文書はサードパーティプラグイン開発者向けです。Dibao `0.2.x` のプラグイン system は「管理者が信頼してインストールするエコシステム版」です。プラグインは server task、hook、settings page、Web UI を拡張できますが、信頼済みローカルコードとして扱われます。任意の悪意あるコードを安全に実行できる sandbox ではありません。

[Webhook](webhook/) や Daily Brief などの公式プラグインも、同じ manifest、capability、contribution、lifecycle model を使います。サードパーティプラグインでは、さらに signing、trusted key、install、enable の流れが必要です。

## セキュリティモデル

- server plugin は独立した Node host 子プロセスで動作し、JSON-RPC Host API だけを呼び出します。
- main process は `db`、`process`、Fastify `request/reply`、内部 service を plugin に渡しません。
- Web plugin は `sandbox="allow-scripts allow-forms"` iframe で動作し、`allow-same-origin` は付与されません。
- plugin page は Dibao API を直接 `fetch` せず、`postMessage` bridge を使います。
- plugin HTML には CSP が付きます。直接 `fetch`、form submit、既定の外部 resource は禁止されます。inline script/style と `/api/plugins/ui.css` は許可されます。
- サードパーティ plugin は install 後も既定では無効です。有効化前に source、signature trust、capabilities、Stable/Beta API、server code risk を確認してください。

## Manifest v1

`.dibao-plugin` は JSON package です。top-level に `manifest`、`files`、任意の `updateUrl` と `signature` を含みます。

```json
{
  "manifest": {
    "manifestVersion": 1,
    "id": "dev.example.reader-tools",
    "name": "Reader Tools",
    "version": "0.1.0",
    "publisher": "Example",
    "dibao": { "minVersion": "0.2.0", "maxVersion": "<0.3.0" },
    "entry": { "server": "server/index.mjs", "web": "web/index.html" },
    "capabilities": ["settings:plugin", "files:plugin-data", "jobs:write"],
    "migrations": [
      { "version": "001", "name": "create_notes", "path": "migrations/001_create_notes.sql" }
    ],
    "contributes": {
      "settingsTabs": [
        {
          "id": "settings",
          "title": "Reader Tools",
          "slot": "settings.tabs",
          "route": "settings",
          "order": 90,
          "icon": "settings"
        }
      ],
      "hooks": ["maintenance.tick"],
      "tasks": [
        {
          "id": "readerTools.refresh",
          "kind": "background",
          "schedule": "manual",
          "defaultEnabled": false
        }
      ]
    }
  },
  "files": {
    "server/index.mjs": "export default { async activate(ctx) {} }",
    "web/index.html": "<!doctype html><html></html>"
  },
  "updateUrl": "https://example.com/plugins/reader-tools/latest.json"
}
```

`id` は reverse-domain または安定した namespace を推奨します。互換範囲は `<0.3.0` のように上限を明示し、将来の breaking API で自動有効化されないようにします。

## Capabilities

Dibao `0.2.x` の capabilities:

```text
articles:read
articles:write
feeds:read
feeds:write
ranking:read
ranking:write
settings:plugin
settings:core:read
settings:core:write
jobs:read
jobs:write
database:plugin
network:outbound
secrets:plugin
deliveries:read
deliveries:write
files:plugin-data
telemetry:emit
```

必要最小限だけを宣言してください。`network:outbound` には SSRF protection、size limit、redirect limit、timeout があります。機密 header は普通の settings や static headers に入れず、`secrets:plugin` と delivery `secretHeaders` で参照してください。

## Contributions

`contributes` は plugin が UI や runtime のどこに現れるかを決めます。

- `settingsTabs`: settings 内の plugin configuration tab。一般的な slot は `settings.tabs`。
- `tabs` / `routes`: main app navigation や plugin page entry。Daily Brief など。
- `actions`: article list や toolbar の action button。
- `setupSteps`: 初回 setup の optional plugin step。
- `hooks`: plugin が購読する Dibao events。
- `events`: plugin が emit できる events。
- `tasks`: foreground/background tasks。`manual`、`interval`、`daily`、`weekly` の schedule を宣言できます。

よく使う UI slots:

```text
app.main.nav.items
app.main.tabs
article.list.item.actions.end
article.list.toolbar.end
article.reader.bottomSheet.actions
settings.tabs
algorithm.jobs.actions
```

## Events

plugin は次の events を購読または宣言できます。

```text
article.created
article.updated
article.actionRecorded
feed.refreshCompleted
ranking.afterRanked
settings.afterUpdated
plugin.taskSucceeded
plugin.taskFailed
maintenance.tick
dailyBrief.generated
```

Hook には timeout protection があります。hot hook の中で大量の network fan-out をしないでください。外部 HTTP 送信には `deliveries` を優先します。

## API 安定性

Stable:

- `manifest.v1`
- `lifecycle.installEnableDisableUpdate`
- `settings`
- `storage`
- `secrets`
- `deliveries`
- `tasks`
- `hooks.basic`
- `events.catalog`
- `iframe.bridge`
- `database.migrations`
- `network.outbound`

Beta:

- `database.defineTable`
- `ranking`
- `articles.snapshot`
- `diagnostics`

Beta API は `0.2.x` 中に field や semantics が変わる可能性があります。長期運用する plugin は、durable schema を `database.defineTable` だけに頼らず manifest migrations で管理してください。

## Server Entry

`activate(ctx)` を export します。Host API は asynchronous JSON-RPC call です。

```js
export default {
  async activate(ctx) {
    ctx.hooks.on("maintenance.tick", async () => {
      await ctx.storage.set("lastTickAt", await ctx.now());
    });

    ctx.tasks.register("readerTools.refresh", async () => {
      await ctx.storage.set("lastRefreshAt", await ctx.now());
    });

    ctx.api.get("/state", async () => ({
      settings: await ctx.settings.list(),
      lastRefreshAt: await ctx.storage.get("lastRefreshAt"),
      generatedAt: await ctx.now()
    }));
  }
};
```

有効化時に server entry は pre-activate されます。失敗すると plugin は `failed` のままです。無効化すると contribution は停止し、未完了 plugin jobs は cancel されます。task handler がない場合は永久失敗ではなく、復旧可能な defer として扱われます。

## Host API

よく使う `ctx` capabilities:

- `ctx.settings`: user-facing plugin configuration。
- `ctx.storage`: plugin KV data。
- `ctx.secrets`: 暗号化された sensitive values。plaintext は UI や delivery record に返しません。
- `ctx.deliveries`: retryable outbound HTTP delivery。`enqueue`、`get`、`list`、`cancel`、`flush`。
- `ctx.network.fetch`: controlled immediate request。connection test 向けで、hot path fan-out には不向きです。
- `ctx.tasks`: plugin task の register/start。
- `ctx.events.catalog`: host が対応する event list を読む。
- `ctx.articles`: article snapshot、openable summary、discovered count を読む。
- `ctx.ranking`: ranked winners と topic targets を読む。
- `ctx.database`: Beta convenience table API。

## Database Migrations

manifest に migrations を宣言してください。Dibao は `plugin_id/version/name/checksum/applied_at` を記録します。既に適用した `version` の `name` または checksum が変わると enable は失敗します。

```json
{
  "capabilities": ["database:plugin"],
  "migrations": [
    { "version": "001", "name": "create_notes", "path": "migrations/001_create_notes.sql" }
  ]
}
```

公開済み migration は書き換えず、変更や cleanup は新しい version として追加してください。

## iframe Bridge

plugin page は Dibao API を直接 `fetch` しません。`postMessage` bridge を使います。

```js
function bridge(method, payload) {
  const requestId = `${Date.now()}:${Math.random().toString(16).slice(2)}`;
  window.parent.postMessage(
    { type: "dibao.bridge", schemaVersion: 1, pluginId, requestId, method, payload },
    "*"
  );
}
```

主な methods:

- `pluginApi`: `{ method: "GET" | "POST", path, body }`
- `getSettings` / `updatePluginSettings`
- `listPluginSecrets` / `setPluginSecret` / `deletePluginSecret`
- `listPluginDeliveries` / `getPluginDelivery`
- `startTask`
- `readArticles`
- `getArticleState`
- `recordArticleAction`
- `getArticleExplanation`
- `openArticle`

host は iframe source、`pluginId`、`requestId` を検証します。

## CLI Flow

```sh
dibao-plugin create ./my-plugin
dibao-plugin validate ./my-plugin
dibao-plugin pack ./my-plugin --out my-plugin.dibao-plugin
dibao-plugin sign my-plugin.dibao-plugin \
  --private-key private.pem \
  --public-key public.pem \
  --key-id my-key \
  --out my-plugin.signed.dibao-plugin
```

template には `server/`、`web/`、`locales/`、`migrations/`、README、release checklist、signing example、test notes が含まれます。

## Signing と trusted keys

Dibao は Ed25519 signature を使います。signature は manifest、files、`updateUrl` の stable payload を対象にします。server-side の third-party plugin install では signature が必須で、signature の `keyId` は管理者が設定した trusted keys に含まれている必要があります。

private key を plugin package に入れないでください。release では package、SHA-256、`keyId`、public-key trust 手順を提供してください。

## Docker 永続化

`/data` を mount すると次が upgrade 後も保持されます。

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`, `plugin_secrets`, `plugin_deliveries`, `plugin_delivery_attempts`

公式 Daily Brief と Webhook は `0.2` image bundled plugin として scan されます。サードパーティ plugin は data volume に残ります。

## Update と Rollback

推奨 update metadata:

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

Dibao は staging に download し、ID、compatibility range、checksum、signature を検証してから installed package を差し替えます。失敗時は旧 package に rollback します。古い `.dibao-plugin` を upload して手動 rollback もできます。

## Release Checklist

- `dibao-plugin validate .` が通る。
- server code が宣言済み capability だけを使う。
- Web UI が sandbox iframe で動作し、host call は bridge 経由。
- 公開済み migration を書き換えず、新しい schema change は新 version。
- package が署名済みで、public key/key id が文書化されている。
- README に install、enable、settings、secrets、update、rollback、limitations がある。
- install、enable、disable、tasks、hooks、update、rollback の smoke test を実施。

## Test Checklist

- manifest、signature、tamper rejection。
- activation failure が `failed` になる。
- missing handler が recoverable defer になる。
- secrets plaintext が露出しない。deliveries が flush/retry できる。
- outbound network が blocked private/local target に到達しない。
- iframe sandbox があり、bridge success/error response が動く。
