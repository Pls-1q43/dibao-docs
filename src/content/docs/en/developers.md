---
title: Developer Docs
description: Dibao 0.3 developer entry point, repository structure, and public contracts.
---

Developer documentation is maintained as public reference from `0.2.0` onward. The current line is `0.3.x`, covering repository structure, APIs, database schema, recommendation algorithms, plugins, full-content fetching, runtime performance, and release process.

## Repository Structure

- `apps/web`: Web app, PWA, settings, feed management, full-content preview, and plugin iframe host.
- `apps/server`: APIs, RSS fetching, full-content fetching, background jobs, recommendation maintenance, plugin host, and authentication.
- `packages/db`: database types, migrations, and shared data contracts.
- `packages/plugin-sdk`: plugin manifest, capabilities, events, signatures, and package validation.
- `packages/plugin-cli`: third-party plugin template, validation, packaging, and signing commands.
- `plugins/official`: bundled official plugins: Daily Brief, Webhook, and Full Content Selectors.
- `docs`: public product, engineering, and developer reference.

Local planning notes, execution records, temporary validation evidence, and machine-specific instructions do not belong in public docs.

## Current 0.3 Focus

- Recommendation v3 memory: `user_representation_snapshots`, `recommendation_exposures`, and `exploration_attempts`.
- Recommended lists stay closer to the active rank context, with capped fallback batches to avoid large unsorted pages taking over.
- Foreground interaction paths avoid synchronous reranking, heavy diagnostics, and broad writes; background worker chunks ranking, embeddings, feed refresh, and plugin work.
- Feeds support `feed_only` and `fetch_full_content`; article web pages are fetched only when explicitly enabled for a feed.
- Plugin manifests support localized strings, iframe/bridge APIs can read the current locale, and full-content extractors are a Beta plugin extension point.

## Public Contracts

- API routes and request/response shapes evolve through the API contract.
- Database structure evolves through schema migrations and database schema docs.
- Plugin manifest, capabilities, hooks, UI slots, full-content extractors, and iframe bridge must stay documented.
- Plugin Stable/Beta APIs, trusted signing keys, persistence paths, and official plugin inventory must track the `0.3` implementation.
- Recommendation docs explain product behavior and should not be overstated as unimplemented UI promises.

## Compatibility

Formal release and hotfix images must use explicit version numbers; user install docs should also use the current recommended version. Cross-version upgrades must preserve SQLite migrations, persistent data, plugin data, and embedding cost boundaries. The 0.3 upgrade does not implicitly require embedding recomputation.
