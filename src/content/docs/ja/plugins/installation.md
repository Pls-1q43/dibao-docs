---
title: プラグインインストール
description: Dibao 0.2 の第三者プラグインをインストール、更新、署名検証、永続化する。
---

この文書は第三者プラグインをインストールする Dibao 管理者向けです。Dibao `0.2.x` では server plugin は独立 Node host 子プロセス、Web plugin は sandbox iframe で動作します。ただし第三者 server plugin は信頼済みローカルコードです。悪意ある任意コードを安全に実行する sandbox ではありません。信頼できる source だけをインストールしてください。

## 公式プラグインと第三者プラグイン

Dibao `0.2.x` では、[Webhook](webhook/) や Daily Brief などの公式プラグインが公式 Docker イメージに同梱されます。公式プラグインは `.dibao-plugin` ファイルをアップロードする必要がなく、第三者プラグインのようにアンインストールすることもできません。設定の `Plugins` タブで公式プラグインを探し、有効化してください。

このページの以降の手順は第三者プラグイン向けです。開発する場合は [プラグイン開発](development/) を参照してください。

## インストール前の確認

- Source: developer、release page、version、changelog を確認します。
- Signature: third-party plugin package には Ed25519 signature が必要で、signature の `keyId` は trusted public key に対応している必要があります。
- SHA-256: checksum が提供されている場合は local で検証します。
- Capabilities: requested capabilities が機能に見合っているか確認します。
- API stability: Stable API は長期利用向けです。Beta API は `0.2.x` で変わる可能性があります。
- Server-code risk: plugin を有効化すると server entry が実行されます。

## 第三者プラグインのインストールを有効化する

誤インストールを避けるため、user-installed third-party plugins は既定で無効です。deployment configuration で明示的に有効化します。

```text
DIBAO_ENABLE_UNTRUSTED_PLUGINS=true
```

公式プラグインはこの switch の影響を受けません。

## Trusted Keys

Dibao は Ed25519 signature を使います。管理者は deployment configuration で trusted public keys を提供します。署名 package の `keyId` は trusted key に一致する必要があります。未知の key、署名なし、改ざんされた payload は拒否されます。

private key を chat log や信頼できない page からコピーしないでください。publisher は public key、`keyId`、package file、SHA-256 を提供し、管理者は確認した key だけを trust してください。

## 推奨手順: `.dibao-plugin` upload

1. developer release page から `.dibao-plugin` を download します。
2. SHA-256 が提供されている場合は local で検証します。
3. deployment に `DIBAO_ENABLE_UNTRUSTED_PLUGINS=true` と trusted keys が設定されていることを確認します。
4. `Settings` -> `Plugins` を開きます。
5. plugin file を upload して `Install` を押します。
6. 新規 third-party plugin は無効のままです。有効化前に source、signature trust、capabilities、Stable/Beta API、`lastError` を確認します。

## Advanced Install: URL または JSON

automation では plugin installation APIs を使えます。

```text
POST /api/plugins/install
POST /api/plugins/install/upload
```

推奨 update metadata:

```json
{
  "pluginId": "dev.example.reader-tools",
  "latestVersion": "0.1.1",
  "packageUrl": "https://example.com/reader-tools-0.1.1.dibao-plugin",
  "sha256": "..."
}
```

URL install でも ID、SHA-256、signature、trusted key を検証します。

## Docker 永続化

`/data` を正しく mount すると、plugin package と data は image upgrade 後も保持されます。

- `/data/plugins/installed`
- `/data/plugins/data/<plugin-id>`
- SQLite tables: `plugin_installs`, `plugin_capability_grants`, `plugin_settings`, `plugin_kv`, `plugin_migrations`, `plugin_update_checks`, `plugin_secrets`, `plugin_deliveries`, `plugin_delivery_attempts`

公式 Daily Brief と Webhook は image から scan されます。第三者 plugin は data volume に残ります。

## Update と Rollback

plugin に `updateUrl` がある場合、Plugins page で update check できます。Dibao は staging に download し、ID、compatibility range、checksum、signature を検証してから old package を差し替えます。失敗した場合、old package は保持されます。

Rollback options:

- 古い `.dibao-plugin` を再アップロードします。
- 新しい version の activation が失敗した場合、plugin は `failed` になり data は保持されます。
- incompatible plugin は、plugin または Dibao が更新されるまで `incompatible` になります。

## Uninstall

third-party plugin を uninstall するときは plugin data を削除するか選択します。data を残すと将来の reinstall や rollback に役立ちます。削除すると install records、settings、KV、secrets、deliveries、migration records が削除されます。
