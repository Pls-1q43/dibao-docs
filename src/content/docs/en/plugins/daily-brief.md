---
title: Official Daily Brief Plugin
description: Use the official Dibao 0.3.1 Daily Brief plugin to generate topic-grouped daily recommendation digests.
---

Daily Brief is an official plugin bundled with Dibao Docker images. Its plugin ID is `app.dibao.daily-brief`, and the version bundled with `v0.3.1` is `0.1.1`. It selects articles from personalized recommendations in the past 24 hours, groups them by interest topic, and stores a daily digest you can revisit later.

## Enable It

1. Upgrade to Dibao `v0.3.1`.
2. Open `Settings` -> `Plugins`.
3. Find the official `Daily Brief` plugin.
4. Enable it. A `Daily Brief` page appears in the main navigation, and a `Daily Brief` settings tab appears in Settings.

Official plugins ship with the image. You do not upload a `.dibao-plugin` file, and official plugins cannot be uninstalled like third-party plugins. New instances also show Daily Brief in the optional setup flow, where it is recommended by default.

## What It Generates

Daily Brief reads ranked personalized winners from the past 24 hours and generates:

- Generation time, covered window, timezone, and article count.
- Articles grouped by recommendation topic family.
- Title, original URL, feed, published time, ranking score, recommendation reason, and readable summary for each article.
- Cluster labels on article entries when a more specific cluster is available.
- An empty state with `no_articles_for_settings` when no article matches the current settings.

It is not a complete RSS newsletter and not an offline full-article archive. It only selects from articles that have entered Dibao's recommendation ranking, so provider, embedding, ranking, and worker health affect the result.

## Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Enabled | `true` | Disabling keeps settings and history but stops scheduled generation. |
| Scheduled time | `08:00` | Runs the `dailyBrief.generate` task once per day at local time. |
| Timezone | `UTC` | Set this to your normal timezone, for example `Asia/Shanghai`. |
| Article count | `20` | Accepts 5 to 50. The plugin reads more candidates first, then diversifies by topic. |
| Excluded topics | Empty | Exclude topic families or clusters you do not want in the brief. |

Saving settings syncs the background schedule. You can also manually generate or regenerate today's brief from the Daily Brief page.

## Generation Semantics

- The scheduled task ID is `dailyBrief.generate`.
- The plugin maps each day to `brief:YYYY-MM-DD` in the configured timezone.
- If today's brief already exists, a normal generation reuses the cached brief; a forced manual generation replaces today's brief.
- The plugin keeps the latest 30 briefs.
- Article summaries are cleaned from HTML, scripts, and styles, then truncated to 280 characters.
- A brief stores article snapshots from generation time; historical briefs stay readable even if the source article later changes or is deleted.

## Recommendation Dependencies

Daily Brief depends on `ranking.listRankedWinners`, so the best flow is:

1. Configure a working embedding provider.
2. Refresh feeds so new articles are discovered.
3. Wait for embedding, ranking, and recommendation inventory jobs to complete.
4. Confirm the recommendation view has enough articles.

If you just installed Dibao or imported OPML, the first brief may be empty. Wait for the background jobs and generate again.

## Topic Filtering

The plugin reads topic targets from the recommendation system. You can exclude:

- Family: a broader interest topic, often representing a source or theme family.
- Cluster: a more specific topic inside a family.

Exclusions affect future briefs. Existing briefs keep their article snapshots, but family and cluster labels are rehydrated when you rename topics manually.

## Webhook Integration

After a brief is generated, Dibao emits the `dailyBrief.generated` event. Use the [official Webhook plugin](/en/plugins/webhook/) to send that event to a chat bot, archive script, or automation workflow.

Example Webhook body:

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "brief": "{{event.brief}}",
  "generatedAt": "{{generatedAt}}"
}
```

## Troubleshooting

- Daily Brief is missing from navigation: make sure the official plugin is enabled in `Settings` -> `Plugins`.
- Today's brief is empty: check provider, embedding, ranking, recommendation inventory, and whether any article arrived in the past 24 hours.
- Scheduled generation uses the wrong local time: check the timezone and scheduled local time in Daily Brief settings.
- Too few articles or repeated topics: increase active feed coverage or remove exclusions. The plugin diversifies by family, but it is limited by the candidate pool.
- Need to rebuild today's brief: use manual / forced generation from the Daily Brief page.
