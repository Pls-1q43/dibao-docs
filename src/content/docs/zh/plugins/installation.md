---
title: 插件安装
description: 安装、更新、签名验证和持久化 Dibao 0.2 第三方插件。
---

本文面向安装第三方插件的 Dibao 管理员。Dibao `0.2.x` 中，服务端插件运行在独立 Node host 子进程中，Web 插件运行在 sandboxed iframe 中；但第三方服务端插件仍是可信本地代码，不是任意恶意代码沙箱。只安装你信任的来源。

## 官方插件与第三方插件

Dibao `0.2.x` 会随官方 Docker 镜像携带部分官方插件，例如 [Webhook](webhook/) 和 Daily Brief。官方插件不需要上传 `.dibao-plugin` 文件，也不能像第三方插件一样卸载；打开设置页的 `插件` Tab，找到官方插件并启用即可。

本页后续步骤只适用于第三方插件。开发插件请阅读 [插件开发](development/)。

## 安装前检查

- 来源：开发者、发布页、版本号和更新记录是否可信。
- 签名：第三方插件包必须带 Ed25519 签名，且 `keyId` 对应的公钥已加入 trusted keys。
- SHA-256：如果发布页提供 checksum，先在本机校验包文件。
- Capabilities：确认插件请求的能力与功能相符。
- API 稳定层级：Stable API 适合长期依赖；Beta API 可能在 `0.2.x` 调整。
- 服务端代码风险：插件启用后会执行 server entry。

## 启用第三方插件安装

为了避免误装，用户安装第三方插件默认关闭。需要安装第三方插件时，管理员应在部署配置中显式启用：

```text
DIBAO_ENABLE_UNTRUSTED_PLUGINS=true
```

官方插件不受这个开关影响。

## Trusted Keys

Dibao 使用 Ed25519 签名。管理员通过部署配置提供 trusted public keys；签名包的 `keyId` 必须能匹配到 trusted key。未知 key、缺失签名或被篡改的包会被拒绝。

不要从聊天记录或不可信网页复制私钥。发布方应提供公钥、`keyId`、包文件和 SHA-256；管理员只把确认可信的公钥加入部署配置。

## 推荐方式：上传 `.dibao-plugin`

1. 从开发者发布页下载 `.dibao-plugin`。
2. 如提供 SHA-256，先在本机校验。
3. 确认部署已经配置 `DIBAO_ENABLE_UNTRUSTED_PLUGINS=true` 和 trusted keys。
4. 打开 `设置` -> `插件`。
5. 上传插件文件并点击 `安装`。
6. 安装后插件默认保持未启用。启用前检查来源、签名信任、capabilities、Stable/Beta API 和 `lastError`。

## 高级安装：URL 或 JSON

自动化部署可调用插件安装 API：

```text
POST /api/plugins/install
POST /api/plugins/install/upload
```

URL update metadata 建议包含：

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

URL 安装同样会校验 ID、SHA-256、签名和 trusted key。

## Docker 持久化

只要 Docker/Compose 正确挂载 `/data`，插件包和数据会随升级保留：

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite 表：`plugin_installs`、`plugin_capability_grants`、`plugin_settings`、`plugin_kv`、`plugin_migrations`、`plugin_update_checks`、`plugin_secrets`、`plugin_deliveries`、`plugin_delivery_attempts`

官方 Daily Brief 和 Webhook 随镜像扫描；第三方插件保存在数据卷中。

## 更新和回滚

如果插件有 `updateUrl`，插件页可以检查更新。Dibao 会下载到 staging，校验 ID、兼容范围、checksum 和签名，然后替换旧包；失败时保留旧包。

回滚方式：

- 重新上传旧版 `.dibao-plugin`。
- 若新版本启用失败，插件会进入 `failed`，旧数据仍保留。
- 不兼容插件会进入 `incompatible`，等待更新插件或升级 Dibao。

## 卸载

卸载第三方插件时可选择是否删除插件数据。保留数据便于将来重装或回滚；删除数据会移除插件安装记录、settings、KV、secrets、deliveries 和 migrations 记录。
