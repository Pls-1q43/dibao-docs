---
title: リリースノート
description: Dibao v0.3.1、v0.3.0、v0.2.1、v0.2.0 と過去バージョンのリリース概要。
---

## v0.3.1

リリース日: 2026-08-10  
GitHub Release: [Dibao v0.3.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.1)

v0.3.1 は、現在推奨する 0.3 系の正式リリースです。中心テーマは「推薦アルゴリズムと推薦メカニズムの大幅更新」です。Dibao は、安定した排序済み在庫、より明確な fallback 境界、より確実なネガティブ topic フィルタ、低遅延なバックグラウンド排序を重視する方向に進みました。v0.3.1 ではさらに、v0.3.0 後の security、plugin、自ホスト feed、reader recovery、記事本文 cleanup の修正も含みます。

### 主な変更

- 推薦 v3 memory 基盤: user representation snapshot、推薦 exposure、探索 attempt を追加し、長期的な興味記憶、探索 feedback、今後の推薦戦略の土台を作りました。
- ranking と fallback の分離: 推薦リストは active rank context をより厳密に使います。排序済み在庫が少ない場合も、fallback は小さな一時 batch として使われ、大量の未排序ページが読書体験を覆うことを避けます。
- ネガティブ topic / family 修正: negative cluster、topic family 制約、金融・取引日系など見たくない topic の降格・除外がより確実に働きます。
- 推薦在庫ステータス: 未読推薦ページで、排序済み在庫があるか、空か、バックグラウンドで補充中かを確認できます。
- 操作経路の高速化: 記事を開く、スクロールする、記事アクションを行う経路では、同期的な再排序、重い transparency diagnostics、広範囲の書き込みを避け、バックグラウンド処理に移します。
- 無限ロード: 推薦、最新、收藏、あとで読む、検索結果で任意の自動ページングを利用できます。追加読み込みに失敗した場合、自動 retry を止め、明示的な手動 retry を残します。
- reader 改善: 記事詳細上部の戻る操作と原文操作を整理しました。詳細ロード失敗時には再読み込み導線を表示し、原文 URL が分かる場合は引き続き原文を開けます。
- plugin 改善: 公式 plugin manifest が localized string に対応し、plugin iframe と bridge API から現在 locale を読めます。Daily Brief、Webhook、全文 selector plugin は `0.1.1` に更新されます。
- 自ホスト feed 互換性: feed discovery / refresh は NAS、家庭内ネットワーク、自建 RSS の private/local network URL に対応します。一方、plugin outbound request と全文取得は controlled-fetch の防護境界を維持します。
- 記事本文 cleanup: Hexo 風 code block の行番号 gutter を除去し、実際の code body は保持します。
- security と release chain 強化: controlled fetch は DNS rebinding / TOCTOU SSRF リスクを下げ、cross-origin redirect では sensitive header を削除します。runtime / build dependency も更新し、production と full `npm audit` はどちらも 0 vulnerabilities です。

### アップグレード影響

v0.3.0 から v0.3.1 へのアップグレードでは、新しい core SQLite migration はありません。Embeddings の再計算も不要です。内蔵公式 plugin は `0.1.1` に更新されます。

v0.2.1 から v0.3.1 へ直接アップグレードする場合、推薦 v3 memory 関連の database 構造が追加されます。core migration は起動時に自動実行されます。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。

このアップグレードでは Embeddings の再計算は不要です。既存の記事、行動イベント、興味 cluster、vector を引き継ぎ、新しい推薦 memory と exposure データはアップグレード後の利用に合わせて蓄積されます。

アップグレード後は次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.3.1"` が含まれていれば基本確認は通っています。推薦在庫ステータスが排序中を示す場合は、バックグラウンドジョブが排序済み在庫を補充するまで待ってください。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

既存の `/data` volume を維持し、image を差し替えて再起動してください。既定の entrypoint は HTTP プロセスと独立 worker プロセスを起動します。独自 Compose を使っている場合は、永続 data volume と既存の環境変数を引き継いでください。

アップグレード前:

```text
/data/dibao.sqlite または Docker volume 全体をバックアップしてください。
```

ロールバックする場合は v0.3.1 コンテナを停止し、アップグレード前の SQLite database と `/data` volume backup を復元してから前の image を起動してください。0.3.x に migration 済みの database を旧バージョンで直接起動しないでください。

### Migration List

v0.3.0 から v0.3.1:

- 新しい core SQLite migration はありません。

v0.2.1 から v0.3.1 へ直接アップグレードする場合:

- `026_recommendation_v3_memory.sql`: `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` を追加し、`article_rank_scores` に探索関連フィールドを追加します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- 推薦 v3 memory は基盤更新であり、長期記憶戦略のすべてが完全に製品化されたわけではありません。推薦品質は利用とバックグラウンド排序に合わせて安定していきます。
- 排序済み推薦在庫が尽きた場合、一時的に fallback sequence を使うことがあります。ただし v0.3.1 では、その状態をより制限し、分かりやすく表示します。
- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。

## v0.3.0

リリース日: 2026-08-08  
GitHub Release: [Dibao v0.3.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.0)

v0.3.0 は「推薦アルゴリズムと推薦メカニズムの大幅更新」を中心にしたメジャーリリースです。推薦 v3 memory の基盤、active ranking の分離、fallback の制御、推薦在庫の可視化、低遅延な読書操作を強化しました。リーダーには無限ロード、全文取得プラグイン、セキュリティと安定性の改善も入っています。

### 主な変更

- 推薦 v3 memory 基盤: user representation snapshot、推薦 exposure、探索 attempt を追加し、長期的な興味記憶とフィードバックの土台を作りました。
- ランキングと fallback の分離: 推薦リストは active rank context をより厳密に使い、fallback が大量の未排序リストとして読書体験を覆うことを抑えます。
- ネガティブ topic / family フィルタの修正: 金融・取引日系など、見たくない topic cluster や topic group の降格・除外がより確実に働きます。
- 推薦在庫ステータス: 未読推薦画面で、排序済み在庫があるか、空か、バックグラウンドで排序中かを確認できます。
- 操作パフォーマンス改善: 記事を開く、スクロールする、記事アクションを行う経路では、同期的な再排序、重い診断、広範囲の書き込みを避けます。
- 無限ロード: 推薦、最新、收藏、あとで読む、検索結果で任意の自動ページングを利用できます。失敗時は自動再試行を止め、手動 retry を残します。
- リーダーの改善: 記事詳細の上部ボタン配置を整理し、詳細ロード失敗時に再読み込み導線を追加しました。
- プラグインと全文取得: 公式プラグイン基盤に全文取得 extractor を追加し、selector ベースの公式全文取得プラグインを提供します。Webhook は secrets、deliveries、runtime state に対応しました。
- outbound fetch の安全性強化: controlled fetch は検証済み IP を実際の接続にも使い、DNS rebinding / TOCTOU SSRF リスクを下げます。cross-origin redirect では sensitive header を削除し、POST body の意図しない転送も避けます。
- Docker と worker の安定化: cross-platform Docker build、worker keepalive、SQLite ranking writes、core migration checksum の streaming 検証を改善しました。

### アップグレード影響

v0.2.1 から v0.3.0 へのアップグレードでは、推薦 v3 memory 関連のデータベース構造が追加されます。core migration は起動時に自動実行されます。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。

このアップグレードでは Embeddings の再計算は不要です。既存の記事、行動イベント、興味 cluster、vector を引き継ぎ、新しい推薦 memory と exposure データはアップグレード後の利用に合わせて蓄積されます。

アップグレード後は次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.3.0"` が含まれていれば基本確認は通っています。推薦在庫ステータスが排序中を示す場合は、バックグラウンドジョブが排序済み在庫を補充するまで待ってください。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.0
```

既存の `/data` volume を維持し、image を差し替えて再起動してください。既定の entrypoint は HTTP プロセスと独立 worker プロセスを起動します。独自 Compose を使っている場合は、永続 data volume と既存の環境変数を引き継いでください。

アップグレード前:

```text
/data/dibao.sqlite または Docker volume 全体をバックアップしてください。
```

ロールバックする場合は v0.3.0 コンテナを停止し、アップグレード前の SQLite database と `/data` volume backup を復元してから前の image を起動してください。v0.3.0 に migration 済みの database を旧バージョンで直接起動しないでください。

### Migration List

v0.2.1 から v0.3.0 では、core SQLite migration が 1 件追加されます。

- `026_recommendation_v3_memory.sql`: `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` を追加し、`article_rank_scores` に探索関連フィールドを追加します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- 推薦 v3 memory は基盤更新であり、長期記憶戦略のすべてが完全に製品化されたわけではありません。推薦品質は利用とバックグラウンド排序に合わせて安定していきます。
- 排序済み推薦在庫が尽きた場合、一時的に fallback sequence を使うことがあります。ただし v0.3.0 では、その状態をより制限し、分かりやすく表示します。
- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。

## v0.2.1

リリース日: 2026-07-12  
GitHub Release: [Dibao v0.2.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.1)

v0.2.1 は 0.2 プラグインラインのパッチリリースです。Docker や NAS で長時間動かす環境で、バックグラウンドジョブ、公式プラグイン、モバイルリーダーの安定性を高めました。

### 主な変更

- Docker の split-process 構成で、HTTP プロセスが追加した `embedding_generate` ジョブを worker が見逃すことがある問題を修正しました。Docker Compose では `DIBAO_SQLITE_JOURNAL_MODE=DELETE` を既定にし、bind mount と SQLite WAL の多プロセス可視性リスクを避けます。
- worker にバックグラウンドジョブ用の heartbeat を追加しました。job runner は起動直後に due jobs を処理し、1 回の処理上限に達した場合は続けて次の drain を行います。
- HTTP プロセスから worker を起こす cross-process job wake signal を追加しました。
- 公式プラグインは一時的な hook/runtime エラーで自動 Disable されず、degraded 状態として表示されます。
- モバイルで記事詳細から未読リストへ戻るとき、`limit=1` の未読件数 probe を完全なリスト再取得として扱わないようにしました。
- 記事詳細の Feed 由来表示と操作ボタン、購読源管理の追加ボタン行の見た目を整えました。
- v0.1.3 メンテナンス修正を取り込みました。Gemini OpenAI-compatible provider の dimensions 指定、Ollama 長文コンテキスト処理、記事メタデータの年表示、ソースフィルター表示が含まれます。

### アップグレード影響

v0.2.0 から v0.2.1 への追加 core SQLite schema migration はありません。同じ `/data` volume を使い、image tag を差し替えてください。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。

独自の Compose ファイルを使っている場合は、次を追加してください。

```yaml
environment:
  DIBAO_SQLITE_JOURNAL_MODE: DELETE
```

リポジトリの `compose.yaml` には既に含まれています。アップグレード後、次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.2.1"` が含まれていれば基本確認は通っています。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.1
```

既定の Docker entrypoint は HTTP プロセスと独立 worker プロセスを起動します。worker を無効化する場合:

```yaml
environment:
  DIBAO_BACKGROUND_JOBS: "false"
```

ロールバックする場合は v0.2.1 コンテナを停止し、アップグレード前の SQLite データベースと `/data` volume バックアップを復元してから、前の image を起動してください。

### Migration List

v0.2.0 から v0.2.1: 新しい core SQLite migrations はありません。起動時には、既存 migrations が適用済みで checksum が変わっていないことを引き続き確認します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。
- v0.2.x の一部 Host API は Beta です。長期運用するプラグインでは Stable API を優先してください。

## v0.2.0

リリース日: 2026-06-19  
GitHub Release: [Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 ではプラグインシステムが利用できるようになりました。プラグインは、設定画面、ナビゲーション、バックグラウンドタスク、Hook、プラグイン専用データ、Secrets、外部配信を拡張できます。

### 主な変更

- manifest v1、インストール / 有効化 / 無効化 / アンインストール、署名パッケージ検証、trusted keys、プラグイン migration、tasks、hooks、設定、プライベートデータに対応しました。
- Web UI は sandboxed iframe 内で動作し、host bridge 経由で宿主機能にアクセスします。サーバープラグインは独立した Node host 子プロセスで実行されます。
- 公式 Daily Brief プラグインを同梱しました。過去 24 時間のパーソナライズ推薦から、興味トピックごとの日次ブリーフを生成します。
- 公式 Webhook プラグインを同梱しました。記事操作、フィード更新、ランキング完了、設定更新、プラグインタスク結果、Daily Brief 生成イベントを外部 HTTP サービスへ送信できます。
- `@dibao/plugin-sdk` と `@dibao/plugin-cli` により、プラグインの検証、パッケージ化、署名を行えます。

### アップグレード影響

v0.1.x から v0.2.0 へのアップグレードでは、プラグインシステムに必要なコアテーブルとインデックスを作成する blocking database migration が 1 回実行されます。初回起動時は core blocking migration gate が完了するまで通常のサービス提供を開始しません。データ量が多い場合やディスクが遅い場合は、少し時間がかかることがあります。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。バックアップ後、同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.2.0"` と `ok: true` が含まれていれば、基本的な確認は通っています。

## v0.1.3

リリース日: 2026-06-04  
GitHub Release: [Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

### 主な変更

- フィード管理画面の縦方向の余白を減らしました。フィード追加は行内のボタンからダイアログを開き、フィード健全性は一覧フィルターに統合しました。
- ソースフィルターが有効な場合、記事一覧のソースボタンに状態が表示されるようになり、意図せず絞り込んでいる状態に気づきやすくなりました。
- おすすめ、最新、あとで読むなどのページで、英語以外の UI では英語サブタイトルを復元しました。英語 UI では引き続きサブタイトルを表示しません。
- 記事一覧、検索結果、Reader のメタ情報に公開年を表示し、年をまたぐ記事でも元ページを開かずに年を確認できます。
- Ollama provider の既定切り出し長を 4000 文字に下げ、中国語長文 / bge-m3 向けの案内を追加しました。Ollama の文脈長エラーでは、より短い切り出しで 1 回だけ再試行します。
- Gemini embedding の次元数を明示的に要求します。Google AI Studio の OpenAI-compatible endpoint には `dimensions` を、native Gemini provider には `outputDimensionality` を送り、768 / 1536 / 3072 次元の設定を使えるようにしました。

### アップグレード影響

v0.1.2 から v0.1.3 へのアップグレードでは、新しい SQL migration はありません。recommendation derived-data upgrade も発生しません。同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.1.3"` と `ok: true` が含まれていれば、基本的な確認は通っています。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

ロールバックする場合は、v0.1.3 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- Ollama のモデルや文脈長設定によっては、切り出し長を手動でさらに下げる必要があります。bge-m3 で文脈長エラーが続く場合は 3000 文字を試してください。
- Gemini / OpenAI-compatible の次元数指定は上流 provider の対応に依存します。Dibao は Google Gemini の経路で次元数を送信し、返ってきたベクトル次元も引き続き検証します。

## v0.1.2

リリース日: 2026-06-01  
GitHub Release: [Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

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

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.1.2"` と `ok: true` が含まれていれば、基本的な確認は通っています。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

ロールバックする場合は、v0.1.2 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- Embedding provider の詳細は上流サービスのレスポンスに依存します。Dibao は可能な範囲で分類と機密情報の除去を行いますが、provider 自体の停止は修復できません。
- 記事本文内のリモート画像は、元サイト、ネットワーク、防 hotlinking 設定に依存します。本リリースは、失敗した画像が繰り返し再試行されることを防ぎます。

## v0.1.1

リリース日: 2026-05-30  
GitHub Release: [Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

### 主な変更

- 関係の薄い記事が 1 つの巨大な興味クラスタへ吸収される問題を修正しました。
- アップグレード後にほとんどのクラスタが 1 記事だけになる過度な断片化を修正しました。
- embedding index ごとの calibration を追加しました。Dibao は rebuild / upgrade 時に、現在の provider、model、dimension、ローカルのベクトル分布から閾値を推定し、その index 用に固定します。
- centroid 類似度、pairwise guard、タイトル/ソースの根拠、最大クラスタサイズ、吸収ステップ上限を使う制約付きマージを導入しました。
- 既存の興味クラスタ上限と同じ設定エリアに topic family 上限を追加しました。初期値は positive clusters 48、negative clusters 32、positive families 16、negative families 12 です。
- 推薦ランキングでの topic family の扱いを抑制しました。semantic match の主役は cluster のままで、family は主に説明と多様性に使われます。
- ブロッキング upgrade 画面に、この移行は derived recommendation data の再構築だけであり、embedding の再生成や API 費用は発生しないことを明記しました。
- labels / upgrade 画面は分割処理と yield を維持し、低消費電力 NAS で CPU が高くなっても進行中であることが見えるようにしました。
- 「さらに読み込む」を使った後も、追加された未読記事を開かずに通過した場合に無視済みへ自動反映されるよう修正しました。
- Docker publish workflow は private Sentry build config を必須にし、正式イメージに server/browser 両方の runtime Sentry 設定を含めます。

### アップグレード影響

v0.1.0 から v0.1.1 へアップグレードすると、新しい SQL migration `018_interest_cluster_calibrations.sql` が自動実行され、その後初回起動時に recommendation derived-data upgrade が 1 回ブロッキングで実行されます。この upgrade は clusters、families、labels、ranking rows を再構築しますが、embedding provider は呼び出さず、embedding の再生成も行いません。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。初回起動時は進捗画面が通常の reader UI を一時的にブロックし、完了後に自動復帰します。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.1
```

同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。ヘルスチェック:

```text
GET /api/system/health
```

ロールバックする場合は、v0.1.1 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- サンプルが少ないライブラリでは保守的な fallback calibration を使います。推薦品質は行動履歴と embedding coverage に応じて改善します。
- 低消費電力 NAS では初回 derived-data upgrade に時間がかかる場合がありますが、進捗は画面に表示されます。
- embedding model や dimension を変更した場合、古い embedding は新しい index に混在できません。新しい index 用の embedding が必要です。

## v0.1.0

リリース日: 2026-05-28  
GitHub Release: [Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

Dibao v0.1.0 は最初の公開 MVP リリースです。Docker でセルフホストできる単一ユーザー向け RSS リーダーとして、OPML のインポート、フィードとフォルダー管理、最新記事の閲覧、保存・あとで読む・既読・興味なしなどの操作、自分の RSS 購読内だけで動く説明可能なパーソナル推薦を提供します。

このリリースには、基本ランキング、OpenAI-compatible / Ollama embedding provider、sqlite-vec ベクターインデックス、推薦状態の診断、バックグラウンド更新、検索、PWA アプリシェル、ヘルスチェック、バックアップとアップグレード手順が含まれます。初回リリースのため、以前の公開版からの移行はありません。インストールには `ghcr.io/pls-1q43/dibao:v0.1.0` を使い、`/data` を永続ディレクトリにマウントしてください。アップグレード前には SQLite データベースまたは Docker volume をバックアップしてください。

既知の制限: 現在は単一ユーザーのセルフホストのみで、公式ホスティング、複数ユーザー、クラウド同期、OAuth / パスワード復旧、完全なオフライン記事保存、ネイティブアプリはありません。推薦品質は MVP 段階で、読書フィードバックと embedding カバレッジに依存します。
