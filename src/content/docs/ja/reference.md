---
title: リファレンス索引
description: Dibao 0.3 public reference documentation index。
---

この section は main repository の `docs/` から移した public reference の入口です。docs site は stable entry と summary を提供し、完全な engineering reference は main project に残ります。

## Product / Design

- Project brief: positioning、non-goals、data ownership、long-term direction。
- MVP PRD: first public release scope。
- Wireframes: early information architecture と page flows。
- Design tokens: colors、type、spacing、visual constraints。
- Visual interaction spec: reader、list、explanation、settings interactions。
- Article action interaction spec: favorite、read later、read/unread、not-interested state contracts。

## Engineering Reference

- Engineering blueprint: first technical map。
- Database schema: SQLite tables、indexes、migrations、data formats。
- API contract: HTTP APIs、request/response shapes、error semantics、feed `fullContentMode`、full-content preview、current-feed backfill APIs。
- Developer guide: 0.3 branch policy、release validation、migrations、plugin API stability tiers。
- Runtime performance guidelines: foreground hot paths、separate worker process、SQLite busy handling、ranking chunks、cold-path diagnostics。
- Profile algorithm v0: profile / ranking parameter reference。
- Recommendation v0.3 plan / v2-v3 design: recommendation v3 memory、exposures、exploration、fallback boundaries。
- Plugin system design: plugin capabilities、install/update、hooks、UI slots、official plugin inventory。

## Release / License

- License FAQ: BUSL-1.1 と Change Date。
- Release process: formal releases、hotfixes、Docker image rules。
- Release notes: v0.3.1、v0.3.0、v0.2.1、v0.2.0、earlier versions。
