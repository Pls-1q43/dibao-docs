---
title: Quick Install
description: Install Dibao with Docker Compose.
---

Use Docker Compose for the simplest self-hosted setup. Save this as `compose.yaml`:

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

Start Dibao:

```bash
docker compose up -d
```

Open `http://localhost:8080`, create the owner login, then import OPML or add your first RSS / Atom feed.

## Build From Source

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

## HTTPS And Cookies

For local `localhost` or `127.0.0.1` installs, keep `DIBAO_COOKIE_SECURE=false`. Behind an HTTPS reverse proxy, set:

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## First Launch

1. Create the single owner account.
2. Import OPML or add your first RSS / Atom URL.
3. Skip provider setup or configure embeddings with [Recommended Providers](../providers/).
4. Start reading in Recommended and Latest.
