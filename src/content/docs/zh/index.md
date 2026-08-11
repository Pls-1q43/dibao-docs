---
title: 邸报文档
description: Dibao v0.3.1 的安装、配置、插件、备份升级与开发者参考文档。
---

邸报 Dibao 是一个自托管、fair-code、个人可控的 RSS 推荐阅读器。你管理 RSS / Atom 信源，邸报只在这些信源内部帮你排序、搜索、解释推荐原因，并把阅读数据留在你的自托管实例里。

当前推荐版本是 `v0.3.1`。这一版围绕推荐算法与机制大更新，加入推荐 v3 memory 基础、推荐库存状态、受控 fallback、可选无限加载、官方全文选择器插件，以及更稳的 Docker worker 和受控 fetch 安全边界。

## 快速入口

- [快速安装](quick-install/)：用 Docker Compose 启动 `v0.3.1`，创建所有者账号，导入 OPML 或添加第一个 RSS / Atom。
- [推荐 Provider](providers/)：选择 Ollama、SiliconFlow、Gemini 或其他 OpenAI-compatible embedding provider。
- [备份与升级](backup-upgrade/)：备份 `./data`，升级 Docker 镜像，检查健康状态与推荐库存。
- [插件安装](plugins/installation/)：安装第三方 `.dibao-plugin`，并在启用前检查来源、签名和 capabilities。
- [Webhook 官方插件](plugins/webhook/)：把文章、刷新、推荐和 Daily Brief 事件投递到外部 HTTP endpoint。
- [全文选择器官方插件](plugins/full-content/)：启用 0.3 的全文抓取与 selector-based extractor。
- [许可证 FAQ](license/)：了解 BUSL-1.1、fair-code、Change Date 和商业授权边界。

## 运行边界

Dibao 适合 Mac mini、NAS、家用服务器、VPS 或任何可以长期运行 Docker 的主机。它可以只在局域网或私有 VPN 内使用，不需要暴露到公网。

当前不做多用户团队协作、官方托管、社交关注、评论转发、平台外内容推荐、云同步或离线全文文章库。全文抓取是按 Feed 显式启用的网页正文补全能力，不是离线全文归档系统。

## 数据属于你

订阅源、文章、阅读状态、行为事件、推荐画像、embedding provider 配置、推荐 v3 memory、插件包和索引状态保存在 SQLite 与持久化目录中。默认 Compose 配置把 `/data` 映射到本地 `./data` 文件夹，便于备份、迁移和审计。
