---
title: API・DB リファレンス
description: Dibao v0.4.1 の発見、オフライン同期、更新 API と永続化境界。
---

v0.4.1 のサーバールートと型に基づきます。成功応答は通常 `data` で包み、ページ送りには `page` / `meta` を追加します。業務 API はログインが必要で、書き込みは origin を検証します。プラグインは許可された Host API／bridge を使い、コア接口への無制限権限とは扱わないでください。

## コア API

| 接口 | 用途とパラメーター |
| --- | --- |
| `GET /api/system/health` | `data.ok` と `data.version` による基本動作確認。データ更新完了ではありません。 |
| `GET /api/system/upgrade/status` | 認証後の core／派生状態。最終 `completed` または `not_required` と `blocking: false` を確認。 |
| `GET /api/articles/:id/related` | 関連プレビュー。初期 5、`limit` は 1–10。 |
| `GET /api/articles/:id/related-search` | 展開検索。初期 50、`limit` は 1–100、`cursor`、`state: all/unread/read/favorites/read_later`。 |
| `GET /api/articles/:id/personalized-related` | 個人順位と現在記事を組み合わせる提案。初期 5、`limit` は 1–10。 |
| `GET /api/offline/manifest` | 保存済み推薦の清單。`recommendedLimit` は初期 200、API は 50–1,000 の整数、UI は 50 刻み。 |
| `POST /api/offline/articles/batch` | `{ "articleIds": [...] }` で本文を取得。 |

発見は `status: "ready"` または `"unavailable"` を返します。理由は `no_active_embedding`、`article_embedding_missing`、個人候補不足時の `insufficient_candidates` などです。記事欠落は 404 です。展開検索は類似度が厳密に 0.35 より大きい結果を使い、プレビューには同じ閾値を適用しません。

## オフライン操作とセッション

操作はクライアント生成の `clientActionId` を受け入れ、同じ ID の再送で行動を重複させません。推薦ページ送りはセッション情報を含みます。返された cursor と対応セッションを保持し、異なるセッションを混ぜないでください。保存と発見は既存データを読み、Embedding 再計算を開始しません。

## プラグイン導入 API

<h3 id="plugin-install">POST /api/plugins/install</h3>

URL／JSON パッケージの高度な導入入口です。通常は設定のアップロードを使い、取得、署名、互換性と権限を検証します。

<h3 id="plugin-install-upload">POST /api/plugins/install/upload</h3>

`.dibao-plugin` をアップロードします。外部プラグインは初期無効で、管理者が提供元と能力を確認して有効にします。

## DB と永続化

v0.4.0 は `027_recommendation_sessions.sql` を追加し、v0.4.1 は core SQL 移行を追加しません。

| 構造 | 内容 |
| --- | --- |
| `recommendation_sessions` | `id`、`rank_context`、`rerank_window_id`、`scope_key`、`item_count`、`created_at`、`expires_at`。 |
| `recommendation_session_items` | `session_id`、`article_id`、`position`、`rank_score`、`rank_calculated_at`。位置は会話内で一意。 |
| 推薦記憶 | 026 の `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`。 |
| プラグイン | install、能力、設定、KV、移行、secret、配信、更新記録をディレクトリーと共に保持。 |

移行を迂回して内部テーブルを編集しないでください。Docker は `/data` 全体、Desktop はルート全体を保存します。ブラウザー IndexedDB のコピーはサーバー SQLite 保存に含みません。

## 関連資料

[開発者](/ja/developers/)、[プラグイン開発](/ja/plugins/development/)、[バックアップと更新](/ja/backup-upgrade/)、[リリースノート](/ja/release-notes/)。詳細なルートと型は [v0.4.1 サーバー](https://github.com/Pls-1q43/Dibao/blob/v0.4.1/apps/server/src/app.ts) と [DB ソース](https://github.com/Pls-1q43/Dibao/tree/v0.4.1/packages/db) にあります。
