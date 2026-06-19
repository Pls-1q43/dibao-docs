---
title: Webhook 官方插件
description: 使用 Dibao 0.2.x 官方 Webhook 插件把文章、推荐、刷新和 Daily Brief 事件投递到外部 HTTP endpoint。
---

Webhook 是 Dibao `0.2.x` 开始随官方 Docker 镜像携带的官方插件，插件 ID 为 `app.dibao.webhook`。它可以监听 Dibao 内部事件，按你配置的规则渲染 URL、Query、Body 和 Header，然后把请求投递到外部 HTTP endpoint。

Webhook 适合把 Dibao 接到 n8n、Make、Zapier、自建脚本、聊天机器人、监控系统或归档服务。它不会替你创建公开入口；如果 Dibao 原本只在局域网或 VPN 内使用，不需要为了 Webhook 把 Dibao 暴露到公网。

## 启用插件

1. 升级到 Dibao `0.2.x`。
2. 打开 `设置`，进入 `插件` Tab。
3. 在官方插件列表中找到 `Webhook`。
4. 点击启用。启用后，设置页会出现 `Webhook` Tab。
5. 进入 `Webhook` Tab，新建规则并保存。

官方插件随镜像分发，不需要上传 `.dibao-plugin` 文件，也不能像第三方插件一样卸载。

## 规则如何工作

一条规则由这些部分组成：

| 字段 | 作用 |
| --- | --- |
| 名称 | 只用于你在插件 UI 中识别规则。 |
| 事件 | 规则监听的 Dibao 事件，例如 `article.actionRecorded`。 |
| 启用 | 关闭后规则会保留，但不会投递。 |
| 方法 | 支持 `POST` 和 `GET`。 |
| URL 模板 | 请求目标地址，可使用 `{{path}}` 模板。 |
| 条件 | 只有条件全部匹配时才投递。 |
| 静态 Headers | 普通 Header，可使用模板。不要把 token 写在这里。 |
| Secret Headers | 引用已保存的 secret，用于 `Authorization` 等敏感 Header。 |
| GET Query 模板 | `GET` 请求附加到 URL 的查询参数。 |
| POST Body 模板 | `POST` 请求发送的 JSON body。 |
| 发送全文 | 打开后，文章快照会包含全文字段。只对可信 endpoint 使用。 |

测试发送会使用示例事件立即创建一次投递，并立即 flush 这条投递，适合直接检查目标 endpoint、headers 和 body 是否正确。测试发送最多尝试 1 次；真实事件触发的投递默认最多尝试 5 次。

## 支持事件

Webhook 当前监听这些事件：

| 事件 | 典型用途 |
| --- | --- |
| `article.created` | 新文章入库后通知或归档。 |
| `article.updated` | 文章内容或状态更新后同步。 |
| `article.actionRecorded` | 收藏、稍后读、隐藏等阅读行为后触发自动化。 |
| `feed.refreshCompleted` | Feed 刷新完成后记录刷新结果。 |
| `ranking.afterRanked` | 推荐排序完成后通知外部系统。 |
| `settings.afterUpdated` | 设置变更后做运维提醒。 |
| `plugin.taskSucceeded` | 插件任务成功后联动。 |
| `plugin.taskFailed` | 插件任务失败后告警。 |
| `dailyBrief.generated` | Daily Brief 生成后推送或归档。 |

## 模板上下文

Webhook 会为每次事件生成一个上下文对象。常用路径：

| 路径 | 含义 |
| --- | --- |
| `pluginId` | 固定为 `app.dibao.webhook`。 |
| `ruleId` | 当前规则 ID。 |
| `eventName` | 当前事件名。 |
| `event` | 原始事件 payload。 |
| `event.articleId` | 事件关联的文章 ID，如果有。 |
| `event.action` | 阅读行为，例如 `favorite`。 |
| `article` | 文章快照，如果事件带有 `articleId`。 |
| `article.title` | 文章标题。 |
| `article.url` | 原文链接。 |
| `article.feed.title` | 文章所属 Feed 标题。 |
| `feed` | Feed 快照；没有文章时至少可能包含 `event.feedId`。 |
| `generatedAt` | Webhook 生成投递的时间戳。 |
| `test` | 测试发送时为 `true`。 |

`article.actionRecorded` 的 `event.action` 常见值包括：

```text
impression
open
mark_read
mark_unread
favorite
unfavorite
like
unlike
read_later
remove_read_later
hide
not_interested
read_progress
```

模板写法是 `{{path.to.value}}`。字符串中嵌入对象会被转成 JSON 字符串；如果整个字段就是一个模板，例如 `"{{article}}"`，则会保留对象值，适合放在 JSON body 中。

```json
{
  "eventName": "{{eventName}}",
  "title": "{{article.title}}",
  "article": "{{article}}",
  "generatedAt": "{{generatedAt}}"
}
```

## 条件

条件按上下文路径读取值。所有条件都满足时才会投递。

| 操作符 | 含义 |
| --- | --- |
| `exists` | 值存在且不是空字符串。 |
| `equals` | 字符串化后完全相等。 |
| `contains` | 字符串包含目标值；数组则要求包含同名项。 |

常用条件示例：

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" },
  { "path": "article.feed.title", "operator": "contains", "value": "Design" },
  { "path": "event.articleId", "operator": "exists", "value": "" }
]
```

## Secret Headers (`secretHeaders`)

如果 endpoint 需要鉴权，先在 Webhook UI 的 Secret 区域保存：

- Key: `webhook.token`
- Hint: `tok_...`
- Value: 真实 token

然后在 `Secret Headers` 中引用它：

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

Dibao 会在真正发送请求时把 secret 注入 Header。API 响应和投递记录只显示 metadata 或脱敏后的请求，不会明文返回 secret。敏感 Header 不要写进静态 Headers。

## 投递记录与重试

每次命中规则都会创建一条投递记录，最近 50 条会显示在 Webhook UI 中。状态包括：

- `queued`：已排队，等待后台任务发送。
- `running`：正在发送。
- `succeeded`：目标返回 `2xx`。
- `failed`：最终失败。
- `cancelled`：已取消。

目标返回 `2xx` 视为成功。`4xx` 通常表示配置或鉴权错误，会作为最终失败处理。`5xx` 和网络错误会按后台任务重试；普通事件最多 5 次，测试发送会立即 flush 且最多 1 次。

Webhook 会尽量用事件中的稳定字段生成 idempotency key，避免同一规则对同一事件重复创建投递。

## 用例

### 收藏文章后发到自动化工具

监听 `article.actionRecorded`，只在收藏时触发：

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" }
]
```

POST Body 模板：

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "action": "{{event.action}}",
  "title": "{{article.title}}",
  "url": "{{article.url}}",
  "feed": "{{article.feed.title}}",
  "article": "{{article}}"
}
```

URL 可以填 n8n、Make 或 Zapier 给你的 webhook endpoint。

### 新文章入库后通知

监听 `article.created`，把新文章发到自建通知服务：

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}",
  "url": "{{article.url}}",
  "feed": "{{article.feed.title}}"
}
```

如果使用 `GET`，可以把 Query 模板设为：

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}"
}
```

### Daily Brief 生成后推送

监听 `dailyBrief.generated`，把事件 payload 发到聊天机器人或归档脚本：

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "event": "{{event}}",
  "generatedAt": "{{generatedAt}}"
}
```

### Feed 刷新完成后打点

监听 `feed.refreshCompleted`，把刷新结果发到监控系统：

```json
{
  "eventName": "{{eventName}}",
  "feedId": "{{event.feedId}}",
  "articlesSeen": "{{event.articlesSeen}}",
  "articleIds": "{{event.articleIds}}",
  "refreshedAt": "{{event.refreshedAt}}"
}
```

### 只对特定来源触发

如果只想对某个 Feed 触发，给规则增加条件：

```json
[
  { "path": "article.feed.title", "operator": "equals", "value": "Example Feed" }
]
```

更稳定的方式是使用 `article.feed.id` 或 `event.feedId`。

### 需要鉴权的 endpoint

保存 `webhook.token` 后，把 `Secret Headers` 设置为：

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

静态 Headers 可以保留非敏感值：

```json
{
  "x-dibao-plugin": "webhook",
  "x-dibao-event": "{{eventName}}"
}
```

## 排查问题

- 没有投递记录：确认插件和规则都已启用，事件名正确，条件没有把事件过滤掉。
- 测试发送成功但真实事件没有触发：真实事件 payload 可能没有对应路径，先减少条件再观察。
- `failed` 且错误是 `HTTP 401` 或 `HTTP 403`：检查 Secret Key、Header 名、prefix 和目标服务权限。
- `failed` 且错误是 `HTTP 400`：目标 endpoint 可能不接受当前 Body 结构，先用更小的 JSON 模板测试。
- 看不到全文：确认规则勾选了“发送全文”。只把全文发送到你信任并可控的 endpoint。
