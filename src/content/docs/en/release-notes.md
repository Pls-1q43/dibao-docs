---
title: Release Notes
description: Dibao v0.3.1, v0.3.0, v0.2.1, v0.2.0, and earlier release notes.
---

## v0.3.1

Release date: 2026-08-10  
GitHub Release: [Dibao v0.3.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.1)

v0.3.1 is the recommended stable 0.3 release. Its central theme is a major recommendation-algorithm and recommendation-mechanism update: Dibao now puts more emphasis on stable sorted inventory, clearer fallback boundaries, more reliable negative-topic filtering, and lower-latency background ranking. v0.3.1 also includes post-v0.3.0 fixes for security, plugins, self-hosted feeds, reader recovery, and article cleanup.

### Highlights

- Recommendation v3 memory foundation: added user representation snapshots, recommendation exposures, and exploration attempts to support long-term interest memory, exploration feedback, and future recommendation strategy work.
- Ranking and fallback isolation: recommended lists now stay closer to the active rank context. When sorted inventory is low, fallback is used only as a small temporary batch instead of letting large unsorted pages dominate the reading experience.
- Negative topic and family fixes: negative clusters, topic-family constraints, and unwanted topics such as finance/trading-day content are applied more reliably.
- Recommendation inventory status: the unread recommendation page can indicate whether sorted inventory is available, empty, or being replenished in the background.
- Faster interaction paths: article opening, scrolling, and article actions no longer synchronously trigger reranking, heavy transparency diagnostics, or broad writes; those tasks move to background work.
- Infinite loading: optional automatic pagination for recommendations, latest articles, favorites, read-later, and search results. When appending fails, automatic retries pause and an explicit manual retry remains available.
- Reader polish: article-detail navigation and original-source actions are aligned; failed detail loads now expose a reload entry, and the original URL remains available when known.
- Plugin improvements: official plugin manifests support localized strings, plugin iframes and bridge APIs can read the current locale, and the Daily Brief, Webhook, and full-content selector plugins are updated to `0.1.1`.
- Self-hosted feed compatibility: feed discovery and refresh can access private/local network feed URLs for NAS, home-network, and self-hosted RSS use cases. Plugin outbound requests and full-content fetches keep the controlled-fetch protection boundary.
- Cleaner article content: Hexo-style code-block line-number gutters are stripped while preserving the actual code body.
- Security and release-chain hardening: controlled fetch reduces DNS rebinding / TOCTOU SSRF risk, cross-origin redirects strip sensitive headers, and runtime/build dependencies are updated so both production and full `npm audit` pass with 0 vulnerabilities.

### Upgrade Impact

Upgrading from v0.3.0 to v0.3.1 adds no new core SQLite migrations and does not require embedding recomputation. Bundled official plugins are updated to `0.1.1`.

Upgrading directly from v0.2.1 to v0.3.1 adds recommendation v3 memory database structures. Core migrations run automatically on startup. Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading.

This upgrade does not require embedding recomputation. v0.3 continues from existing articles, behavior events, interest clusters, and vectors; new recommendation memory and exposure data accumulate after upgrade.

After upgrading, verify:

```text
GET /api/system/health
```

The response should include `ok: true` and `version: "0.3.1"`. If the recommendation inventory indicator says sorting is in progress, wait for background jobs to replenish sorted inventory.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

Keep the existing `/data` volume, replace the image, and restart. The default entrypoint starts both the HTTP process and a separate worker process. If you maintain a custom Compose file, keep your persistent data volume and carry forward existing environment settings.

Before upgrading:

```text
Back up /data/dibao.sqlite or the whole Docker volume.
```

To roll back, stop the v0.3.1 container, restore the pre-upgrade SQLite database and `/data` volume backup, then start the previous image. Do not start an older version against a database already migrated to 0.3.x.

### Migration List

From v0.3.0 to v0.3.1:

- No new core SQLite migrations.

For a direct upgrade from v0.2.1 to v0.3.1:

- `026_recommendation_v3_memory.sql`: adds `user_representation_snapshots`, `recommendation_exposures`, `exploration_attempts`, and exploration fields on `article_rank_scores`.

### Sentry Release Verification

The formal Docker image is built with the private Sentry config injected through the BuildKit secret `dibao_sentry_config`. Verification reports only booleans such as `hasDsn`, `hasOrg`, and `hasProject`; it does not expose DSN, org, project, or tokens.

### Known Limitations

- Recommendation v3 memory is a foundation update; not every long-term memory strategy is fully productized yet. Recommendation quality should stabilize as usage and background ranking continue.
- When sorted recommendation inventory is exhausted, Dibao may still temporarily use a fallback sequence, but v0.3.1 limits and communicates that state more clearly.
- Third-party server plugins are trusted local code, not an arbitrary malicious-code sandbox.

## v0.3.0

Release date: 2026-08-08  
GitHub Release: [Dibao v0.3.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.0)

v0.3.0 is a major release focused on a recommendation-algorithm and recommendation-mechanism update. The recommendation system now has a stronger v3 memory foundation, clearer active-ranking isolation, safer fallback behavior, better visibility into recommendation inventory, and a lower-latency interaction path. The reader also gains infinite loading, full-content extraction plugins, and several security and reliability improvements.

### Highlights

- Recommendation v3 memory foundation: added user representation snapshots, recommendation exposures, and exploration attempts to support more stable long-term interest memory and feedback loops.
- Ranking and fallback isolation: recommended lists now stay closer to the active rank context, with fallback pages capped to avoid large unsorted batches taking over the reading experience.
- Negative topic and family filtering fixes: negative clusters and topic groups, including finance/trading-day style topics, are applied more reliably.
- Recommendation inventory status: the unread recommendation view can show whether sorted inventory is available, empty, or currently being replenished.
- Interaction performance improvements: article opening, scrolling, and actions avoid synchronous reranking, heavy transparency diagnostics, and broad writes on the hot path.
- Infinite loading: optional automatic pagination for recommendations, latest articles, favorites, read-later, and search results, with failure pause and manual retry behavior.
- Reader polish: article detail actions were aligned, and failed detail loads now expose an explicit reload entry.
- Plugins and full-content extraction: official plugin infrastructure now includes full-content extractor support and a selector-based official extraction plugin; Webhook support includes secrets, deliveries, and runtime state.
- Safer outbound fetches: controlled fetch now uses the validated IP for the actual connection, reducing DNS rebinding / TOCTOU SSRF risk. Cross-origin redirects strip sensitive headers and avoid forwarding POST bodies unexpectedly.
- Docker and worker stability: improved cross-platform Docker builds, worker keepalive behavior, SQLite ranking writes, and streaming checksum verification for core migrations.

### Upgrade Impact

Upgrading from v0.2.1 to v0.3.0 adds recommendation v3 memory database structures. Core migrations run automatically on startup. Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading.

This upgrade does not require embedding recomputation. v0.3 continues from existing articles, behavior events, interest clusters, and vectors; new recommendation memory and exposure data accumulate after upgrade.

After upgrading, verify:

```text
GET /api/system/health
```

The response should include `ok: true` and `version: "0.3.0"`. If the recommendation inventory indicator says sorting is in progress, wait for background jobs to replenish sorted inventory.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.0
```

Keep the existing `/data` volume, replace the image, and restart. The default entrypoint starts both the HTTP process and a separate worker process. If you maintain a custom Compose file, keep your persistent data volume and carry forward existing environment settings.

Before upgrading:

```text
Back up /data/dibao.sqlite or the whole Docker volume.
```

To roll back, stop the v0.3.0 container, restore the pre-upgrade SQLite database and `/data` volume backup, then start the previous image. Do not start an older version against a database already migrated to v0.3.0.

### Migration List

From v0.2.1 to v0.3.0, one core SQLite migration is added:

- `026_recommendation_v3_memory.sql`: adds `user_representation_snapshots`, `recommendation_exposures`, `exploration_attempts`, and exploration fields on `article_rank_scores`.

### Sentry Release Verification

The formal Docker image is built with the private Sentry config injected through the BuildKit secret `dibao_sentry_config`. Verification reports only booleans such as `hasDsn`, `hasOrg`, and `hasProject`; it does not expose DSN, org, project, or tokens.

### Known Limitations

- Recommendation v3 memory is a foundation update; not every long-term memory strategy is fully productized yet. Recommendation quality should stabilize as usage and background ranking continue.
- When sorted recommendation inventory is exhausted, Dibao may still temporarily use a fallback sequence, but v0.3.0 limits and communicates that state more clearly.
- Third-party server plugins are trusted local code, not an arbitrary malicious-code sandbox.

## v0.2.1

Release date: 2026-07-12  
GitHub Release: [Dibao v0.2.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.1)

v0.2.1 is a patch release for the 0.2 plugin line. It improves long-running Docker and NAS deployments by making background job processing more reliable, keeping official plugins enabled through transient runtime failures, and tightening mobile reader behavior.

### Highlights

- Fixed Docker split-process deployments where the worker could miss newly queued `embedding_generate` jobs from the HTTP process. Docker Compose now defaults to `DIBAO_SQLITE_JOURNAL_MODE=DELETE` to avoid bind-mount SQLite WAL visibility issues across processes.
- Added worker-side background-job heartbeat, immediate due-job draining on runner startup, and follow-up drains when a pass hits its job limit.
- Added a cross-process job wake signal so HTTP enqueue paths can wake the worker.
- Official plugins now remain enabled during transient hook/runtime failures and expose degraded runtime state instead of being automatically disabled.
- Mobile article-detail back navigation no longer treats the `limit=1` unread-count probe as a full list refetch.
- Polished the article-detail source/action row and vertical alignment in the feed-management add-feed controls.
- Merged v0.1.3 maintenance fixes, including Gemini OpenAI-compatible embedding dimensions, stronger Ollama context handling, publication years in article metadata, and clearer active source-filter state.

### Upgrade Impact

There are no new core SQLite schema migrations from v0.2.0 to v0.2.1. Keep the same `/data` volume and replace the image. Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading.

If you maintain a custom Compose file, add:

```yaml
environment:
  DIBAO_SQLITE_JOURNAL_MODE: DELETE
```

The repository `compose.yaml` already includes this default. After upgrading, verify:

```text
GET /api/system/health
```

The response should include `ok: true` and `version: "0.2.1"`.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.1
```

The default Docker entrypoint starts both HTTP and a separate worker process. To disable the worker:

```yaml
environment:
  DIBAO_BACKGROUND_JOBS: "false"
```

To roll back, stop the v0.2.1 container, restore the pre-upgrade SQLite database and `/data` volume backup, then start the previous image.

### Migration List

From v0.2.0 to v0.2.1: no new core SQLite migrations. Startup still checks that all shipped migrations are complete and unchanged.

### Sentry Release Verification

The formal Docker image is built with the private Sentry config injected through the BuildKit secret `dibao_sentry_config`. Verification reports only booleans such as `hasDsn`, `hasOrg`, and `hasProject`; it does not expose DSN, org, project, or tokens.

### Known Limitations

- Third-party server plugins are trusted local code, not an arbitrary malicious-code sandbox.
- Some v0.2.x Host APIs remain Beta; long-lived plugins should prefer Stable APIs.

## v0.2.0

Release date: 2026-06-19  
GitHub Release: [Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 launches the plugin system. Plugins can now extend settings, navigation, background tasks, hooks, plugin-owned data, secrets, and outbound deliveries while running through a trusted local runtime.

### Highlights

- Plugin platform: manifest v1, install/enable/disable/uninstall flows, signed package verification, trusted keys, plugin migrations, tasks, hooks, private plugin data, and plugin settings.
- Safer runtime boundaries: plugin web UI runs inside a sandboxed iframe with a host bridge, while server plugins run in a separate Node host process with a whitelisted Host API.
- Official Daily Brief plugin: generates a daily, topic-grouped brief from the last 24 hours of personalized recommendations and adds its own page and settings.
- Official Webhook plugin: sends configurable HTTP webhooks for article actions, feed refreshes, ranking completion, settings updates, plugin task results, and Daily Brief generation.
- Plugin tooling: `@dibao/plugin-sdk` and `@dibao/plugin-cli` support validation, packaging, and signing.
- Reliability work across recommendation reads, foreground performance, background jobs, migrations, health checks, and plugin host behavior.

### Upgrade Impact

Upgrading from v0.1.x to v0.2.0 includes a blocking database migration that creates the core tables and indexes required by the plugin system. On first startup, Dibao completes the core blocking migration gate before serving normal traffic; larger databases or slower disks may take some time.

Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading. After the backup, keep the same `/data` volume, replace the image, and restart the container. Then verify:

```text
GET /api/system/health
```

The response should include `version: "0.2.0"` and `ok: true`.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.0
```

To roll back, stop the v0.2.0 container, restore the pre-upgrade SQLite database and `/data` volume backup, then start the previous image.

### Useful Links

- Webhook guide: https://docs.dibao.app/zh/plugins/webhook/
- Plugin development guide: https://docs.dibao.app/zh/plugins/development/
- Plugin installation docs: [`docs/plugin-installation.en-US.md`](./plugin-installation.en-US.md)
- Plugin development docs: [`docs/plugin-development.en-US.md`](./plugin-development.en-US.md)

### Known Limitations

- Third-party server plugins are trusted local code, not an arbitrary malicious-code sandbox. Install only trusted packages and review signatures, trusted keys, capabilities, and server-code risk.
- Some Host APIs are Beta and may change during 0.2.x. Long-lived plugins should prefer Stable APIs and manifest migrations.

## v0.1.3

Release date: 2026-06-04  
GitHub Release: [Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

### Highlights

- Feed management uses less vertical space: adding a feed now opens from the feed row, and feed health is folded into list filtering instead of occupying a full-width row.
- The source filter button now shows an active state when source filtering is enabled, making accidental source filters easier to notice.
- Localized reader pages such as For You, Latest, and Read Later restore their English subtitles outside the English UI; the English UI remains subtitle-free.
- Article lists, search results, and the reader header now include the publication year so cross-year articles are unambiguous without opening the source page.
- Ollama provider defaults to 4000-character slices and shows guidance for Chinese long-form content/bge-m3. Ollama context-length failures retry once with a shorter slice.
- Gemini embedding dimensions are requested explicitly. Google AI Studio through the OpenAI-compatible endpoint receives `dimensions`, and the native Gemini provider receives `outputDimensionality`, enabling configured 768 / 1536 / 3072-dimensional output.

### Upgrade Impact

Upgrading from v0.1.2 to v0.1.3 does not add SQL migrations and does not trigger a recommendation derived-data upgrade. Keep the same `/data` volume, replace the image, and restart the container.

Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading. After the restart, verify:

```text
GET /api/system/health
```

The response should include `version: "0.1.3"` and `ok: true`.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

To roll back, stop the v0.1.3 container, restore the pre-upgrade SQLite backup, and start the previous image.

### Known Limitations

- Ollama models and context settings may still require manual slice tuning. If bge-m3 still reports context length errors, try 3000 characters.
- Gemini/OpenAI-compatible dimensionality depends on upstream provider support. Dibao sends dimension requests for Google Gemini paths and still validates returned vector dimensions.

## v0.1.2

Release date: 2026-06-01  
GitHub Release: [Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

### Highlights

- Embedding provider test failures now return more actionable public errors. Authentication failures, missing models/endpoints, rate limits, provider outages, network failures, and malformed responses are classified separately.
- Provider errors preserve safe upstream context while redacting API keys, tokens, Authorization headers, and similar sensitive fields.
- Settings and backend status responses avoid leaking provider test errors into index lists where they do not belong.
- Feed management is split into Feed management and Feed folder management views, reducing mixed long-page operations.
- Feed and folder rows now include View articles, jumping directly to the corresponding latest article list.
- Reader URLs preserve feed/folder filter parameters so refresh, sharing, and back navigation keep the current context.
- Failed article images in the reader stop retrying after load failure, avoiding repeated requests and layout churn.

### Upgrade Impact

Upgrading from v0.1.1 to v0.1.2 does not add SQL migrations and does not trigger a recommendation derived-data upgrade. Keep the same `/data` volume, replace the image, and restart the container.

Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading. After the restart, verify:

```text
GET /api/system/health
```

The response should include `version: "0.1.2"` and `ok: true`.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

To roll back, stop the v0.1.2 container, restore the pre-upgrade SQLite backup, and start the previous image.

### Known Limitations

- Embedding provider detail depends on the upstream service response. Dibao classifies and redacts what it can, but it cannot repair an unavailable provider.
- Remote article images still depend on the source site, network, and hotlinking rules. This release prevents failed images from retrying repeatedly.

## v0.1.1

Release date: 2026-05-30  
GitHub Release: [Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

### Highlights

- Fixes over-merged interest clusters so unrelated topics no longer collapse into one large cluster.
- Fixes over-fragmented profiles where most clusters degraded into single-article clusters after an upgrade.
- Adds per-index calibration. Dibao now estimates and freezes thresholds for each embedding index from the active provider, model, dimension, and local vector distribution during rebuild or upgrade.
- Adds constrained merging with centroid similarity, pairwise guards, title/source evidence, maximum cluster size, and bounded absorb steps.
- Adds topic-family caps beside the existing interest-cluster caps. Defaults are positive clusters 48, negative clusters 32, positive families 16, and negative families 12.
- Tightens ranking usage of topic families. Clusters remain the primary semantic match signal; families are used for explanation and diversity rather than broad score amplification.
- The blocking upgrade copy now states that the migration rebuilds derived recommendation data only. It does not recompute embeddings and will not create embedding API cost.
- Labels and upgrade screens keep batched/yielding behavior so low-power NAS devices remain visibly alive under high CPU load.
- Fixes scroll-past ignore telemetry after using Load more, so unopened appended articles can still be marked ignored when scrolled past.
- Docker publishing now requires private Sentry build config so release images include both server and browser runtime Sentry configuration.

### Upgrade Impact

Upgrading from v0.1.0 to v0.1.1 automatically runs the new SQL migration `018_interest_cluster_calibrations.sql`, then performs one blocking recommendation derived-data upgrade on first start. The upgrade rebuilds clusters, families, labels, and ranking rows, but it does not call an embedding provider or recompute embeddings.

Back up `/data/dibao.sqlite` or the whole Docker volume before upgrading. During the first start, the normal reader UI is paused behind a progress screen until the derived-data upgrade finishes.

### Docker Install And Upgrade

Recommended image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.1
```

Keep the same `/data` volume, replace the image tag, and restart the container. Health check:

```text
GET /api/system/health
```

To roll back, stop the v0.1.1 container, restore the pre-upgrade SQLite backup, and start the previous image.

### Known Limitations

- Low-sample libraries use conservative fallback calibration; recommendation quality still improves with behavior history and embedding coverage.
- The first derived-data upgrade can take time on low-power NAS devices, but progress is shown.
- If the user changes embedding model or dimension, old embeddings still cannot be mixed into the new index; the new index needs its own embeddings.

## v0.1.0

Release date: 2026-05-28  
GitHub Release: [Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

Dibao v0.1.0 is the first public MVP release. It provides a Docker self-hostable, single-user RSS reader with OPML import, feed and folder management, latest article reading, article actions, and explainable personalized recommendations that only rank content from the user's own RSS subscriptions.

This release includes baseline ranking, OpenAI-compatible and Ollama embedding providers, sqlite-vec vector indexes, recommendation diagnostics, background refresh, search, a PWA app shell, health checks, and backup/upgrade documentation. Because this is the first public release, there is no previous public release migration path. Install with `ghcr.io/pls-1q43/dibao:v0.1.0` and mount `/data` to persistent storage. Back up the SQLite database or Docker volume before future upgrades.

Known limitations: Dibao is currently single-user and self-hosted only. There is no hosted service, multi-user collaboration, cloud sync, OAuth/password recovery, full offline article library, or native mobile/desktop app. Recommendation quality is MVP-stage and depends on user feedback and embedding coverage.
