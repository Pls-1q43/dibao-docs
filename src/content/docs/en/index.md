---
title: Dibao Docs
description: Install, configure, back up, extend, and operate Dibao.
---

Dibao is a self-hosted, fair-code RSS recommendation reader for people who still want to own their sources. You choose the RSS / Atom feeds; Dibao ranks, searches, and explains articles only inside those feeds.

## Start Here

- [Quick Install](quick-install/): run Dibao with Docker Compose, create the owner login, and import OPML or add your first RSS / Atom feed.
- [Recommended Providers](providers/): choose Ollama, SiliconFlow, Gemini, or another OpenAI-compatible embedding provider.
- [Backup And Upgrade](backup-upgrade/): back up `./data`, upgrade the Docker image, and verify the instance.
- [Plugin Installation](plugins/installation/): upload third-party `.dibao-plugin` files and review permissions before enabling them.
- [Official Webhook Plugin](plugins/webhook/): deliver article, refresh, ranking, and Daily Brief events to external HTTP endpoints in Dibao `0.2.x`.
- [License FAQ](license/): understand BUSL-1.1, fair-code use, Change Dates, and commercial boundaries.

## Where Dibao Runs

Dibao fits Mac minis, NAS boxes, home servers, VPS instances, or any host that can keep Docker running. It can stay on your LAN or private VPN; it does not need to be public on the internet.

Dibao does not provide multi-user teams, official hosting, social following, comments, recommendations outside your subscriptions, cloud sync, or offline full-article storage.

## Your Data

Feeds, articles, states, behavior events, recommendation profile, embedding provider configuration, and index status live in SQLite and the persistent data directory. The default Compose file maps `/data` to local `./data` so backups and migrations stay understandable.
