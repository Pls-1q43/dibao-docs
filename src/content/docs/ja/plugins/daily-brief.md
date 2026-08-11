---
title: 公式 Daily Brief プラグイン
description: Dibao 0.3.1 の公式 Daily Brief plugin で topic ごとの daily recommendation digest を生成する。
---

Daily Brief は Dibao の公式 Docker image に同梱される公式 plugin です。plugin ID は `app.dibao.daily-brief` で、`v0.3.1` に同梱される version は `0.1.1` です。過去 24 時間の personalized recommendations から記事を選び、興味 topic ごとにまとめた daily digest を保存します。

## 有効化手順

1. Dibao `v0.3.1` に upgrade します。
2. `Settings` -> `Plugins` を開きます。
3. 公式 `Daily Brief` plugin を探します。
4. 有効化します。main navigation に `Daily Brief` page が追加され、Settings に `Daily Brief` tab が表示されます。

公式 plugin は image に同梱され、`.dibao-plugin` upload は不要です。サードパーティ plugin のように uninstall することもできません。新規 instance の optional setup flow にも Daily Brief が表示され、既定では有効化が推奨されます。

## 生成される内容

Daily Brief は過去 24 時間の ranked personalized winners を読み、次を生成します。

- 生成時刻、対象 window、timezone、article count。
- recommendation topic family ごとに group された article list。
- 各 article の title、original URL、feed、published time、ranking score、recommendation reason、readable summary。
- より細かい cluster がある場合は article entry に cluster label。
- 現在の settings に一致する article がない場合は `no_articles_for_settings` の empty state。

これは全 RSS の newsletter でも offline full-article archive でもありません。Dibao の recommendation ranking に入った article だけを選ぶため、provider、embedding、ranking、worker health が結果に影響します。

## Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Enabled | `true` | 無効化すると settings と history は残り、scheduled generation だけ止まります。 |
| Scheduled time | `08:00` | local time で `dailyBrief.generate` task を毎日実行します。 |
| Timezone | `UTC` | 普段使う timezone、たとえば `Asia/Shanghai` に変更してください。 |
| Article count | `20` | 5 から 50。plugin は多めに candidate を読み、topic ごとに分散します。 |
| Excluded topics | Empty | brief に出したくない topic family または cluster を除外します。 |

settings を保存すると background schedule が同期されます。Daily Brief page から今日の brief を手動生成または再生成できます。

## 生成の動作

- scheduled task ID は `dailyBrief.generate` です。
- plugin は設定 timezone で日付を計算し、`brief:YYYY-MM-DD` として保存します。
- 今日の brief が既にある場合、通常生成は cached brief を再利用します。forced manual generation は今日の brief を置き換えます。
- 最新 30 件の brief を保持します。
- article summary は HTML、script、style を取り除き、280 characters 以内に短縮されます。
- brief は生成時点の article snapshot を保存します。後で source article が変更または削除されても、過去 brief はできるだけ readable に保たれます。

## Recommendation への依存

Daily Brief は `ranking.listRankedWinners` に依存します。おすすめの流れは次の通りです。

1. 利用可能な embedding provider を設定します。
2. feed を refresh して new articles を discover します。
3. embedding、ranking、recommendation inventory jobs の完了を待ちます。
4. recommendation view に十分な articles があることを確認します。

Dibao を入れた直後や OPML import 直後は、最初の brief が空になることがあります。background jobs を待ってから再生成してください。

## Topic Filtering

plugin は recommendation system の topic targets を読みます。除外できるのは次の 2 種類です。

- Family: source や theme family を表す広い interest topic。
- Cluster: family 内のより具体的な topic。

除外は future briefs に効きます。既存 brief は article snapshot を保持しますが、topic を手動 rename した場合、family / cluster label はできるだけ新しい表示名で補完されます。

## Webhook 連携

brief 生成後、Dibao は `dailyBrief.generated` event を発火します。[公式 Webhook plugin](/ja/plugins/webhook/) でこの event を監視し、chat bot、archive script、automation workflow に送信できます。

Webhook body 例:

```json
{
  "source": "dibao",
  "eventName": "{{eventName}}",
  "brief": "{{event.brief}}",
  "generatedAt": "{{generatedAt}}"
}
```

## Troubleshooting

- navigation に Daily Brief がない: `Settings` -> `Plugins` で公式 plugin が有効か確認してください。
- 今日の brief が空: provider、embedding、ranking、recommendation inventory、過去 24 時間の記事有無を確認してください。
- scheduled generation の時刻がずれる: Daily Brief settings の timezone と scheduled local time を確認してください。
- 記事が少ない、topic が偏る: active feed を増やすか、exclusions を減らします。plugin は family ごとに分散しますが candidate pool に制限されます。
- 今日の brief を作り直したい: Daily Brief page から manual / forced generation を実行します。
