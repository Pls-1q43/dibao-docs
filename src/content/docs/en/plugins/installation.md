---
title: Plugin Installation
description: Install, update, verify signatures, and preserve Dibao 0.4 third-party plugins.
---

Last updated: 2026-10-11

This guide is for Dibao administrators installing third-party plugins. In 0.4, server plugins run in isolated Node host processes and web plugins render in sandboxed iframes, but third-party server plugins are still trusted local code. Dibao does not claim hostile-code sandboxing. Install only from sources you trust.

## v0.4.1 Compatibility And Desktop

Bundled Daily Brief, Webhook, and Full Content Selectors remain at plugin version `0.1.1`, now with an upper compatibility bound of `<0.5.0`. They ship with official Desktop and Docker distributions. Older third-party plugins declaring `<0.4.0` become `incompatible`; authors must test and publish a compatible version.

Desktop backups include plugin packages, data, and keys. A `.dibao-plugin` package alone is not a data backup. Web / PWA offline caches do not run server plugin APIs; outbound requests and Webhook deliveries still need a connection on Desktop.

## Official And Third-Party Plugins

Dibao 0.4.1 bundles [Daily Brief](/en/plugins/daily-brief/), [Webhook](/en/plugins/webhook/), and [Full Content Selectors](/en/plugins/full-content/) in the official Docker image. Official plugins do not require uploading a .dibao-plugin file and cannot be uninstalled like third-party plugins. Open Settings -> Plugins, find the official plugin, and enable it. The install flow below applies to third-party plugins.

## Before Installing

- Source: verify the developer, release page, version, and changelog.
- Signature: prefer signed packages and make sure the key id maps to a trusted public key.
- Capabilities: confirm requested capabilities match the feature.
- API stability: Stable APIs are suitable for long-term use; Beta APIs may change during 0.4.x.
- Server-code risk: enabling a plugin executes its server entry.

## Recommended Flow: Upload `.dibao-plugin`

1. Download the `.dibao-plugin` file from the developer release page.
2. Verify SHA-256 locally if provided.
3. Open Settings -> Plugins.
4. Upload the plugin file and click Install.
5. Newly installed third-party plugins stay disabled. Review source, signature trust, capabilities, Stable/Beta API usage, and lastError before enabling.

## Trusted Keys

Dibao uses Ed25519 signatures. Administrators provide trusted public keys through deployment configuration. Packages signed by unknown keys are rejected, and tampered packages fail verification. Never copy private keys from chat logs or untrusted pages.

## Advanced Install: URL Or JSON

Automation can use:

- [`POST /api/plugins/install`](/en/reference/#plugin-install)
- [`POST /api/plugins/install/upload`](/en/reference/#plugin-install-upload)

Recommended update metadata:

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

## Docker Persistence

When `/data` is mounted correctly, plugin packages and data survive image upgrades:

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`, `plugin_secrets`, `plugin_deliveries`

Official Daily Brief, Webhook, and Full Content Selectors plugins are scanned from the 0.4.1 image. Third-party plugins remain in the data volume.

## Updates And Rollback

If a plugin has `updateUrl`, the Plugins page can check updates. Dibao downloads into staging, validates ID/compatibility/checksum, then swaps the old package. Failures keep the old package.

Rollback options:

- Upload an older `.dibao-plugin` again.
- If a new version fails activation, the plugin moves to `failed` and data is preserved.
- Incompatible plugins move to `incompatible` until the plugin or Dibao is updated.

## Uninstall

When uninstalling a third-party plugin, choose whether to delete plugin data. Keeping data helps future reinstall or rollback. Deleting data removes install records, settings, KV, secrets, deliveries, and migration records.
