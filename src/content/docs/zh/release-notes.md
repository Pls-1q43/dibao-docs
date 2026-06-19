---
title: 发布说明
description: Dibao v0.2.0、v0.1.3、v0.1.2、v0.1.1 与 v0.1.0 发布说明摘要。
---

## v0.2.0

发布日期：2026-06-19  
GitHub Release：[Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 的重点是插件系统正式上线：邸报现在可以通过可信本地插件扩展设置页、导航入口、后台任务、事件 Hook、插件数据、Secrets 和出站投递。

### 主要变化

- 插件系统上线：支持 manifest v1、安装、启用、禁用、卸载、签名包校验、trusted keys、插件迁移、插件任务、事件 Hook、插件私有数据和设置项。
- 插件 UI 运行在 sandboxed iframe 中，并通过受控 bridge 调用宿主能力；服务端插件运行在独立 Node host 子进程中，通过白名单 Host API 与邸报交互。
- 官方 Daily Brief 插件随镜像提供：每天从过去 24 小时的个性化推荐中生成按兴趣主题分组的每日简报，并提供独立导航页和设置页。
- 官方 Webhook 插件随镜像提供：可根据文章动作、订阅源刷新、排序完成、设置更新、插件任务结果和 Daily Brief 生成事件，向外部 HTTP 服务发送可配置的 webhook。
- 插件开发工具链上线：新增 `@dibao/plugin-sdk` 和 `@dibao/plugin-cli`，支持插件校验、打包和签名。
- 推荐列表、前台读取、后台任务、迁移等待、健康检查和插件宿主稳定性获得一批性能与可靠性修复。

### 升级影响

从 v0.1.x 升级到 v0.2.0 包含一次阻塞式数据库迁移，用于创建插件系统所需的核心表和索引。首次启动时，邸报会先完成 core blocking migration gate，再对外提供正常服务；数据量较大或磁盘较慢时可能需要等待一段时间。

升级前请先备份 `/data/dibao.sqlite` 或整个 Docker volume。备份完成后，保留同一个 `/data` volume，替换镜像并重启容器即可。升级后打开健康检查接口确认：

```text
GET /api/system/health
```

返回 `version: "0.2.0"` 且 `ok: true` 即表示基础健康检查通过。

### Docker 安装与升级

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.0
```

如需回滚，请先停止 v0.2.0 容器，用升级前备份恢复 SQLite 数据库和 `/data` volume，再启动上一版镜像。

### 有用链接

- [Webhook 使用说明](/zh/plugins/webhook/)
- [插件安装说明](/zh/plugins/installation/)
- [插件开发说明](/zh/plugins/development/)

### 已知限制

- 第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱；只安装你信任的来源，并检查签名、公钥、capabilities 和服务端代码风险。
- 部分 Host API 标记为 Beta，可能在 `0.2.x` 中调整字段或语义；长期插件应优先使用 Stable API 和 manifest migrations。

## v0.1.3

发布日期：2026-06-04  
GitHub Release：[Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

v0.1.3 是 v0.1 稳定线维护版本，重点是订阅源管理体验、阅读器元信息和 Ollama / Gemini embedding provider 行为。

### 主要变化

- 订阅源管理页进一步压缩垂直空间：添加订阅改为在订阅源行内打开弹窗，订阅源健康度归入列表筛选。
- 来源筛选启用时，文章列表里的来源按钮现在会显示状态提示，避免用户无意打开来源筛选后误以为列表刷新异常。
- 推荐文章、最新文章、稍后读等页面在非英文界面下恢复英文副标题；英文界面继续保持无副标题。
- 文章列表、搜索结果和阅读界面现在会显示文章年份，跨年阅读时不必打开原文才能确认具体年份。
- Ollama provider 默认切片长度降为 4000 字符，并在设置界面增加中文长文 / bge-m3 提示；遇到 Ollama 上下文过长错误时会自动用更短切片重试一次。
- Gemini embedding 维度请求更可靠：Google AI Studio 的 OpenAI-compatible 入口会发送 `dimensions`，原生 Gemini provider 会发送 `outputDimensionality`，支持按配置使用 768 / 1536 / 3072 维。

### 升级影响

从 v0.1.2 升级到 v0.1.3 不需要新的 SQL migration，也不会触发 recommendation derived-data upgrade。保留同一个 `/data` volume 后替换镜像并重启容器即可。

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

### 已知限制

- Ollama 不同模型和上下文配置仍可能需要手动调低切片长度；如果 bge-m3 仍提示上下文过长，建议降到 3000 字符。
- Gemini / OpenAI-compatible 的维度能力取决于上游 provider 是否支持对应参数；Dibao 会对 Google Gemini 路径发送维度请求并继续执行返回向量维度校验。

## v0.1.2

发布日期：2026-06-01  
GitHub Release：[Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

v0.1.2 是 v0.1 稳定线维护版本，重点是更清晰的 embedding provider 错误、更安全的阅读器媒体渲染，以及更直接的订阅源 / 分组导航。

### 主要变化

- Embedding provider 测试失败现在会返回更可操作的公开错误：鉴权失败、模型或 endpoint 不存在、rate limit、provider 不可用、网络不可达、响应格式异常等会被明确分类。
- Provider 错误会保留可公开展示的上游信息，同时过滤 API key、token、Authorization 等敏感字段。
- 设置页与后台状态不再把 provider 的测试错误泄漏到不该展示的索引列表里。
- 订阅源管理拆分为“订阅源管理”和“订阅源分组管理”两个视图，减少长页面里混在一起的操作。
- 订阅源和分组管理行新增“查看文章”，可直接跳到对应 feed 或 folder 的 latest 文章列表。
- 文章列表 URL 会保留 feed / folder 筛选参数，方便刷新、分享或返回时维持当前上下文。
- 阅读器里的文章图片加载失败后会停止反复重试，避免失败图片持续触发布局抖动或重复网络请求。

### 升级影响

从 v0.1.1 升级到 v0.1.2 不需要新的 SQL migration，也不会触发 recommendation derived-data upgrade。保留同一个 `/data` volume 后替换镜像并重启容器即可。

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

### 已知限制

- Embedding provider 的错误信息取决于上游服务实际返回的内容；Dibao 会尽量分类并清理敏感字段，但无法修复 provider 本身的不可用状态。
- 文章正文中的远程图片仍取决于原站点、网络和防盗链策略；本版本的修复是避免失败图片反复重试。

## v0.1.1

发布日期：2026-05-30  
GitHub Release：[Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

v0.1.1 修正了推荐画像校准与升级体验，在 RSS/Atom、OPML、Feed 管理、搜索、文章动作、推荐解释、Provider 设置、后台任务和 PWA 基础上，让首次安装与持续升级更稳定。

重点：

- 快速安装默认使用 `ghcr.io/pls-1q43/dibao:latest`。
- Compose 默认把 `/data` 挂载到本地 `./data` 文件夹。
- Provider 不可用时，阅读功能继续可用并退回基础排序。
- 推荐、索引、后台任务和插件状态在设置页中可见。

## v0.1.0

发布日期：2026-05-28  
GitHub Release：[Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

v0.1.0 是首个公开版本，包含基础排序、OpenAI-compatible 与 Ollama embedding providers、sqlite-vec 向量索引、推荐诊断、后台刷新、搜索、PWA app shell、健康检查和备份/升级文档。

因为它是首个公开版本，没有从更早公开版本升级的迁移路径。后续升级前请先备份 `./data`。
