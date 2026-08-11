---
title: 公式 Full Content Selectors プラグイン
description: Dibao 0.3.1 の Full Content Selectors で Web 記事本文取得を改善する。
---

Full Content Selectors は Dibao `0.3.0` 以降に公式 Docker image に同梱される公式 plugin です。plugin ID は `app.dibao.full-content-selectors` で、`v0.3.1` では `0.1.1` に更新されています。一般的な blog 記事構造に対して、built-in extraction より先に selector-based extraction を試します。

## 使う場面

既定では Dibao は RSS / Atom feed の content を使い、各 article の Web URL を request しません。Web full-content fetching は feed が明示的に `fetch_full_content` に設定された場合だけ行われます。

この plugin は次のような場合に向いています。

- Feed が summary だけを提供し、original web page に全文がある。
- 記事本文が `post-content`、`entry-content`、`article-content`、`markdown-body`、`prose`、`content` などの class を使う。
- navigation、footer、script、iframe、SVG などを取り除き、paragraph、heading、quote、list、code block を残したい。

## 有効化手順

1. Dibao `v0.3.1` に upgrade します。
2. `Settings` -> `Plugins` を開きます。
3. 公式 `Full Content Selectors` plugin を探します。
4. 有効化します。公式 plugin は image に同梱され、`.dibao-plugin` upload は不要です。
5. Feed Management を開き、Web 記事本文が必要な feed を選びます。
6. full-content mode を `Feed の内容を使用（既定）` から `Web 記事全文を取得` に変更します。
7. まず `全文取得をプレビュー` で結果を確認し、必要なら `現在の Feed 記事を取得` を実行します。

## 仕組み

plugin は `fullContentExtractors` contribution を宣言します。

```json
{
  "id": "balanced-readable-selectors",
  "title": "バランス型本文セレクター",
  "order": 10
}
```

有効化後、Dibao は article HTML を download し、`articleUrl`、`html`、`contentType` を enabled extractors に渡します。plugin は自身で network request を行いません。host が既に download した page content だけを処理します。形式不正、空、または短すぎる結果は built-in extractor へ安全に fallback します。

## Embeddings と Ranking

full-content extraction が成功すると、Dibao は article の effective content と content hash を更新します。hash が変わると embedding regeneration と ranking recalculation が queue に入ります。これは background work であり、記事を開く・scroll する経路では同期実行されません。

## Safety boundaries

- full-content fetching は feed が `fetch_full_content` の場合だけ行われます。
- Web request は controlled fetch を使い、timeout、maximum byte limit、redirect handling があります。
- v0.3.1 では NAS、home-network、自ホスト RSS のために feed discovery / refresh が private/local network URL を扱えます。一方、plugin outbound request と full-content fetching は controlled-fetch protection boundary を維持します。
- site が extraction に向かない、non-HTML を返す、text が短すぎる、network failure がある場合、Dibao は feed content を保持します。

## Troubleshooting

- preview が `feed_only` のまま: feed full-content mode が `Web 記事全文を取得` になっているか確認してください。
- preview が失敗する: original URL が reachable か、HTML を返すか、login が必要か、server-side request を block していないか確認します。
- recommendation がすぐ変わらない: embedding と ranking background jobs の完了を待ってください。
- extracted text が短すぎる: その site には dedicated third-party extractor が必要か、feed content のみを使う方がよい可能性があります。
