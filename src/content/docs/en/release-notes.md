---
title: Release Notes
description: Dibao v0.2.0, v0.1.3, v0.1.2, v0.1.1, and v0.1.0 release note summary.
---

## v0.2.0

Release date: 2026-06-19  
GitHub Release: [Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 launches the plugin system. Plugins can now extend settings, navigation, background tasks, hooks, plugin-owned data, secrets, and outbound deliveries while running through a trusted local runtime.

### Highlights

- Plugin platform: manifest v1, install, enable, disable, uninstall, signed package verification, trusted keys, plugin migrations, tasks, hooks, private plugin data, and plugin settings.
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

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.0
```

To roll back, stop the v0.2.0 container, restore the pre-upgrade SQLite database and `/data` volume backup, then start the previous image.

### Useful Links

- [Webhook guide](/en/plugins/webhook/)
- [Plugin installation guide](/en/plugins/installation/)
- [Plugin development guide](/en/plugins/development/)

### Known Limitations

- Third-party server plugins are trusted local code, not an arbitrary malicious-code sandbox. Install only trusted packages and review signatures, trusted keys, capabilities, and server-code risk.
- Some Host APIs are Beta and may change during `0.2.x`. Long-lived plugins should prefer Stable APIs and manifest migrations.

## v0.1.3

Release date: 2026-06-04  
GitHub Release: [Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

v0.1.3 is a maintenance release for the v0.1 line. It focuses on feed-management usability, clearer reader metadata, and safer embedding provider behavior for Ollama and Gemini.

### Highlights

- Feed management uses less vertical space: adding a feed now opens from the feed row, and feed health is folded into list filtering instead of occupying a full-width row.
- The source filter button now shows an active state when source filtering is enabled, making accidental source filters easier to notice.
- Localized reader pages such as For You, Latest, and Read Later restore their English subtitles outside the English UI; the English UI remains subtitle-free.
- Article lists, search results, and the reader header now include the publication year so cross-year articles are unambiguous without opening the source page.
- Ollama provider defaults to 4000-character slices and shows guidance for Chinese long-form content / bge-m3. Ollama context-length failures retry once with a shorter slice.
- Gemini embedding dimensions are requested explicitly. Google AI Studio through the OpenAI-compatible endpoint receives `dimensions`, and the native Gemini provider receives `outputDimensionality`, enabling configured 768 / 1536 / 3072-dimensional output.

### Upgrade Impact

Upgrading from v0.1.2 to v0.1.3 does not add SQL migrations and does not trigger a recommendation derived-data upgrade. Keep the same `/data` volume, replace the image, and restart the container.

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

### Known Limitations

- Ollama models and context settings may still require manual slice tuning. If bge-m3 still reports context length errors, try 3000 characters.
- Gemini / OpenAI-compatible dimensionality depends on upstream provider support. Dibao sends dimension requests for Google Gemini paths and still validates returned vector dimensions.

## v0.1.2

Release date: 2026-06-01  
GitHub Release: [Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

v0.1.2 is a maintenance release for the v0.1 line. It focuses on clearer embedding provider failures, safer reader media rendering, and more direct feed/folder navigation.

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

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

### Known Limitations

- Embedding provider detail depends on the upstream service response. Dibao classifies and redacts what it can, but it cannot repair an unavailable provider.
- Remote article images still depend on the source site, network, and hotlinking rules. This release prevents failed images from retrying repeatedly.

## v0.1.1

Release date: 2026-05-30  
GitHub Release: [Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

v0.1.1 improved recommendation profile calibration and upgrade experience across RSS/Atom, OPML, feed management, search, article actions, recommendation explanations, provider settings, background jobs, and the PWA foundation.

Highlights:

- Quick install uses `ghcr.io/pls-1q43/dibao:latest`.
- Compose defaults to local folder persistence with `./data:/data`.
- If a provider is unavailable, reading remains available and recommendations fall back to baseline ranking.
- Recommendation, index, background job, and plugin state are visible in Settings.

## v0.1.0

Release date: 2026-05-28  
GitHub Release: [Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

v0.1.0 was the first public release. It included baseline ranking, OpenAI-compatible and Ollama embedding providers, sqlite-vec vector indexes, recommendation diagnostics, background refresh, search, a PWA app shell, health checks, and backup/upgrade documentation.

Because it was the first public release, there was no migration path from an earlier public version. Back up `./data` before future upgrades.
