---
title: 每日简报官方插件
description: 使用 Dibao 0.3.1 官方 Daily Brief 插件生成按主题分组的每日推荐简报。
---

Daily Brief 是 Dibao 随官方 Docker 镜像携带的官方插件，插件 ID 为 `app.dibao.daily-brief`，当前随 `v0.3.1` 分发的插件版本为 `0.1.1`。它每天从过去 24 小时的个性化推荐结果中挑选文章，按兴趣主题分组，生成一份可回看的每日简报。

## 启用入口

1. 升级到 Dibao `v0.3.1`。
2. 打开 `设置` -> `插件`。
3. 找到官方插件 `每日简报` / `Daily Brief`。
4. 启用插件。启用后，主导航会出现 `每日简报` 页面，设置页会出现 `每日简报` Tab。

官方插件随镜像分发，不需要上传 `.dibao-plugin` 文件，也不能像第三方插件一样卸载。新实例的可选设置流程中也会展示 Daily Brief，默认建议启用。

## 它会生成什么

每日简报会读取过去 24 小时内已经完成排序的个性化推荐 winners，并生成：

- 简报生成时间、覆盖窗口、时区和文章数量。
- 按推荐主题 family 分组的文章列表。
- 每篇文章的标题、原文 URL、Feed、发布时间、推荐分数、推荐理由和可读摘要。
- 如果文章属于更细的 cluster，会在文章条目中保留 cluster 标签。
- 如果没有符合设置的文章，简报会显示空状态，原因是 `no_articles_for_settings`。

简报不是全量 RSS 日报，也不是离线全文归档。它只从已经进入 Dibao 推荐排序结果的文章里挑选，所以 Provider、embedding、ranking 和后台 worker 的状态会影响内容质量。

## 设置项

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| 启用 | `true` | 关闭后保留设置和历史简报，但不再按计划生成。 |
| 生成时间 | `08:00` | 每天本地时间触发 `dailyBrief.generate`。 |
| 时区 | `UTC` | 建议改成你的日常时区，例如 `Asia/Shanghai`。 |
| 文章数量 | `20` | 可设置为 5 到 50。插件会先读取更多候选，再做主题分散。 |
| 排除主题 | 空 | 可排除不想出现在简报里的 family 或 cluster。 |

保存设置后，插件会同步后台日程。你也可以在 Daily Brief 页面手动生成或重新生成当天简报。

## 生成语义

- 定时任务 ID 是 `dailyBrief.generate`，由 Dibao 的插件任务系统调度。
- 插件会按当前时区把一天映射成 `brief:YYYY-MM-DD`。
- 同一天已有简报时，普通生成会复用缓存；手动强制生成会覆盖当天内容。
- 插件最多保留最近 30 份简报。
- 摘要会从文章 summary 中清理 HTML、脚本和样式，并截断到 280 字符以内。
- 简报会保存当时的文章快照；之后原文章被删除或标题改变，历史简报仍尽量保持可读。

## 推荐质量依赖

Daily Brief 依赖 `ranking.listRankedWinners`，因此建议先完成：

1. 配置可用的 embedding Provider。
2. 刷新订阅源，让新文章入库。
3. 等待 embedding、ranking 和推荐库存后台任务完成。
4. 在推荐页确认有足够的推荐文章。

如果你刚安装 Dibao 或刚导入 OPML，第一份简报可能为空。等后台任务跑完后再手动生成一次即可。

## 主题过滤

插件会读取推荐系统中的 topic targets。你可以在设置里排除：

- family：较大的兴趣主题，例如某类来源或主题族。
- cluster：更细的主题簇，例如某个 family 下的具体兴趣点。

排除只影响之后生成的简报。已经生成的历史简报会保留当时的文章快照，但主题标签会尽量跟随你后来手动重命名的 family / cluster 显示。

## 与 Webhook 联动

Daily Brief 生成后会触发 `dailyBrief.generated` 事件。你可以在 [Webhook 官方插件](/zh/plugins/webhook/) 中监听这个事件，把简报生成通知发送到聊天机器人、归档脚本或自动化工具。

示例 Webhook Body：

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "brief": "{{event.brief}}",
  "generatedAt": "{{generatedAt}}"
}
```

## 排查问题

- 主导航没有 Daily Brief：确认官方插件已在 `设置` -> `插件` 中启用。
- 今日简报为空：检查 Provider、embedding、ranking、推荐库存和过去 24 小时是否有新文章。
- 定时没有按本地时间触发：检查 Daily Brief 设置里的 timezone 和 scheduled local time。
- 文章太少或主题重复：增加订阅源活跃度，或减少排除主题；插件会尽量按 family 分散，但受候选池限制。
- 想重新生成当天简报：在 Daily Brief 页面使用手动生成 / 强制生成。
