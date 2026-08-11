---
title: 发布说明
description: Dibao v0.3.1、v0.3.0、v0.2.1、v0.2.0 与历史版本发布说明。
---

## v0.3.1

发布日期: 2026-08-10  
GitHub Release: [Dibao v0.3.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.1)

v0.3.1 是当前推荐安装和升级的 0.3 正式版本。本版本的主轴是“推荐算法与机制大更新”：推荐系统从单纯给出列表，进一步走向更稳定的已排序库存、更清楚的 fallback 边界、更可靠的负面主题过滤，以及更低干扰的后台排序机制。v0.3.1 还补齐了 0.3.0 发布后的安全、插件、本地网络订阅源和阅读器恢复体验修复。

### 主要变化

- 推荐 v3 memory 基础：新增用户表示快照、推荐曝光记录和探索尝试记录，为长期兴趣记忆、探索反馈和后续推荐策略迭代打基础。
- 推荐排序与 fallback 隔离：推荐列表更严格使用当前 active rank context，避免旧上下文或 fallback 序列过早混入；当已排序库存不足时，fallback 只用于短批次临时补位，降低大批未排序内容涌入的体感。
- 负面主题簇与主题组修复：负面主题、主题组约束，以及金融/交易日等不想看的主题标记会更可靠地参与过滤和降权。
- 推荐库存状态提示：未读推荐页可以显示当前处于“有已排序库存”“无库存”或“排序中”，帮助判断是否正在消费高质量推荐，还是暂时进入备用序列。
- 阅读路径性能优化：打开文章、滚动和文章操作不再同步触发重排序、重型透明度诊断或大范围写入；这些工作改由后台任务处理。
- 无限加载：可在设置中开启。推荐、最新、收藏、稍后读和搜索结果滚动到底部时会自动加载下一批；失败时暂停自动重试，并保留明确的手动重试入口。
- 文章详情体验：顶部“返回列表”和“原文”按钮布局收口；详情加载失败时提供重新加载入口，已知原文 URL 时仍可打开原文。
- 插件体验补齐：官方插件 manifest 支持本地化字符串，插件 iframe 和 bridge 可感知当前语言；Daily Brief、Webhook 和全文选择器官方插件更新到 `0.1.1`。
- 自托管订阅源兼容：feed 发现和刷新允许访问私有/内网地址，以支持 NAS、家庭网络或自建服务里的 RSS；插件出站请求和全文抓取仍保留受控 fetch 的防护边界。
- 内容清理：更好地清除 Hexo 风格代码块行号/侧栏，保留正文代码内容，减少文章详情中的噪声。
- 安全与发布链路加固：受控 fetch 降低 DNS rebinding / TOCTOU SSRF 风险，跨源重定向会剥离敏感 header；同时升级运行时与构建依赖，发布前生产和完整 `npm audit` 均为 0。

### 升级影响

从 v0.3.0 升级到 v0.3.1 没有新增 core SQLite migration，也不需要重新计算 Embeddings。官方插件会随应用内置资源更新到 `0.1.1`。

从 v0.2.1 直接升级到 v0.3.1 会新增推荐 v3 memory 相关数据库结构。迁移会在应用启动时自动执行；升级前仍建议备份 `/data/dibao.sqlite` 或整个 Docker volume。

本次升级不会要求重新计算 Embeddings。v0.3 会在现有文章、行为事件、兴趣簇和已存在向量的基础上继续工作；新的推荐记忆和曝光数据会在升级后随使用逐步积累。

升级后建议检查：

```text
GET /api/system/health
```

返回 `ok: true` 和 `version: "0.3.1"` 表示基础健康检查通过。进入推荐页后，如果推荐库存状态提示显示正在排序，可以等待后台任务补充排序库存。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

保留原有 `/data` volume，替换镜像并重启即可。默认入口会启动 HTTP 进程和独立 worker 进程。若你维护自定义 Compose 文件，请继续保留持久化数据目录，并确保环境变量与上一版相比没有遗漏。

升级前建议：

```text
备份 /data/dibao.sqlite 或整个 Docker volume
```

如需回滚，请先停止 v0.3.1 容器，用升级前备份恢复 SQLite 数据库和 `/data` volume，再启动上一版镜像。不要直接用已迁移到 0.3.x 的数据库启动更旧版本。

### Migration List

从 v0.3.0 到 v0.3.1：

- 没有新增 core SQLite migration。

从 v0.2.1 直接升级到 v0.3.1：

- `026_recommendation_v3_memory.sql`：新增 `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`，并为 `article_rank_scores` 增加探索相关字段。

### Sentry 发布校验

正式 Docker 镜像使用 BuildKit secret `dibao_sentry_config` 注入私有 Sentry 配置。发布验证只报告 `hasDsn`、`hasOrg`、`hasProject` 等布尔结果，不公开 DSN、org、project 或 token。

### 已知限制

- 推荐 v3 memory 是基础设施更新，不代表所有长期记忆策略都已完成产品化；推荐质量仍会随使用和后台排序逐步稳定。
- 当已排序推荐库存耗尽时，系统仍可能临时使用备用序列，但 v0.3.1 会更明确地限制和提示这一状态。
- 第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱。

## v0.3.0

发布日期: 2026-08-08  
GitHub Release: [Dibao v0.3.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.0)

v0.3.0 是一次围绕“推荐算法与机制大更新”的大版本发布。推荐系统现在更强调稳定的已排序库存、清晰的 fallback 边界、负面主题与主题组约束，以及更低干扰的后台排序机制；阅读器也加入了无限加载、推荐库存状态提示、全文抓取插件与多处交互收口。

### 主要变化

- 推荐 v3 memory 基础：新增用户表示快照、推荐曝光记录和探索尝试记录，为后续更稳定的长期兴趣记忆与探索反馈打基础。
- 推荐排序机制重构：推荐列表更严格使用当前 active rank context，避免旧上下文或 fallback 序列过早混入；fallback 分页被限制在较小批次，降低“突然像未排序列表”的体感。
- 负面主题簇与主题组约束修复：负面主题、金融/交易日等不想看的主题标记更可靠地参与过滤和降权。
- 推荐库存状态提示：未读推荐页新增库存/排序状态提示，帮助判断当前是在消费已排序库存、等待排序，还是临时进入备用序列。
- 推荐相关性能优化：阅读、滚动、文章操作不再同步触发重排序、透明度诊断或重型写入；后台排序与前台交互的耦合进一步降低。
- 无限加载：可在设置中开启，推荐、最新、收藏、稍后读和搜索结果滚动到底部时自动加载下一批；失败时停止自动重试并保留手动重试入口。
- 文章详情体验：顶部“返回列表”和“原文”按钮布局收口，详情加载失败时提供重新加载入口。
- 插件与全文抓取：官方插件系统继续完善，新增全文抓取扩展点与官方全文选择器插件；Webhook 插件支持 secrets、deliveries 和运行状态。
- 出站请求安全加固：受控 fetch 会在真实连接中使用已校验 IP，降低 DNS rebinding / TOCTOU SSRF 风险；跨源重定向会剥离敏感 header，并避免 POST body 被意外转发到跳转目标。
- Docker 与后台任务稳定性：修复跨平台 Docker 构建、后台 worker 保活、SQLite 排序写入与 core migration checksum 流式校验等长期运行问题。

### 升级影响

从 v0.2.1 升级到 v0.3.0 会新增推荐 v3 memory 相关数据库结构。升级会在应用启动时自动运行 core migration；升级前仍建议备份 `/data/dibao.sqlite` 或整个 Docker volume。

本次升级不会要求重新计算 Embeddings。v0.3 会在现有文章、行为事件、兴趣簇和已存在向量的基础上继续工作；新的推荐记忆和曝光数据会在升级后随使用逐步积累。

升级后建议检查：

```text
GET /api/system/health
```

返回 `ok: true` 和 `version: "0.3.0"` 表示基础健康检查通过。进入推荐页后，如果推荐库存状态提示显示正在排序，可以等待后台任务补充排序库存。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.0
```

保留原有 `/data` volume，替换镜像并重启即可。默认入口会启动 HTTP 进程和独立 worker 进程。若你维护自定义 Compose 文件，请继续保留持久化数据目录，并确保环境变量与 0.2.x 相比没有遗漏。

升级前建议：

```text
备份 /data/dibao.sqlite 或整个 Docker volume
```

如需回滚，请先停止 v0.3.0 容器，用升级前备份恢复 SQLite 数据库和 `/data` volume，再启动上一版镜像。不要直接用已迁移到 0.3.0 的数据库启动旧版本。

### Migration List

从 v0.2.1 到 v0.3.0 新增 1 个 core SQLite migration：

- `026_recommendation_v3_memory.sql`：新增 `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts`，并为 `article_rank_scores` 增加探索相关字段。

### Sentry 发布校验

正式 Docker 镜像使用 BuildKit secret `dibao_sentry_config` 注入私有 Sentry 配置。发布验证只报告 `hasDsn`、`hasOrg`、`hasProject` 等布尔结果，不公开 DSN、org、project 或 token。

### 已知限制

- 推荐 v3 memory 是基础设施更新，不代表所有长期记忆策略都已完成产品化；推荐质量仍会随使用和后台排序逐步稳定。
- 当已排序推荐库存耗尽时，系统仍可能临时使用备用序列，但 v0.3.0 会更明确地限制和提示这一状态。
- 第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱。

## v0.2.1

发布日期: 2026-07-12  
GitHub Release: [Dibao v0.2.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.1)

v0.2.1 是 0.2 插件版本线的补丁发布。重点是让 Docker / 群晖这类长期运行实例更稳：后台 worker 会更可靠地处理 HTTP 进程入队的推荐与 Embedding 任务，官方插件遇到瞬时 runtime 错误时不再被误禁用，移动端返回列表也避免了不必要的列表重载。

### 主要变化

- 修复 Docker split-process 模式下后台 worker 可能看不到新入队 `embedding_generate` 任务的问题。Docker Compose 默认使用 `DIBAO_SQLITE_JOURNAL_MODE=DELETE`，避开 bind mount + SQLite WAL 在多进程场景下的可见性风险。
- worker 增加后台任务兜底心跳，job runner 启动后会立即处理 due jobs，并在单轮达到上限时自动补跑下一轮，避免启动期维护任务挤占后续任务。
- 增加跨进程 job wake signal，HTTP 进程入队后台任务后可以唤醒 worker。
- 官方插件遇到瞬时 hook/runtime 错误时保持 enabled，并通过 runtime 状态暴露 degraded 信息，避免自动 Disable。
- 移动端文章详情返回未读列表时，忽略 `limit=1` 未读计数探测，不再把它误判为完整列表 refetch。
- 文章详情和订阅源管理界面的 0.2.1 UI 收口：Feed 来源说明与操作按钮对齐，添加订阅源按钮行垂直居中。
- 合入 v0.1.3 维护线修复：Gemini OpenAI-compatible provider 会请求配置的 embedding dimensions，Ollama 长上下文处理更稳，文章发布日期显示年份，源过滤状态更清晰。

### 升级影响

从 v0.2.0 升级到 v0.2.1 没有新增 core SQLite schema migration。保留同一个 `/data` volume 并替换镜像即可。升级前仍建议备份 `/data/dibao.sqlite` 或整个 Docker volume。

如果你使用自定义 Compose 文件，建议加入：

```yaml
environment:
  DIBAO_SQLITE_JOURNAL_MODE: DELETE
```

官方 `compose.yaml` 已包含这个默认值。升级后检查：

```text
GET /api/system/health
```

返回 `ok: true` 和 `version: "0.2.1"` 即表示基础健康检查通过。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.1
```

默认 Docker 入口会启动 HTTP 进程和独立 worker 进程。若需要关闭后台 worker，可设置：

```yaml
environment:
  DIBAO_BACKGROUND_JOBS: "false"
```

如需回滚，请先停止 v0.2.1 容器，用升级前备份恢复 SQLite 数据库和 `/data` volume，再启动上一版镜像。

### Migration List

从 v0.2.0 到 v0.2.1：无新增 core SQLite migrations。应用启动时仍会正常检查已发布 migration 是否完整且 checksum 未漂移。

### Sentry 发布校验

正式 Docker 镜像使用 BuildKit secret `dibao_sentry_config` 注入私有 Sentry 配置。发布验证只报告 `hasDsn`、`hasOrg`、`hasProject` 等布尔结果，不公开 DSN、org、project 或 token。

### 已知限制

- 第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱。
- v0.2.x 的部分插件 Host API 仍处于 Beta；长期插件应优先使用 Stable API。

## v0.2.0

发布日期: 2026-06-19  
GitHub Release: [Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

端午安康。Dibao v0.2.0 的重点是插件系统正式上线：邸报现在可以通过可信本地插件扩展设置页、导航入口、后台任务、事件 Hook、插件数据、Secrets 和出站投递。

### 主要变化

- 插件系统上线：支持 manifest v1、安装/启用/禁用/卸载、签名包校验、trusted keys、插件迁移、插件任务、事件 Hook、插件私有数据和设置项。
- 插件 UI 运行在 sandboxed iframe 中，并通过受控 bridge 调用宿主能力；服务端插件运行在独立 Node host 子进程中，通过白名单 Host API 与邸报交互。
- 官方 Daily Brief 插件随镜像提供：每天从过去 24 小时的个性化推荐中生成按兴趣主题分组的每日简报，并提供独立导航页和设置页。
- 官方 Webhook 插件随镜像提供：可根据文章动作、订阅源刷新、排序完成、设置更新、插件任务结果和 Daily Brief 生成事件，向外部 HTTP 服务发送可配置的 webhook。
- 插件开发工具链上线：新增 `@dibao/plugin-sdk` 和 `@dibao/plugin-cli`，支持插件校验、打包和签名。
- 0.2 还包含推荐列表、前台读取、后台任务、迁移等待、健康检查和插件宿主稳定性的性能/可靠性修复。

### 升级影响

从 v0.1.x 升级到 v0.2.0 包含一次阻塞式数据库迁移，用于创建插件系统所需的核心表和索引。首次启动时，邸报会先完成 core blocking migration gate，再对外提供正常服务；数据量较大或磁盘较慢时可能需要等待一段时间。

升级前请先备份 `/data/dibao.sqlite` 或整个 Docker volume。备份完成后，保留同一个 `/data` volume，替换镜像并重启容器即可。升级后打开健康检查接口确认：

```text
GET /api/system/health
```

返回 `version: "0.2.0"` 且 `ok: true` 即表示基础健康检查通过。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.0
```

如需回滚，请先停止 v0.2.0 容器，用升级前备份恢复 SQLite 数据库和 `/data` volume，再启动上一版镜像。

### Sentry 发布校验

v0.2.0 正式 Docker 镜像通过 GitHub Actions 使用 BuildKit secret `dibao_sentry_config` 注入私有 Sentry 构建配置。发布验证只报告 `hasDsn`、`hasOrg` 和 `hasProject` 等布尔值，不会在源码、日志或 Release Note 中公开 DSN、org、project 或 token。

### 有用链接

- Webhook 使用说明：https://docs.dibao.app/zh/plugins/webhook/
- 插件开发说明：https://docs.dibao.app/zh/plugins/development/
- 插件安装说明：[`docs/plugin-installation.zh-CN.md`](./plugin-installation.zh-CN.md)
- 插件开发指南：[`docs/plugin-development.zh-CN.md`](./plugin-development.zh-CN.md)

### 已知限制

- 第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱；只安装你信任的来源，并检查签名、公钥、capabilities 和服务端代码风险。
- 部分 Host API 标记为 Beta，可能在 0.2.x 中调整字段或语义；长期插件应优先使用 Stable API 和 manifest migrations。

## v0.1.3

发布日期: 2026-06-04  
GitHub Release: [Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

### 主要变化

- 订阅源管理页进一步压缩垂直空间：添加订阅改为在订阅源行内打开弹窗，订阅源健康度归入列表筛选，减少大屏下仍然可见的布局拥挤。
- 来源筛选启用时，文章列表里的来源按钮现在会显示状态提示，避免用户无意打开来源筛选后误以为列表刷新异常。
- 推荐文章、最新文章、稍后读等页面在非英文界面下恢复英文副标题；英文界面继续保持无副标题。
- 文章列表、搜索结果和阅读界面现在会显示文章年份，跨年阅读时不必打开原文才能确认具体年份。
- Ollama provider 默认切片长度降为 4000 字符，并在设置界面增加中文长文/bge-m3 提示；遇到 Ollama 上下文过长错误时会自动用更短切片重试一次。
- Gemini embedding 维度请求更可靠：Google AI Studio 的 OpenAI-compatible 入口会发送 `dimensions`，原生 Gemini provider 会发送 `outputDimensionality`，支持按配置使用 768 / 1536 / 3072 维。

### 升级影响

从 v0.1.2 升级到 v0.1.3 不需要新的 SQL migration，也不会触发 recommendation derived-data upgrade。保留同一个 `/data` volume 后替换镜像并重启容器即可。

升级前仍建议备份 `/data/dibao.sqlite` 或整个 Docker volume。升级后打开健康检查接口确认：

```text
GET /api/system/health
```

返回 `version: "0.1.3"` 且 `ok: true` 即表示基础健康检查通过。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

如需回滚，请先停止 v0.1.3 容器，用升级前备份恢复 SQLite 数据库，再启动上一版镜像。

### 已知限制

- Ollama 不同模型和上下文配置仍可能需要手动调低切片长度；如果 bge-m3 仍提示上下文过长，建议降到 3000 字符。
- Gemini/OpenAI-compatible 的维度能力取决于上游 provider 是否支持对应参数；Dibao 会对 Google Gemini 路径发送维度请求并继续执行返回向量维度校验。

## v0.1.2

发布日期: 2026-06-01  
GitHub Release: [Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

### 主要变化

- Embedding provider 测试失败现在会返回更可操作的公开错误：鉴权失败、模型/endpoint 不存在、rate limit、provider 不可用、网络不可达、响应格式异常等会被明确分类。
- Provider 错误会保留可公开展示的上游信息，同时会过滤 API key、token、Authorization 等敏感字段。
- 设置页与后台状态不再把 provider 的测试错误泄漏到不该展示的索引列表里。
- 订阅源管理拆分为“订阅源管理”和“订阅源分组管理”两个视图，减少长页面里混在一起的操作。
- 订阅源和分组管理行新增“查看文章”，可直接跳到对应 feed 或 folder 的 latest 文章列表。
- 文章列表 URL 现在会保留 feed/folder 筛选参数，方便刷新、分享或返回时维持当前上下文。
- 阅读器里的文章图片加载失败后会停止反复重试，避免失败图片持续触发布局抖动或重复网络请求。

### 升级影响

从 v0.1.1 升级到 v0.1.2 不需要新的 SQL migration，也不会触发 recommendation derived-data upgrade。保留同一个 `/data` volume 后替换镜像并重启容器即可。

升级前仍建议备份 `/data/dibao.sqlite` 或整个 Docker volume。升级后打开健康检查接口确认：

```text
GET /api/system/health
```

返回 `version: "0.1.2"` 且 `ok: true` 即表示基础健康检查通过。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

如需回滚，请先停止 v0.1.2 容器，用升级前备份恢复 SQLite 数据库，再启动上一版镜像。

### 已知限制

- Embedding provider 的错误信息取决于上游服务实际返回的内容；Dibao 会尽量分类并清理敏感字段，但无法修复 provider 本身的不可用状态。
- 文章正文中的远程图片仍取决于原站点、网络和防盗链策略；本版本的修复是避免失败图片反复重试。

## v0.1.1

发布日期: 2026-05-30  
GitHub Release: [Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

### 主要变化

- 修复兴趣簇过度合并：避免不同主题被吸进一个超大兴趣簇，例如测试数据中出现过的“AI / 不是 / 你自己”式巨簇。
- 修复兴趣簇过度碎片化：避免升级后大部分兴趣簇退化成只有 1 篇文章。
- 新增每个 embedding index 独立的 calibration。Dibao 会根据当前 provider、模型、dimension 和本库向量分布，在重建/升级时生成并冻结本 index 的合并阈值。
- 合并逻辑加入约束：centroid 相似度、pairwise guard、标题/来源证据、最大簇规模、最大吸收步长都会参与判断。
- 主题组现在也有上限设置。默认值为 positive clusters 48、negative clusters 32、positive families 16、negative families 12，设置入口与兴趣簇上限放在同一区域。
- 推荐排序收紧 topic family 的作用：cluster 仍是语义匹配主依据，family 主要用于解释和多样性，宽泛主题组不会直接放大推荐匹配分。
- 升级界面会说明本次阻塞迁移只重建 derived recommendation data，不重算 embeddings，不会产生新的 embedding API 费用。
- labels/升级相关界面保持分批处理和让出事件循环，降低低功耗 NAS 上 CPU 100% 时“界面像升级失败”的误判。
- 修复在文章列表点击“加载更多”后，滚过第二页未打开文章可能不再自动标记为已忽略的问题。
- Docker 发布流水线要求注入私有 Sentry build config，正式镜像会同时包含服务端和浏览器端的运行期 Sentry 配置。

### 升级影响

从 v0.1.0 升级到 v0.1.1 会自动执行新增数据库迁移 `018_interest_cluster_calibrations.sql`，并在首次启动后进入一次阻塞式 recommendation derived-data upgrade。该升级会重建兴趣簇、主题组、labels 和 ranking rows，但不会调用 embedding provider，也不会重算 embeddings。

升级前请备份 `/data/dibao.sqlite` 或整个 Docker volume。首次启动时，普通阅读界面会暂时被升级进度页阻塞；升级完成后自动恢复。

### Docker 安装与升级

推荐镜像：

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.1
```

保留同一个 `/data` volume 后替换镜像并重启容器即可。健康检查地址为：

```text
GET /api/system/health
```

如需回滚，请先停止 v0.1.1 容器，用升级前备份恢复 SQLite 数据库，再启动上一版镜像。

### 已知限制

- 低样本库会使用保守 fallback calibration；推荐质量仍需要用户行为与 embedding 覆盖逐步积累。
- 低功耗 NAS 上首次 derived-data upgrade 可能需要一些时间，但界面会显示具体进度。
- 如果用户主动更换 embedding 模型或 dimension，历史 embedding 仍不能跨模型混用，需要为新 index 生成新 embedding。

## v0.1.0

发布日期: 2026-05-28  
GitHub Release: [Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

邸报 v0.1.0 是首次公开发布版本。它提供一个可用 Docker 自托管的单用户 RSS 阅读器：你可以导入 OPML、管理订阅源和分组、阅读最新文章、使用收藏/稍后读/已读/不感兴趣等动作，并在自己的 RSS 信源内部获得可解释的个性化推荐。

本版本支持基础排序、OpenAI-compatible / Ollama embedding provider、sqlite-vec 向量索引、推荐状态诊断、后台刷新、搜索、PWA 应用壳、健康检查、备份和升级说明。首次安装不需要历史迁移；请使用 `ghcr.io/pls-1q43/dibao:v0.1.0`，并把 `/data` 挂载到持久化目录。升级前请备份 SQLite 数据库或 Docker volume。

已知限制：当前仅支持单用户自托管，没有官方托管服务、多用户协作、云同步、OAuth/密码找回、完整离线文章库或原生移动/桌面应用。推荐质量仍处于 MVP 阶段，效果取决于阅读反馈和 embedding 覆盖率。
