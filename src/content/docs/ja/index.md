---
title: Dibao Docs
description: Dibao v0.4.1 の Desktop・Docker 導入、オフライン読書、プラグイン、保存と開発者資料。
---

Dibao は source-available / fair-code の個人用 RSS 推薦リーダーです。RSS / Atom は自分で選び、その中だけで順位付け、検索、推薦理由の説明を行います。読書データは PC または自ホスト環境に保存されます。

現在の推奨版は `v0.4.1` です。Windows・macOS の独立アプリと Docker・Web・PWA を提供します。v0.4 はオフライン読書、関連記事、いいね後の個人提案と安定したページ送りを追加し、v0.4.1 は Desktop 常駐、更新、保存と復元、初回設定を改善しました。

## はじめに

- [クイックインストール](/ja/quick-install/)：Desktop または Docker Compose で v0.4.1 を導入。
- [デスクトップ版](/ja/desktop-install/)：三種類のインストーラー、常駐、更新、データと復元。
- [オフライン読書](/ja/offline-reading/)：Web／PWA の保存、切り替えと同期。
- [読書と関連記事](/ja/reading/)：関連検索、いいね後の提案と記事状態。
- [Provider](/ja/providers/)：任意で Ollama または外部 Embedding を接続。
- [バックアップと更新](/ja/backup-upgrade/)：全データの保存と更新完了の確認。
- [プラグイン導入](/ja/plugins/installation/)：公式を有効化、または信頼できる外部パッケージを導入。
- [Daily Brief](/ja/plugins/daily-brief/)、[Webhook](/ja/plugins/webhook/)、[Full Content Selectors](/ja/plugins/full-content/)：公式 Desktop と Docker に同梱され、アップロード不要。
- [リリースノート](/ja/release-notes/)：v0.4.1、v0.4.0 と過去版。
- [ライセンス FAQ](/ja/license/)：BUSL-1.1、Change Date と商用ライセンス。

## 実行方式

Desktop はサーバー構築なしで Windows／Mac に導入できます。Docker は NAS、自宅サーバー、VPS に適し、Web／PWA から利用します。LAN／私設 VPN 内でも使え、PWA のオフライン起動には安全なコンテキストが必要です。

Desktop と Docker の DB は独立しています。別環境からのインポート、遠隔接続、多端末同期は未対応です。チーム協業、公式ホスティング、SNS フォロー、購読外コンテンツの推薦も提供しません。

## データの保存

フィード、記事、行動、興味プロフィール、ベクトル、プラグインデータと鍵は永続ディレクトリーに保存します。Docker の既定は `./data:/data`、Desktop はアプリ本体と別保存です。ブラウザーのコピーは端末キャッシュで、完全バックアップではありません。
