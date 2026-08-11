---
title: Reference Index
description: Dibao 0.3 public reference documentation index.
---

This section carries public reference material migrated from the main repository `docs/` directory. The docs site provides stable entry points and summaries; the main project still keeps the full engineering reference files.

## Product And Design

- Project brief: positioning, non-goals, data ownership, and long-term direction.
- MVP PRD: first public release scope.
- Wireframes: early information architecture and page flows.
- Design tokens: colors, type, spacing, and visual constraints.
- Visual interaction spec: reader, list, explanation, and settings interactions.
- Article action interaction spec: favorite, read later, read/unread, and not-interested state contracts.

## Engineering Reference

- Engineering blueprint: first technical map.
- Database schema: SQLite tables, indexes, migrations, and data formats.
- API contract: HTTP APIs, request/response shapes, error semantics, feed `fullContentMode`, full-content preview, and current-feed backfill APIs.
- Developer guide: 0.3 branch policy, release validation, migrations, and plugin API stability tiers.
- Runtime performance guidelines: foreground hot paths, separate worker process, SQLite busy handling, ranking chunks, and cold-path diagnostics.
- Profile algorithm v0: profile and ranking parameter reference.
- Recommendation v0.3 plan / v2-v3 design: recommendation v3 memory, exposures, exploration, and fallback boundaries.
- Plugin system design: plugin capabilities, install/update, hooks, UI slots, and official plugin inventory.

## Release And License

- License FAQ: BUSL-1.1 and Change Date.
- Release process: formal releases, hotfixes, and Docker image rules.
- Release notes: v0.3.1, v0.3.0, v0.2.1, v0.2.0, and earlier versions.
