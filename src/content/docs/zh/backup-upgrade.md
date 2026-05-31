---
title: 备份与升级
description: 备份 Dibao 数据目录并升级 Docker 镜像。
---

默认 Compose 配置把容器 `/data` 映射到当前目录的 `./data`：

```text
./data:/data
./data/dibao.sqlite
```

## 备份

升级或迁移前先停止容器并打包数据目录：

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

建议定期备份整个 `./data` 目录，而不是只复制 SQLite 文件，因为插件包、插件数据和后续文件型状态也会放在该目录下。

## 升级

```bash
docker compose pull
docker compose up -d
docker compose ps
```

升级后打开设置页检查版本、订阅源刷新状态、推荐维护状态和插件兼容状态。

## 恢复

如果需要回滚到备份：

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

恢复后先打开健康检查或 Web 页面确认实例可用，再删除旧目录。
