---
title: 推奨 Provider
description: Dibao で Ollama、SiliconFlow、Gemini、OpenAI-compatible embedding provider を選ぶ。
---

Dibao は AI provider なしでも使えます。Provider を設定すると、embedding によって推薦がより個人の読書傾向に近づきます。まずは Dibao をどこで動かすかで選びます。

同じ PC の Desktop と Ollama は `http://127.0.0.1:11434`、Docker Desktop からホストへは通常 `http://host.docker.internal:11434` を使います。モデルは別途導入し、Desktop のインストーラーには含みません。

## 実行環境で選ぶ

| 実行環境 | 推奨 |
| --- | --- |
| ローカルの MacBook、Mac mini、Windows desktop / notebook | まずは local Ollama。読書データを外に出さず、API cost もかかりません。推奨 model は `bge-m3`、dimension は `1024`。 |
| 家庭用 NAS または低消費電力 mini PC | CPU や memory に余裕がなければ、[SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) または Gemini を優先します。 |
| `4 vCPU / 8GB RAM` 以上の VPS | Ollama CPU でも background embedding は可能です。`bge-m3` を使い、初回 indexing には時間がかかる前提で運用します。 |
| `4 vCPU / 8GB RAM` 未満の VPS | SiliconFlow または Gemini を推奨します。小さな VPS で embedding backfill に CPU / RAM を使い切らないためです。 |

## Local Ollama

```bash
ollama pull bge-m3
```

| Field | Value |
| --- | --- |
| Type | `Ollama` |
| Base URL | Docker Desktop で Dibao を動かし、Ollama を host 側で動かす場合は `http://host.docker.internal:11434`。同じ machine で Docker なしに直接動かす場合は `http://127.0.0.1:11434`。 |
| Model | `bge-m3` |
| Dimension | `1024` |

`bge-m3` は、中国語、日本語、英語を含む多言語 RSS に向いており、Ollama から直接利用できます。より軽く速い local 構成が必要な場合は、`nomic-embed-text` と dimension `768` を検討できます。

## 外部の無料 / 低コスト provider

| Provider | 設定 |
| --- | --- |
| [SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) | OpenAI-compatible Embedding に対応し、`BAAI/bge-m3` は設定例です。利用可能モデルとアカウントの枠を確認してください。<br>Type: `OpenAI-compatible`<br>Base URL: `https://api.siliconflow.cn/v1`<br>Model: `BAAI/bge-m3`<br>Dimension: `1024` |
| Gemini | Gemini API の OpenAI-compatible Embedding を使います。料金、無料枠、制限は現在のアカウントに従います。<br>Type: `OpenAI-compatible`<br>Base URL: `https://generativelanguage.googleapis.com/v1beta/openai/`<br>Model: `gemini-embedding-001`<br>Dimension: `768` |

無料枠、価格、rate limit、利用可能地域は変更されることがあります。大量に使う前に provider の現在ページを確認してください。

## アプリ内の設定

`Settings` -> `Recommended Provider` に進み、provider type、Base URL、Model、Dimension、API Key を入力します。接続テストに通ってから現在の Provider に設定してください。

Model や dimension を変更した場合、embedding は再生成が必要です。Dibao は読書データを保持しますが、異なる model の vector はそのまま混在できません。Provider が利用できない場合でも RSS reader としては使えますが、推薦は基本的な並び順に戻ります。

現在の接口：[SiliconFlow Embeddings](https://siliconflow.readme.io/reference/createembedding)、[Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)、[Gemini 料金](https://ai.google.dev/gemini-api/docs/pricing)。
