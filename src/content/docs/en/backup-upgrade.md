---
title: Backup And Upgrade
description: Back up the Dibao data directory and upgrade the Docker image.
---

The default Compose file maps container `/data` to local `./data`:

```text
./data:/data
./data/dibao.sqlite
```

## Backup

Before upgrading or moving the instance, stop the container and archive the data directory:

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

Back up the whole `./data` directory, not just the SQLite file. Plugin packages, plugin data, and future file-based state also live there.

## Upgrade

```bash
docker compose pull
docker compose up -d
docker compose ps
```

After upgrading, check the Settings page for version, feed refresh state, recommendation maintenance state, and plugin compatibility.

## Restore

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

Confirm the instance is healthy before deleting the old directory.
