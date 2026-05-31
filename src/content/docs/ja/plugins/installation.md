---
title: プラグインインストール
description: Dibao の第三者プラグインをインストール、更新、永続化する。
---

第三者プラグインはセルフホストしたサーバー上でコードを実行します。信頼できる提供元だけを使い、有効化する前に名前、公開者、権限、互換性を確認してください。

## 推奨方式：プラグインファイルをアップロード

1. プラグイン開発者の公開ページから `.dibao-plugin` ファイルをダウンロードします。
2. SHA-256 が提供されている場合は、先にローカルで検証します。
3. Dibao の設定を開き、`Plugins` タブに移動します。
4. 第三者プラグインのインストール欄で `.dibao-plugin` を選び、`Install` をクリックします。
5. インストール直後の第三者プラグインは無効のままです。提供元と権限を確認してから有効化します。

## 高度な方式：URL または JSON パッケージ

Dibao のプラグイン API は、パッケージ URL またはプラグインパッケージ JSON からのインストールにも対応します。これは主に自動化、開発、開発者向けサンプル用です。通常は `.dibao-plugin` ファイルを使ってください。

URL インストールには次が必要です。

- `.dibao-plugin` を指すパッケージ URL。
- SHA-256 checksum。提供されていることが望ましいです。

JSON パッケージ方式では、`manifest` と `files` を含む完全な package JSON が必要です。

## Docker アップグレード後

通常、公式 Docker イメージをアップグレードしても第三者プラグインの再インストールは不要です。これは `/data` が永続化されていることが前提です。

永続化パス：

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`

## プラグイン更新

manifest に `updateUrl` がある場合、Plugins タブに `Check update` が表示されます。Dibao は更新を一時領域にダウンロードし、plugin ID、互換性、SHA-256 を検証してから古いパッケージを置き換えます。失敗した場合、古いパッケージは保持されます。

`updateUrl` がない場合は、新しい `.dibao-plugin` をダウンロードして再アップロードします。
