---
title: 推荐 Provider
description: 为 Dibao 选择 Ollama、SiliconFlow、Gemini 或 OpenAI-compatible embedding provider。
---

Dibao 没有强制绑定任何 AI 服务。你可以先跳过 provider，只用基础排序；也可以接入本地模型、免费额度或免费层的 embedding provider，让推荐更像“按你的兴趣整理过的 RSS”。

## 先按部署环境选择

| 你的部署方式 | 推荐选择 | 原因与参数 |
| --- | --- | --- |
| 本地 MacBook、Mac mini、Windows 台式机 / 笔记本 | Ollama 本地模型 | 不花 API 钱，阅读数据不出本机。推荐模型：`bge-m3`；Dimension：`1024`。 |
| 家用 NAS 或低功耗小主机 | 优先外部 provider | 弱 CPU 或小内存会被 embedding 拖慢。优先用 SiliconFlow 或 Gemini。 |
| VPS >= `4 vCPU / 8GB RAM` | 可以用 Ollama CPU | 可接受后台慢慢生成 embedding 的话，用 `bge-m3`。 |
| VPS < `4 vCPU / 8GB RAM` | SiliconFlow 或 Gemini | 小 VPS 更适合把 embedding 交给 API。 |

## 本地 Ollama

```bash
ollama pull bge-m3
```

| 字段 | 填写 |
| --- | --- |
| 类型 | `Ollama` |
| Base URL | Docker Desktop 上通常填 `http://host.docker.internal:11434`；非 Docker 同机运行可填 `http://127.0.0.1:11434` |
| Model | `bge-m3` |
| Dimension | `1024` |

`bge-m3` 适合中文、日文、英文等多语言 RSS。如果只想更轻、更快，可以换成 `nomic-embed-text`，Dimension 填 `768`。

## 外部低成本 Provider

| Provider | 邸报里怎么填 |
| --- | --- |
| SiliconFlow | 类型：`OpenAI-compatible`；Base URL：`https://api.siliconflow.cn/v1`；Model：`BAAI/bge-m3`；Dimension：`1024`；API Key：在控制台创建。 |
| Gemini | 类型：`OpenAI-compatible`；Base URL：`https://generativelanguage.googleapis.com/v1beta/openai/`；Model：`gemini-embedding-001`；Dimension：`768`；API Key：在 Google AI Studio 创建。 |

免费额度、模型价格、限速和可用地区会变化。大量使用前请查看对应服务的当前页面。

## 配置入口

进入 `设置` -> `算法` -> `Provider`，选择类型并填写 Base URL、Model、Dimension、API Key，然后先 `测试连接`，再设为当前 Provider。

更换模型或维度后，需要重新生成 embedding。Dibao 会保留旧阅读数据，但不同模型的向量不能直接混用。Provider 不可用时，Dibao 仍可阅读 RSS，只是推荐退回基础排序。
