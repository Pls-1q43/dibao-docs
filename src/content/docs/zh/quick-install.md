---
title: 快速安装
description: 使用 Docker Compose 安装 Dibao v0.3.1。
---

推荐用 Docker Compose 运行当前稳定版 `v0.3.1`。把下面内容保存为 `compose.yaml`：

```yaml
name: dibao

services:
  dibao:
    image: ghcr.io/pls-1q43/dibao:v0.3.1
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

启动：

```bash
docker compose up -d
```

打开 `http://localhost:8080`，创建所有者用户名和密码，然后导入 OPML 或添加第一个 RSS / Atom 地址。

## 首次启动后

1. 创建唯一所有者账号。
2. 导入 OPML，或添加第一个 RSS / Atom 地址。
3. 选择跳过 Provider，或按 [推荐 Provider](../providers/) 配置 embedding。
4. 在 `推荐` 与 `最新` 视图中开始阅读。
5. 可在首次设置或设置页启用 Daily Brief、Webhook 等官方插件。

## 从源码构建

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

源码仓库里的 `compose.yaml` 会构建本地镜像，适合开发或验证当前分支；普通部署建议使用上方明确版本号的 GHCR 镜像。

## HTTPS 与 Cookie

本地 `localhost` 或 `127.0.0.1` 可以保持 `DIBAO_COOKIE_SECURE=false`。如果放在 HTTPS 反向代理后面，建议改为：

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## 后台 Worker

v0.3.1 默认入口会启动 HTTP 进程和独立 worker 进程。worker 负责 feed refresh、embedding、推荐排序、插件任务和全文抓取相关后台工作。自定义 Compose 文件应保留 `DIBAO_SQLITE_JOURNAL_MODE: DELETE`，以避免 bind mount + SQLite WAL 在多进程 Docker 场景下的可见性问题。
