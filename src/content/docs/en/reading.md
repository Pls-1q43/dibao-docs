---
title: Reading And Related Articles
description: Understand Dibao v0.4 related articles, suggestions after likes, pagination, and article states.
---

Dibao ranks and discovers articles only inside your subscribed RSS / Atom feeds. Current `v0.4.1` includes v0.4 reader discovery.

## Related Articles And More

The reader shows up to 5 related articles below the body, excluding the current article, duplicates sharing its groups, hidden items, and items marked not interested. Read or liked articles may still appear.

More opens a related-article search with 50 articles per page and state filters. The implementation considers up to 500 nearest neighbors and retains similarity **strictly greater than 0.35**, rather than scanning the entire library. This threshold applies only to expanded search, not the inline preview, so results may differ.

## Suggestions After A Like

A successful like can reveal personalized next-read suggestions. These combine the current article's topic with your recommendations and exclude read, favorited, and liked articles. Enough candidates are not guaranteed for every like.

## Unavailable Results

Discovery requires an existing active embedding index and a vector for the current article. Missing prerequisites are reported; opening the panel does not recompute vectors on demand.

Check the [Provider](/en/providers/), background embedding/ranking jobs, and whether the article is indexed. Offline mode does not run online discovery queries; disconnected Desktop does not call external embedding services to generate results.

## Recommendation Pagination

Recommendations use a fixed session sequence to reduce duplicates and omissions during background reranking. Offline lists keep snapshot order. Saving, opening, and progress update row state; hiding or marking not interested can remove the row.

## Article States

- Unread: untouched articles. Saving, liking, read-later, opening, reading, or read state leave unread.
- Read: opening alone does not mean finished; an explicit read action or reading-state rule must mark it read.
- Favorites and Read later: can coexist with opened, reading, or read state.
- Scroll-past ignore: controlled in Settings → Reading and applies only to untouched articles. Saved or opened articles are not treated as ignored by later scrolling.

## Official Daily Brief

[Daily Brief](/en/plugins/daily-brief/) groups ranked personalized articles from the past 24 hours by topic and keeps brief history. It depends on ranked inventory rather than providing a complete feed newsletter. [Webhook](/en/plugins/webhook/) can forward the generated event.
