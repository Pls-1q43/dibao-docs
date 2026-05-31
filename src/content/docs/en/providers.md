---
title: Recommended Providers
description: Choose Ollama, SiliconFlow, Gemini, or an OpenAI-compatible embedding provider for Dibao.
---

Dibao works without an AI provider, but embeddings make recommendations more personal. Choose based on where you run Dibao.

## Choose By Host

| Deployment | Recommendation | Why |
| --- | --- | --- |
| Local MacBook, Mac mini, or Windows desktop/laptop | Local Ollama | No API cost and reading data stays on the machine. Use `bge-m3`, dimension `1024`. |
| Home NAS or low-power mini PC | Prefer an external provider | Weak CPUs and small memory make embedding backfill slow. Use SiliconFlow or Gemini first. |
| VPS with at least `4 vCPU / 8GB RAM` | Ollama CPU can work | Use `bge-m3` if slow background embedding is acceptable. |
| VPS below `4 vCPU / 8GB RAM` | SiliconFlow or Gemini | Small VPS instances should not spend limited CPU/RAM on embedding. |

## Local Ollama

```bash
ollama pull bge-m3
```

| Field | Value |
| --- | --- |
| Type | `Ollama` |
| Base URL | `http://host.docker.internal:11434` when Dibao runs in Docker Desktop and Ollama runs on the host; `http://127.0.0.1:11434` when both run directly on the same machine |
| Model | `bge-m3` |
| Dimension | `1024` |

`bge-m3` works well for multilingual RSS. For a lighter local option, use `nomic-embed-text` with dimension `768`.

## External Low-Cost Providers

| Provider | Settings |
| --- | --- |
| SiliconFlow | Type: `OpenAI-compatible`; Base URL: `https://api.siliconflow.cn/v1`; Model: `BAAI/bge-m3`; Dimension: `1024`; API Key: create one in the provider console. |
| Gemini | Type: `OpenAI-compatible`; Base URL: `https://generativelanguage.googleapis.com/v1beta/openai/`; Model: `gemini-embedding-001`; Dimension: `768`; API Key: create one in Google AI Studio. |

Free tiers, pricing, rate limits, and regional availability can change. Check provider pages before heavy use.

## In The App

Go to `Settings` -> `Algorithm` -> `Provider`, choose the provider type, fill in Base URL, Model, Dimension, and API Key, then test the connection before setting it as current.

Changing model or dimension requires regenerating embeddings. Dibao keeps reading data, but vectors from different models cannot be mixed. If the provider is unavailable, reading still works and recommendations fall back to baseline ranking.
