---
title: Backup And Upgrade
description: Back up Dibao data and upgrade to v0.3.1.
---

The default Compose setup maps container `/data` to local `./data`:

```text
./data:/data
./data/dibao.sqlite
```

Before upgrading, migrating, or trying new plugins, back up the whole `./data` directory rather than only the SQLite file. Plugin packages, plugin data, and future file-backed state also live there.

## Backup

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

## Upgrade To v0.3.1

Set the image in `compose.yaml`:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

Then run:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

After upgrading, open:

```text
http://localhost:8080/api/system/health
```

The response should include `ok: true` and `version: "0.3.1"`. If the recommendation inventory indicator says sorting is in progress, wait for background jobs to replenish sorted inventory.

## Migration Impact

- From `v0.3.0` to `v0.3.1`: no new core SQLite migrations and no embedding recomputation. Bundled Daily Brief, Webhook, and Full Content Selectors plugins update to `0.1.1`.
- Directly from `v0.2.1` to `v0.3.1`: adds `026_recommendation_v3_memory.sql`, creating `user_representation_snapshots`, `recommendation_exposures`, `exploration_attempts`, and exploration fields on `article_rank_scores`.
- The 0.3 upgrade does not require embedding recomputation. New recommendation memory and exposure data accumulate after upgrade.

## Restore

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

Do not start an older version against a database already migrated to 0.3.x. Restore the pre-upgrade backup first, then start the previous image.
