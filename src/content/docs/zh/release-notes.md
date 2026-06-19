---
title: 发布说明
description: Dibao v0.2.x、v0.1.1 与 v0.1.0 发布说明摘要。
---

## v0.2.x 当前开发线

`0.2` 是插件平台和下一版本功能开发线。当前分支重点包括：

- 插件平台加固：服务端插件运行在独立 Node host 子进程中，通过 JSON-RPC Host API 调用核心能力。
- 插件 UI 加固：插件页面运行在 sandboxed iframe 中，通过 `postMessage` bridge 访问宿主，不直接 `fetch` Dibao API。
- 第三方插件安装策略：用户安装默认关闭，需要显式启用；第三方包安装要求 Ed25519 签名和 trusted key。
- 插件能力扩展：`secrets`、`deliveries`、manifest migrations、Stable/Beta API 分层和插件健康信息。
- 官方插件：Daily Brief 和 Webhook 随镜像分发，可在插件页启用。
- 性能与安全：后台任务、插件 Hook、诊断接口和 SQLite 维护路径增加运行时保护。

## v0.1.1

v0.1.1 修正了推荐画像校准与升级体验，在 RSS/Atom、OPML、Feed 管理、搜索、文章动作、推荐解释、Provider 设置、后台任务和 PWA 基础上，让首次安装与持续升级更稳定。

重点：

- 快速安装默认使用 `ghcr.io/pls-1q43/dibao:latest`。
- Compose 默认把 `/data` 挂载到本地 `./data` 文件夹。
- Provider 不可用时，阅读功能继续可用并退回基础排序。
- 推荐、索引、后台任务和插件状态在设置页中可见。

## v0.1.0

v0.1.0 是首个公开版本，包含基础排序、OpenAI-compatible 与 Ollama embedding providers、sqlite-vec 向量索引、推荐诊断、后台刷新、搜索、PWA app shell、健康检查和备份/升级文档。

因为它是首个公开版本，没有从更早公开版本升级的迁移路径。后续升级前请先备份 `./data`。
