---
title: 開発者ドキュメント
description: Dibao v0.4.1 のコア、Desktop、オフライン、API、移行とプラグイン開発。
---

公開版は `v0.4.1` で、主プロジェクト `main` の完全リリースに対応します。開発ブランチは現在の版系列と公開規則に従って選び、古い 0.2／0.3 案内を現状として扱わないでください。

## リポジトリー構造

- `apps/desktop`：Electron 主プロセスと preload、ローカル実行、更新、保存と復元。
- `apps/web`：React、リーダー、PWA、オフラインキャッシュ、iframe 宿主。
- `apps/server`：Fastify API、認証、取得、worker、推薦、プラグイン宿主。
- `packages/db`：SQLite repository、移行とベクトル。
- `packages/ranking`：興味プロフィールと順位付け。
- `packages/plugin-sdk` / `packages/plugin-cli`：manifest、能力、検証、パッケージと署名。
- `plugins/official`：Daily Brief、Webhook、Full Content Selectors。

## 開発と検証

```bash
npm ci
npm run typecheck
npm test
npm run build
git diff --check
```

開発サービスは `npm run dev:server` と `npm run dev:web` を使います。Desktop は `npm run build:desktop`、`npm run desktop:package`、`npm run desktop:smoke` です。ローカル作成だけでは対象 OS のインストール・更新検証を代替できません。

## v0.4 の合約

- 推薦セッションでページ送り順を固定し、`027_recommendation_sessions.sql` に位置とスコアを保存します。
- 関連／個人向け発見は既存ベクトルの読み取りです。リーダーを開くために Embedding や全庫再計算を実施しません。
- Web／PWA は origin とユーザーで分離し、オフライン操作は `clientActionId` で冪等化します。操作同期後に保存内容を更新します。
- 開く、記事操作、スクロールは低遅延を保ち、プロフィール、順位付け、Embedding、重い診断は背景または明示的な処理に回します。
- Desktop は断網時もローカル DB を使用します。終了時は進捗を保存し、背景タスクとプラグインを停止してから DB を閉じます。

## データ更新とリリース

公開済み移行は削除・改変しません。core 移行は通常操作を止める可視画面で実施し、必要な派生再構築も進捗を表示します。成功後に業務を戻し、旧コンテキストを削除します。

v0.4.0 は推薦セッション移行を追加し、既存 Embedding を派生更新で再利用します。v0.4.1 は SQL 移行や強制再構築を追加しません。Embedding 費用のかかる再計算はユーザーの明示的な判断が必要です。

正式版は同じコミットと版から Windows x64 EXE、Intel／Apple Silicon DMG、Docker amd64／arm64 を提供します。新規導入、旧版更新、保存復元、権限を検証します。現在は未署名で、Mac は手動上書きです。

## プラグインと API

[プラグイン開発](/ja/plugins/development/) は Stable／Beta、互換性、bridge、抽出器、署名と CLI を説明します。[API・DB リファレンス](/ja/reference/) は新しい接口と永続化境界を扱います。

前面隔離は悪意あるサーバーコードの sandbox ではありません。Desktop の権限は管理されたアプリ入口だけに許可し、プラグインや外部ページへ公開しません。

## 実装の根拠

`apps/server/src/app.ts`、`reader-discovery-service.ts`、`apps/web/src/api.ts`、`packages/db/migrations`、`packages/plugin-sdk/src/index.ts`、`apps/desktop/src` を参照します。全ソースは [v0.4.1](https://github.com/Pls-1q43/Dibao/tree/v0.4.1) にあります。
