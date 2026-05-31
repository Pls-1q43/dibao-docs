---
title: Release Notes
description: Dibao v0.1.1 and v0.1.0 release note summary.
---

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
