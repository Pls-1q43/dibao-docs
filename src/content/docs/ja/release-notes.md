---
title: リリースノート
description: Dibao v0.2.0、v0.1.3、v0.1.2、v0.1.1、v0.1.0 のリリース概要。
---

## v0.2.0

リリース日：2026-06-19  
GitHub Release：[Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 ではプラグインシステムが利用できるようになりました。プラグインは、設定画面、ナビゲーション、バックグラウンドタスク、Hook、プラグイン専用データ、Secrets、外部配信を拡張できます。

### 主な変更

- manifest v1、インストール、有効化、無効化、アンインストール、署名パッケージ検証、trusted keys、プラグイン migration、tasks、hooks、設定、プライベートデータに対応しました。
- Web UI は sandboxed iframe 内で動作し、host bridge 経由で宿主機能にアクセスします。サーバープラグインは独立した Node host 子プロセスで実行されます。
- 公式 Daily Brief プラグインを同梱しました。過去 24 時間のパーソナライズ推薦から、興味トピックごとの日次ブリーフを生成します。
- 公式 Webhook プラグインを同梱しました。記事操作、フィード更新、ランキング完了、設定更新、プラグインタスク結果、Daily Brief 生成イベントを外部 HTTP サービスへ送信できます。
- `@dibao/plugin-sdk` と `@dibao/plugin-cli` により、プラグインの検証、パッケージ化、署名を行えます。
- 推薦リスト、前面の読み取り、バックグラウンドジョブ、migration 待機、health check、plugin host の安定性に関する性能・信頼性修正を含みます。

### アップグレード影響

v0.1.x から v0.2.0 へのアップグレードでは、プラグインシステムに必要なコアテーブルとインデックスを作成する blocking database migration が 1 回実行されます。初回起動時は core blocking migration gate が完了するまで通常のサービス提供を開始しません。データ量が多い場合やディスクが遅い場合は、少し時間がかかることがあります。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。バックアップ後、同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.2.0"` と `ok: true` が含まれていれば、基本的な確認は通っています。

### Docker インストールとアップグレード

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.0
```

ロールバックする場合は、v0.2.0 コンテナを停止し、アップグレード前の SQLite database と `/data` volume backup を復元してから前バージョンのイメージを起動してください。

### 関連リンク

- [Webhook ガイド](/ja/plugins/webhook/)
- [プラグインインストールガイド](/ja/plugins/installation/)
- [プラグイン開発ガイド](/ja/plugins/development/)

### 既知の制限

- 第三者サーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを安全に実行する sandbox ではありません。信頼できるパッケージだけをインストールし、署名、trusted keys、capabilities、サーバーコードのリスクを確認してください。
- 一部の Host API は Beta で、`0.2.x` 中に field や semantics が変わる可能性があります。長期運用する plugin は Stable API と manifest migrations を優先してください。

## v0.1.3

リリース日：2026-06-04  
GitHub Release：[Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

v0.1.3 は v0.1 系のメンテナンスリリースです。フィード管理の使いやすさ、Reader のメタ情報、Ollama / Gemini embedding provider の安全な動作を改善しました。

### 主な変更

- フィード管理画面の縦方向の余白を減らしました。フィード追加は行内のボタンからダイアログを開き、フィード健全性は一覧フィルターに統合しました。
- ソースフィルターが有効な場合、記事一覧のソースボタンに状態が表示されるようになり、意図せず絞り込んでいる状態に気づきやすくなりました。
- おすすめ、最新、あとで読むなどのページで、英語以外の UI では英語サブタイトルを復元しました。英語 UI では引き続きサブタイトルを表示しません。
- 記事一覧、検索結果、Reader のメタ情報に公開年を表示し、年をまたぐ記事でも元ページを開かずに年を確認できます。
- Ollama provider の既定切り出し長を 4000 文字に下げ、中国語長文 / bge-m3 向けの案内を追加しました。Ollama の文脈長エラーでは、より短い切り出しで 1 回だけ再試行します。
- Gemini embedding の次元数を明示的に要求します。Google AI Studio の OpenAI-compatible endpoint には `dimensions` を、native Gemini provider には `outputDimensionality` を送り、768 / 1536 / 3072 次元の設定を使えるようにしました。

### アップグレード影響

v0.1.2 から v0.1.3 へのアップグレードでは、新しい SQL migration はありません。recommendation derived-data upgrade も発生しません。同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

### 既知の制限

- Ollama のモデルや文脈長設定によっては、切り出し長を手動でさらに下げる必要があります。bge-m3 で文脈長エラーが続く場合は 3000 文字を試してください。
- Gemini / OpenAI-compatible の次元数指定は上流 provider の対応に依存します。Dibao は Google Gemini の経路で次元数を送信し、返ってきたベクトル次元も引き続き検証します。

## v0.1.2

リリース日：2026-06-01  
GitHub Release：[Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

v0.1.2 は v0.1 系のメンテナンスリリースです。Embedding provider のエラーを分かりやすくし、Reader のメディア表示を安全にし、feed / folder への移動をより直接的にしました。

### 主な変更

- Embedding provider のテスト失敗が、より対応しやすい公開エラーとして返るようになりました。認証失敗、model / endpoint 不存在、rate limit、provider 停止、ネットワーク不可達、不正なレスポンスを分類します。
- Provider のエラーでは、表示してよい上流メッセージを残しつつ、API key、token、Authorization などの機密情報を伏せます。
- 設定画面とバックエンド状態レスポンスで、provider のテストエラーが不要な index 一覧へ漏れないようにしました。
- フィード管理を「フィード管理」と「フィードフォルダー管理」の 2 つのビューに分け、長い画面で操作が混ざりにくくなりました。
- フィードとフォルダーの行に「記事を見る」を追加し、該当 feed / folder の latest 記事一覧へ直接移動できます。
- 記事一覧 URL が feed / folder の絞り込みパラメータを保持するため、更新、共有、戻る操作でも文脈を保ちやすくなりました。
- Reader 内の記事画像が読み込みに失敗した場合、繰り返し再試行しないようにしました。不要な通信とレイアウトの揺れを抑えます。

### アップグレード影響

v0.1.1 から v0.1.2 へのアップグレードでは、新しい SQL migration はありません。recommendation derived-data upgrade も発生しません。同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

### 既知の制限

- Embedding provider の詳細は上流サービスのレスポンスに依存します。Dibao は可能な範囲で分類と機密情報の除去を行いますが、provider 自体の停止は修復できません。
- 記事本文内のリモート画像は、元サイト、ネットワーク、防 hotlinking 設定に依存します。本リリースは、失敗した画像が繰り返し再試行されることを防ぎます。

## v0.1.1

リリース日：2026-05-30  
GitHub Release：[Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

v0.1.1 は推薦プロフィールの calibration とアップグレード体験を改善しました。RSS/Atom、OPML、feed 管理、検索、記事操作、推薦説明、Provider 設定、バックグラウンドジョブ、PWA 基盤の上に、初回導入と継続アップグレードをより安定させています。

主な点：

- クイックインストールは `ghcr.io/pls-1q43/dibao:latest` を使います。
- Compose はデフォルトで `./data:/data` のローカルフォルダ永続化を使います。
- Provider が利用できない場合でも読書は継続でき、推薦は基本の並び順に戻ります。
- 推薦、index、バックグラウンドジョブ、プラグイン状態は Settings で確認できます。

## v0.1.0

リリース日：2026-05-28  
GitHub Release：[Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

v0.1.0 は最初の公開リリースです。基本の並び替え、OpenAI-compatible と Ollama embedding providers、sqlite-vec vector indexes、推薦診断、バックグラウンド更新、検索、PWA app shell、health check、バックアップ/アップグレード文書を含みます。

最初の公開版のため、より古い公開版からの移行経路はありません。今後のアップグレード前には `./data` をバックアップしてください。
