---
title: Official Webhook Plugin
description: Use the official Dibao 0.2.x Webhook plugin to deliver article, ranking, refresh, and Daily Brief events to external HTTP endpoints.
---

Webhook is an official plugin bundled with Dibao `0.2.x` Docker images. Its plugin ID is `app.dibao.webhook`. It listens to Dibao events, renders a URL, query, body, and headers from your rule, then delivers an HTTP request to an external endpoint.

Use Webhook to connect Dibao to n8n, Make, Zapier, your own scripts, chat bots, monitoring systems, or archive services. It does not create a public Dibao endpoint. If your Dibao instance normally stays on a LAN or private VPN, you do not need to expose Dibao to the internet just to use outgoing webhooks.

## Enable The Plugin

1. Upgrade to Dibao `0.2.x`.
2. Open `Settings` and go to the `Plugins` tab.
3. Find the official `Webhook` plugin.
4. Enable it. A `Webhook` settings tab will appear.
5. Open the `Webhook` tab, create a rule, and save it.

Official plugins are bundled with the image. You do not upload a `.dibao-plugin` file, and official plugins cannot be uninstalled like third-party plugins.

## How Rules Work

A rule has these parts:

| Field | Purpose |
| --- | --- |
| Name | Only helps you recognize the rule in the plugin UI. |
| Event | The Dibao event to listen for, such as `article.actionRecorded`. |
| Enabled | Disabled rules are kept but do not deliver requests. |
| Method | Supports `POST` and `GET`. |
| URL template | Target URL. Supports `{{path}}` templates. |
| Conditions | Delivery runs only when all conditions match. |
| Static Headers | Non-sensitive headers. Templates are supported. Do not put tokens here. |
| Secret Headers | References saved secrets for sensitive headers such as `Authorization`. |
| GET Query template | Query parameters appended to the URL for `GET` requests. |
| POST Body template | JSON body sent for `POST` requests. |
| Include content | Adds full article content to the article snapshot. Use only for trusted endpoints. |

Test delivery creates one delivery immediately with a sample event and only tries once. Real event delivery uses up to 5 attempts by default.

## Supported Events

Webhook currently listens to:

| Event | Common use |
| --- | --- |
| `article.created` | Notify or archive after a new article is saved. |
| `article.updated` | Sync after article content or metadata changes. |
| `article.actionRecorded` | Trigger automation after favorite, read-later, hide, or similar actions. |
| `feed.refreshCompleted` | Record feed refresh results. |
| `ranking.afterRanked` | Notify an external system after ranking completes. |
| `settings.afterUpdated` | Send an operations note after settings change. |
| `plugin.taskSucceeded` | Chain work after a plugin task succeeds. |
| `plugin.taskFailed` | Alert after a plugin task fails. |
| `dailyBrief.generated` | Push or archive a generated Daily Brief. |

## Template Context

Webhook creates a context object for each event. Useful paths:

| Path | Meaning |
| --- | --- |
| `pluginId` | Always `app.dibao.webhook`. |
| `ruleId` | Current rule ID. |
| `eventName` | Current event name. |
| `event` | Raw event payload. |
| `event.articleId` | Related article ID, when present. |
| `event.action` | Reader action, such as `favorite`. |
| `article` | Article snapshot when the event includes `articleId`. |
| `article.title` | Article title. |
| `article.url` | Original article URL. |
| `article.feed.title` | Feed title for the article. |
| `feed` | Feed snapshot; without an article it may only include `event.feedId`. |
| `generatedAt` | Timestamp when the webhook delivery was generated. |
| `test` | `true` for test delivery. |

Use `{{path.to.value}}` in templates. If you embed an object inside a larger string, it becomes a JSON string. If the entire field is exactly one template, for example `"{{article}}"`, the object value is preserved, which is useful in JSON bodies.

```json
{
  "eventName": "{{eventName}}",
  "title": "{{article.title}}",
  "article": "{{article}}",
  "generatedAt": "{{generatedAt}}"
}
```

## Conditions

Conditions read values from the context. All conditions must match before delivery runs.

| Operator | Meaning |
| --- | --- |
| `exists` | The value exists and is not an empty string. |
| `equals` | Stringified values are exactly equal. |
| `contains` | A string contains the target value, or an array contains the item. |

Common examples:

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" },
  { "path": "article.feed.title", "operator": "contains", "value": "Design" },
  { "path": "event.articleId", "operator": "exists", "value": "" }
]
```

## Secret Headers (`secretHeaders`)

If your endpoint needs authentication, save a secret first:

- Key: `webhook.token`
- Hint: `tok_...`
- Value: the real token

Then reference it in `Secret Headers`:

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

Dibao injects the secret only when sending the request. API responses and delivery records show metadata or redacted requests; they do not return the secret value. Do not put sensitive headers in Static Headers.

## Deliveries And Retries

Every matching rule creates a delivery record. The latest 50 deliveries are shown in the Webhook UI. Statuses are:

- `queued`: waiting for the background job.
- `running`: currently sending.
- `succeeded`: the endpoint returned `2xx`.
- `failed`: final failure.
- `cancelled`: cancelled.

`2xx` is success. `4xx` usually means a configuration or authentication problem and is treated as final failure. `5xx` and network errors can be retried by the background job. Real event delivery tries up to 5 times; test delivery tries once.

Webhook uses stable event fields when possible to create an idempotency key, reducing duplicate deliveries for the same rule and event.

## Use Cases

### Send Favorite Articles To Automation

Listen to `article.actionRecorded` and only trigger on favorites:

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" }
]
```

POST Body template:

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

Use the webhook endpoint provided by n8n, Make, or Zapier as the URL.

### Notify When A New Article Arrives

Listen to `article.created` and send the new article to your own notification service:

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}",
  "url": "{{article.url}}",
  "feed": "{{article.feed.title}}"
}
```

For `GET`, use a Query template:

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}"
}
```

### Push A Generated Daily Brief

Listen to `dailyBrief.generated` and send the event payload to a chat bot or archive script:

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "event": "{{event}}",
  "generatedAt": "{{generatedAt}}"
}
```

### Track Feed Refreshes

Listen to `feed.refreshCompleted` and send refresh results to a monitoring system:

```json
{
  "eventName": "{{eventName}}",
  "feedId": "{{event.feedId}}",
  "articlesSeen": "{{event.articlesSeen}}",
  "articleIds": "{{event.articleIds}}",
  "refreshedAt": "{{event.refreshedAt}}"
}
```

### Trigger Only For One Source

To limit a rule to one feed, add a condition:

```json
[
  { "path": "article.feed.title", "operator": "equals", "value": "Example Feed" }
]
```

Using `article.feed.id` or `event.feedId` is more stable than matching the title.

### Authenticate The Endpoint

After saving `webhook.token`, set `Secret Headers` to:

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

Static Headers can still carry non-sensitive values:

```json
{
  "x-dibao-plugin": "webhook",
  "x-dibao-event": "{{eventName}}"
}
```

## Troubleshooting

- No delivery records: make sure the plugin and rule are enabled, the event is correct, and conditions are not filtering everything.
- Test delivery succeeds but real events do not trigger: the real payload may not include the path used by your condition. Remove conditions temporarily and observe again.
- `failed` with `HTTP 401` or `HTTP 403`: check the secret key, header name, prefix, and target service permissions.
- `failed` with `HTTP 400`: the endpoint may reject your body shape. Test with a smaller JSON body first.
- Full content is missing: enable `Include content` on the rule. Only send full content to endpoints you trust and control.
