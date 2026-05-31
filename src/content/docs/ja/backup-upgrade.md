---
title: バックアップとアップグレード
description: Dibao のデータディレクトリをバックアップし、Docker イメージを更新する。
---

デフォルトの Compose は、コンテナの `/data` をローカル `./data` に割り当てます。

```text
./data:/data
./data/dibao.sqlite
```

## バックアップ

アップグレードや移行の前にコンテナを止め、データディレクトリをアーカイブします。

```bash
docker compose stop
tar czf dibao-data-backup.tgz -C data .
docker compose up -d
```

SQLite ファイルだけでなく、`./data` 全体をバックアップしてください。プラグインパッケージ、プラグインデータ、今後のファイル型状態もこの中に置かれます。

## アップグレード

```bash
docker compose pull
docker compose up -d
docker compose ps
```

アップグレード後、設定画面でバージョン、フィード更新状態、推薦メンテナンス状態、プラグイン互換性を確認します。

## 復元

```bash
docker compose stop
mv data data.failed
mkdir data
tar xzf dibao-data-backup.tgz -C data
docker compose up -d
```

古いディレクトリを削除する前に、インスタンスが正常に動くことを確認してください。
