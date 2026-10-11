---
title: 开发者文档
description: Dibao v0.4.1 核心、桌面、离线阅读、API、数据迁移与插件开发入口。
---

当前公开版本是 `v0.4.1`，对应主项目 `main` 的完整发布状态。开发时根据仓库实时版本线和发布规则选择分支；旧指南中的 0.2 / 0.3 分支说明不能当作当前发布状态。

## 仓库结构

- `apps/desktop`：Electron 主进程与 preload、本地运行时、更新、备份和恢复。
- `apps/web`：React 阅读器、设置、PWA、离线缓存和插件 iframe 宿主。
- `apps/server`：Fastify API、认证、抓取、独立 worker、推荐和插件运行时。
- `packages/db`：SQLite repository、迁移和向量存储。
- `packages/ranking`：兴趣画像和推荐排序。
- `packages/plugin-sdk` / `packages/plugin-cli`：manifest、能力、校验、打包和签名。
- `plugins/official`：Daily Brief、Webhook、Full Content Selectors。

## 本地开发与验证

```bash
npm ci
npm run typecheck
npm test
npm run build
git diff --check
```

开发服务用 `npm run dev:server` 和 `npm run dev:web`。桌面构建用 `npm run build:desktop`，打包用 `npm run desktop:package`，运行时 smoke 用 `npm run desktop:smoke`。本地打包成功不代替各系统实际安装与升级验收。

## v0.4 核心合约

- 推荐会话固定当前分页序列；`027_recommendation_sessions.sql` 保存会话、位置和分数快照。
- 相关文章和点赞后的个性化发现是已有向量的读取路径，不得在打开阅读器时触发向量生成或全库重排。
- Web / PWA 缓存按来源与用户隔离；离线动作使用 `clientActionId` 幂等处理，先同步动作再更新快照。
- 文章打开、动作和滚动是延迟敏感路径；画像、排序、embedding 和重型诊断进入后台或显式冷路径。
- Desktop 用本机数据库，不将断网阅读降为 PWA 子集。结束前保存阅读进度、停止后台任务和插件进程，再关闭数据库。

## 数据升级与发布

已发布 migration 不得删除或改写。core migration 使用应用内用户可见的阻塞升级入口；需要重建推荐派生数据时继续显示进度，成功后再恢复业务并清理旧上下文。

v0.4.0 增加推荐会话 migration，派生升级复用已有 embeddings。v0.4.1 不新增 SQL migration 或强制重建。涉及额外 embedding 成本的重算必须让用户明确决定。

正式发布提供同一提交版本的 Windows x64 EXE、Intel / Apple Silicon DMG 和 Docker amd64 / arm64 镜像。验收需包含安装、旧版升级、备份恢复和平台权限边界；当前桌面包未签名，Mac 手动替换应用。

## 插件与接口

[插件开发](/zh/plugins/development/) 包含 Stable / Beta 合约、兼容范围、iframe bridge、全文抓取器、签名与 CLI。[API 与数据库参考](/zh/reference/) 列出当前新增接口和持久化边界。

前端隔离不代表恶意服务端代码沙箱。桌面本机权限只通过受控应用入口使用，不能由插件或外部页面取得。

## 实现依据

以当前实现为准：`apps/server/src/app.ts`、`reader-discovery-service.ts`、`apps/web/src/api.ts`、`packages/db/migrations`、`packages/plugin-sdk/src/index.ts` 和 `apps/desktop/src`。完整工程源码见 [v0.4.1 源码](https://github.com/Pls-1q43/Dibao/tree/v0.4.1)。
