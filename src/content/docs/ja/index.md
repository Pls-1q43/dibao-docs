---
title: Dibao ドキュメント
description: Dibao のインストール、設定、バックアップ、プラグイン、開発者向けリファレンス。
---

Dibao は、セルフホストできる fair-code の個人向け RSS 推薦リーダーです。購読する RSS / Atom はあなたが選び、Dibao はその中だけで記事を並べ替え、検索し、推薦理由を説明します。

## はじめに

- [クイックインストール](quick-install/)：Docker Compose で起動し、所有者アカウントを作成して OPML または最初の RSS / Atom を追加します。
- [推奨 Provider](providers/)：Ollama、SiliconFlow、Gemini、または OpenAI-compatible embedding provider を選びます。
- [バックアップとアップグレード](backup-upgrade/)：`./data` をバックアップし、Docker イメージを更新します。
- [プラグインインストール](plugins/installation/)：第三者の `.dibao-plugin` をアップロードし、権限を確認してから有効化します。
- [公式 Webhook プラグイン](plugins/webhook/)：Dibao `0.2.x` で記事、更新、推薦、Daily Brief のイベントを外部 HTTP endpoint に送信します。
- [ライセンス FAQ](license/)：BUSL-1.1、fair-code、Change Date、商用利用の境界を確認します。

## 実行環境

Dibao は Mac mini、NAS、自宅サーバー、VPS、または Docker を継続実行できるホストに向いています。LAN や private VPN の内側だけで使うこともできます。

現在は、複数ユーザーのチーム利用、公式ホスティング、SNS フォロー、コメント、購読外コンテンツ推薦、クラウド同期、全文記事のオフライン保存は提供していません。

## データの置き場所

フィード、記事、状態、行動イベント、推薦プロフィール、embedding provider 設定、index 状態は SQLite と永続化ディレクトリに保存されます。デフォルトの Compose は `/data` をローカル `./data` に割り当てるため、バックアップと移行が分かりやすくなります。
