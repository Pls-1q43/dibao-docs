---
title: Quick Install
description: Choose Desktop or Docker Compose to install Dibao v0.4.1.
---

## Desktop Or Docker

For personal Windows or Mac use, see [Desktop Installation](/en/desktop-install/) without deploying a server. For a NAS, home server, or VPS, use Docker Compose below.

## Docker Compose

Use Docker Compose with the stable `latest` image. Installation examples always use this tag, so upgrades do not require changing a version number. Save this as `compose.yaml`:

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

Start Dibao:

```bash
docker compose pull
docker compose up -d
```

Open `http://localhost:8080`, create the owner login, then import OPML or add your first RSS / Atom feed.

`latest` does not automatically update running containers. For later upgrades, preserve your data following [Backup And Upgrades](/en/backup-upgrade/), then run `docker compose pull` and `docker compose up -d` to fetch the latest image and recreate the container.

## First Launch

1. Create the single owner account.
2. Import OPML or add RSS / Atom feeds, or choose Add later.
3. Skip provider setup or configure embeddings with [Recommended Providers](../providers/).
4. Start reading in Recommended and Latest.
5. Enable bundled official plugins such as Daily Brief or Webhook from setup or Settings.

Choose the language on the welcome screen; feeds and AI can be configured later. See [Offline Reading](/en/offline-reading/) for Web caches and [Backup And Upgrades](/en/backup-upgrade/) for existing installations.

## Build From Source

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

The repository `compose.yaml` builds a local image and is intended for development or branch validation. For ordinary deployments, prefer the GHCR image tagged `latest` above.

## HTTPS And Cookies

For local `localhost` or `127.0.0.1` installs, keep `DIBAO_COOKIE_SECURE=false`. Behind an HTTPS reverse proxy, set:

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## Background Worker

The v0.4.1 default entrypoint starts both an HTTP process and a separate worker process. The worker handles feed refresh, embeddings, ranking, plugin tasks, and full-content background work. Custom Compose files should keep `DIBAO_SQLITE_JOURNAL_MODE: DELETE` to avoid bind-mount SQLite WAL visibility issues across Docker processes.
