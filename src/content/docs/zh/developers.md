---
title: 开发者文档
description: Dibao 0.3 开发者入口、仓库结构与公开合约。
---

开发者文档从 `0.2.0` 开始作为公开参考维护。当前主线是 `0.3.x`，覆盖仓库结构、API、数据库 schema、推荐算法、插件系统、全文抓取、运行时性能和发布流程。

## 仓库结构

- `apps/web`：前端 Web App、PWA、设置页、Feed 管理、全文预览和插件 iframe 宿主。
- `apps/server`：API、RSS 抓取、全文抓取、后台任务、推荐维护、插件宿主和认证。
- `packages/db`：数据库类型、迁移和 shared data contracts。
- `packages/plugin-sdk`：插件 manifest、能力、事件、签名和 package 校验工具。
- `packages/plugin-cli`：第三方插件模板、校验、打包和签名命令。
- `plugins/official`：随镜像分发的官方插件：Daily Brief、Webhook、Full Content Selectors。
- `docs`：公开产品、工程和开发者参考文档。

本地计划、执行记录、临时验证证据和机器特定说明不属于公开 docs，应保留在仓库外或被忽略的本地目录。

## 当前 0.3 重点

- 推荐 v3 memory：`user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`。
- 推荐列表更严格使用 active rank context，并限制 fallback 批次，减少未排序内容突然涌入。
- 前台交互路径避免同步重排序、重型诊断和大范围写入，后台 worker 分块处理排序、embedding、feed refresh 和插件任务。
- Feed 支持 `feed_only` / `fetch_full_content` 模式，全文抓取只在显式启用时请求文章网页。
- 插件 manifest 支持本地化字符串，iframe/bridge 可感知当前 locale，插件系统新增 Beta 的 full-content extractor 扩展点。

## 公开合约

- API 路由与请求/响应结构按 API contract 演进。
- 数据库结构按 schema migration 和 database schema 文档演进。
- 插件 manifest、capability、Hook、UI slot、full-content extractor 和 iframe bridge 需要保持文档化。
- 插件 Stable/Beta API、签名 trusted key、持久化路径和官方插件清单需要随 `0.3` 实现同步。
- 推荐算法文档用于解释产品行为，不应被 UI 文案夸大为未实现的能力。

## 兼容性

正式 release 和 hotfix 镜像必须使用明确版本号发布；用户安装文档也应使用当前推荐版本号。跨版本升级需要保护 SQLite 迁移、持久化目录、插件数据和 embedding 成本边界。0.3 升级不会隐式要求重新计算 embeddings。
