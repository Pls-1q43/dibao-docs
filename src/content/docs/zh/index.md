---
title: 邸报文档
description: Dibao v0.4.1 桌面版与 Docker 安装、离线阅读、插件、备份升级和开发者文档。
---

邸报 Dibao 是 source-available / fair-code 的个人 RSS 推荐阅读器。你选择 RSS / Atom 信源，邸报在这些信源内部排序、搜索并解释推荐原因，阅读数据保存在你的电脑或自托管实例。

当前推荐版本是 `v0.4.1`，提供 Windows 与 macOS 独立桌面版，也保留 Docker、网页和 PWA。v0.4 带来离线阅读、相关文章、点赞后的个性化建议及更稳定的翻页；v0.4.1 新增桌面后台运行、更新、备份恢复及首次设置改进。

## 快速入口

- [快速安装](/zh/quick-install/)：选择桌面版，或用 Docker Compose 启动 v0.4.1。
- [桌面版](/zh/desktop-install/)：三种安装包、托盘、更新、数据目录和恢复。
- [离线阅读](/zh/offline-reading/)：准备网页 / PWA 缓存，切换模式并同步操作。
- [阅读与相关文章](/zh/reading/)：相关文章、“更多”搜索、点赞建议和文章状态。
- [推荐 Provider](/zh/providers/)：按需接入本地 Ollama 或外部 embedding 服务。
- [备份与升级](/zh/backup-upgrade/)：完整保存数据，升级并确认数据处理完成。
- [插件安装](/zh/plugins/installation/)：启用官方插件，或安装受信任的第三方插件。
- [每日简报](/zh/plugins/daily-brief/)、[Webhook](/zh/plugins/webhook/)、[全文选择器](/zh/plugins/full-content/)：随官方桌面版与 Docker 分发，无需上传安装包。
- [发布说明](/zh/release-notes/)：v0.4.1、v0.4.0 与历史版本。
- [许可证 FAQ](/zh/license/)：BUSL-1.1、Change Date 和商业授权边界。

## 选择运行方式

桌面版适合直接在 Windows 或 Mac 上个人使用，不用部署服务器。Docker 适合 NAS、家用服务器或 VPS，可供网页 / PWA 访问；局域网或私有 VPN 即可使用，PWA 离线启动需要安全上下文。

桌面数据库与 Docker 实例独立，暂不支持跨部署导入、远程实例连接或多端同步；也不提供多用户团队协作、官方托管、社交关注或订阅源之外的内容推荐。

## 数据属于你

订阅源、文章、阅读行为、兴趣画像、向量、插件数据及密钥保存在本机持久化目录。Docker 默认挂载 `./data:/data`；桌面版的数据目录独立于应用安装目录。浏览器离线副本只是设备缓存，不代替完整备份。
