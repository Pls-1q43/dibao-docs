---
title: リリースノート
description: Dibao v0.4.1、v0.4.0 と過去版のリリースノート。
---

## v0.4.1

Release date: 2026-10-11

GitHub Release: [Dibao v0.4.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.1)

v0.4.1 では Windows と macOS の独立したデスクトップ版を初めて提供します。サーバーを構築せず、インストール後に自分の PC で邸報を使えます。既存のリーダー、フィード管理、推薦機能を引き継ぎ、トレイ常駐、ローカルのオフライン読書、バックアップと復元、デスクトップ更新を追加しました。初回設定、終了時の保存、データ復元も改善し、Docker・Web・PWA は引き続き利用できます。

### 新機能

- **独立したデスクトップ版。** Windows x64 の EXE、Intel Mac と Apple Silicon Mac の DMG を提供します。実行環境を内蔵し、Node.js、Docker、データベースの別途インストールは不要です。初回にアカウントを作成します。AI は任意設定で、モデルは同梱しません。
- **トレイ常駐とバックグラウンド動作。** ウィンドウを閉じてもフィード取得を続け、トレイ／メニューバーからリーダーを開けます。「Quit」でアプリを終了します。ログイン時の起動は初期状態で無効、有効時はウィンドウを表示せずに動作します。
- **ローカルのオフライン読書。** インターネットが切れてもリーダーを開き、この PC に保存済みの記事を読み、閲覧状態を記録できます。PWA の一部キャッシュへ切り替えません。新しい記事の取得、未保存の外部リソース、AI は接続が必要です。
- **手動バックアップと復元。** 「設定 → このインスタンスについて → バックアップと復元」で完全な保存、日時による復元ポイントの選択、結果確認ができます。フィード、記事と閲覧状態、設定、既存ベクトル、プラグインのデータと鍵、ログインとクライアント状態を含み、確認後に再起動して処理します。復元前に現在のデータも別保存しますが、復元日以降の変更は戻る場合があります。
- **更新とデータ保護。** 設定から新バージョンを確認できます。Windows はダウンロード後に確認して再起動・更新します。Mac は新 DMG を取得し、完全終了後にアプリを上書きします。更新前バックアップに失敗した場合、データ移行を続けません。通常の終了時には自動インストールせず、安定版へのプレリリース配信や自動降格も行いません。

### 改善

- **初回設定を柔軟に。** 最初に簡体中国語、日本語、English を選び、その後の設定、プラグイン、リーダーにも反映します。「あとで追加」で RSS／OPML の設定をスキップでき、フィード未登録でも初回設定を完了できます。
- **アプリとデータを別保存。** インストール先の変更、上書き、再インストール、通常のアンインストールではローカルデータを削除しません。設定からデータフォルダーを開けます。成功した更新前バックアップを直近三件保持し、手動保存と復元前スナップショットは自動削除しません。
- **デスクトップと自ホストの操作を分離。** デスクトップ画面からテスト版の表記を除きました。バックアップ、データフォルダー、ログイン時起動、アプリ更新は Desktop だけに表示します。Docker・Web・PWA の読書／オフライン機能は維持し、専用項目は追加しません。

### 修正

- **バックアップ／復元の反応が分かりにくい問題。** 確認、処理中、キャンセル、完了、失敗の表示を追加しました。有効なバックアップがない場合は復元を無効にし、無反応に見える状態を避けます。
- **破損バックアップが正常な復元を妨げる問題。** 一件の破損で正常な復元ポイントまで使えなくならないようにしました。中断した復元は置換前に整合性を確認し、DB 欠落、不正パス、変更されたファイルを拒否します。
- **起動時のデータ誤判定。** 新規生成されたブラウザー設定を既存 DB と誤認しません。使用済み DB が欠落・空の場合は空の DB を黙って作らず、起動を停止して復元を案内します。残存ファイルも復元前に保存します。
- **Windows で復元後に起動できない問題。** ブラウザーがデータフォルダーを開く前にコールドバックアップ、復元、版の確認を完了し、フォルダーロックや起動時の書き込みによる干渉を防ぎます。ログインデータの保存先は変えません。
- **終了／更新時の書き込み競合。** 未送信の閲覧進捗を保存し、バックグラウンドタスクとプラグインを停止してから DB を閉じます。未保存の設定やデータ更新中は、安全に行えない保存・復元・アプリ更新を拒否します。
- **セキュリティと実行依存。** セキュリティ修正のある HTTP／実行依存を更新し、Docker の不要なパッケージ管理ツールを除きました。デスクトップ権限とプラグインの境界を強化し、外部ページから特権操作を呼べないようにします。Docker 実行イメージは Electron とデスクトップ実行プロセスを含みません。

### 更新の影響と移行

**v0.4.0 から v0.4.1** への新規 SQL 移行、強制派生データ再計算はなく、**Embeddings も再計算しません**。過去版から直接更新する場合は、未適用の歴史的移行と必要なデータ更新を実行します。Desktop の保存と版の保護はこの PC のデータだけに適用し、NAS や別の環境から自動インポートはしません。

### ダウンロードと更新

- [Windows x64 EXE](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-win-x64.exe)
- [Intel Mac DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-x64.dmg)
- [Apple Silicon Mac DMG](https://github.com/Pls-1q43/Dibao/releases/download/v0.4.1/Dibao-0.4.1-mac-arm64.dmg)
- Docker：`ghcr.io/pls-1q43/dibao:v0.4.1`、`linux/amd64`／`linux/arm64`。

Desktop のデータは Windows の `%LOCALAPPDATA%\Dibao`、Mac の `~/Library/Application Support/Dibao` に保存します。導入、更新、復元は[デスクトップ手順](/ja/desktop-install/)をご覧ください。以後の正式リリースも三種類のインストーラーと Docker を同時提供します。

Docker の新規導入は [README](/ja/quick-install/) を参照してください。更新前に各端末の未同期操作を同期し、旧コンテナを停止して `/data` 全体を保存します。SQLite 本体だけのコピーでは不十分です。既存 volume と環境変数を維持し、イメージを `v0.4.1` に変更して `docker compose pull && docker compose up -d` を実行します。`/api/system/health` の `data.ok: true`、`data.version: "0.4.1"` に加え、認証後の `/api/system/upgrade/status` が完了または更新不要で、`blocking: false` であることを確認します。

戻す場合は新版を停止し、完全な更新前バックアップを空のディレクトリ／新 volume に復元してから旧イメージを起動します。旧版で新しいデータを開いたり、新 WAL のある場所にバックアップを重ねたりしないでください。

### 既知の制限

- パッケージは未署名のため、OS が初回起動を警告・拒否する場合があります。本 Release のみを使用し、システムの確認手順に従ってください。安全確認を無効にしないでください。Mac はアプリ内自動インストール未対応で、未署名ログイン項目も登録に失敗する場合があります。
- Windows ARM ネイティブ版、NAS データ移行、遠隔インスタンス接続、多端末同期は未対応です。Desktop のオフライン読書はローカル DB を使い、サーバーとのオフライン同期ではありません。
- サードパーティのサーバープラグインは信頼済みローカルコードとして動作します。信頼するものだけを導入してください。上流未修正の依存警告と検証範囲は[リリース監査](https://github.com/Pls-1q43/Dibao/blob/main/docs/release-audit-v0.4.1.md)に記録しています。

## v0.4.0

Release date: 2026-09-07

GitHub Release: [Dibao v0.4.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.4.0)

v0.4.0 では、記事を端末に保存してオフラインで読めるようになりました。本文の下から関連記事を探したり、「いいね」の後に興味に合った次の記事を見つけたりできます。おすすめ一覧のページ送り、接続の復旧、プラグインの権限境界、バージョンアップ時の処理も改善しました。

### オフラインへの切り替えは自分で選べます

- **初期設定は無効で、端末ごとに有効にします。** オンラインの状態で設定からオフライン閲覧を有効にすると、記事の保存が始まります。スイッチと保存目標数は現在のブラウザまたはインストール済み PWA に保存され、アカウント経由では同期されません。パソコンで有効にしても、スマートフォンでは別途設定が必要です。
- 順位付け済みの未読のおすすめ記事を、**初期目標 200 件、50〜1,000 件の範囲で 50 件刻み**に保存できます。「あとで読む」は最大 200 件、最近開いた記事は最大 20 件を別途保存します。**200 件という制限は「あとで読む」のオフラインコピーだけに適用され、サーバー側の一覧の上限ではありません。** 重複する記事はまとめられます。実際の保存数は取得済みの本文、おすすめ記事の数、ブラウザの空き容量によって変わります。
- ネットワークやサーバーに接続できないときは、保存済みの記事があれば切り替えを確認します。オンライン一覧を無断でキャッシュに置き換えることはありません。切り替え後はバナーでオフラインであることを示し、ステータス表示から保存件数、保存日時、未同期・同期失敗の操作を確認できます。接続が戻ったら、同じパネルの「オフラインモードを終了」から接続確認と同期を行ってオンラインに戻ります。回線が戻っただけでは強制的に切り替わりません。アプリを開き直した場合も、前回選んだオフラインモードを引き継ぎます。
- 保存済みの本文を読み、お気に入り、いいね、あとで読む、既読状態、読書の進み具合などを記録して、再接続後に同期できます。失敗した同期は再試行でき、セッションの期限が切れた場合は同じアカウントで再ログインして続行します。オフライン閲覧の無効化、キャッシュの削除、ログアウトの前に同期を済ませ、未同期の操作が失われる旨の確認に注意してください。
- PWA 更新時のアプリ資源の保持を改善しました。別タブでのログアウトやキャッシュ削除後に、古いリクエストが無効になった画像キャッシュを書き戻すことも防ぎます。

### 読書画面とおすすめ一覧

- 本文の下に最大 **5 件の関連記事**を表示できます。現在の記事、それと同じグループの重複記事、非表示の記事、「興味なし」にした記事は除外します。「いいね」が成功した後には、個人のおすすめと今読んでいる記事の話題を組み合わせた候補も表示できます。
- 「もっと見る」から関連記事検索に進み、ページ送りや記事の状態による絞り込みができます。初期設定では最大 500 件の近傍候補から、**類似度が 0.35 を超える**記事を選び、1 ページ 50 件で表示します。このしきい値は検索側のもので、本文下の 5 件のプレビューには適用されません。両方の結果が必ず一致するわけではありません。有効な埋め込み索引と現在の記事のベクトルが必要です。条件がそろっていない場合は利用できないことを表示し、その場でベクトルを再計算することはありません。オフラインモードではこれらのオンライン検索は利用できません。
- おすすめのページ送りに固定されたセッション内の順序を使い、バックグラウンドで順位が変わったときの重複や読み飛ばしを減らしました。オフラインでも記事の状態変更によって次のページが飛ぶ問題を修正しています。保存済み・閲覧済みの記事をスクロールで通過しても、誤って「無視した」と扱わなくなりました。
- フィード更新が止まる問題を修正し、アップグレード中に候補記事や全文検索を何度も重く処理する負担を減らしました。所要時間は記事数や端末性能によって変わるため、一定時間での完了を保証するものではありません。
- 「設定 → 読書」から、未操作の記事をスクロールで通過した際に無視扱いにするかを選べます。関連記事には既読や「いいね」済みの記事も含まれますが、個人向けの次の記事候補からは既読・お気に入り・「いいね」済みの記事を除外します。

### Sentry による診断

エラーと性能のテレメトリーは初期設定で有効ですが、初回設定または設定画面で無効にできます。正式イメージにはサーバーとブラウザの Sentry 設定を含めます。ブラウザのソースマップはビルド時にアップロードし、公開イメージから `.map` ファイルを除去します。設定は非公開のビルド secret から渡し、認証 token は実行用イメージに含めません。リリース検証では送信と無効化後の抑止を確認し、非公開の設定値ではなく真偽値と受信結果だけを報告します。

### セキュリティと制限

- 認証、書き込みリクエストの送信元確認、静的ファイルと API のパス境界、プラグイン経由のリクエスト、外部取得先のアドレス検証を強化しました。無効化したプラグインの資源は配信されず、HTML や SVG/XML を含むプラグイン資源にはサンドボックス制約が適用されます。
- フロントエンドの隔離は、サーバー側プラグインのサンドボックスを意味しません。サードパーティのサーバープラグインは信頼済みのローカルコードとして動くため、信頼できるものだけを導入してください。
- **localhost・ループバック以外で PWA を確実にオフライン起動するには、HTTPS の安全なコンテキストが必要です。** NAS の LAN IP に HTTP でアクセスできるだけでは、オフライン PWA が使えるとは限りません。HTTPS を設定し、保存完了後に実際に回線を切って確認してください。
- スマートフォンでは、OS がバックグラウンドのページを停止したり、ダウンロードを中断したり、保存領域を回収したりすることがあります。永続保存の許可が得られない場合もあります。保存・同期中はできるだけアプリを前面に置き、外出前に利用可能な件数を確認してください。画像は可能な範囲で保存しますが、すべての画像、外部リンク、動画、未取得の本文のオフライン利用は保証しません。新規インストール直後で保存が済んでいなければ、未保存の記事をオフラインで開くことはできません。
- 端末内のコピーはバックアップや端末間クラウド同期ではありません。サイトデータの削除、PWA のアンインストール、OS による領域回収で、保存内容や未同期の操作が失われる場合があります。

### アップグレードとデータ移行

**v0.3.1 から v0.4.0** への新しい SQLite マイグレーションは 1 件です。

- `027_recommendation_sessions.sql`：安定したおすすめのページ送りのため、`recommendation_sessions`、`recommendation_session_items` と索引を追加します。古いバージョンから直接更新する場合は、それ以前の未適用のマイグレーションも自動で実行します。

データベース移行は自動で実行されます。おすすめ用データの更新が必要な既存データベースでは、続いて**専用のデータ更新画面**が開き、通常機能を一時的に停止します。既存の行動履歴を再処理し、興味のプロフィールと関連する派生データを再構築して、対象記事の順位を計算します。すべて成功してから古い推薦コンテキストを整理し、通常画面に戻ります。失敗した場合はエラーが残り、画面から再試行できます。更新状態を削除して処理を回避しないでください。

**このアップグレードで埋め込みベクトルを再計算することはなく、既存記事のために埋め込みサービスを呼び直す必要はありません。** 保存済みのベクトルを再利用します。通常動作に戻った後の新着記事のベクトル生成は、従来どおり設定に従います。

### Docker の導入・バックアップ・ロールバック

バージョン指定イメージは `ghcr.io/pls-1q43/dibao:v0.4.0` です。新規導入には [日本語 README の Compose 例](/ja/quick-install/)を使えます。`./data:/data` などで `/data` を永続化し、データベースを `/data/dibao.sqlite` に保持してください。コンテナ内だけにデータを保存しないでください。

既存の Compose 環境では、各端末の未同期操作を同期してからサービスを停止し、データディレクトリ全体をバックアップして、イメージのタグを変更します。以下は `./data:/data` の例です。名前付き volume や別のパスを使っている場合は、実際の保存先に合わせてください。

```bash
docker compose stop
tar czf "dibao-data-before-v0.4.0-$(date +%Y%m%d-%H%M%S).tgz" -C data .
# compose.yaml の image を ghcr.io/pls-1q43/dibao:v0.4.0 に変更
docker compose pull
docker compose up -d
docker compose ps
```

SQLite が書き込み中の状態で、主 `.sqlite` ファイルだけをコピーしないでください。停止後に `/data` 全体を保存するか、SQLite の整合性が保たれるバックアップ方法を使います。標準の Docker 起動処理は HTTP と worker の両プロセスを管理します。既存の環境変数とマウント設定は引き継いでください。

更新後は、次の両方を確認します。

1. `GET /api/system/health` が `data.ok: true` と `data.version: "0.4.0"` を返すこと。これは基本的な稼働確認であり、**データ更新の完了確認ではありません**。
2. ログインした状態で `GET /api/system/upgrade/status` を確認します。既存データの更新では、最終的に `data.id: "recommendation-contract"`、`data.state: "completed"`、`data.blocking: false` になる必要があります。新規の空データベースでは `not_required` と `blocking: false` でも正常です。スキーマ移行中は先に core migration の状態が返る場合があるため、派生データ更新の結果まで確認してください。更新画面が閉じ、通常の読書ができることも確認します。

戻す場合は v0.4.0 を停止して障害時のデータを別途保管し、空のディレクトリまたは新しい volume に**更新前の完全なバックアップ**を復元します。その保存先をマウントして、以前のイメージ（例：`ghcr.io/pls-1q43/dibao:v0.3.1`）を起動してください。新しい WAL ファイルが残る場所に古いバックアップを重ねたり、移行済みデータベースを旧バージョンで直接開いたりしないでください。バックアップ後の変更は失われます。サーバーのバックアップには、各ブラウザの未同期操作は含まれません。

## v0.3.1

リリース日: 2026-08-10  
GitHub Release: [Dibao v0.3.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.1)

v0.3.1 は、現在推奨する 0.3 系の正式リリースです。中心テーマは「推薦アルゴリズムと推薦メカニズムの大幅更新」です。Dibao は、安定した排序済み在庫、より明確な fallback 境界、より確実なネガティブ topic フィルタ、低遅延なバックグラウンド排序を重視する方向に進みました。v0.3.1 ではさらに、v0.3.0 後の security、plugin、自ホスト feed、reader recovery、記事本文 cleanup の修正も含みます。

### 主な変更

- 推薦 v3 memory 基盤: user representation snapshot、推薦 exposure、探索 attempt を追加し、長期的な興味記憶、探索 feedback、今後の推薦戦略の土台を作りました。
- ranking と fallback の分離: 推薦リストは active rank context をより厳密に使います。排序済み在庫が少ない場合も、fallback は小さな一時 batch として使われ、大量の未排序ページが読書体験を覆うことを避けます。
- ネガティブ topic / family 修正: negative cluster、topic family 制約、金融・取引日系など見たくない topic の降格・除外がより確実に働きます。
- 推薦在庫ステータス: 未読推薦ページで、排序済み在庫があるか、空か、バックグラウンドで補充中かを確認できます。
- 操作経路の高速化: 記事を開く、スクロールする、記事アクションを行う経路では、同期的な再排序、重い transparency diagnostics、広範囲の書き込みを避け、バックグラウンド処理に移します。
- 無限ロード: 推薦、最新、收藏、あとで読む、検索結果で任意の自動ページングを利用できます。追加読み込みに失敗した場合、自動 retry を止め、明示的な手動 retry を残します。
- reader 改善: 記事詳細上部の戻る操作と原文操作を整理しました。詳細ロード失敗時には再読み込み導線を表示し、原文 URL が分かる場合は引き続き原文を開けます。
- plugin 改善: 公式 plugin manifest が localized string に対応し、plugin iframe と bridge API から現在 locale を読めます。Daily Brief、Webhook、全文 selector plugin は `0.1.1` に更新されます。
- 自ホスト feed 互換性: feed discovery / refresh は NAS、家庭内ネットワーク、自建 RSS の private/local network URL に対応します。一方、plugin outbound request と全文取得は controlled-fetch の防護境界を維持します。
- 記事本文 cleanup: Hexo 風 code block の行番号 gutter を除去し、実際の code body は保持します。
- security と release chain 強化: controlled fetch は DNS rebinding / TOCTOU SSRF リスクを下げ、cross-origin redirect では sensitive header を削除します。runtime / build dependency も更新し、production と full `npm audit` はどちらも 0 vulnerabilities です。

### アップグレード影響

v0.3.0 から v0.3.1 へのアップグレードでは、新しい core SQLite migration はありません。Embeddings の再計算も不要です。内蔵公式 plugin は `0.1.1` に更新されます。

v0.2.1 から v0.3.1 へ直接アップグレードする場合、推薦 v3 memory 関連の database 構造が追加されます。core migration は起動時に自動実行されます。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。

このアップグレードでは Embeddings の再計算は不要です。既存の記事、行動イベント、興味 cluster、vector を引き継ぎ、新しい推薦 memory と exposure データはアップグレード後の利用に合わせて蓄積されます。

アップグレード後は次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.3.1"` が含まれていれば基本確認は通っています。推薦在庫ステータスが排序中を示す場合は、バックグラウンドジョブが排序済み在庫を補充するまで待ってください。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.1
```

既存の `/data` volume を維持し、image を差し替えて再起動してください。既定の entrypoint は HTTP プロセスと独立 worker プロセスを起動します。独自 Compose を使っている場合は、永続 data volume と既存の環境変数を引き継いでください。

アップグレード前:

```text
/data/dibao.sqlite または Docker volume 全体をバックアップしてください。
```

ロールバックする場合は v0.3.1 コンテナを停止し、アップグレード前の SQLite database と `/data` volume backup を復元してから前の image を起動してください。0.3.x に migration 済みの database を旧バージョンで直接起動しないでください。

### Migration List

v0.3.0 から v0.3.1:

- 新しい core SQLite migration はありません。

v0.2.1 から v0.3.1 へ直接アップグレードする場合:

- `026_recommendation_v3_memory.sql`: `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` を追加し、`article_rank_scores` に探索関連フィールドを追加します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- 推薦 v3 memory は基盤更新であり、長期記憶戦略のすべてが完全に製品化されたわけではありません。推薦品質は利用とバックグラウンド排序に合わせて安定していきます。
- 排序済み推薦在庫が尽きた場合、一時的に fallback sequence を使うことがあります。ただし v0.3.1 では、その状態をより制限し、分かりやすく表示します。
- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。

## v0.3.0

リリース日: 2026-08-08  
GitHub Release: [Dibao v0.3.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.3.0)

v0.3.0 は「推薦アルゴリズムと推薦メカニズムの大幅更新」を中心にしたメジャーリリースです。推薦 v3 memory の基盤、active ranking の分離、fallback の制御、推薦在庫の可視化、低遅延な読書操作を強化しました。リーダーには無限ロード、全文取得プラグイン、セキュリティと安定性の改善も入っています。

### 主な変更

- 推薦 v3 memory 基盤: user representation snapshot、推薦 exposure、探索 attempt を追加し、長期的な興味記憶とフィードバックの土台を作りました。
- ランキングと fallback の分離: 推薦リストは active rank context をより厳密に使い、fallback が大量の未排序リストとして読書体験を覆うことを抑えます。
- ネガティブ topic / family フィルタの修正: 金融・取引日系など、見たくない topic cluster や topic group の降格・除外がより確実に働きます。
- 推薦在庫ステータス: 未読推薦画面で、排序済み在庫があるか、空か、バックグラウンドで排序中かを確認できます。
- 操作パフォーマンス改善: 記事を開く、スクロールする、記事アクションを行う経路では、同期的な再排序、重い診断、広範囲の書き込みを避けます。
- 無限ロード: 推薦、最新、收藏、あとで読む、検索結果で任意の自動ページングを利用できます。失敗時は自動再試行を止め、手動 retry を残します。
- リーダーの改善: 記事詳細の上部ボタン配置を整理し、詳細ロード失敗時に再読み込み導線を追加しました。
- プラグインと全文取得: 公式プラグイン基盤に全文取得 extractor を追加し、selector ベースの公式全文取得プラグインを提供します。Webhook は secrets、deliveries、runtime state に対応しました。
- outbound fetch の安全性強化: controlled fetch は検証済み IP を実際の接続にも使い、DNS rebinding / TOCTOU SSRF リスクを下げます。cross-origin redirect では sensitive header を削除し、POST body の意図しない転送も避けます。
- Docker と worker の安定化: cross-platform Docker build、worker keepalive、SQLite ranking writes、core migration checksum の streaming 検証を改善しました。

### アップグレード影響

v0.2.1 から v0.3.0 へのアップグレードでは、推薦 v3 memory 関連のデータベース構造が追加されます。core migration は起動時に自動実行されます。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。

このアップグレードでは Embeddings の再計算は不要です。既存の記事、行動イベント、興味 cluster、vector を引き継ぎ、新しい推薦 memory と exposure データはアップグレード後の利用に合わせて蓄積されます。

アップグレード後は次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.3.0"` が含まれていれば基本確認は通っています。推薦在庫ステータスが排序中を示す場合は、バックグラウンドジョブが排序済み在庫を補充するまで待ってください。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.3.0
```

既存の `/data` volume を維持し、image を差し替えて再起動してください。既定の entrypoint は HTTP プロセスと独立 worker プロセスを起動します。独自 Compose を使っている場合は、永続 data volume と既存の環境変数を引き継いでください。

アップグレード前:

```text
/data/dibao.sqlite または Docker volume 全体をバックアップしてください。
```

ロールバックする場合は v0.3.0 コンテナを停止し、アップグレード前の SQLite database と `/data` volume backup を復元してから前の image を起動してください。v0.3.0 に migration 済みの database を旧バージョンで直接起動しないでください。

### Migration List

v0.2.1 から v0.3.0 では、core SQLite migration が 1 件追加されます。

- `026_recommendation_v3_memory.sql`: `user_representation_snapshots`、`recommendation_exposures`、`exploration_attempts` を追加し、`article_rank_scores` に探索関連フィールドを追加します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- 推薦 v3 memory は基盤更新であり、長期記憶戦略のすべてが完全に製品化されたわけではありません。推薦品質は利用とバックグラウンド排序に合わせて安定していきます。
- 排序済み推薦在庫が尽きた場合、一時的に fallback sequence を使うことがあります。ただし v0.3.0 では、その状態をより制限し、分かりやすく表示します。
- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。

## v0.2.1

リリース日: 2026-07-12  
GitHub Release: [Dibao v0.2.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.1)

v0.2.1 は 0.2 プラグインラインのパッチリリースです。Docker や NAS で長時間動かす環境で、バックグラウンドジョブ、公式プラグイン、モバイルリーダーの安定性を高めました。

### 主な変更

- Docker の split-process 構成で、HTTP プロセスが追加した `embedding_generate` ジョブを worker が見逃すことがある問題を修正しました。Docker Compose では `DIBAO_SQLITE_JOURNAL_MODE=DELETE` を既定にし、bind mount と SQLite WAL の多プロセス可視性リスクを避けます。
- worker にバックグラウンドジョブ用の heartbeat を追加しました。job runner は起動直後に due jobs を処理し、1 回の処理上限に達した場合は続けて次の drain を行います。
- HTTP プロセスから worker を起こす cross-process job wake signal を追加しました。
- 公式プラグインは一時的な hook/runtime エラーで自動 Disable されず、degraded 状態として表示されます。
- モバイルで記事詳細から未読リストへ戻るとき、`limit=1` の未読件数 probe を完全なリスト再取得として扱わないようにしました。
- 記事詳細の Feed 由来表示と操作ボタン、購読源管理の追加ボタン行の見た目を整えました。
- v0.1.3 メンテナンス修正を取り込みました。Gemini OpenAI-compatible provider の dimensions 指定、Ollama 長文コンテキスト処理、記事メタデータの年表示、ソースフィルター表示が含まれます。

### アップグレード影響

v0.2.0 から v0.2.1 への追加 core SQLite schema migration はありません。同じ `/data` volume を使い、image tag を差し替えてください。アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。

独自の Compose ファイルを使っている場合は、次を追加してください。

```yaml
environment:
  DIBAO_SQLITE_JOURNAL_MODE: DELETE
```

リポジトリの `compose.yaml` には既に含まれています。アップグレード後、次を確認してください。

```text
GET /api/system/health
```

レスポンスに `ok: true` と `version: "0.2.1"` が含まれていれば基本確認は通っています。

### Docker インストール / アップグレード

推奨 image:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.2.1
```

既定の Docker entrypoint は HTTP プロセスと独立 worker プロセスを起動します。worker を無効化する場合:

```yaml
environment:
  DIBAO_BACKGROUND_JOBS: "false"
```

ロールバックする場合は v0.2.1 コンテナを停止し、アップグレード前の SQLite データベースと `/data` volume バックアップを復元してから、前の image を起動してください。

### Migration List

v0.2.0 から v0.2.1: 新しい core SQLite migrations はありません。起動時には、既存 migrations が適用済みで checksum が変わっていないことを引き続き確認します。

### Sentry リリース検証

正式 Docker image は BuildKit secret `dibao_sentry_config` で private Sentry 設定を注入してビルドします。検証結果は `hasDsn`、`hasOrg`、`hasProject` などの boolean のみを報告し、DSN、org、project、token は公開しません。

### 既知の制限

- サードパーティのサーバープラグインは信頼済みローカルコードであり、任意の悪意あるコードを隔離する sandbox ではありません。
- v0.2.x の一部 Host API は Beta です。長期運用するプラグインでは Stable API を優先してください。

## v0.2.0

リリース日: 2026-06-19  
GitHub Release: [Dibao v0.2.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.2.0)

Dibao v0.2.0 ではプラグインシステムが利用できるようになりました。プラグインは、設定画面、ナビゲーション、バックグラウンドタスク、Hook、プラグイン専用データ、Secrets、外部配信を拡張できます。

### 主な変更

- manifest v1、インストール / 有効化 / 無効化 / アンインストール、署名パッケージ検証、trusted keys、プラグイン migration、tasks、hooks、設定、プライベートデータに対応しました。
- Web UI は sandboxed iframe 内で動作し、host bridge 経由で宿主機能にアクセスします。サーバープラグインは独立した Node host 子プロセスで実行されます。
- 公式 Daily Brief プラグインを同梱しました。過去 24 時間のパーソナライズ推薦から、興味トピックごとの日次ブリーフを生成します。
- 公式 Webhook プラグインを同梱しました。記事操作、フィード更新、ランキング完了、設定更新、プラグインタスク結果、Daily Brief 生成イベントを外部 HTTP サービスへ送信できます。
- `@dibao/plugin-sdk` と `@dibao/plugin-cli` により、プラグインの検証、パッケージ化、署名を行えます。

### アップグレード影響

v0.1.x から v0.2.0 へのアップグレードでは、プラグインシステムに必要なコアテーブルとインデックスを作成する blocking database migration が 1 回実行されます。初回起動時は core blocking migration gate が完了するまで通常のサービス提供を開始しません。データ量が多い場合やディスクが遅い場合は、少し時間がかかることがあります。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。バックアップ後、同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.2.0"` と `ok: true` が含まれていれば、基本的な確認は通っています。

## v0.1.3

リリース日: 2026-06-04  
GitHub Release: [Dibao v0.1.3](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.3)

### 主な変更

- フィード管理画面の縦方向の余白を減らしました。フィード追加は行内のボタンからダイアログを開き、フィード健全性は一覧フィルターに統合しました。
- ソースフィルターが有効な場合、記事一覧のソースボタンに状態が表示されるようになり、意図せず絞り込んでいる状態に気づきやすくなりました。
- おすすめ、最新、あとで読むなどのページで、英語以外の UI では英語サブタイトルを復元しました。英語 UI では引き続きサブタイトルを表示しません。
- 記事一覧、検索結果、Reader のメタ情報に公開年を表示し、年をまたぐ記事でも元ページを開かずに年を確認できます。
- Ollama provider の既定切り出し長を 4000 文字に下げ、中国語長文 / bge-m3 向けの案内を追加しました。Ollama の文脈長エラーでは、より短い切り出しで 1 回だけ再試行します。
- Gemini embedding の次元数を明示的に要求します。Google AI Studio の OpenAI-compatible endpoint には `dimensions` を、native Gemini provider には `outputDimensionality` を送り、768 / 1536 / 3072 次元の設定を使えるようにしました。

### アップグレード影響

v0.1.2 から v0.1.3 へのアップグレードでは、新しい SQL migration はありません。recommendation derived-data upgrade も発生しません。同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.1.3"` と `ok: true` が含まれていれば、基本的な確認は通っています。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.3
```

ロールバックする場合は、v0.1.3 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- Ollama のモデルや文脈長設定によっては、切り出し長を手動でさらに下げる必要があります。bge-m3 で文脈長エラーが続く場合は 3000 文字を試してください。
- Gemini / OpenAI-compatible の次元数指定は上流 provider の対応に依存します。Dibao は Google Gemini の経路で次元数を送信し、返ってきたベクトル次元も引き続き検証します。

## v0.1.2

リリース日: 2026-06-01  
GitHub Release: [Dibao v0.1.2](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.2)

### 主な変更

- Embedding provider のテスト失敗が、より対応しやすい公開エラーとして返るようになりました。認証失敗、model / endpoint 不存在、rate limit、provider 停止、ネットワーク不可達、不正なレスポンスを分類します。
- Provider のエラーでは、表示してよい上流メッセージを残しつつ、API key、token、Authorization などの機密情報を伏せます。
- 設定画面とバックエンド状態レスポンスで、provider のテストエラーが不要な index 一覧へ漏れないようにしました。
- フィード管理を「フィード管理」と「フィードフォルダー管理」の 2 つのビューに分け、長い画面で操作が混ざりにくくなりました。
- フィードとフォルダーの行に「記事を見る」を追加し、該当 feed / folder の latest 記事一覧へ直接移動できます。
- 記事一覧 URL が feed / folder の絞り込みパラメータを保持するため、更新、共有、戻る操作でも文脈を保ちやすくなりました。
- Reader 内の記事画像が読み込みに失敗した場合、繰り返し再試行しないようにしました。不要な通信とレイアウトの揺れを抑えます。

### アップグレード影響

v0.1.1 から v0.1.2 へのアップグレードでは、新しい SQL migration はありません。recommendation derived-data upgrade も発生しません。同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップすることを推奨します。再起動後、次の health check を確認してください。

```text
GET /api/system/health
```

レスポンスに `version: "0.1.2"` と `ok: true` が含まれていれば、基本的な確認は通っています。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.2
```

ロールバックする場合は、v0.1.2 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- Embedding provider の詳細は上流サービスのレスポンスに依存します。Dibao は可能な範囲で分類と機密情報の除去を行いますが、provider 自体の停止は修復できません。
- 記事本文内のリモート画像は、元サイト、ネットワーク、防 hotlinking 設定に依存します。本リリースは、失敗した画像が繰り返し再試行されることを防ぎます。

## v0.1.1

リリース日: 2026-05-30  
GitHub Release: [Dibao v0.1.1](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.1)

### 主な変更

- 関係の薄い記事が 1 つの巨大な興味クラスタへ吸収される問題を修正しました。
- アップグレード後にほとんどのクラスタが 1 記事だけになる過度な断片化を修正しました。
- embedding index ごとの calibration を追加しました。Dibao は rebuild / upgrade 時に、現在の provider、model、dimension、ローカルのベクトル分布から閾値を推定し、その index 用に固定します。
- centroid 類似度、pairwise guard、タイトル/ソースの根拠、最大クラスタサイズ、吸収ステップ上限を使う制約付きマージを導入しました。
- 既存の興味クラスタ上限と同じ設定エリアに topic family 上限を追加しました。初期値は positive clusters 48、negative clusters 32、positive families 16、negative families 12 です。
- 推薦ランキングでの topic family の扱いを抑制しました。semantic match の主役は cluster のままで、family は主に説明と多様性に使われます。
- ブロッキング upgrade 画面に、この移行は derived recommendation data の再構築だけであり、embedding の再生成や API 費用は発生しないことを明記しました。
- labels / upgrade 画面は分割処理と yield を維持し、低消費電力 NAS で CPU が高くなっても進行中であることが見えるようにしました。
- 「さらに読み込む」を使った後も、追加された未読記事を開かずに通過した場合に無視済みへ自動反映されるよう修正しました。
- Docker publish workflow は private Sentry build config を必須にし、正式イメージに server/browser 両方の runtime Sentry 設定を含めます。

### アップグレード影響

v0.1.0 から v0.1.1 へアップグレードすると、新しい SQL migration `018_interest_cluster_calibrations.sql` が自動実行され、その後初回起動時に recommendation derived-data upgrade が 1 回ブロッキングで実行されます。この upgrade は clusters、families、labels、ranking rows を再構築しますが、embedding provider は呼び出さず、embedding の再生成も行いません。

アップグレード前に `/data/dibao.sqlite` または Docker volume 全体をバックアップしてください。初回起動時は進捗画面が通常の reader UI を一時的にブロックし、完了後に自動復帰します。

### Docker インストールとアップグレード

推奨イメージ:

```yaml
image: ghcr.io/pls-1q43/dibao:v0.1.1
```

同じ `/data` volume を使い、image tag を差し替えてコンテナを再起動してください。ヘルスチェック:

```text
GET /api/system/health
```

ロールバックする場合は、v0.1.1 コンテナを停止し、アップグレード前の SQLite バックアップを復元してから前バージョンのイメージを起動してください。

### 既知の制限

- サンプルが少ないライブラリでは保守的な fallback calibration を使います。推薦品質は行動履歴と embedding coverage に応じて改善します。
- 低消費電力 NAS では初回 derived-data upgrade に時間がかかる場合がありますが、進捗は画面に表示されます。
- embedding model や dimension を変更した場合、古い embedding は新しい index に混在できません。新しい index 用の embedding が必要です。

## v0.1.0

リリース日: 2026-05-28  
GitHub Release: [Dibao v0.1.0](https://github.com/Pls-1q43/Dibao/releases/tag/v0.1.0)

Dibao v0.1.0 は最初の公開 MVP リリースです。Docker でセルフホストできる単一ユーザー向け RSS リーダーとして、OPML のインポート、フィードとフォルダー管理、最新記事の閲覧、保存・あとで読む・既読・興味なしなどの操作、自分の RSS 購読内だけで動く説明可能なパーソナル推薦を提供します。

このリリースには、基本ランキング、OpenAI-compatible / Ollama embedding provider、sqlite-vec ベクターインデックス、推薦状態の診断、バックグラウンド更新、検索、PWA アプリシェル、ヘルスチェック、バックアップとアップグレード手順が含まれます。初回リリースのため、以前の公開版からの移行はありません。インストールには `ghcr.io/pls-1q43/dibao:v0.1.0` を使い、`/data` を永続ディレクトリにマウントしてください。アップグレード前には SQLite データベースまたは Docker volume をバックアップしてください。

既知の制限: 現在は単一ユーザーのセルフホストのみで、公式ホスティング、複数ユーザー、クラウド同期、OAuth / パスワード復旧、完全なオフライン記事保存、ネイティブアプリはありません。推薦品質は MVP 段階で、読書フィードバックと embedding カバレッジに依存します。
