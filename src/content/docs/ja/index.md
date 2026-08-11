---
title: Dibao Docs
description: Dibao v0.3.1 のインストール、設定、バックアップ、拡張、運用ドキュメント。
---

Dibao は、source-available / fair-code のセルフホスト RSS 推薦リーダーです。購読する RSS / Atom はあなたが選びます。Dibao は、そのフィードの内側だけで記事を並べ替え、検索し、推薦理由を説明します。

現在の推奨 release は `v0.3.1` です。0.3 系では推薦アルゴリズムとメカニズムが大きく更新され、recommendation v3 memory、推薦在庫ステータス、制御された fallback、任意の無限ロード、公式 Full Content Selectors plugin、Docker worker と controlled-fetch の強化が入りました。

## はじめに

- [クイックインストール](quick-install/)：Docker Compose で `v0.3.1` を起動し、所有者アカウントを作成して OPML または最初の RSS / Atom を追加します。
- [推奨 Provider](providers/)：Ollama、SiliconFlow、Gemini、または OpenAI-compatible embedding provider を選びます。
- [バックアップとアップグレード](backup-upgrade/)：`./data` をバックアップし、Docker image を更新し、health と推薦在庫を確認します。
- [プラグインインストール](plugins/installation/)：third-party `.dibao-plugin` を install し、有効化前に source、signature、capabilities を確認します。
- [公式 Webhook プラグイン](plugins/webhook/)：記事、更新、推薦、Daily Brief のイベントを外部 HTTP endpoint に送信します。
- [公式 Full Content Selectors プラグイン](plugins/full-content/)：0.3 の full-content fetching と selector-based extraction を有効化します。
- [ライセンス FAQ](license/)：BUSL-1.1、fair-code、Change Date、商用利用の境界を確認します。

## 実行環境

Dibao は Mac mini、NAS、自宅サーバー、VPS など Docker を継続実行できる host に向いています。LAN や private VPN の中だけで使え、公開 internet に出す必要はありません。

複数ユーザーのチーム利用、公式ホスティング、SNS follow、コメント、購読外コンテンツの推薦、cloud sync、offline full-article archive は提供していません。full-content fetching は feed ごとに明示的に有効化する Web 記事本文補完機能であり、offline archive system ではありません。

## データは手元に残る

Feed、記事、状態、行動 event、推薦 profile、embedding provider 設定、recommendation v3 memory、plugin package、index 状態は SQLite と永続 data directory に保存されます。既定の Compose は `/data` を local `./data` に map します。
