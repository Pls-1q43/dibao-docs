---
title: Plugin Installation
description: Install, update, verify signatures, and preserve Dibao 0.2 third-party plugins.
---

This guide is for Dibao administrators installing third-party plugins. In Dibao `0.2.x`, server plugins run in isolated Node host child processes and web plugins render in sandboxed iframes. Third-party server plugins are still trusted local code, not a hostile-code sandbox. Install only from sources you trust.

## Official Plugins And Third-Party Plugins

Dibao `0.2.x` ships official plugins inside the official Docker image, including [Webhook](webhook/) and Daily Brief. Official plugins do not require uploading a `.dibao-plugin` file and cannot be uninstalled like third-party plugins. Open the `Plugins` tab in settings, find the official plugin, and enable it.

The rest of this page applies to third-party plugins. To build plugins, read [Plugin Development](development/).

## Before Installing

- Source: verify the developer, release page, version, and changelog.
- Signature: third-party plugin packages must include an Ed25519 signature, and the signature `keyId` must map to a trusted public key.
- SHA-256: verify the file locally first if the release provides a checksum.
- Capabilities: confirm requested capabilities match the feature.
- API stability: Stable APIs are suitable for long-term use; Beta APIs may change during `0.2.x`.
- Server-code risk: enabling a plugin executes its server entry.

## Enable Third-Party Plugin Installation

To prevent accidental installation, user-installed third-party plugins are disabled by default. Enable them explicitly in deployment configuration:

```text
DIBAO_ENABLE_UNTRUSTED_PLUGINS=true
```

Official plugins are not affected by this switch.

## Trusted Keys

Dibao uses Ed25519 signatures. Administrators provide trusted public keys through deployment configuration; a signed package's `keyId` must match a trusted key. Packages with unknown keys, missing signatures, or tampered payloads are rejected.

Never copy private keys from chat logs or untrusted pages. Publishers should provide the public key, `keyId`, package file, and SHA-256. Administrators should trust only keys they have verified.

## Recommended Flow: Upload `.dibao-plugin`

1. Download the `.dibao-plugin` file from the developer release page.
2. Verify SHA-256 locally if provided.
3. Confirm deployment has `DIBAO_ENABLE_UNTRUSTED_PLUGINS=true` and trusted keys configured.
4. Open `Settings` -> `Plugins`.
5. Upload the plugin file and click `Install`.
6. Newly installed third-party plugins stay disabled. Review source, signature trust, capabilities, Stable/Beta API usage, and `lastError` before enabling.

## Advanced Install: URL Or JSON

Automation can use the plugin installation APIs:

```text
POST /api/plugins/install
POST /api/plugins/install/upload
```

Recommended update metadata:

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

URL installation also verifies ID, SHA-256, signature, and trusted key.

## Docker Persistence

When `/data` is mounted correctly, plugin packages and data survive image upgrades:

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`, `plugin_secrets`, `plugin_deliveries`, `plugin_delivery_attempts`

Official Daily Brief and Webhook plugins are scanned from the image. Third-party plugins remain in the data volume.

## Updates And Rollback

If a plugin has `updateUrl`, the Plugins page can check updates. Dibao downloads into staging, validates ID, compatibility range, checksum, and signature, then swaps the old package. Failures keep the old package.

Rollback options:

- Upload an older `.dibao-plugin` again.
- If a new version fails activation, the plugin moves to `failed` and data is preserved.
- Incompatible plugins move to `incompatible` until the plugin or Dibao is updated.

## Uninstall

When uninstalling a third-party plugin, choose whether to delete plugin data. Keeping data helps future reinstall or rollback. Deleting data removes install records, settings, KV, secrets, deliveries, and migration records.
