---
title: Official Full Content Selectors Plugin
description: Use Dibao 0.3.1 Full Content Selectors to improve web-article extraction.
---

Full Content Selectors is an official plugin bundled with Dibao starting in `0.3.0`. Its plugin ID is `app.dibao.full-content-selectors`, and `v0.3.1` updates it to `0.1.1`. It provides a selector-based full-content extractor that runs before Dibao's built-in extraction for common blog article structures.

## When To Use It

By default, Dibao uses content from the RSS / Atom feed and does not request each article web URL. Web full-content fetching happens only when a feed is explicitly set to `fetch_full_content`.

Use this plugin when:

- A feed only provides summaries, but the original web page has the full article.
- Article bodies commonly use classes such as `post-content`, `entry-content`, `article-content`, `markdown-body`, `prose`, or `content`.
- You want navigation, footers, scripts, iframes, SVGs, and other noise removed while preserving paragraphs, headings, quotes, lists, and code blocks.

## Enable It

1. Upgrade to Dibao `v0.3.1`.
2. Open `Settings` -> `Plugins`.
3. Find the official `Full Content Selectors` plugin.
4. Enable it. Official plugins ship with the image and do not require uploading a `.dibao-plugin` file.
5. Open Feed Management and select the feed that needs web article bodies.
6. Change full-content mode from `Use feed content (default)` to `Fetch full web article`.
7. Use `Preview full content fetch` first, then run `Fetch current feed articles` if the result looks useful.

## How It Works

The plugin declares a `fullContentExtractors` contribution:

```json
{
  "id": "balanced-readable-selectors",
  "title": "Balanced readable selectors",
  "order": 10
}
```

When enabled, Dibao downloads the article HTML and passes `articleUrl`, `html`, and `contentType` to enabled extractors. The plugin does not make its own network request; it only processes the page content the host already downloaded. If the plugin returns malformed, empty, or too-short content, Dibao safely falls back to the built-in extractor.

## Embeddings And Ranking

When full-content extraction succeeds, Dibao updates the article's effective content and content hash. If the hash changes, embedding regeneration and ranking recalculation are enqueued. This is background work and does not happen synchronously when opening or scrolling articles.

## Safety Boundaries

- Full-content fetching only happens for feeds set to `fetch_full_content`.
- Web requests use controlled fetch with timeouts, maximum byte limits, and redirect handling.
- v0.3.1 allows feed discovery / refresh to access private or local network URLs for NAS, home-network, and self-hosted RSS use cases. Plugin outbound requests and full-content fetching still keep controlled-fetch protection boundaries.
- If a site is unfriendly to extraction, returns non-HTML, returns too little text, or fails over the network, Dibao keeps the feed content.

## Troubleshooting

- Preview still shows `feed_only`: confirm the feed full-content mode is `Fetch full web article`.
- Preview fails: check whether the original URL is reachable, returns HTML, requires login, or blocks server-side requests.
- Recommendations do not change immediately: wait for embedding and ranking background jobs.
- Extracted text is too short: the site may need a dedicated third-party extractor, or it may be better to use feed content only.
