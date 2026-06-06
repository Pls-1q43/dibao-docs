---
title: Plugin Installation
description: Install, update, and preserve Dibao third-party plugins.
---

Third-party plugins run code on your self-hosted server. Only install plugins from trusted sources and review the plugin name, publisher, capabilities, and compatibility before enabling them.

## Official Plugins And Third-Party Plugins

Dibao `0.2.x` can ship official plugins inside the official Docker image, including [Webhook](webhook/). Official plugins do not require uploading a `.dibao-plugin` file and cannot be uninstalled like third-party plugins. Open the `Plugins` tab in settings, find the official plugin, and enable it.

The rest of this page applies to third-party plugins. For official plugins such as Webhook, use the plugin-specific documentation.

## Recommended Flow: Upload A Plugin File

1. Download the `.dibao-plugin` file from the plugin developer's release page.
2. If the developer provides a SHA-256 checksum, verify the file locally first.
3. Open Dibao settings and go to the `Plugins` tab.
4. Choose the `.dibao-plugin` file in the third-party plugin installer and click `Install`.
5. Newly installed third-party plugins stay disabled by default. Review source and permissions before enabling.

## Advanced Flow: URL Or JSON Package

Dibao's plugin API also supports installing from a package URL or a plugin package JSON body. These flows are mainly for automation, development, or developer documentation examples. Most users should install the `.dibao-plugin` file instead.

URL installation requires:

- A package URL, usually pointing to a `.dibao-plugin` file.
- A SHA-256 checksum, recommended.

JSON package installation requires a complete package JSON with `manifest` and `files`.

## Docker Upgrades

You usually do not need to reinstall third-party plugins after upgrading the official Docker image. This depends on mounting `/data` as persistent storage.

Persistent paths:

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`

## Updating Plugins

If the plugin manifest provides an `updateUrl`, the Plugins tab shows `Check update`. Dibao downloads the update into a staging area, verifies plugin ID, compatibility, and SHA-256, then replaces the old package. If the update fails, Dibao keeps the old package.

If there is no `updateUrl`, download the newer `.dibao-plugin` file from the developer and upload it again.
