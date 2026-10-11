---
title: Web And PWA Offline Reading
description: Prepare Dibao article caches, switch modes explicitly, sync actions, and troubleshoot offline PWA startup.
---

Web and PWA offline copies are available from `v0.4.0`; use `v0.4.1` for current installations. Offline reading is off by default and must be enabled separately in each browser or PWA. Settings and cached files do not sync across devices.

[Desktop](/en/desktop-install/) reads its local database directly. The cache limits and switching workflow below apply to Web and PWA.

## Prepare Before Leaving

1. Sign in while connected and enable offline reading in Settings.
2. Set the recommendation target and keep the app in the foreground while it prepares.
3. Open the list's status light to check the available count, snapshot time, and pending actions.
4. Disconnect and test reopening the app and an article body.

Outside `localhost` or loopback, reliable offline PWA startup requires HTTPS. Opening a NAS at a plain HTTP LAN address is not equivalent to an offline-capable PWA; configure HTTPS first.

## Saved Articles

| Collection | Count | Meaning |
| --- | --- | --- |
| Ranked unread recommendations | Default 200; 50–1,000 in steps of 50 | Prepared from ranked inventory, without browser-side reranking. |
| Read later | Up to 200 copies | Limits offline copies only, not the server's read-later list. |
| Recently opened | Up to 20 copies | Articles shared with other collections keep one body copy. |

An article counts as available only when its title and body can be read. Images are best-effort; videos, external links, all images, and unfetched bodies are not guaranteed. Bodies, recommendation inventory, and storage determine the actual count. The target is not a download guarantee.

Recommendations, Read later, Favorites, Latest, and feed filters reuse the existing interface, but offline results cover only cached articles, not the complete server library.

## Enter And Exit Offline Mode

When the network or server becomes unavailable, Dibao asks whether to switch if a cache exists. The offline mode is clearly identified and your selection is retained when reopening the app.

Connectivity alone does not force a return online. Open the list's status light and choose Exit offline mode to check the connection and sync actions before returning to online results. On mobile, return from the reader to the list to find this control.

## Actions And Sync

Favorites, likes, read-later changes, read status, and reading progress can be recorded offline. After reconnecting, actions sync before article states and snapshots refresh. Failed actions can be retried. If the session expires, sign in with the same account to continue.

Sync pending actions before disabling offline reading, clearing caches, or signing out. Cleanup warns about losing unsynced actions. Clearing local copies does not delete server article states.

Offline mode does not provide full-text search, related articles, personalized next-read discovery, feed refresh, original-page opening, or plugin actions that depend on online APIs.

## Troubleshooting

- Available count below target: check fetched bodies, ranked inventory, and storage; keep preparing in the foreground.
- Missing images: text remains readable; uncached images need a connection.
- Offline cold start fails: check HTTPS, previous authentication and cache preparation, and whether browser storage was cleared.
- Mobile preparation interrupted: the OS may suspend background pages; keep the app visible and verify actual counts again.
- Sync fails: check the same account's session and server connectivity, then retry without clearing the queue first.

The OS may reclaim browser storage and persistent-storage permission is not guaranteed. Offline copies are not backups. Clearing site data, uninstalling the PWA, or storage eviction may remove articles and unsynced actions. See [Backup And Upgrades](/en/backup-upgrade/) for server backups.
