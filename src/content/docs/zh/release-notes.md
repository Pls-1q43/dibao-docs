---
title: 发布说明
description: Dibao v0.1.1 与 v0.1.0 发布说明摘要。
---

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
