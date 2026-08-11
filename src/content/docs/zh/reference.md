---
title: 参考索引
description: Dibao 0.3 公开参考文档索引。
---

这部分承载从主项目 `docs/` 迁出的公开参考内容。当前文档站提供稳定入口与摘要，主项目仍保留完整工程参考源文件。

## 产品与设计

- Project brief：项目定位、非目标、数据所有权与长期方向。
- MVP PRD：首个公开版本的功能范围。
- Wireframes：早期信息架构和页面流。
- Design tokens：颜色、字体、间距和视觉约束。
- Visual interaction spec：阅读器、列表、解释与设置页交互规格。
- Article action interaction spec：收藏、稍后读、已读、不感兴趣等状态契约。

## 工程参考

- Engineering blueprint：第一版开发技术地图。
- Database schema：SQLite 表、索引、迁移和数据格式。
- API contract：HTTP API、请求响应结构和错误语义，包含 feed `fullContentMode`、全文预览和当前 Feed 回溯接口。
- Developer guide：0.3 分支、发布验证、迁移和插件 API 稳定层级。
- Runtime performance guidelines：前台热路径、独立 worker、SQLite busy、推荐分块和冷路径诊断原则。
- Profile algorithm v0：画像与排序参数表。
- Recommendation v0.3 plan / v2-v3 design：推荐 v3 memory、曝光、探索与 fallback 边界。
- Plugin system design：插件能力、安装、更新、Hook、UI slot 和官方插件清单。

## 发布与许可证

- License FAQ：BUSL-1.1 与 Change Date。
- Release process：正式发布、hotfix 和 Docker 镜像规则。
- Release notes：v0.3.1、v0.3.0、v0.2.1、v0.2.0 和历史版本。
