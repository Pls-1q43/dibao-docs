---
title: API 与数据库参考
description: Dibao v0.4.1 的阅读发现、离线同步、升级接口与数据库边界。
---

本页按 v0.4.1 服务端路由与类型整理。成功业务响应通常包装在 `data` 中，分页还可有 `page` / `meta`。业务接口需要登录；写请求还需通过来源校验。插件请使用白名单 Host API / bridge，不要把核心接口当作可任意访问的插件权限。

## 核心接口

| 接口 | 用途与参数 |
| --- | --- |
| `GET /api/system/health` | 基础健康：检查 `data.ok` 和 `data.version`。不表示数据升级结束。 |
| `GET /api/system/upgrade/status` | 登录后读取 core / 派生升级状态；最终确认 `completed` 或 `not_required`，且 `blocking: false`。 |
| `GET /api/articles/:id/related` | 相关文章预览，默认 5，`limit` 范围 1–10。 |
| `GET /api/articles/:id/related-search` | 扩展搜索，默认 50，`limit` 范围 1–100；`cursor` 分页，`state` 为 `all/unread/read/favorites/read_later`。 |
| `GET /api/articles/:id/personalized-related` | 当前文章与个人推荐结合，默认 5，`limit` 范围 1–10。 |
| `GET /api/offline/manifest` | 已有推荐与缓存清单，`recommendedLimit` 默认 200，接口接受 50–1,000 整数；UI 按 50 调整。 |
| `POST /api/offline/articles/batch` | 用 `{ "articleIds": [...] }` 获取正文批次。 |

发现查询返回 `status: "ready"` 或 `"unavailable"`；不可用原因包括 `no_active_embedding`、`article_embedding_missing`，个性化候选不足可为 `insufficient_candidates`。不存在的文章返回 404。展开搜索使用相似度严格大于 0.35，不能把阈值套到预览接口。

## 离线动作与推荐会话

文章动作支持客户端生成的 `clientActionId`，重试同一 ID 不得重复写入行为。推荐分页返回会话信息；继续分页需保留服务端给出的 cursor 与对应 recommendation session，不能把不同会话的 cursor 混用。快照和发现接口读取已有数据，不为查询启动 embedding 重算。

## 插件安装接口

<h3 id="plugin-install">POST /api/plugins/install</h3>

接收 URL 或 JSON 包的高级安装入口。普通用户优先在设置上传文件；下载、签名、兼容范围与权限仍须校验。

<h3 id="plugin-install-upload">POST /api/plugins/install/upload</h3>

上传 `.dibao-plugin` 文件的入口。新第三方插件默认禁用，管理员检查来源与能力后启用。

## 数据库与持久化

v0.4.0 新增 `027_recommendation_sessions.sql`；v0.4.1 没有新增 core SQL migration。

| 结构 | 说明 |
| --- | --- |
| `recommendation_sessions` | `id`、`rank_context`、`rerank_window_id`、`scope_key`、`item_count`、`created_at`、`expires_at`。 |
| `recommendation_session_items` | `session_id`、`article_id`、`position`、`rank_score`、`rank_calculated_at`；会话内位置唯一。 |
| 推荐记忆 | `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` 来自 026 migration。 |
| 插件 | installs、capability grants、settings、KV、migrations、secrets、deliveries、update checks 与插件目录一起保留。 |

不要绕过 migration 直接修改推荐或插件内部表。Docker 保存整个 `/data`；Desktop 保存整个数据根目录；浏览器 IndexedDB 的离线副本不在服务器 SQLite 备份里。

## 进一步阅读

[开发者文档](/zh/developers/)、[插件开发](/zh/plugins/development/)、[备份升级](/zh/backup-upgrade/)、[发布说明](/zh/release-notes/)。完整路由与类型可在 [v0.4.1 服务端源码](https://github.com/Pls-1q43/Dibao/blob/v0.4.1/apps/server/src/app.ts) 和 [数据库源码](https://github.com/Pls-1q43/Dibao/tree/v0.4.1/packages/db) 核对。
