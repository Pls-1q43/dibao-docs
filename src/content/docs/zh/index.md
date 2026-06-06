---
title: 邸报文档
description: 邸报 Dibao 的安装、配置、插件、备份升级与开发者参考文档。
---

邸报 Dibao 是一个自托管、fair-code、个人可控的 RSS 推荐阅读器。你管理 RSS / Atom 信源，邸报只在这些信源内部帮你排序、搜索、解释推荐原因，并把阅读数据留在你的自托管实例里。

## 快速入口

- [快速安装](quick-install/)：用 Docker Compose 启动，创建所有者账号，导入 OPML 或添加第一个 RSS / Atom。
- [推荐 Provider](providers/)：选择 Ollama、SiliconFlow、Gemini 或其他 OpenAI-compatible embedding provider。
- [备份与升级](backup-upgrade/)：备份 `./data`，升级 Docker 镜像，检查健康状态。
- [插件安装](plugins/installation/)：上传第三方 `.dibao-plugin` 文件，并在启用前检查权限。
- [Webhook 官方插件](plugins/webhook/)：在 Dibao `0.2.x` 中把文章、刷新、推荐和 Daily Brief 事件投递到外部 HTTP endpoint。
- [许可证 FAQ](license/)：了解 BUSL-1.1、fair-code、Change Date 和商业授权边界。

## 运行边界

Dibao 适合 Mac mini、NAS、家用服务器、VPS 或任何可以长期运行 Docker 的主机。它可以只在局域网或私有 VPN 内使用，不需要暴露到公网。

当前不做多用户团队协作、官方托管、社交关注、评论转发、平台外内容推荐、云同步或离线全文文章库。

## 数据属于你

订阅源、文章、阅读状态、行为事件、推荐画像、embedding provider 配置和索引状态保存在 SQLite 与持久化目录中。默认 Compose 配置把 `/data` 映射到本地 `./data` 文件夹，便于备份、迁移和审计。
