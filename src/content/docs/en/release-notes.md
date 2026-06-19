---
title: Release Notes
description: Dibao v0.2.x, v0.1.1, and v0.1.0 release note summary.
---

## v0.2.x Current Development Line

`0.2` is the plugin-platform and next-version development line. Current branch highlights:

- Plugin platform hardening: server plugins run in isolated Node host child processes and call core capabilities through a JSON-RPC Host API.
- Plugin UI hardening: plugin pages run in sandboxed iframes and use a `postMessage` bridge instead of direct Dibao API `fetch`.
- Third-party install policy: user-installed plugins are disabled by default and server installation requires Ed25519 signatures plus trusted keys.
- Plugin capabilities: `secrets`, `deliveries`, manifest migrations, Stable/Beta API tiers, and plugin health metadata.
- Official plugins: Daily Brief and Webhook ship with the image and can be enabled from the Plugins page.
- Runtime safety: background jobs, plugin hooks, diagnostics, and SQLite maintenance paths have stricter runtime guardrails.

## v0.1.1

v0.1.1 improved recommendation profile calibration and upgrade experience across RSS/Atom, OPML, feed management, search, article actions, recommendation explanations, provider settings, background jobs, and the PWA foundation.

Highlights:

- Quick install uses `ghcr.io/pls-1q43/dibao:latest`.
- Compose defaults to local folder persistence with `./data:/data`.
- If a provider is unavailable, reading remains available and recommendations fall back to baseline ranking.
- Recommendation, index, background job, and plugin state are visible in Settings.

## v0.1.0

v0.1.0 was the first public release. It included baseline ranking, OpenAI-compatible and Ollama embedding providers, sqlite-vec vector indexes, recommendation diagnostics, background refresh, search, a PWA app shell, health checks, and backup/upgrade documentation.

Because it was the first public release, there was no migration path from an earlier public version. Back up `./data` before future upgrades.
