---
title: リリースノート
description: Dibao v0.1.1 と v0.1.0 のリリース概要。
---

## v0.1.1

v0.1.1 は推薦プロフィールの calibration とアップグレード体験を改善しました。RSS/Atom、OPML、feed 管理、検索、記事操作、推薦説明、Provider 設定、バックグラウンドジョブ、PWA 基盤の上に、初回導入と継続アップグレードをより安定させています。

主な点：

- クイックインストールは `ghcr.io/pls-1q43/dibao:latest` を使います。
- Compose はデフォルトで `./data:/data` のローカルフォルダ永続化を使います。
- Provider が利用できない場合でも読書は継続でき、推薦は基本の並び順に戻ります。
- 推薦、index、バックグラウンドジョブ、プラグイン状態は Settings で確認できます。

## v0.1.0

v0.1.0 は最初の公開リリースです。基本の並び替え、OpenAI-compatible と Ollama embedding providers、sqlite-vec vector indexes、推薦診断、バックグラウンド更新、検索、PWA app shell、health check、バックアップ/アップグレード文書を含みます。

最初の公開版のため、より古い公開版からの移行経路はありません。今後のアップグレード前には `./data` をバックアップしてください。
