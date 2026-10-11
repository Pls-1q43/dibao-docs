---
title: Backup And Upgrades
description: Back up Dibao v0.4.1 Desktop or Docker data, verify migrations, and recover safely.
---

Use `v0.4.1` for current installations. Before upgrading, sync offline actions on every Web / PWA client; server backups do not contain actions that have not reached the server.

## Desktop

Settings → About → Backup and recovery creates full backups or restores a dated point after confirmation and restart. Restore saves current data separately first, but changes after the restore point are rolled back.

Windows uses Restart and update after a confirmed download. On macOS, quit fully and replace the app with the new DMG. New versions back up before migration and stop if backup fails. The three most recent successful upgrade backups are retained; manual backups and pre-restore snapshots are not automatically deleted.

For an external backup, quit fully and copy the complete data root, including `data`, `profile`, `backups`, and plugin keys. See [Desktop](/en/desktop-install/) for paths and steps.

## Full Docker Backup

The default mount is `./data:/data`, with the database at `/data/dibao.sqlite`. Back up the entire data directory, not only SQLite's main file. Adapt the procedure for named volumes or different paths.

```bash
docker compose stop
tar czf "dibao-data-before-v0.4.1-$(date +%Y%m%d-%H%M%S).tgz" -C data .
```

After preserving the backup, confirm that `compose.yaml` uses this image. No configuration change is needed if it already uses `latest`:

```yaml
image: ghcr.io/pls-1q43/dibao:latest
```

Keep volumes and environment settings, then run the commands below. `latest` does not automatically update running containers; pull the new image and recreate the container:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

## Verify Completion

1. Open `http://localhost:8080/api/system/health`, confirm `data.ok: true`, and verify that `data.version` matches the stable release you pulled (currently `"0.4.1"`).
2. While signed in, check `/api/system/upgrade/status` until the final state is `completed` or `not_required` with `data.blocking: false`.
3. Confirm the upgrade screen closes and normal reading and actions work.

A successful health response proves basic service health, not completion of the data upgrade.

## Migration Impact

| Upgrade | Impact |
| --- | --- |
| v0.4.0 → v0.4.1 | No new core SQL migration or mandatory derived-data rebuild; no embedding recomputation. |
| v0.3.1 → v0.4.1 | Applies `027_recommendation_sessions.sql` for stable recommendation sessions and required recommendation-data upgrades. |
| Earlier releases → v0.4.1 | Applies all pending historical migrations before required data upgrades. |

Existing databases needing new recommendation data enter an automatic blocking upgrade screen. Dibao replays behavior, rebuilds profiles and derived data, reranks eligible articles, and removes obsolete contexts after success. Duration depends on data and hardware. Retry failures from the screen; do not delete upgrade markers to bypass it.

The v0.4 data upgrade reuses stored vectors without calling embedding services for historical articles. New articles still follow current Provider settings.

## Rollback

Stop the newer version, preserve the failed installation, and restore the complete pre-upgrade backup into a clean directory or new volume. Then start its matching older image with the original mount. Do not run an older version against newer data or overlay backups onto newer WAL files.

Desktop likewise requires restoring matching old data, not merely replacing the app. Restore loses later changes; restore plugin packages, data, and keys together.
