---
title: 插件开发
description: Dibao 插件开发入口与兼容性约定。
---

插件开发文档面向需要扩展 Dibao 的开发者。Dibao 插件通过 manifest 声明能力、贡献点、任务、设置项和兼容版本，不应通过 DOM patch 或 CSS selector 注入 UI。

## 基本约定

- 插件包使用 `.dibao-plugin` 分发。
- manifest 必须声明插件 ID、版本、发布者、能力和兼容范围。
- 第三方插件安装后默认不启用，启用前需要用户确认。
- 插件数据应写入 `/data/plugins/data/<plugin-id>` 或文档化的插件存储接口。
- 插件更新应提供 update metadata、包地址和 checksum。

## 开发者参考

当前插件开发参考以中文和英文维护，日文页面提供产品级说明。实现时请以 `plugin-development.zh-CN.md`、`plugin-development.en-US.md` 和 API contract 的插件接口为准。

首批 docs 站把插件开发入口独立出来，后续应继续把 manifest v1 字段、capability 名称、Hook 名称、UI slot 和打包格式整理成稳定页面。
