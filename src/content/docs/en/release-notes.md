---
title: Release Notes
description: Dibao v0.4.1, v0.4.0, and historical release notes.
---

## v0.4.1

Release date: 2026-10-11

GitHub Release: [Dibao v0.4.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.1)

v0.4.1 introduces standalone Windows and macOS desktop apps: install Dibao and use it locally without deploying a server. Desktop keeps the existing reader, feeds and recommendations, and adds tray-based background operation, local offline reading, backup and recovery, and desktop updates. First-run setup, shutdown saves and recovery are also improved. Docker, Web and PWA deployments remain available.

### New Features

- **Standalone desktop apps.** Windows x64 EXE, Intel Mac DMG and Apple Silicon Mac DMG installers include the runtime; no separate Node.js, Docker or database installation is needed. Create an account on first use. AI services are optional and no models are bundled.
- **Tray and background operation.** Closing the window keeps feed fetching active. Reopen the reader from the system tray or menu bar; choose Quit to stop the app. Launch at login is off by default and, when enabled, runs silently without opening a window.
- **Local offline reading.** Open the reader, read articles already stored on this computer and record reading state without internet. Desktop does not switch to a PWA cache subset. New feed fetches, unsaved external resources and AI services still need network access.
- **Manual backup and recovery.** Settings → About → Backup and recovery can create a complete backup, select a dated restore point and show operation results. Backups include feeds, articles and reading state, settings, existing vectors, plugin data and keys, and login/client state. Confirm and restart to complete the operation. Recovery saves the current data separately first; changes made after the restore point may be rolled back.
- **Desktop updates and upgrade protection.** Check for updates in Settings → About. On Windows, confirm the download and then Restart and update. On Mac, download the new DMG, quit fully and replace the app. Upgrades back up data first and stop if backup fails. Normal quit does not install updates; stable users do not receive prereleases and automatic downgrade is disabled.

### Improvements

- **More flexible setup.** Choose Simplified Chinese, Japanese or English on the welcome screen; setup, plugins and the reader retain it. Add later skips RSS/OPML setup so a feed is not required to finish onboarding.
- **Data independent of installation.** Moving the installation, replacement installs, reinstalls and normal uninstall do not intentionally delete local data. Open the data folder from Settings → About. The three latest successful pre-upgrade backups are retained; manual backups and pre-restore snapshots are not automatically deleted.
- **Separate desktop and self-hosted controls.** Desktop no longer carries a test-build label. Backup, data-folder, login-startup and app-install controls appear only in Desktop. Docker, Web and PWA keep their reading and offline workflows without desktop-only entries.

### Fixes

- **Unclear backup/recovery feedback.** Added confirmation, working, cancellation, completion and failure states. Restore is explicitly disabled when no valid backup is available, instead of appearing unresponsive.
- **Damaged backups blocking recovery.** One damaged snapshot no longer prevents access to healthy restore points. Interrupted recovery verifies integrity before replacing live data and rejects missing databases, invalid paths or altered files.
- **Incorrect startup data detection.** Newly generated browser preferences are no longer mistaken for an existing database. If a previously used database is missing or empty, startup stops and offers recovery rather than silently creating an empty replacement. Residual files are preserved before recovery.
- **Windows failing to start after recovery.** Cold backup, recovery and version checks now finish before the browser opens its data directory, avoiding directory locks and startup writes during recovery. Existing login-data paths are unchanged.
- **Write conflicts during quit and update.** Pending reading progress is saved, background tasks and plugin processes stop, then the database closes. Unsaved settings or an active data upgrade block unsafe backup, recovery and update actions.
- **Security and runtime dependencies.** Updated HTTP/runtime dependencies with security fixes and removed unused package-manager tools from Docker images. Hardened desktop permission and plugin boundaries so external pages cannot invoke privileged desktop operations. Docker runtime images contain neither Electron nor the desktop service runtime.

### Upgrade Impact And Migrations

From **v0.4.0 to v0.4.1**: no new SQL migrations or mandatory derived-data rebuilds, and **no embedding recomputation**. Direct upgrades from earlier releases still apply pending historical migrations and required data upgrades. Desktop backup/version protection applies to this computer's data; it does not automatically import a NAS or another deployment.

### Downloads And Upgrade

- [Windows x64 EXE installer](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-win-x64.exe)
- [Intel Mac drag-and-drop DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-x64.dmg)
- [Apple Silicon Mac drag-and-drop DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-arm64.dmg)
- Docker: `ghcr.io/pls-1q43/dibao:v0.4.1`, `linux/amd64` and `linux/arm64`.

Desktop data lives in `%LOCALAPPDATA%\Dibao` on Windows or `~/Library/Application Support/Dibao` on Mac. See the [desktop guide](/en/desktop-install/) for installation, updates and recovery. Future formal releases will also include all three installers and Docker.

For a new Docker installation, use the [Compose example](/en/quick-install/). Before upgrading, sync pending client offline actions, stop the old container and back up the entire `/data`, not only SQLite's main file. Keep the existing volume and environment, set the image to `v0.4.1`, then run `docker compose pull && docker compose up -d`. Check `/api/system/health` for `data.ok: true` and `data.version: "0.4.1"`; authenticated `/api/system/upgrade/status` must show completed or not-required upgrades and `blocking: false`.

To roll back, stop the new version, restore the full pre-upgrade backup into a clean directory/new volume, then start the older image. Do not open newer data with an old version or overlay a backup onto newer WAL files.

### Known Limitations

- Packages remain unsigned and your OS may warn about or block first launch. Use only this Release's downloads and follow system confirmation prompts; do not disable security checks. Mac currently needs manual replacement and unsigned login-item registration may fail.
- Native Windows ARM, NAS imports, remote-instance connections and multi-device sync are not supported. Desktop offline reading uses the local database; it is not offline synchronization with a server.
- Third-party server plugins remain trusted local code; install only plugins you trust. Vendor-unfixed dependency findings and the scope of checks are documented in the [release audit](https://github.com/Pls-1q43/Dibao/blob/main/docs/release-audit-v0.4.1.md).

## v0.4.0

Release date: 2026-09-07

GitHub Release: [Dibao v0.4.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.0)

v0.4.0 adds a local reading copy you can take offline, plus better ways to find the next article: related stories below the reader and personalized suggestions after a like. It also makes recommendation pagination, connection recovery, plugin boundaries, and version upgrades more reliable.

### Offline Reading, On Your Terms

- **Off by default, enabled per client.** Turn on offline reading in Settings while connected to prepare the cache. The switch and article target belong to the current browser or installed PWA, not your server account. Enabling it on a desktop does not enable it on your phone.
- Dibao saves ranked unread recommendations, with a **default target of 200 articles, adjustable from 50 to 1,000 in steps of 50**. It also keeps up to 200 read-later copies and 20 recently opened articles. **The 200-article limit applies only to offline read-later copies, not your server-side read-later list.** Overlapping articles are deduplicated. Available bodies, recommendation inventory, and browser storage determine the actual count; the target is not a download guarantee.
- When the network or server becomes unavailable, Dibao offers an explicit switch if cached articles are available. It does not silently replace online results with a cache. An offline banner identifies the mode; the status light opens details about cached articles, the snapshot, and pending or failed actions. Once connected, choose “Exit offline mode” in that panel to check the connection and sync before returning online. Connectivity alone does not force a switch. Reopening the app restores your previously selected offline mode.
- Read cached bodies and queue favorites, likes, read-later changes, read status, and reading progress for synchronization. Failed syncs can be retried; an expired session requires signing back into the same account. Sync pending actions before disabling offline reading, clearing the cache, or signing out, and heed the warning about losing unsynced actions.
- PWA updates retain the resources needed to reopen the app more reliably. Cross-tab sign-out and cache cleanup also prevent old requests from repopulating revoked image caches.

### Reader And Recommendations

- The reader offers up to **5 related articles**, excluding the current article, duplicates in its groups, hidden articles, and articles marked not interested. A successful like can also reveal next-read suggestions that combine your personal recommendations with the current article's topic.
- “More” opens a paginated related-article search with article-state filters. By default it considers up to 500 nearest neighbors and retains results with **similarity strictly greater than 0.35**, shown 50 per page. This threshold applies to expanded search, not the five-item preview, so the two lists need not match exactly. Discovery requires an existing active embedding index and a vector for the current article; unavailable prerequisites are reported rather than triggering on-demand embedding recomputation. These online discovery queries are unavailable in offline mode.
- Recommendation pages use a fixed session sequence to reduce duplicates and omissions when background ranking changes. Offline pagination also keeps its place as local article states change. Scrolling past a saved or opened article no longer incorrectly treats it as ignored.
- Feed refresh is less likely to stall, and upgrades avoid repeated expensive candidate and full-text queries. Upgrade duration still depends on your dataset and hardware; there is no fixed completion-time guarantee.
- Settings → Reading controls whether scrolling past an untouched article marks it ignored. Related articles may include read or liked items; personalized next-read suggestions exclude read, favorited, and liked items.

### Sentry Diagnostics

Error and performance telemetry is enabled by default and can be disabled during setup or in Settings. Release images include server and browser Sentry configuration. Browser source maps are uploaded during the build and `.map` files are removed from the public image. Configuration comes from a private build secret; the authorization token is not included in the runtime image. Release checks verify reporting and opt-out suppression, exposing only booleans and acceptance status rather than private settings.

### Security And Limits

- Hardened authentication and write-request origin checks, static/API path boundaries, plugin bridge paths, and address validation for controlled outbound requests. Disabled plugins no longer serve assets; plugin documents, including HTML and SVG/XML, receive sandbox protection.
- Frontend plugin isolation is not a server-side plugin sandbox. Third-party server plugins remain trusted local code; install only plugins you trust.
- **Outside localhost/loopback, reliable PWA offline startup requires an HTTPS secure context.** Opening a NAS through a plain HTTP LAN address is not equivalent to having an offline-capable PWA. Configure HTTPS, prepare the cache, and test with the network disconnected.
- Mobile operating systems can suspend background pages, interrupt downloads, or reclaim browser storage. Persistent-storage permission may not be granted. Keep the app in the foreground while preparing or syncing and check the available article count before leaving. Images are cached on a best-effort basis; external links, videos, every image, and bodies not yet fetched are not guaranteed offline. A fresh installation without a prepared cache cannot open uncached articles offline.
- Local copies are neither a backup nor cross-device cloud sync. Clearing site data, uninstalling the PWA, or storage eviction can remove cached content and unsynced actions.

### Upgrade Impact And Migrations

There is one new core SQLite migration from **v0.3.1 to v0.4.0**:

- `027_recommendation_sessions.sql` adds `recommendation_sessions`, `recommendation_session_items`, and indexes for stable recommendation pagination. Direct upgrades from older releases also apply any earlier pending migrations automatically.

Database migrations run automatically. Existing databases that need updated recommendation data then enter an **automatic blocking data-upgrade screen**. Dibao replays existing behavior, rebuilds interest profiles and related derived data, recalculates eligible recommendations, and removes superseded recommendation contexts only after success. Normal features remain unavailable until this completes. Failures remain visible and can be retried from the upgrade screen; do not delete upgrade markers to bypass the process.

**This upgrade does not recompute embeddings or require new embedding-service calls for existing articles.** It reuses stored vectors. After normal operation resumes, embedding generation for new articles still follows your provider settings.

### Docker Installation, Backup, And Rollback

Version image: `ghcr.io/pls-1q43/dibao:v0.4.0`. For a new installation, use the [English README Compose example](/en/quick-install/). Persist `/data`, for example with `./data:/data`, and keep the database at `/data/dibao.sqlite`; do not store your only copy in the container's writable layer.

For an existing Compose installation, sync offline actions on each client, stop the service, back up the whole data directory, and update the Compose image tag. These commands assume `./data:/data`; adapt the backup for a named volume or another path.

```bash
docker compose stop
tar czf "dibao-data-before-v0.4.0-$(date +%Y%m%d-%H%M%S).tgz" -C data .
# Set compose.yaml image to ghcr.io/pls-1q43/dibao:v0.4.0
docker compose pull
docker compose up -d
docker compose ps
```

Do not copy only the main `.sqlite` file while SQLite is writing. Stop the service and back up all of `/data`, or use a consistent SQLite backup. The default Docker entrypoint manages both HTTP and worker processes; retain existing environment settings and mounts.

Verify both conditions after upgrading:

1. `GET /api/system/health` returns `data.ok: true` and `data.version: "0.4.0"`. This proves basic health, **not completion of the data upgrade**.
2. While signed in, check `GET /api/system/upgrade/status`. An existing-data upgrade should finish with `data.id: "recommendation-contract"`, `data.state: "completed"`, and `data.blocking: false`. A fresh empty database may report `not_required` with `blocking: false`. During schema migration, this endpoint may first report core migration status; continue until it reports the derived-data result. Confirm the upgrade screen closes and normal reading works.

To roll back, stop v0.4.0, preserve the failed installation for diagnosis, restore the **complete pre-upgrade backup** into a clean directory or new volume, and start the previous image, such as `ghcr.io/pls-1q43/dibao:v0.3.1`, with that restored mount. Do not overlay an old backup onto a directory containing newer WAL files, or run an older image against the upgraded database. Rollback loses changes made after the backup; server backups do not contain unsynced browser actions.

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
- Plugin installation docs: [`docs/plugin-installation.en-US.md`](/en/plugins/installation/)
- Plugin development docs: [`docs/plugin-development.en-US.md`](/en/plugins/development/)

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
