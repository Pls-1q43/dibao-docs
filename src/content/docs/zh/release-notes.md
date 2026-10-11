---
title: 发布说明
description: Dibao v0.4.1、v0.4.0 与历史版本发布说明。
---

## v0.4.1

Release date: 2026-10-11

GitHub Release: [Dibao v0.4.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.1)

v0.4.1 首次带来 Windows 和 macOS 独立桌面版：不用部署服务器，安装后就能在本机使用邸报。桌面版沿用现有阅读器、订阅管理和推荐功能，新增托盘后台运行、本地离线阅读、数据备份恢复和桌面更新；首次设置、退出保存和数据恢复体验也得到完善。原有 Docker、网页与 PWA 部署继续保留。

### 新增功能

- **独立桌面版。** 提供 Windows x64 安装程序、Intel Mac 和 Apple Silicon Mac 拖拽安装包，内置运行环境，无需另外安装 Node.js、Docker 或数据库。首次使用仍需创建账号密码，AI 服务按需配置，不捆绑模型。
- **托盘与后台运行。** 关闭窗口后继续抓取订阅源，可从系统托盘或菜单栏重新打开阅读器，选择“退出”才停止应用。“登录系统时在后台启动”默认关闭；启用后静默运行，不自动弹出窗口。
- **桌面本地离线阅读。** 互联网断开时，仍可打开阅读器、阅读本机已保存的文章并记录阅读状态，不需要切换到 PWA 的离线缓存子集。抓取新文章、加载未保存的外部资源和调用 AI 仍需联网。
- **手动备份与恢复。** “设置 → 关于 → 数据备份与恢复”可创建完整备份、按日期选择恢复点，并查看操作结果。备份包括订阅、文章与阅读状态、设置、已有向量、插件数据和密钥，以及登录与客户端状态；确认后重启完成操作。恢复前会另存当前数据，恢复点之后的修改可能回退。
- **桌面更新与升级保护。** 在“设置 → 关于”检查新版本。Windows 支持确认下载后再“重启并更新”；macOS 当前通过下载新 DMG、完全退出后覆盖应用更新。新版本先备份再升级，备份失败不会继续改动数据；普通退出不会自动安装更新，稳定渠道不接收预发布版本，也不会自动降级。

### 改进

- **首次设置更灵活。** 欢迎页可先选择简体中文、日本語或 English，后续设置、插件和阅读器沿用该语言。订阅源可选择“稍后添加”，不必先添加 RSS 或导入 OPML 才能完成设置。
- **安装与数据分离。** 更换安装目录、覆盖安装、重装和默认卸载不会主动删除本机数据；“设置 → 关于”可直接打开数据目录。默认保留最近三份成功的升级前自动备份，手动备份与恢复前快照不自动删除。
- **桌面与自托管界面分开。** 桌面界面不再标注“内测版”。备份恢复、数据目录、登录启动和应用安装等桌面操作只在 Desktop 显示；Docker、网页与 PWA 保留原有阅读和离线功能，不增加桌面专属入口。

### 修复

- **备份与恢复操作没有明确反馈。** 补齐确认、执行中、取消、完成和失败提示；没有可用备份时明确禁用恢复，避免点击后像是没有反应。
- **损坏备份影响正常恢复。** 单个损坏备份不再阻塞其他有效恢复点；恢复中断后会先校验完整性，再替换现有数据，拒绝缺失数据库、路径异常或文件被改动的备份。
- **启动时误判已有数据。** 修复把系统新生成的浏览器配置当作已有数据库的问题。已使用过的数据库缺失或为空时，会停止启动并引导恢复，不再悄悄新建空库；恢复前保留残余文件。
- **Windows 恢复后无法正常启动。** 将冷备份、恢复和版本检查移到浏览器打开数据目录之前，避免目录锁和启动写入干扰恢复；不改变原有登录数据路径。
- **退出与更新时的写入冲突。** 退出前保存待提交的阅读进度，停止后台任务和插件进程，再关闭数据库；有未保存设置或正在进行数据升级时，阻止不安全的备份、恢复与更新操作。
- **安全与运行依赖。** 更新有安全修复的 HTTP 和运行依赖，清理 Docker 镜像中不需要的包管理工具；加固桌面权限调用和插件边界，防止外部页面调用桌面特权操作。Docker 运行镜像不包含 Electron 或桌面运行进程。

### 升级影响与迁移

从 **v0.4.0 到 v0.4.1** 无新增 SQL 迁移，无新增强制派生数据重算，**不会重新计算 Embeddings**。更早版本直接升级时，仍会自动执行尚未应用的历史迁移和必要的数据升级。桌面版的数据备份与版本保护只作用于本机数据，不会自动导入群晖或其他部署的数据。

### 下载与升级

- [Windows x64 EXE 安装程序](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-win-x64.exe)
- [macOS Intel DMG 拖拽安装包](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-x64.dmg)
- [macOS Apple Silicon DMG 拖拽安装包](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-arm64.dmg)
- Docker：`ghcr.io/pls-1q43/dibao:v0.4.1`，支持 `linux/amd64` 和 `linux/arm64`。

桌面数据位于 Windows 的 `%LOCALAPPDATA%\Dibao` 或 macOS 的 `~/Library/Application Support/Dibao`。安装、更新与恢复步骤见[桌面版说明](/zh/desktop-install/)。以后正式 Release 同样提供上述三种安装包及 Docker 镜像。

Docker 新安装见 [Compose 示例](/zh/quick-install/)。升级前先同步各客户端的离线操作，停止旧容器并备份整个 `/data`，不要只复制 SQLite 主文件。保留原数据卷和环境变量，将镜像改为 `v0.4.1` 后运行 `docker compose pull && docker compose up -d`。检查 `/api/system/health` 的 `data.ok: true`、`data.version: "0.4.1"`，并确认登录后的 `/api/system/upgrade/status` 已完成或不需要升级、`blocking: false`。

回滚时停止新版本，在干净目录或新 volume 中恢复完整的升级前备份，再启动旧镜像；不要让旧版直接打开新数据，也不要覆盖仍有新 WAL 文件的目录。

### 已知限制

- 安装包尚未签名，系统可能警告或阻止首次运行。仅使用本 Release 的下载，按系统提示确认，不要关闭系统安全校验。macOS 暂不支持应用内自动安装，未签名登录项也可能注册失败。
- 暂不支持 Windows ARM 原生版、群晖数据迁入、远程实例连接或多端同步。桌面离线阅读使用本机数据库，不是与服务器之间的离线同步。
- 第三方服务端插件仍是可信本地代码，只安装你信任的插件。尚无上游修复的依赖告警及检查范围见[发布审计报告](https://github.com/Pls-1q43/Dibao/blob/main/docs/release-audit-v0.4.1.md)。

## v0.4.0

Release date: 2026-09-07

GitHub Release: [Dibao v0.4.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.0)

v0.4.0 让邸报可以带着一份文章副本离线阅读，也让读完一篇之后的下一步更自然：查看相关文章，或在点赞后发现更符合兴趣的内容。推荐列表翻页、断网恢复、插件权限和版本升级流程也得到加固。

### 离线阅读，由你决定何时切换

- **默认关闭，按客户端启用。** 在设置中打开离线阅读后，邸报会在联网时准备缓存。开关和数量目标只保存在当前浏览器或已安装的 PWA，不会通过账户同步到其他设备；在电脑上开启不会替手机开启。
- 自动保存已排序的未读推荐，**默认目标为 200 篇，可在 50–1,000 篇之间按 50 篇调整**。同时保留最多 200 篇稍后读副本、20 篇最近阅读副本。**200 篇仅是稍后读离线副本的上限，不是服务器稍后读列表的上限。** 这些集合会去重；实际可用数量受正文是否已取得、可用推荐及浏览器空间影响，目标不是下载保证。
- 网络中断或服务器不可达时，有缓存会提示你是否切换，而不是悄悄把在线列表换成缓存。进入后，离线横幅明确标识当前模式；状态灯可展开查看可用文章、快照时间、待同步或失败操作。联网后可从状态面板选择“退出离线模式”，完成连接检查和同步后恢复在线内容；网络恢复本身不会强制切换。重新打开应用会恢复此前选择的离线模式。
- 离线时可阅读已缓存正文，并记录收藏、喜欢、稍后读、已读和阅读进度等操作，重新连接后同步。同步失败可以重试；会话过期时需用同一账户重新登录以继续同步。关闭离线阅读、清除缓存或退出登录前，请先同步待处理操作，并留意丢失未同步操作的确认提示。
- PWA 更新会更完整地保留运行所需资源；跨标签退出登录及清理缓存时，旧的请求不能重新写回已撤销的图片缓存。

### 阅读器与推荐列表

- 正文下方可查看最多 **5 篇相关文章**，排除当前文章、与它同组的重复内容，以及已隐藏或标记为不感兴趣的文章。成功点赞后，还可看到结合个人推荐和当前文章主题的下一篇建议。
- “更多”会进入相关文章搜索，可分页并按文章状态筛选。默认从最多 500 个近邻结果中选取**相似度严格大于 0.35** 的内容，界面每页 50 篇。这个阈值只用于“更多”搜索，不能套用于下方 5 条预览；两处结果不一定完全相同。需要现有的活跃向量索引和当前文章向量；缺少条件时会提示不可用，不会为打开这个面板临时重算向量。离线模式不提供这些在线发现查询。
- 推荐翻页使用固定会话序列，减少后台重排序期间重复或漏过文章；离线翻页也不再因本地文章状态变化而跳过后续内容。已保存或打开的文章不会因滚动经过而被误当作“忽略”。
- 修复订阅源刷新可能停滞的问题，并降低升级时反复查询候选文章和全文检索的开销。升级耗时仍取决于数据规模与设备性能，不承诺固定完成时间。
- “设置 → 阅读”可控制滚动经过文章后是否自动忽略。相关文章不排除已读或已喜欢文章；个性化的“你可能还喜欢”会排除已读、已收藏和已喜欢文章。

### Sentry 诊断

错误与性能遥测默认开启，可在首次设置或设置页关闭。正式镜像包含服务端和浏览器 Sentry 配置，并在构建时上传浏览器 source maps、移除公开镜像中的 `.map` 文件。配置通过私有构建 secret 注入，不把访问 token 打包进运行镜像。发布验收检查上报与关闭后的抑制行为，只输出布尔结果和接收状态，不公开私有配置。

### 安全与使用限制

- 加固鉴权与写请求来源检查、静态资源/API 路径边界、插件桥接请求路径，以及受控出站请求的地址检查。停用插件不再提供其资源；HTML、SVG/XML 等插件资源统一受沙箱策略约束。
- 插件前端隔离不等于服务端插件沙箱。第三方服务端插件仍是可信本地代码，只安装你信任的插件。
- **除 localhost/回环地址外，可靠的 PWA 离线启动需要 HTTPS 安全上下文。** 直接通过 NAS 的 HTTP 局域网 IP 访问，不等同于具备离线 PWA 能力；请配置 HTTPS，并在准备好缓存后实际断网试读。
- 手机系统可能暂停后台页面、终止下载或回收浏览器存储，持久存储授权也不保证成功。准备缓存和同步时尽量保持应用在前台；出门前检查实际可用数量。图片尽力缓存，不保证全部图片、外链、视频或未取得的正文离线可用。首次安装尚未缓存时，不能凭空离线打开文章。
- 本机离线副本不是备份或跨设备云同步。清除站点数据、卸载 PWA 或系统回收空间都可能丢失缓存及未同步操作。

### 升级影响与迁移

从 **v0.3.1 到 v0.4.0** 新增一项 core SQLite migration：

- `027_recommendation_sessions.sql`：新增 `recommendation_sessions`、`recommendation_session_items` 及相关索引，用于保存稳定的推荐翻页序列。更早版本直接升级时，也会自动补齐此前尚未执行的迁移。

数据库迁移自动执行。对需要更新推荐数据的现有数据库，应用随后自动进入**阻塞式数据升级页面**，重放已有行为、重建兴趣画像与相关派生数据、重算符合条件的推荐文章，全部成功后清理旧推荐上下文并恢复正常界面。期间普通功能暂不可用；失败时保留错误状态，可从升级页面重试。不要删除升级标记来绕过这一步。

**本次升级不会重新计算 Embeddings，不需要为已有文章重新调用嵌入服务。** 派生数据升级复用已有向量；正常运行后新增文章的向量生成仍遵循你的 provider 设置。

### Docker 安装、备份与回滚

版本镜像：`ghcr.io/pls-1q43/dibao:v0.4.0`。新安装可使用 [中文 README 的 Compose 示例](/zh/quick-install/)。保留 `/data` 持久化挂载（例如 `./data:/data`）以及数据库路径 `/data/dibao.sqlite`，不要把数据留在容器可写层。

现有 Compose 安装先同步各客户端的离线操作，停止服务并备份整个数据目录，然后将 Compose 的 `image` 改为上述版本。以下命令适用于 `./data:/data`；使用命名 volume 或不同路径时，按实际挂载备份。

```bash
docker compose stop
tar czf "dibao-data-before-v0.4.0-$(date +%Y%m%d-%H%M%S).tgz" -C data .
# 将 compose.yaml 中的 image 改为 ghcr.io/pls-1q43/dibao:v0.4.0
docker compose pull
docker compose up -d
docker compose ps
```

不要在 SQLite 正在写入时只复制主 `.sqlite` 文件；停服后备份整个 `/data`，或使用 SQLite 一致性备份。默认 Docker 入口同时管理 HTTP 与 worker，沿用原有环境变量和挂载即可。

升级后必须分别验证：

1. `GET /api/system/health` 返回 `data.ok: true`、`data.version: "0.4.0"`。这只证明基本健康，**不证明数据升级完成**。
2. 登录后查看 `GET /api/system/upgrade/status`。现有数据的派生升级应最终返回 `data.id: "recommendation-contract"`、`data.state: "completed"`、`data.blocking: false`。全新空数据库可返回 `not_required` 且 `blocking: false`。数据库迁移期间此接口可能先返回 core migration 状态，请继续等到派生升级状态；确认升级页面退出且可正常阅读。

回滚时先停止 v0.4.0，保留失败现场，在干净的数据目录或新 volume 中恢复**升级前的完整备份**，再以原挂载路径启动之前的镜像（如 `ghcr.io/pls-1q43/dibao:v0.3.1`）。不要把旧备份覆盖到仍留有新 WAL 文件的目录，也不要直接让旧版本读取已升级的数据库。回滚会失去备份之后的新数据；服务器备份不包含各浏览器尚未同步的操作。

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
- 插件安装说明：[`docs/plugin-installation.zh-CN.md`](/zh/plugins/installation/)
- 插件开发指南：[`docs/plugin-development.zh-CN.md`](/zh/plugins/development/)

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
