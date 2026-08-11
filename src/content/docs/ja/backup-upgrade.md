---
title: バックアップとアップグレード
description: Dibao data をバックアップし、v0.3.1 へアップグレードする。
---

既定の Compose は container `/data` を local `./data` に map します。

```text
./data:/data
./data/dibao.sqlite
```

upgrade、migration、新しい plugin の試用前には、SQLite file だけでなく `./data` directory 全体を backup してください。plugin package、plugin data、将来の file-backed state もここに保存されます。

## Backup

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

## v0.3.1 へアップグレード

`compose.yaml` の image を次に変更します。

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

そして実行します。

```bash
docker compose pull
docker compose up -d
docker compose ps
```

upgrade 後、次を開きます。

```text
http://localhost:8080/api/system/health
```

response に `ok: true` と `version: "0.3.1"` が含まれていれば基本確認は通っています。推薦在庫ステータスが sorting in progress を示す場合は、background job が排序済み在庫を補充するまで待ってください。

## Migration 影響

- `v0.3.0` から `v0.3.1`: 新しい core SQLite migration はなく、embedding recomputation も不要です。内蔵 Daily Brief、Webhook、Full Content Selectors plugin は `0.1.1` に更新されます。
- `v0.2.1` から `v0.3.1` へ直接 upgrade: `026_recommendation_v3_memory.sql` が追加され、`user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` と `article_rank_scores` の探索関連 fields が作られます。
- 0.3 upgrade では embedding recomputation は不要です。新しい recommendation memory と exposure data は upgrade 後に蓄積されます。

## Restore

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

0.3.x に migration 済みの database を旧 version で直接起動しないでください。まず upgrade 前 backup を restore し、その後に前 version の image を起動してください。
