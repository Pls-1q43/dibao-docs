---
title: クイックインストール
description: Docker Compose で Dibao をインストールする。
---

一番簡単なセルフホスト構成は Docker Compose です。次の内容を `compose.yaml` として保存します。

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
    volumes:
      - ./data:/data
```

起動します。

```bash
docker compose up -d
```

`http://localhost:8080` を開き、所有者アカウントを作成します。その後、OPML をインポートするか、最初の RSS / Atom フィードを追加します。

## ソースからビルドする

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

## HTTPS と Cookie

ローカルの `localhost` または `127.0.0.1` では `DIBAO_COOKIE_SECURE=false` のままで構いません。HTTPS リバースプロキシの後ろで動かす場合は、次のように設定します。

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## 初回起動後

1. 唯一の所有者アカウントを作成します。
2. OPML をインポートするか、最初の RSS / Atom URL を追加します。
3. Provider をスキップするか、[推奨 Provider](../providers/) に沿って embedding を設定します。
4. Recommended と Latest で読み始めます。
