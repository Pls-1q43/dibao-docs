---
title: 公式 Webhook プラグイン
description: Dibao 0.2.x の公式 Webhook プラグインで、記事、推薦、更新、Daily Brief のイベントを外部 HTTP endpoint に送信する。
---

Webhook は Dibao `0.2.x` の公式 Docker イメージに同梱される公式プラグインです。プラグイン ID は `app.dibao.webhook` です。Dibao 内部イベントを監視し、ルールに従って URL、Query、Body、Header をレンダリングして、外部 HTTP endpoint にリクエストを送信します。

n8n、Make、Zapier、自作スクリプト、チャット bot、監視システム、アーカイブサービスとの連携に使えます。Webhook は Dibao の公開入口を作るものではありません。Dibao を LAN や private VPN の内側で使っている場合、Webhook のためだけに Dibao をインターネットへ公開する必要はありません。

## プラグインを有効化する

1. Dibao `0.2.x` にアップグレードします。
2. `Settings` を開き、`Plugins` タブに移動します。
3. 公式 `Webhook` プラグインを探します。
4. 有効化します。有効化後、設定画面に `Webhook` タブが表示されます。
5. `Webhook` タブを開き、ルールを作成して保存します。

公式プラグインはイメージに同梱されます。`.dibao-plugin` ファイルをアップロードする必要はなく、第三者プラグインのようにアンインストールすることもできません。

## ルールの仕組み

ルールは次の要素で構成されます。

| 項目 | 役割 |
| --- | --- |
| 名前 | プラグイン UI でルールを識別するための名前です。 |
| イベント | 監視する Dibao イベント。例：`article.actionRecorded`。 |
| 有効 | 無効にするとルールは残りますが送信されません。 |
| メソッド | `POST` と `GET` に対応します。 |
| URL テンプレート | 送信先 URL。`{{path}}` テンプレートを使えます。 |
| 条件 | すべての条件に一致した場合だけ送信します。 |
| 静的 Headers | 通常の Header。テンプレートを使えます。token はここに書かないでください。 |
| Secret Headers | `Authorization` などの機密 Header 用に保存済み secret を参照します。 |
| GET Query テンプレート | `GET` リクエストで URL に追加する query parameters です。 |
| POST Body テンプレート | `POST` リクエストで送信する JSON body です。 |
| 全文を送信 | 記事 snapshot に全文を含めます。信頼できる endpoint にだけ使ってください。 |

テスト送信はサンプルイベントで即時に 1 件の送信を作成し、最大 1 回だけ試行します。実イベントの送信はデフォルトで最大 5 回試行します。

## 対応イベント

Webhook は現在、次のイベントを監視します。

| イベント | よくある用途 |
| --- | --- |
| `article.created` | 新しい記事が保存された後の通知やアーカイブ。 |
| `article.updated` | 記事内容や metadata 更新後の同期。 |
| `article.actionRecorded` | favorite、read-later、hide などの読書行動後の自動化。 |
| `feed.refreshCompleted` | Feed 更新結果の記録。 |
| `ranking.afterRanked` | 推薦 ranking 完了後の通知。 |
| `settings.afterUpdated` | 設定変更後の運用通知。 |
| `plugin.taskSucceeded` | プラグインタスク成功後の連携。 |
| `plugin.taskFailed` | プラグインタスク失敗後のアラート。 |
| `dailyBrief.generated` | 生成された Daily Brief の送信や保存。 |

## テンプレートコンテキスト

Webhook はイベントごとに context object を作ります。よく使う path は次の通りです。

| Path | 意味 |
| --- | --- |
| `pluginId` | 常に `app.dibao.webhook`。 |
| `ruleId` | 現在の rule ID。 |
| `eventName` | 現在のイベント名。 |
| `event` | 元のイベント payload。 |
| `event.articleId` | 関連する記事 ID。存在する場合のみ。 |
| `event.action` | `favorite` などの読書行動。 |
| `article` | イベントに `articleId` がある場合の記事 snapshot。 |
| `article.title` | 記事タイトル。 |
| `article.url` | 元記事の URL。 |
| `article.feed.title` | 記事が属する Feed のタイトル。 |
| `feed` | Feed snapshot。記事がない場合は `event.feedId` だけの場合があります。 |
| `generatedAt` | Webhook 送信を生成した timestamp。 |
| `test` | テスト送信では `true`。 |

テンプレートは `{{path.to.value}}` の形で書きます。文字列の一部として object を埋め込むと JSON 文字列になります。フィールド全体が `"{{article}}"` のような単一テンプレートの場合、object 値のまま保持されるため JSON body で便利です。

```json
{
  "eventName": "{{eventName}}",
  "title": "{{article.title}}",
  "article": "{{article}}",
  "generatedAt": "{{generatedAt}}"
}
```

## 条件

条件は context の path から値を読みます。すべての条件に一致した場合だけ送信されます。

| Operator | 意味 |
| --- | --- |
| `exists` | 値が存在し、空文字列ではない。 |
| `equals` | 文字列化した値が完全一致する。 |
| `contains` | 文字列が対象値を含む。配列の場合は同じ項目を含む。 |

よく使う例：

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" },
  { "path": "article.feed.title", "operator": "contains", "value": "Design" },
  { "path": "event.articleId", "operator": "exists", "value": "" }
]
```

## Secret Headers (`secretHeaders`)

endpoint に認証が必要な場合は、先に secret を保存します。

- Key: `webhook.token`
- Hint: `tok_...`
- Value: 実際の token

次に `Secret Headers` で参照します。

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

Dibao はリクエスト送信時だけ secret を Header に注入します。API response と送信記録には metadata またはマスク済み request が表示され、secret の値は返りません。機密 Header を静的 Headers に書かないでください。

## 送信記録とリトライ

一致したルールごとに送信記録が作成されます。最新 50 件は Webhook UI に表示されます。status は次の通りです。

- `queued`：background job を待っています。
- `running`：送信中です。
- `succeeded`：endpoint が `2xx` を返しました。
- `failed`：最終的に失敗しました。
- `cancelled`：キャンセルされました。

`2xx` は成功です。`4xx` は通常、設定または認証の問題なので最終失敗として扱われます。`5xx` とネットワークエラーは background job によりリトライされます。実イベントは最大 5 回、テスト送信は 1 回だけ試行します。

Webhook は可能な場合、イベント内の安定した値から idempotency key を作り、同じルールと同じイベントの重複送信を減らします。

## ユースケース

### Favorite した記事を自動化ツールへ送る

`article.actionRecorded` を監視し、favorite のときだけ発火します。

```json
[
  { "path": "event.action", "operator": "equals", "value": "favorite" }
]
```

POST Body テンプレート：

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "action": "{{event.action}}",
  "title": "{{article.title}}",
  "url": "{{article.url}}",
  "feed": "{{article.feed.title}}",
  "article": "{{article}}"
}
```

URL には n8n、Make、Zapier が発行する webhook endpoint を指定します。

### 新着記事を通知する

`article.created` を監視し、新しい記事を自作通知サービスに送ります。

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}",
  "url": "{{article.url}}",
  "feed": "{{article.feed.title}}"
}
```

`GET` を使う場合は Query テンプレートにします。

```json
{
  "event": "{{eventName}}",
  "articleId": "{{event.articleId}}",
  "title": "{{article.title}}"
}
```

### 生成された Daily Brief を送る

`dailyBrief.generated` を監視し、event payload をチャット bot やアーカイブスクリプトに送ります。

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "event": "{{event}}",
  "generatedAt": "{{generatedAt}}"
}
```

### Feed 更新を監視する

`feed.refreshCompleted` を監視し、更新結果を監視システムに送ります。

```json
{
  "eventName": "{{eventName}}",
  "feedId": "{{event.feedId}}",
  "articlesSeen": "{{event.articlesSeen}}",
  "articleIds": "{{event.articleIds}}",
  "refreshedAt": "{{event.refreshedAt}}"
}
```

### 特定の source だけで発火する

特定 Feed だけに限定するには条件を追加します。

```json
[
  { "path": "article.feed.title", "operator": "equals", "value": "Example Feed" }
]
```

タイトルよりも `article.feed.id` または `event.feedId` を使う方が安定します。

### 認証が必要な endpoint

`webhook.token` を保存した後、`Secret Headers` を次のように設定します。

```json
{
  "authorization": {
    "key": "webhook.token",
    "prefix": "Bearer "
  }
}
```

静的 Headers には非機密の値を入れられます。

```json
{
  "x-dibao-plugin": "webhook",
  "x-dibao-event": "{{eventName}}"
}
```

## トラブルシューティング

- 送信記録がない：プラグインとルールが有効か、イベント名が正しいか、条件がすべてを除外していないか確認します。
- テスト送信は成功するが実イベントが発火しない：実 payload に条件で使っている path がない可能性があります。一時的に条件を減らして確認します。
- `failed` で `HTTP 401` または `HTTP 403`：secret key、Header 名、prefix、対象サービスの権限を確認します。
- `failed` で `HTTP 400`：endpoint が現在の body 形式を受け付けていない可能性があります。小さい JSON body で先にテストします。
- 全文が見えない：ルールで `Include content` を有効にします。全文は信頼し管理できる endpoint にだけ送ってください。
