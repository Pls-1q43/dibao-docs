---
title: 备份与升级
description: 备份 Dibao 数据目录并升级到 v0.3.1。
---

默认 Compose 配置把容器 `/data` 映射到当前目录的 `./data`：

```text
./data:/data
./data/dibao.sqlite
```

升级、迁移或尝试新插件前，建议备份整个 `./data` 目录，而不是只复制 SQLite 文件，因为插件包、插件数据和后续文件型状态也会放在该目录下。

## 备份

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

## 升级到 v0.3.1

把 `compose.yaml` 中的镜像改为：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

然后运行：

```bash
docker compose pull
docker compose up -d
docker compose ps
```

升级后打开：

```text
http://localhost:8080/api/system/health
```

返回 `ok: true` 和 `version: "0.3.1"` 表示基础健康检查通过。进入推荐页后，如果推荐库存状态提示显示正在排序，可以等待后台任务补充排序库存。

## 版本迁移影响

- 从 `v0.3.0` 到 `v0.3.1`：没有新增 core SQLite migration，不需要重新计算 embeddings；官方 Daily Brief、Webhook、Full Content Selectors 插件会随镜像更新到 `0.1.1`。
- 从 `v0.2.1` 直接到 `v0.3.1`：会新增 `026_recommendation_v3_memory.sql`，创建 `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`，并给 `article_rank_scores` 增加探索相关字段。
- 本次 0.3 升级不会要求重新计算 embeddings；新的推荐记忆和曝光数据会在升级后随使用逐步积累。

## 回滚

如果需要回滚到备份：

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

不要直接用已迁移到 0.3.x 的数据库启动更旧版本。回滚时应先恢复升级前备份，再启动上一版镜像。
