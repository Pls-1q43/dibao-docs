---
title: 开发者文档
description: Dibao 开发者入口、仓库结构与公开合约。
---

开发者文档从 `0.2.0` 开始作为公开参考维护。它覆盖仓库结构、API、数据库 schema、推荐算法、插件系统和发布流程。

## 仓库结构

- `apps/web`：前端 Web App。
- `apps/server`：API、RSS 抓取、后台任务和推荐维护。
- `packages/db`：数据库类型、迁移和 shared data contracts。
- `docs`：公开产品、工程和开发者参考文档。

本地计划、执行记录、临时验证证据和机器特定说明不属于公开 docs，应保留在仓库外或被忽略的本地目录。

## 公开合约

- API 路由与请求/响应结构按 API contract 演进。
- 数据库结构按 schema migration 和 database schema 文档演进。
- 插件 manifest、capability、Hook 和 UI slot 需要保持文档化。
- 推荐算法文档用于解释产品行为，不应被 UI 文案夸大为未实现的能力。

## 兼容性

正式 release 和 hotfix 镜像必须使用明确版本号发布；用户安装文档可以使用 `latest` 作为快速安装入口。跨版本升级需要保护 SQLite 迁移、持久化目录和插件数据。
