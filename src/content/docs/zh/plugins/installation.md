---
title: 插件安装
description: 安装、更新和持久化 Dibao 第三方插件。
---

第三方插件会在你的自托管服务器上运行代码。只安装可信来源提供的插件，并在启用前检查插件名称、发布者、权限和兼容性。

## 推荐方式：上传插件文件

1. 从插件开发者的发布页下载 `.dibao-plugin` 文件。
2. 如果开发者提供了 SHA-256，先在本机校验文件摘要。
3. 打开邸报设置页，进入 `插件` Tab。
4. 在 `安装第三方插件` 区域选择 `.dibao-plugin` 文件并点击 `安装`。
5. 安装完成后，第三方插件默认保持未启用。确认来源与权限后再启用。

## 高级方式：URL 或 JSON 包

Dibao 的插件 API 支持从插件包 URL 或插件包 JSON 安装。这些方式主要用于自动化部署、开发调试或开发者文档示例，不建议普通用户直接手填。

URL 安装需要插件开发者提供：

- 插件包下载地址，通常指向 `.dibao-plugin` 文件。
- SHA-256 摘要，建议提供。

JSON 包安装需要完整插件包 JSON，其中包含 `manifest` 和 `files`。如果你只是安装别人发布的插件，优先使用 `.dibao-plugin` 文件。

## Docker 升级后是否需要重装

通常不需要。只要 Docker 或 Docker Compose 正确挂载了 `/data` 持久化目录，第三方插件包、插件数据和 SQLite 中的插件记录会随数据目录保留。

持久化路径：

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite 表：`plugin_installs`、`plugin_capability_grants`、`plugin_settings`、`plugin_kv`、`plugin_migrations`、`plugin_update_checks`

## 更新插件

如果插件 manifest 提供了 `updateUrl`，插件页会显示 `检查更新`。Dibao 会先下载到暂存区，校验插件 ID、兼容性和 SHA-256，再替换旧包；失败时保留旧插件包。

如果插件没有提供 `updateUrl`，请从开发者发布页下载新版 `.dibao-plugin` 后重新上传安装。
