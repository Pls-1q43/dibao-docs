---
title: Dibao Docs
description: Dibao v0.4.1 desktop and Docker installation, offline reading, plugins, backups, and developer documentation.
---

Dibao is a source-available / fair-code personal RSS recommendation reader. You choose RSS / Atom feeds; Dibao ranks, searches, and explains recommendations within those feeds. Reading data stays on your computer or self-hosted instance.

The recommended release is `v0.4.1`, with standalone Windows and macOS apps alongside Docker, Web, and PWA. v0.4 adds offline reading, related articles, personalized suggestions after likes, and stable pagination. v0.4.1 adds desktop background operation, updates, backup and recovery, and improved setup.

## Start Here

- [Quick Installation](/en/quick-install/): choose Desktop or run v0.4.1 with Docker Compose.
- [Desktop](/en/desktop-install/): three installers, tray operation, updates, data folders, and recovery.
- [Offline Reading](/en/offline-reading/): prepare Web / PWA caches, switch modes, and sync actions.
- [Reading And Related Articles](/en/reading/): related search, next-read suggestions, and article states.
- [Providers](/en/providers/): optionally connect local Ollama or an external embedding service.
- [Backup And Upgrades](/en/backup-upgrade/): preserve complete data and verify upgrade completion.
- [Plugin Installation](/en/plugins/installation/): enable official plugins or install trusted third-party ones.
- [Daily Brief](/en/plugins/daily-brief/), [Webhook](/en/plugins/webhook/), and [Full Content Selectors](/en/plugins/full-content/): bundled with official Desktop and Docker distributions, without package uploads.
- [Release Notes](/en/release-notes/): v0.4.1, v0.4.0, and older releases.
- [License FAQ](/en/license/): BUSL-1.1, Change Date, and commercial licensing.

## Choose A Deployment

Desktop runs directly on Windows or Mac without deploying a server. Docker suits a NAS, home server, or VPS accessed through Web / PWA. A LAN or private VPN is sufficient; offline PWA startup requires a secure context.

Desktop databases and Docker instances are independent. Cross-deployment imports, remote-instance connections, and multi-device sync are not supported. Dibao does not provide team collaboration, official hosting, social following, or recommendations outside your feeds.

## Your Data

Feeds, articles, behavior, interest profiles, vectors, plugin data, and keys stay in your persistent data directory. Docker defaults to `./data:/data`; Desktop stores data separately from its installation. Browser offline copies are client caches, not complete backups.
