---
title: 開発者ドキュメント
description: Dibao 0.3 developer entry point、repository structure、public contracts。
---

開発者ドキュメントは `0.2.0` 以降の公開リファレンスとして維持されます。現在の line は `0.3.x` で、repository structure、API、database schema、推薦アルゴリズム、plugin system、full-content fetching、runtime performance、release process を扱います。

## Repository structure

- `apps/web`: Web app、PWA、settings、feed management、full-content preview、plugin iframe host。
- `apps/server`: API、RSS fetching、full-content fetching、background jobs、recommendation maintenance、plugin host、authentication。
- `packages/db`: database types、migrations、shared data contracts。
- `packages/plugin-sdk`: plugin manifest、capabilities、events、signatures、package validation。
- `packages/plugin-cli`: third-party plugin template、validation、packaging、signing commands。
- `plugins/official`: bundled official plugins: Daily Brief、Webhook、Full Content Selectors。
- `docs`: public product、engineering、developer reference。

local planning notes、execution records、temporary validation evidence、machine-specific instructions は public docs に含めません。

## 現在の 0.3 focus

- Recommendation v3 memory: `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`。
- Recommended list は active rank context をより厳密に使い、fallback batch を制限します。
- foreground interaction path では同期的な reranking、heavy diagnostics、広範囲 write を避け、background worker が ranking、embeddings、feed refresh、plugin work を chunk 処理します。
- Feed は `feed_only` / `fetch_full_content` をサポートし、記事 Web page は feed ごとに明示的に有効化された場合だけ取得されます。
- Plugin manifest は localized strings に対応し、iframe/bridge API は current locale を読めます。full-content extractor は Beta plugin extension point です。

## Public contracts

- API routes と request/response shape は API contract に沿って進化します。
- Database structure は schema migrations と database schema docs に沿って進化します。
- Plugin manifest、capabilities、hooks、UI slots、full-content extractors、iframe bridge は文書化を維持します。
- Plugin Stable/Beta APIs、trusted signing keys、persistence paths、official plugin inventory は `0.3` 実装と同期します。
- Recommendation docs は product behavior を説明するもので、未実装能力を UI copy として誇張しません。

## Compatibility

正式 release と hotfix image は明示的な version number を使います。user install docs も current recommended version を使います。version をまたぐ upgrade では SQLite migration、persistent data、plugin data、embedding cost boundary を守る必要があります。0.3 upgrade は embedding recomputation を暗黙には要求しません。
