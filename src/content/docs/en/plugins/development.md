---
title: Plugin Development
description: Dibao 0.2 plugin manifest, capabilities, Host API, iframe bridge, packaging, signing, and release checks.
---

This guide is for third-party plugin developers. Dibao `0.2.x` is an ecosystem-platform release for trusted administrator-installed plugins. Plugins can extend server tasks, hooks, settings pages, and web UI, but they are trusted local code. Dibao does not claim to safely run arbitrary malicious code.

Official plugins such as [Webhook](webhook/) and Daily Brief use the same manifest, capability, contribution, and lifecycle model. Third-party plugins additionally go through signing, trusted keys, installation, and enablement.

## Security Model

- Server plugins run in an isolated Node host child process and call Dibao through a JSON-RPC Host API.
- The main process never passes `db`, `process`, Fastify `request/reply`, or internal services to plugins.
- Web plugins run in `sandbox="allow-scripts allow-forms"` iframes without `allow-same-origin`.
- Plugin pages must not call Dibao APIs with direct `fetch`; use the `postMessage` bridge.
- Plugin HTML receives a restrictive CSP: no direct `fetch`, no form submit, and no default external resources. Inline scripts/styles and `/api/plugins/ui.css` are allowed.
- Third-party plugins stay disabled after installation. Before enabling, review source, signature trust, capabilities, Stable/Beta API usage, and server-code risk.

## Manifest v1

`.dibao-plugin` packages are JSON with top-level `manifest`, `files`, and optional `updateUrl` and `signature`.

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

Use reverse-domain IDs or another stable namespace. Use a bounded compatibility range such as `<0.3.0` so future breaking APIs do not auto-enable the plugin.

## Capabilities

Dibao `0.2.x` supports:

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

Declare only what you need. `network:outbound` is protected by SSRF checks, size limits, redirect limits, and timeouts. Sensitive headers should use `secrets:plugin` and delivery `secretHeaders`, not plain settings or static headers.

## Contributions

The `contributes` object decides where the plugin appears in UI and runtime:

- `settingsTabs`: plugin configuration tabs in settings; common slot: `settings.tabs`.
- `tabs` / `routes`: main app navigation or plugin page entries, such as Daily Brief.
- `actions`: article-list or toolbar action buttons.
- `setupSteps`: optional first-install plugin steps.
- `hooks`: Dibao events the plugin subscribes to.
- `events`: events the plugin declares it can emit.
- `tasks`: foreground or background tasks with `manual`, `interval`, `daily`, or `weekly` schedules.

Common UI slots:

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

Plugins can subscribe to or declare:

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

Hooks have timeout protection. Avoid heavy network fan-out inside hot hooks; enqueue `deliveries` for outbound HTTP work.

## API Stability

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

Beta fields and semantics may change during `0.2.x`. Long-lived plugins should use manifest migrations for durable schema changes instead of relying only on `database.defineTable`.

## Server Entry

Export `activate(ctx)`. Host APIs are asynchronous JSON-RPC calls:

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

Dibao pre-activates the server entry when a plugin is enabled. Activation failure keeps the plugin in `failed`. Disabling a plugin stops contributions and cancels open plugin jobs. Missing task handlers defer jobs for recovery instead of marking them as ordinary permanent failures.

## Host API

Common `ctx` capabilities:

- `ctx.settings`: user-facing plugin configuration.
- `ctx.storage`: plugin KV data.
- `ctx.secrets`: encrypted sensitive values; plaintext is not returned in UI or delivery records.
- `ctx.deliveries`: retryable outbound HTTP delivery with `enqueue`, `get`, `list`, `cancel`, and `flush`.
- `ctx.network.fetch`: controlled immediate request, useful for connection tests, not hot-path fan-out.
- `ctx.tasks`: register and start plugin tasks.
- `ctx.events.catalog`: read the host's supported event list.
- `ctx.articles`: read article snapshots, openable summaries, and discovered counts.
- `ctx.ranking`: read ranked winners and topic targets.
- `ctx.database`: Beta convenience table API.

## Database Migrations

Declare migrations in the manifest. Dibao records `plugin_id/version/name/checksum/applied_at`. If an already-applied version changes name or checksum, enable fails to prevent schema drift.

```json
{
  "capabilities": ["database:plugin"],
  "migrations": [
    { "version": "001", "name": "create_notes", "path": "migrations/001_create_notes.sql" }
  ]
}
```

Never rewrite published migrations. Append a new version for changes or cleanup.

## iframe Bridge

Plugin pages must not call Dibao APIs with direct `fetch`. Use `postMessage`:

```js
function bridge(method, payload) {
  const requestId = `${Date.now()}:${Math.random().toString(16).slice(2)}`;
  window.parent.postMessage(
    { type: "dibao.bridge", schemaVersion: 1, pluginId, requestId, method, payload },
    "*"
  );
}
```

Common methods:

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

The host validates iframe source, `pluginId`, and `requestId`.

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

The template includes `server/`, `web/`, `locales/`, `migrations/`, README, release checklist, signing example, and test notes.

## Signing And Trusted Keys

Dibao uses Ed25519 signatures over a stable payload containing manifest, files, and `updateUrl`. Server-side third-party plugin installation requires a signature, and the signature `keyId` must be present in the administrator's trusted keys.

Never ship private keys inside plugin packages. Releases should publish the package, SHA-256, `keyId`, and public-key trust instructions.

## Docker Persistence

With `/data` mounted, these survive image upgrades:

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`, `plugin_secrets`, `plugin_deliveries`, `plugin_delivery_attempts`

Official Daily Brief and Webhook plugins are scanned from the bundled `0.2` image. Third-party plugins remain in the data volume.

## Updates And Rollback

Recommended update metadata:

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

Dibao downloads to staging, validates ID, compatibility range, checksum, and signature, then swaps the installed package. Failures roll back to the old package. Users can also roll back by uploading an older `.dibao-plugin`.

## Release Checklist

- `dibao-plugin validate .` passes.
- Server code only uses declared capabilities.
- Web UI works in the sandboxed iframe and uses the bridge for host calls.
- Published migrations are immutable; new schema changes append new versions.
- Package is signed and the public key/key id is documented.
- README covers install, enable, settings, secrets, update, rollback, and limitations.
- Manual smoke covers install, enable, disable, tasks, hooks, update, and rollback.

## Test Checklist

- Manifest, signature, and tamper rejection.
- Activation failure moves to `failed`.
- Missing handlers defer recoverably.
- Secrets never reveal plaintext; deliveries flush and retry.
- Outbound network cannot reach blocked private/local targets.
- iframe sandbox is present; bridge success and error responses work.
