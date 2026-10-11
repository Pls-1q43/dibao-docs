---
title: 插件安装
description: 安装、更新、签名验证和持久化 Dibao 0.4 第三方插件。
---

Last updated: 2026-10-11

本文面向安装第三方插件的邸报管理员。0.4 插件会在独立 Node host 进程中运行，并使用 sandboxed iframe 展示 Web UI；但第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱。只安装你信任的来源。

## v0.4.1 兼容与桌面版

Daily Brief、Webhook 和 Full Content Selectors 的内置版本仍为 `0.1.1`，兼容上限现为 `<0.5.0`，随官方桌面版和 Docker 分发。旧第三方插件若声明 `<0.4.0`，升级后会显示 `incompatible`；需由作者验证后发布兼容版本。

桌面备份包含插件包、数据和密钥。不要只拷贝 `.dibao-plugin` 当作数据备份。网页 / PWA 离线缓存不运行插件服务端接口；桌面断网后出站请求和 Webhook 投递仍依赖网络。

## 官方插件与第三方插件

Dibao 0.4.1 随官方 Docker 镜像携带 [Daily Brief](/zh/plugins/daily-brief/)、[Webhook](/zh/plugins/webhook/) 和 [Full Content Selectors](/zh/plugins/full-content/)。官方插件不需要上传 .dibao-plugin，也不能像第三方插件一样卸载；打开设置页的 插件 Tab，找到官方插件并启用即可。本页后续安装步骤只适用于第三方插件。

## 安装前检查

- 来源：开发者、发布页、版本号和更新记录是否可信。
- 签名：优先安装已签名包，并确认 keyId 对应的公钥已加入 trusted keys。
- capabilities：确认插件请求的能力与功能相符。
- API 稳定层级：Stable API 适合长期依赖；Beta API 可能在 0.4.x 调整。
- 服务端代码风险：插件启用后会执行 server entry。

## 推荐方式：上传 `.dibao-plugin`

1. 从开发者发布页下载 `.dibao-plugin`。
2. 如提供 SHA-256，先在本机校验。
3. 打开「设置」->「插件」。
4. 上传插件文件并点击「安装」。
5. 安装后插件默认保持未启用。启用前检查来源、签名信任、capabilities、Stable/Beta API 和 lastError。

## trusted keys

邸报使用 Ed25519 签名。管理员需要通过环境或部署配置提供 trusted public keys。未被信任的签名包会被拒绝；篡改包会验证失败。不要从聊天记录或不可信网页复制私钥。

## 高级安装：URL 或 JSON

自动化部署可调用：

- [`POST /api/plugins/install`](/zh/reference/#plugin-install)
- [`POST /api/plugins/install/upload`](/zh/reference/#plugin-install-upload)

URL metadata 建议包含：

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

## Docker 持久化

只要 Docker/Compose 正确挂载 `/data`，插件包和数据会随升级保留：

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite 表：`plugin_installs`、`plugin_capability_grants`、`plugin_settings`、`plugin_kv`、`plugin_migrations`、`plugin_update_checks`、`plugin_secrets`、`plugin_deliveries`

官方 Daily Brief、Webhook 和 Full Content Selectors 随 0.4.1 镜像扫描；第三方插件保存在数据卷中。

## 更新和回滚

如果插件有 `updateUrl`，插件页可以检查更新。邸报会 staging 下载、校验 ID/兼容范围/checksum，然后替换旧包；失败时保留旧包。

回滚方式：

- 重新上传旧版 `.dibao-plugin`。
- 若新版本启用失败，插件会进入 `failed`，旧数据仍保留。
- 不兼容插件会进入 `incompatible`，等待更新插件或升级邸报。

## 卸载

卸载第三方插件时可选择是否删除插件数据。保留数据便于将来重装或回滚；删除数据会移除插件安装记录、settings、KV、secrets、deliveries 和 migrations 记录。
