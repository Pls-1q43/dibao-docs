---
title: 開発者ドキュメント
description: Dibao の開発者入口、リポジトリ構造、公開 contract。
---

開発者ドキュメントは `0.2.0` 以降の公開リファレンスとして維持されます。リポジトリ構造、API、database schema、推薦アルゴリズム、プラグインシステム、リリースプロセスを扱います。

## リポジトリ構造

- `apps/web`：フロントエンド Web App。
- `apps/server`：API、RSS 取得、バックグラウンドジョブ、推薦メンテナンス。
- `packages/db`：database types、migrations、shared data contracts。
- `docs`：公開の製品、工程、開発者向けリファレンス。

ローカル計画、実行ログ、一時的な検証証拠、マシン固有メモは公開 docs には含めません。

## 公開 contract

- API routes と request/response shape は API contract に沿って進化します。
- Database structure は schema migration と database schema docs に沿って進化します。
- Plugin manifest、capability、Hook、UI slot は文書化された状態を保ちます。
- 推薦アルゴリズム文書は製品挙動を説明するもので、未実装の能力を UI 文言で誇張してはいけません。

## 互換性

正式 release と hotfix image は明示的な version number を使います。ユーザー向け quick-install docs は入口として `latest` を使えます。バージョンをまたぐアップグレードでは、SQLite migration、永続化ディレクトリ、プラグインデータを守る必要があります。
