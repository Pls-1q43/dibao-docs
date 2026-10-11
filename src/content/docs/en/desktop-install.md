---
title: Desktop Installation
description: Install Dibao v0.4.1 on Windows or macOS and manage background operation, updates, backups, and recovery.
---

Dibao provides standalone desktop apps starting with `v0.4.1`. The runtime is bundled; Node.js, Docker, and a separate database installation are not required. AI configuration is optional and models are not bundled.

## Download And Install

| Platform | Installer | Installation |
| --- | --- | --- |
| Windows x64 | [EXE installer](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-win-x64.exe) | Run the installer for the current user. |
| Intel Mac | [x64 DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-x64.dmg) | Open the DMG and drag Dibao into Applications. |
| Apple Silicon Mac | [arm64 DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-arm64.dmg) | Open the DMG and drag Dibao into Applications. |

The [GitHub Release](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.1) provides direct installers; the outer Actions ZIP is not needed.

Current installers are unsigned. Windows may show an unknown publisher and macOS may block first launch. Use only official Release downloads. On macOS, review the launch in System Settings → Privacy & Security without disabling system security checks. Managed-device policies may still prohibit it.

## First Run

1. Open the app and choose English, Chinese, or Japanese on the welcome screen.
2. Create the local owner's account and password.
3. Add RSS / Atom feeds or import OPML, or choose Add later.
4. Configure a [Provider](/en/providers/) if desired, or skip it.
5. Enable official plugins such as [Daily Brief](/en/plugins/daily-brief/) and [Webhook](/en/plugins/webhook/), then start reading.

## Tray And Background Operation

Closing the window keeps feed fetching active. Choose `Open Dibao` in the system tray or menu bar to reopen it; Quit stops the app completely.

Settings → About → Start in the background at login is off by default. Once enabled, login starts the app without opening the reader. Manual launches and backup/recovery restarts still show a window. Unsigned macOS builds may fail to register login items.

## Offline Reading

Desktop reads its local database. Stored articles and reading-state changes remain available without internet, without enabling a PWA cache or applying PWA article-cache limits. New feed fetches, unsaved external images, and AI services still need network access.

This is local reading, not synchronization with a NAS or remote server. Cross-deployment imports, remote-instance connections, and multi-device sync are not supported. See [Offline Reading](/en/offline-reading/) for Web and PWA behavior.

## Updates

Check for updates in Settings → About. Windows requires confirmation both to download and to Restart and update; normal quit does not install updates. On macOS, quit fully, download the new DMG, and replace Dibao in Applications.

New versions back up data before opening it for migration and stop if backup fails. Stable releases do not automatically receive prereleases; older apps cannot directly open newer data.

## Data And Backups

| Platform | Data root |
| --- | --- |
| Windows | `%LOCALAPPDATA%\Dibao` |
| macOS | `~/Library/Application Support/Dibao` |

Open the folder from Settings → About. `data` contains the database, plugin data, and keys; `profile` contains login and client state; `backups` contains backups. Installation and data folders are separate. Updates, replacement installs, reinstalls, and normal uninstall do not intentionally delete user data.

Backup and recovery supports manual backups, dated restore-point selection, and operation results. Actions require confirmation and restart. Recovery saves current data separately first, but changes after the restore point are rolled back. Restore is disabled when no valid backup is available.

The three most recent successful upgrade backups are retained; manual backups and pre-restore snapshots are not automatically deleted. Backups stay on this computer. Quit fully before copying the entire data root to another storage device; copying only SQLite's main file or omitting plugin keys is insufficient.

## Troubleshooting

- App will not open: check the installer architecture and OS prompt. Native Windows ARM is not supported.
- Data missing after update: confirm the original data root is in use. Do not move an active directory or delete keys.
- Existing database reported missing or empty: follow recovery prompts and preserve residual files; do not bypass protection by creating an empty database.
- Update or backup action unavailable: save settings and wait for active data upgrades to finish.
- Need an older app version: restore a complete backup for that version first. See [Backup And Upgrades](/en/backup-upgrade/).
