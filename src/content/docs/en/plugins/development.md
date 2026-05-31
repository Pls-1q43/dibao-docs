---
title: Plugin Development
description: Dibao plugin development entry point and compatibility rules.
---

Plugin development documentation is for developers extending Dibao. Plugins declare capabilities, contributions, tasks, settings, and compatible versions through a manifest. They should not inject UI through DOM patching or CSS selectors.

## Baseline Rules

- Plugin packages are distributed as `.dibao-plugin` files.
- The manifest must declare plugin ID, version, publisher, capabilities, and compatibility range.
- Third-party plugins stay disabled after installation until the user enables them.
- Plugin data should live under `/data/plugins/data/<plugin-id>` or a documented plugin storage API.
- Updates should publish metadata, package URL, and checksum.

## Reference Status

Plugin development references are maintained in Simplified Chinese and English. Japanese pages provide product-level guidance. Implementations should follow `plugin-development.zh-CN.md`, `plugin-development.en-US.md`, and the plugin sections of the API contract.

The docs site now gives plugin development its own entry. Future passes should expand manifest v1 fields, capability names, Hook names, UI slots, and package format into stable pages.
