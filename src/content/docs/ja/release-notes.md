---
title: リリースノート
description: Dibao v0.2.x、v0.1.1、v0.1.0 のリリース概要。
---

## v0.2.x 現在の開発ライン

`0.2` はプラグインプラットフォームと次期バージョンの開発ラインです。現在の branch の主な内容：

- プラグインプラットフォームの強化：server plugin は独立 Node host 子プロセスで動作し、JSON-RPC Host API 経由で core capabilities を呼び出します。
- プラグイン UI の強化：plugin page は sandbox iframe で動作し、Dibao API を直接 `fetch` せず `postMessage` bridge を使います。
- third-party install policy：user-installed plugins は既定で無効で、server install には Ed25519 signature と trusted keys が必要です。
- plugin capabilities：`secrets`、`deliveries`、manifest migrations、Stable/Beta API tiers、plugin health metadata。
- 公式プラグイン：Daily Brief と Webhook は image に同梱され、Plugins page から有効化できます。
- runtime safety：background jobs、plugin hooks、diagnostics、SQLite maintenance paths により厳格な runtime guardrails が入っています。

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
