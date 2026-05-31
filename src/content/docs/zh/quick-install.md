---
title: 快速安装
description: 使用 Docker Compose 安装邸报 Dibao。
---

推荐用 Docker Compose 运行。把下面内容保存为 `compose.yaml`：

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

启动：

```bash
docker compose up -d
```

打开 `http://localhost:8080`，创建用户名和密码，然后导入 OPML 或添加第一个 RSS / Atom 地址。

## 从源码构建

如果你要从源码构建当前仓库：

```bash
git clone https://github.com/Pls-1q43/Dibao.git
cd Dibao
docker compose up --build -d
```

## HTTPS 与 Cookie

本地 `localhost` 或 `127.0.0.1` 开发可以保持 `DIBAO_COOKIE_SECURE=false`。如果放在 HTTPS 反向代理后面，建议改为：

```yaml
environment:
  DIBAO_COOKIE_SECURE: "true"
```

## 首次启动后

1. 创建唯一所有者账号。
2. 导入 OPML，或添加第一个 RSS / Atom 地址。
3. 选择跳过 Provider，或按 [推荐 Provider](../providers/) 配置 embedding。
4. 在 `推荐` 与 `最新` 视图中开始阅读。
