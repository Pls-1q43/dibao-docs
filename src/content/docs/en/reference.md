---
title: API And Database Reference
description: Dibao v0.4.1 discovery, offline synchronization, upgrade APIs, and persistence boundaries.
---

This reference follows v0.4.1 server routes and types. Successful business responses generally use a `data` wrapper, with `page` / `meta` for pagination. Business APIs require a session; writes also pass origin validation. Plugins must use allowlisted Host APIs / bridge methods, not treat core endpoints as unrestricted permissions.

## Core APIs

| Endpoint | Purpose And Parameters |
| --- | --- |
| `GET /api/system/health` | Basic health: check `data.ok` and `data.version`, not data-upgrade completion. |
| `GET /api/system/upgrade/status` | Authenticated core / derived upgrade status; confirm final `completed` or `not_required` with `blocking: false`. |
| `GET /api/articles/:id/related` | Related preview: default 5, `limit` 1–10. |
| `GET /api/articles/:id/related-search` | Expanded search: default 50, `limit` 1–100; `cursor` pagination; `state` is `all/unread/read/favorites/read_later`. |
| `GET /api/articles/:id/personalized-related` | Article context combined with personal ranking: default 5, `limit` 1–10. |
| `GET /api/offline/manifest` | Existing ranked cache manifest: `recommendedLimit` defaults to 200; API accepts integers 50–1,000, while UI adjusts in steps of 50. |
| `POST /api/offline/articles/batch` | Retrieve body batches with `{ "articleIds": [...] }`. |

Discovery returns `status: "ready"` or `"unavailable"`. Reasons include `no_active_embedding`, `article_embedding_missing`, and `insufficient_candidates` for insufficient personalized candidates. Missing articles return 404. Expanded search uses similarity strictly greater than 0.35; the preview endpoint does not share that threshold.

## Offline Actions And Sessions

Article actions support a client-generated `clientActionId`; retrying the same ID must not duplicate behavior. Recommendation pagination includes session information. Keep the server-provided cursor with its matching recommendation session rather than combining cursors from different sessions. Snapshot and discovery queries read existing data without launching embedding recomputation.

## Plugin Installation APIs

<h3 id="plugin-install">POST /api/plugins/install</h3>

Advanced URL or JSON-package installation. Ordinary users should upload through Settings; downloads, signatures, compatibility, and permissions still require validation.

<h3 id="plugin-install-upload">POST /api/plugins/install/upload</h3>

Upload a `.dibao-plugin` file. New third-party plugins stay disabled until an administrator reviews source and capabilities.

## Database And Persistence

v0.4.0 adds `027_recommendation_sessions.sql`; v0.4.1 adds no core SQL migration.

| Structure | Details |
| --- | --- |
| `recommendation_sessions` | `id`, `rank_context`, `rerank_window_id`, `scope_key`, `item_count`, `created_at`, `expires_at`. |
| `recommendation_session_items` | `session_id`, `article_id`, `position`, `rank_score`, `rank_calculated_at`; positions are unique within a session. |
| Recommendation memory | `user_representation_snapshots`, `recommendation_exposures`, `exploration_attempts` from migration 026. |
| Plugins | Installs, capability grants, settings, KV, migrations, secrets, deliveries, update checks, and plugin directories persist together. |

Do not bypass migrations by editing internal ranking or plugin tables. Back up all of `/data` for Docker and the full data root for Desktop. Browser IndexedDB offline copies are not included in server SQLite backups.

## Further Reading

[Developers](/en/developers/), [Plugin Development](/en/plugins/development/), [Backup And Upgrades](/en/backup-upgrade/), and [Release Notes](/en/release-notes/). Check complete routes and types in [v0.4.1 server source](https://github.com/Pls-1q43/Dibao/blob/v0.4.1/apps/server/src/app.ts) and [database source](https://github.com/Pls-1q43/Dibao/tree/v0.4.1/packages/db).
