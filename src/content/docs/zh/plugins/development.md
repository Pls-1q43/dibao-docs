---
title: 插件开发
description: Dibao 0.2 插件 manifest、能力、Host API、iframe bridge、打包签名和发布检查清单。
---

本文面向第三方插件开发者。Dibao `0.2.x` 的插件系统定位是“可信管理员安装的生态平台版”：插件可以扩展服务端任务、Hook、设置页和 Web UI，但仍是可信本地代码，不承诺能安全运行任意恶意代码。

官方插件例如 [Webhook](webhook/) 和 Daily Brief 也走同一套 manifest、capability、贡献点和启停模型；第三方插件需要额外经过签名、trusted key、安装和启用流程。

## 安全模型

- 服务端插件运行在独立 Node host 子进程中，通过 JSON-RPC 调用 Dibao 白名单 Host API。
- 主进程不会把 `db`、`process`、Fastify `request/reply` 或内部 service 对象传给插件。
- Web 插件运行在 `sandbox="allow-scripts allow-forms"` iframe 中，不包含 `allow-same-origin`。
- 插件页面不能直接 `fetch` Dibao API，必须通过 `postMessage` bridge 请求宿主能力。
- 插件 HTML 带 CSP：禁止直接 `fetch`、表单提交和默认外部资源；允许内联脚本/样式和 `/api/plugins/ui.css`。
- 第三方插件安装后默认不启用。管理员启用前应检查来源、签名信任、capabilities、Stable/Beta API 使用和服务端代码风险。

## Manifest v1

`.dibao-plugin` 是 JSON 包，顶层包含 `manifest`、`files`，可选 `updateUrl` 和 `signature`。

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
      {
        "version": "001",
        "name": "create_notes",
        "path": "migrations/001_create_notes.sql"
      }
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

`id` 建议使用反向域名或稳定命名空间。`dibao.maxVersion` 建议写成 `<0.3.0`，避免未来 breaking API 自动启用。

## Capabilities

0.2 支持这些 capability：

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

只声明实际需要的能力。`network:outbound` 受 SSRF 防护、大小限制、重定向限制和超时限制。敏感 header 应使用 `secrets:plugin` 并通过 delivery `secretHeaders` 引用，不要写进普通配置或静态 headers。

## 贡献点

Manifest 中的 `contributes` 决定插件出现在 UI 或运行时的哪个位置：

- `settingsTabs`：设置页中的插件配置 Tab，常用 slot 是 `settings.tabs`。
- `tabs` / `routes`：主应用导航或插件页面入口，例如 Daily Brief。
- `actions`：文章列表或工具栏中的动作按钮。
- `setupSteps`：首次安装的可选插件步骤。
- `hooks`：订阅 Dibao 事件。
- `events`：插件自己声明可发出的事件。
- `tasks`：前台或后台任务，支持 `manual`、`interval`、`daily`、`weekly` 调度声明。

常见 UI slot 包括：

```text
app.main.nav.items
app.main.tabs
article.list.item.actions.end
article.list.toolbar.end
article.reader.bottomSheet.actions
settings.tabs
algorithm.jobs.actions
```

## 支持事件

插件可以订阅或声明这些事件：

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

Hook 运行有超时保护。不要在 Hook 热路径里做大量网络 fan-out；需要出站 HTTP 时优先入队 `deliveries`。

## API 稳定层级

Stable：

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

Beta：

- `database.defineTable`
- `ranking`
- `articles.snapshot`
- `diagnostics`

Beta API 可在 `0.2.x` 中调整字段或语义。长期插件应把持久 schema 写成 manifest migrations，而不是只依赖 `database.defineTable`。

## 服务端入口

服务端入口导出 `activate(ctx)`。Host API 是异步 JSON-RPC 调用：

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

启用插件时 Dibao 会预激活 server entry。激活失败会让插件保持 `failed`；禁用插件会停止贡献点并取消该插件未完成任务。缺失 task handler 的插件任务会延后重试，表现为可恢复的 plugin-paused 语义，而不是普通永久失败。

## Host API

常用 `ctx` 能力：

- `ctx.settings`: 用户可配置项。
- `ctx.storage`: 插件 KV 数据。
- `ctx.secrets`: 加密保存敏感值，UI 和 delivery 记录不回显明文。
- `ctx.deliveries`: 可重试的出站 HTTP 投递，支持 `enqueue`、`get`、`list`、`cancel`、`flush`。
- `ctx.network.fetch`: 受控即时请求，适合测试连接，不适合热路径大量调用。
- `ctx.tasks`: 注册和启动插件任务。
- `ctx.events.catalog`: 读取宿主当前支持的事件列表。
- `ctx.articles`: 读取文章 snapshot、openable summary 和发现计数。
- `ctx.ranking`: 读取推荐结果和兴趣主题目标。
- `ctx.database`: Beta 便捷表 API。

## 数据库迁移

推荐在 manifest 中声明 migrations。Dibao 记录 `plugin_id/version/name/checksum/applied_at`。同一 `version` 已应用后，如果 `name` 或 checksum 改变，启用会失败以避免历史 schema 漂移。

```json
{
  "capabilities": ["database:plugin"],
  "migrations": [
    { "version": "001", "name": "create_notes", "path": "migrations/001_create_notes.sql" }
  ]
}
```

已发布 migration 不要改写；新增版本继续追加。需要废弃 schema 时发布新的 cleanup migration。

## iframe Bridge

插件页面不能直接 `fetch("/api/...")`。使用 `postMessage` bridge：

```js
function bridge(method, payload) {
  const requestId = `${Date.now()}:${Math.random().toString(16).slice(2)}`;
  window.parent.postMessage(
    { type: "dibao.bridge", schemaVersion: 1, pluginId, requestId, method, payload },
    "*"
  );
}
```

常用方法：

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

宿主会校验 iframe source、`pluginId` 和 `requestId`。

## CLI 流程

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

模板包含 `server/`、`web/`、`locales/`、`migrations/`、README、release checklist、签名脚本示例和测试说明。

## 签名与 trusted keys

Dibao 使用 Ed25519 签名。签名覆盖 manifest、files 和 `updateUrl` 的稳定序列化 payload。服务器安装第三方插件时要求签名存在，且 `keyId` 必须在管理员配置的 trusted keys 中。

不要把私钥放进插件包。发布时应同时提供包文件、SHA-256、`keyId` 和公钥信任说明。

## Docker 持久化

挂载 `/data` 后，下列内容会随升级保留：

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite 表：`plugin_installs`、`plugin_capability_grants`、`plugin_settings`、`plugin_kv`、`plugin_migrations`、`plugin_update_checks`、`plugin_secrets`、`plugin_deliveries`、`plugin_delivery_attempts`

官方 Daily Brief 和 Webhook 插件随 `0.2` 镜像扫描；第三方插件保留在数据卷中。

## 更新与回滚

`updateUrl` metadata 建议包含：

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

Dibao 更新时会下载到 staging、校验 ID/兼容范围/checksum 和签名、替换安装目录；失败会回滚旧包。用户可以通过重新上传旧 `.dibao-plugin` 回滚。

## 发布 Checklist

- `dibao-plugin validate .` 通过。
- 服务端代码只使用已声明 capability。
- Web UI 在 sandbox iframe 中工作，所有宿主访问走 bridge。
- 已发布 migration 未被改写，新 schema 使用新 version。
- 包已签名，公钥和 keyId 可供管理员信任。
- README 写明安装、启用、设置、secrets、更新、回滚和限制。
- 手动测试安装、启用、禁用、任务、Hook、更新回滚。

## 测试 Checklist

- manifest、签名和篡改包拒绝。
- 启用预激活失败进入 `failed`。
- 缺 handler 任务可恢复延后。
- secrets 不回显明文；deliveries 可 flush 和重试。
- 出站网络不能访问被阻止的私网/本机目标。
- iframe `sandbox` 存在，bridge 正常/异常请求都有响应。
