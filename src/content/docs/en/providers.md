---
title: Recommended Providers
description: Choose Ollama, SiliconFlow, Gemini, or an OpenAI-compatible embedding provider for Dibao.
---

Dibao works without an AI provider, but embeddings make recommendations more personal. Choose based on where you run Dibao.

## Choose By Host

| Deployment | Recommendation |
| --- | --- |
| Local MacBook, Mac mini, or Windows desktop/laptop | Use local Ollama first. It keeps reading data on the machine and avoids API cost. Recommended model: `bge-m3`; dimension: `1024`. |
| Home NAS or low-power mini PC | Prefer [SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) or Gemini unless the CPU is close to desktop-class and memory is comfortable. |
| VPS with at least `4 vCPU / 8GB RAM` | Ollama CPU can work for background embedding. Use `bge-m3`, and expect initial indexing to take time. |
| VPS below `4 vCPU / 8GB RAM` | Use SiliconFlow or Gemini. Small VPS instances should not spend limited CPU/RAM on embedding backfill. |

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

`bge-m3` is the default local recommendation because it is not oversized, works well for multilingual RSS, and is available directly from Ollama. For a lighter local option, use `nomic-embed-text` with dimension `768`.

## External Low-Cost Providers

| Provider | Settings |
| --- | --- |
| [SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) | Recommended model: `BAAI/bge-m3`. It is free, has no daily quota, and is rate-limited by RPM / TPM. Current L0 limits are 2,000 RPM and 500,000 TPM.<br>Type: `OpenAI-compatible`<br>Base URL: `https://api.siliconflow.cn/v1`<br>Model: `BAAI/bge-m3`<br>Dimension: `1024` |
| Gemini | Gemini embedding is also free and works well for a small personal RSS setup. Plan around the free tier's roughly 1,000 requests per day.<br>Type: `OpenAI-compatible`<br>Base URL: `https://generativelanguage.googleapis.com/v1beta/openai/`<br>Model: `gemini-embedding-001`<br>Dimension: `768` |

Free tiers, pricing, rate limits, and regional availability can change. Check provider pages before heavy use.

## In The App

Go to `Settings` -> `Recommended Provider`, choose the provider type, fill in Base URL, Model, Dimension, and API Key, then test the connection before setting it as current.

Changing model or dimension requires regenerating embeddings. Dibao keeps reading data, but vectors from different models cannot be mixed. If the provider is unavailable, reading still works and recommendations fall back to baseline ranking.
