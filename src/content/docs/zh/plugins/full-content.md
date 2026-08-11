---
title: 全文选择器官方插件
description: 使用 Dibao 0.3.1 的 Full Content Selectors 官方插件改善网页全文抓取。
---

Full Content Selectors 是 Dibao `0.3.0` 开始随官方 Docker 镜像携带的官方插件，插件 ID 为 `app.dibao.full-content-selectors`，当前随 `v0.3.1` 更新到 `0.1.1`。它提供 selector-based 的全文抓取器，在内置全文提取前优先尝试更适合常见博客正文结构的选择器。

## 适用场景

默认情况下，Dibao 使用 RSS / Atom feed 中提供的正文或摘要，不会请求每篇文章的网页 URL。只有当某个 Feed 显式设置为 `fetch_full_content` 时，后续刷新或当前 Feed 回溯才会请求网页全文。

全文选择器适合这些情况：

- Feed 只给摘要，但原文网页有完整正文。
- 站点正文常见 class 包括 `post-content`、`entry-content`、`article-content`、`markdown-body`、`prose`、`content`。
- 希望移除导航、页脚、脚本、iframe、SVG 等噪声，同时保留段落、标题、引用、列表和代码块。

## 启用步骤

1. 升级到 Dibao `v0.3.1`。
2. 打开 `设置` -> `插件`。
3. 找到官方插件 `全文选择器` / `Full Content Selectors`。
4. 启用插件。官方插件随镜像分发，不需要上传 `.dibao-plugin`。
5. 打开 `订阅源管理`，选择需要网页正文的 Feed。
6. 将全文模式从 `使用 Feed 内容（默认）` 改为 `抓取网页全文`。
7. 先使用 `预览全文抓取` 检查目标站点结果，再按需运行 `抓取当前 Feed 文章全文`。

## 工作方式

插件声明一个 `fullContentExtractors` contribution：

```json
{
  "id": "balanced-readable-selectors",
  "title": "平衡正文选择器",
  "order": 10
}
```

启用后，Dibao 抓取文章网页时会先下载 HTML，再把 `articleUrl`、`html` 和 `contentType` 传给已启用的 extractor。插件不会自行发起网络请求；它只处理宿主已下载的页面内容。若插件返回空结果、格式错误或正文过短，Dibao 会安全回退到内置提取器。

## 与 embedding 和推荐的关系

全文抓取成功后，Dibao 会更新文章有效正文和内容 hash。若 hash 变化，会入队 embedding regeneration 和 ranking recalculation。这个过程是后台任务，不会在打开文章或滚动时同步重算。

## 安全边界

- Feed 的全文抓取只在 `fetch_full_content` 模式下发生。
- 网页请求走受控 fetch，有超时、最大字节数和重定向处理。
- v0.3.1 允许 feed discovery / refresh 访问私有或内网地址，以支持 NAS、家庭网络和自建 RSS；插件出站请求和全文抓取仍保留独立的受控 fetch 边界。
- 如果站点对抓取不友好、返回非 HTML、正文太短或网络失败，Dibao 会保留 Feed 内容。

## 排查问题

- 预览显示 `feed_only`：确认该 Feed 的全文模式已经改为 `抓取网页全文`。
- 预览失败：检查原文 URL 是否可访问、是否返回 HTML、是否需要登录或阻止服务器请求。
- 抓取后推荐没有立即变化：等待 embedding 与 ranking 后台任务完成。
- 结果正文太短：该站点可能需要专门的第三方 extractor，或只能使用 Feed 内容。
