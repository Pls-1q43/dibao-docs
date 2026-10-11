---
title: 备份与升级
description: 备份 Dibao v0.4.1 桌面或 Docker 数据，完成升级、验证迁移并安全恢复。
---

当前推荐版本为 `v0.4.1`。升级前先同步每个网页 / PWA 客户端的离线操作；服务器备份不包含尚未同步到服务器的操作。

## 桌面版

通过“设置 → 关于 → 数据备份与恢复”创建完整备份或选择恢复点，确认后重启执行。恢复前会另存当前数据，但恢复点之后的更改会回退。

Windows 在确认下载后选择“重启并更新”；macOS 完全退出后用新 DMG 覆盖应用。新版本会在迁移前备份，失败时停止。自动升级备份保留最近三份成功记录，手动备份和恢复前快照不自动删除。

外部备份请在完全退出后复制整个数据根目录，包含 `data`、`profile`、`backups` 和插件密钥。路径与详细操作见 [桌面版](/zh/desktop-install/)。

## Docker 完整备份

默认挂载为 `./data:/data`，数据库为 `/data/dibao.sqlite`。备份整个数据目录，而不是只复制主 SQLite 文件。命名 volume 或其他挂载路径请按实际配置备份。

```bash
docker compose stop
tar czf "dibao-data-before-v0.4.1-$(date +%Y%m%d-%H%M%S).tgz" -C data .
```

保存备份后，确认 `compose.yaml` 使用以下镜像；已经使用 `latest` 时无需修改配置：

```yaml
image: ghcr.io/pls-1q43/dibao:latest
```

保留数据卷和环境变量，然后执行以下命令。`latest` 不会自动更新运行中的容器，需要重新拉取镜像并重建容器：

```bash
docker compose pull
docker compose up -d
docker compose ps
```

## 验证升级完成

1. 打开 `http://localhost:8080/api/system/health`，确认响应里的 `data.ok: true`，并确认 `data.version` 与本次拉取的稳定版一致（当前为 `"0.4.1"`）。
2. 登录后访问 `/api/system/upgrade/status`，确认最终为 `completed` 或 `not_required`，且 `data.blocking: false`。
3. 确认升级页面退出，可以正常阅读并执行操作。

健康接口成功只表示基础服务正常，不证明数据升级已完成。

## 版本迁移影响

| 升级路径 | 影响 |
| --- | --- |
| v0.4.0 → v0.4.1 | 没有新增 core SQL migration 或强制派生重建，不重算 embeddings。 |
| v0.3.1 → v0.4.1 | 自动补齐 `027_recommendation_sessions.sql`，建立稳定推荐会话表，并按需要执行推荐数据升级。 |
| 更早版本 → v0.4.1 | 先应用此前所有未执行的历史迁移，再执行需要的数据升级。 |

需要升级推荐数据的现有库会自动进入阻塞式升级页，重放行为、重建画像和派生数据、重算符合条件的推荐，成功后清理旧上下文并恢复普通功能。耗时取决于数据和设备；失败可以在页面重试，不要删除升级标记绕过。

v0.4 数据升级复用已有向量，不为历史文章重新调用 embedding 服务。新增文章仍按当前 Provider 设置生成向量。

## 回滚

先停止新版本，保留失败现场，然后在干净目录或新 volume 恢复升级前完整备份，再使用对应旧镜像和原挂载启动。不要让旧版直接读取新版数据库，也不要把备份覆盖到仍有新 WAL 文件的目录。

桌面版同样需先恢复对应旧数据，不能只换旧应用。恢复会失去备份之后的更改；插件包、数据和密钥应一起恢复。
