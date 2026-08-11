---
title: クイックインストール
description: Docker Compose で Dibao v0.3.1 をインストールする。
---

現在の安定版 `v0.3.1` は Docker Compose での実行を推奨します。次の内容で `compose.yaml` を作成します。

```yaml
name: dibao

services:
  dibao:
    image: ghcr.io/pls-1q43/dibao:v0.3.1
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
docker compose up -d
```

`http://localhost:8080` を開き、所有者アカウントのユーザー名とパスワードを作成します。その後、OPML をインポートするか、最初の RSS / Atom フィードを追加します。

## 初回起動後

1. 所有者アカウントを作成します。
2. OPML をインポートするか、最初の RSS / Atom URL を追加します。
3. Provider 設定をスキップするか、[推奨 Provider](../providers/) を参考に embedding を設定します。
4. Recommended と Latest で読み始めます。
5. Daily Brief や Webhook などの公式 plugin は setup または Settings から有効化できます。

## ソースからビルド

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

repository の `compose.yaml` は local image を build するため、開発や branch 検証向けです。通常の deployment では上の明示的な GHCR version を推奨します。

## HTTPS と Cookie

local `localhost` または `127.0.0.1` では `DIBAO_COOKIE_SECURE=false` のままで構いません。HTTPS reverse proxy の後ろで動かす場合は次を設定します。

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## Background worker

v0.3.1 の既定 entrypoint は HTTP process と独立 worker process を起動します。worker は feed refresh、embedding、ranking、plugin task、full-content background work を処理します。独自 Compose では `DIBAO_SQLITE_JOURNAL_MODE: DELETE` を維持し、Docker process 間の bind mount + SQLite WAL visibility 問題を避けてください。
