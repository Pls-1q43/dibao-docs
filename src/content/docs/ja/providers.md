---
title: 推奨 Provider
description: Dibao で使う Ollama、SiliconFlow、Gemini、OpenAI-compatible embedding provider を選ぶ。
---

Dibao は AI provider なしでも使えます。Provider を設定すると、embedding によって推薦がより個人の読書傾向に近づきます。

## 実行環境で選ぶ

| 実行環境 | 推奨 | 理由 |
| --- | --- | --- |
| ローカルの MacBook、Mac mini、Windows デスクトップ / ノート PC | ローカル Ollama | API コストがなく、読書データを外に出しません。`bge-m3`、dimension `1024` を推奨。 |
| 家庭用 NAS または低消費電力ミニ PC | 外部 provider 優先 | 弱い CPU や小さいメモリでは embedding backfill が重くなります。 |
| `4 vCPU / 8GB RAM` 以上の VPS | Ollama CPU も可 | バックグラウンドでゆっくり生成できるなら `bge-m3` が使えます。 |
| `4 vCPU / 8GB RAM` 未満の VPS | SiliconFlow または Gemini | 小さな VPS では embedding を API に任せる方が安定します。 |

## ローカル Ollama

```bash
ollama pull bge-m3
```

| フィールド | 値 |
| --- | --- |
| Type | `Ollama` |
| Base URL | Docker Desktop で Dibao を動かし、Ollama をホスト側で動かす場合は `http://host.docker.internal:11434`。同じマシンで直接動かす場合は `http://127.0.0.1:11434`。 |
| Model | `bge-m3` |
| Dimension | `1024` |

`bge-m3` は多言語 RSS に向いています。より軽いローカル構成なら、`nomic-embed-text` と dimension `768` を検討できます。

## 外部の低コスト Provider

| Provider | 設定 |
| --- | --- |
| SiliconFlow | Type: `OpenAI-compatible`; Base URL: `https://api.siliconflow.cn/v1`; Model: `BAAI/bge-m3`; Dimension: `1024`; API Key は provider のコンソールで作成。 |
| Gemini | Type: `OpenAI-compatible`; Base URL: `https://generativelanguage.googleapis.com/v1beta/openai/`; Model: `gemini-embedding-001`; Dimension: `768`; API Key は Google AI Studio で作成。 |

無料枠、価格、レート制限、利用可能地域は変わることがあります。大量に使う前に provider 側の現在の情報を確認してください。

## アプリ内の設定

`Settings` -> `Algorithm` -> `Provider` に進み、Provider type、Base URL、Model、Dimension、API Key を入力します。接続テストに通ってから現在の Provider に設定してください。

モデルや dimension を変えた場合、embedding の再生成が必要です。Provider が利用できない場合でも読書機能は使え、推薦は基本の並び順に戻ります。
