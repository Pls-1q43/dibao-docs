---
title: Developer Documentation
description: Dibao v0.4.1 core, Desktop, offline reading, APIs, migrations, and plugin development.
---

The public release is `v0.4.1`, corresponding to the main project's complete release on `main`. Follow the repository's current version-line and release rules when choosing development branches; older 0.2 / 0.3 guidance does not establish current release state.

## Repository Structure

- `apps/desktop`: Electron main/preload, local server runtime, updates, backup/recovery.
- `apps/web`: React, reader, PWA, offline cache, plugin iframe host.
- `apps/server`: Fastify API, authentication, feed/content fetching, worker jobs, plugin host.
- `packages/db`: SQLite repositories, migrations, vector storage.
- `packages/ranking`: interest profiles and recommendation ranking.
- `packages/plugin-sdk` / `packages/plugin-cli`: manifest validation, capabilities, packaging and signing.
- `plugins/official`: Daily Brief, Webhook, Full Content Selectors.

## Development And Validation

```bash
npm ci
npm run typecheck
npm test
npm run build
git diff --check
```

Use `npm run dev:server` and `npm run dev:web` for development. Desktop uses `npm run build:desktop`, `npm run desktop:package`, and `npm run desktop:smoke`. Local packaging does not replace installed upgrade checks on each target OS.

## v0.4 Contracts

- Recommendation sessions freeze the pagination sequence; `027_recommendation_sessions.sql` stores session positions and score snapshots.
- Related and personalized discovery read existing vectors, without generating embeddings or reranking the entire library when opening the reader.
- Web / PWA caches are scoped by origin and user. Offline actions use `clientActionId` for idempotency; actions sync before snapshots refresh.
- Article opening, actions, and scrolling are latency-sensitive. Profile work, ranking, embeddings, and heavy diagnostics belong in background jobs or explicit cold paths.
- Desktop reads the local database rather than switching to a PWA subset when disconnected. Save progress, stop background tasks and plugin processes, then close the database on shutdown.

## Data Upgrades And Releases

Do not remove or rewrite shipped migrations. Core migrations use the visible blocking upgrade flow; required derived-data rebuilds keep progress visible and restore normal APIs only after success, then remove obsolete contexts.

v0.4.0 adds the recommendation-session migration and reuses existing embeddings for derived upgrades. v0.4.1 adds no SQL migration or mandatory rebuild. Recomputations that incur embedding costs require an explicit user decision.

Formal releases provide Windows x64 EXE, Intel / Apple Silicon DMG, and Docker amd64 / arm64 from the same version and commit. Validation covers fresh installation, installed upgrades, backup/recovery, and platform permissions. Current desktop packages are unsigned; Mac uses manual app replacement.

## Plugins And APIs

[Plugin Development](/en/plugins/development/) covers Stable / Beta contracts, compatibility, iframe bridge, extractors, signing, and CLI. [API And Database Reference](/en/reference/) lists recent endpoints and persistence boundaries.

Frontend isolation is not hostile server-code sandboxing. Desktop privileges belong to controlled app entry points and are not available to plugin or external pages.

## Implementation Sources

Check `apps/server/src/app.ts`, `reader-discovery-service.ts`, `apps/web/src/api.ts`, `packages/db/migrations`, `packages/plugin-sdk/src/index.ts`, and `apps/desktop/src`. Full engineering source: [v0.4.1 source](https://github.com/Pls-1q43/Dibao/tree/v0.4.1).
