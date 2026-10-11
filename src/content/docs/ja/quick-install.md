---
title: クイックインストール
description: Desktop または Docker Compose で Dibao v0.4.1 を導入する。
---

## Desktop と Docker

Windows／Mac の個人利用は、サーバー不要の [デスクトップ版](/ja/desktop-install/) を参照してください。NAS、自宅サーバー、VPS は下の Docker Compose を使います。

## Docker Compose

Docker Compose では安定版の `latest` イメージを推奨します。導入例は常にこのタグを使うため、更新時にバージョン番号を書き換える必要はありません。次の内容で `compose.yaml` を作成します。

```yaml
name: dibao

services:
  dibao:
    image: ghcr.io/pls-1q43/dibao:latest
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      DIBAO_HOST: 0.0.0.0
      DIBAO_PORT: "8080"
      DIBAO_DATABASE_PATH: /data/dibao.sqlite
      DIBAO_COOKIE_SECURE: "false"
      DIBAO_SQLITE_JOURNAL_MODE: DELETE
    volumes:
      - ./data:/data
```

起動します。

```bash
docker compose pull
docker compose up -d
```

`http://localhost:8080` を開き、所有者アカウントのユーザー名とパスワードを作成します。その後、OPML をインポートするか、最初の RSS / Atom フィードを追加します。

`latest` を指定しても実行中のコンテナーは自動更新されません。次回の更新前に [バックアップと更新](/ja/backup-upgrade/) に従ってデータを保存し、`docker compose pull` と `docker compose up -d` で最新イメージを取得してコンテナーを再作成します。

## 初回起動後

1. 所有者アカウントを作成します。
2. OPML または RSS / Atom を追加します。「あとで追加」でスキップもできます。
3. Provider 設定をスキップするか、[推奨 Provider](../providers/) を参考に embedding を設定します。
4. Recommended と Latest で読み始めます。
5. Daily Brief や Webhook などの公式 plugin は setup または Settings から有効化できます。

歓迎画面で言語を選べます。フィードと AI は後で設定できます。Web の保存は [オフライン読書](/ja/offline-reading/)、既存環境の更新は [バックアップと更新](/ja/backup-upgrade/) を参照してください。

## ソースからビルド

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

repository の `compose.yaml` は local image を build するため、開発や branch 検証向けです。通常の deployment では上の `latest` タグの GHCR image を推奨します。

## HTTPS と Cookie

local `localhost` または `127.0.0.1` では `DIBAO_COOKIE_SECURE=false` のままで構いません。HTTPS reverse proxy の後ろで動かす場合は次を設定します。

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## Background worker

v0.4.1 の既定 entrypoint は HTTP process と独立 worker process を起動します。worker は feed refresh、embedding、ranking、plugin task、full-content background work を処理します。独自 Compose では `DIBAO_SQLITE_JOURNAL_MODE: DELETE` を維持し、Docker process 間の bind mount + SQLite WAL visibility 問題を避けてください。
