---
title: Dibao Docs
description: Install, configure, back up, extend, and operate Dibao v0.3.1.
---

Dibao is a self-hosted, fair-code RSS recommendation reader for people who still want to own their sources. You choose the RSS / Atom feeds; Dibao ranks, searches, and explains articles only inside those feeds.

The current recommended release is `v0.3.1`. It carries the recommendation-algorithm and mechanism update from 0.3: recommendation v3 memory, inventory status, controlled fallback behavior, optional infinite loading, the official full-content selector plugin, and stronger Docker worker and controlled-fetch boundaries.

## Start Here

- [Quick Install](quick-install/): run `v0.3.1` with Docker Compose, create the owner login, and import OPML or add your first RSS / Atom feed.
- [Recommended Providers](providers/): choose Ollama, SiliconFlow, Gemini, or another OpenAI-compatible embedding provider.
- [Backup And Upgrade](backup-upgrade/): back up `./data`, upgrade the Docker image, and verify health and recommendation inventory.
- [Plugin Installation](plugins/installation/): install third-party `.dibao-plugin` files and review source, signature, and capabilities before enabling them.
- [Official Daily Brief Plugin](plugins/daily-brief/): generate a topic-grouped daily digest from personalized recommendations in the past 24 hours.
- [Official Webhook Plugin](plugins/webhook/): deliver article, refresh, ranking, and Daily Brief events to external HTTP endpoints.
- [Official Full Content Selectors Plugin](plugins/full-content/): enable 0.3 full-content fetching and selector-based extraction.
- [License FAQ](license/): understand BUSL-1.1, fair-code use, Change Dates, and commercial boundaries.

## Where Dibao Runs

Dibao fits Mac minis, NAS boxes, home servers, VPS instances, or any host that can keep Docker running. It can stay on your LAN or private VPN; it does not need to be public on the internet.

Dibao does not provide multi-user teams, official hosting, social following, comments, recommendations outside your subscriptions, cloud sync, or offline full-article archives. Full-content fetching is an explicit per-feed web-article enrichment feature, not an offline archive system.

## Your Data

Feeds, articles, states, behavior events, recommendation profile, embedding provider configuration, recommendation v3 memory, plugin packages, and index status live in SQLite and the persistent data directory. The default Compose file maps `/data` to local `./data` so backups and migrations stay understandable.
