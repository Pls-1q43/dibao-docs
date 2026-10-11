---
title: 推荐 Provider
description: 为 Dibao 选择 Ollama、SiliconFlow、Gemini 或 OpenAI-compatible embedding provider。
---

Dibao 没有强制绑定任何 AI 服务。你可以先跳过 provider，只用基础排序；也可以接入本地模型、免费额度或免费层的 embedding provider，让推荐更像“按你的兴趣整理过的 RSS”。

桌面版与同机 Ollama 使用 `http://127.0.0.1:11434`；Docker Desktop 访问宿主机通常用 `http://host.docker.internal:11434`。模型需要单独安装，邸报桌面安装包不包含模型。

## 先按部署环境选择

| 你的部署方式 | 推荐选择 | 原因与参数 |
| --- | --- | --- |
| 本地 MacBook、Mac mini、Windows 台式机 / 笔记本 | **Ollama 本地模型** | 本地电脑通常比小 VPS 更适合跑 embedding：不花 API 钱，阅读数据不出本机，首次索引慢一点也可以接受。推荐模型：`bge-m3`；Dimension：`1024`。 |
| 家用 NAS 或低功耗小主机 | **优先外部 provider** | 如果 CPU 较弱、内存紧张，embedding 会拖慢设备。建议直接用 [SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) 或 Gemini；如果设备接近桌面级 CPU 且内存充足，再考虑 Ollama。 |
| VPS >= `4 vCPU / 8GB RAM` | **可以用 Ollama CPU** | 可接受后台慢慢生成 embedding 的话，用 `bge-m3`；如果文章很多或机器还跑别的服务，仍建议外部 provider。 |
| VPS < `4 vCPU / 8GB RAM` | **SiliconFlow 或 Gemini** | 1-2 vCPU、1-4GB RAM 的 VPS 更适合把 embedding 交给 API，避免首次 backfill 和后续刷新挤占服务器资源。 |

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

`bge-m3` 是目前更适合 Dibao 默认推荐的本地模型：模型不算大，Ollama 上约 567M 参数，兼顾中文、日文、英文等多语言 RSS。只想更轻、更快时，可以把模型换成 `nomic-embed-text`，Dimension 填 `768`。

## 外部免费 / 低成本 Provider

| Provider | 适合谁 | Dibao 里怎么填 |
| --- | --- | --- |
| [SiliconFlow](https://cloud.siliconflow.cn/i/4wjbYmMH) | 支持 OpenAI-compatible embedding；示例为 `BAAI/bge-m3`，以控制台当前可用模型和额度为准。 | 类型：`OpenAI-compatible`<br>Base URL：`https://api.siliconflow.cn/v1`<br>Model：`BAAI/bge-m3`<br>Dimension：`1024`<br>API Key：硅基流动控制台创建 |
| Gemini | 使用 Gemini API 的 OpenAI-compatible embedding；费用、免费层与限速以当前账户为准。 | 类型：`OpenAI-compatible`<br>Base URL：`https://generativelanguage.googleapis.com/v1beta/openai/`<br>Model：`gemini-embedding-001`<br>Dimension：`768`<br>API Key：Google AI Studio 创建 |

免费额度、免费层、模型价格、限速和可用地区会变化。大量使用前请查看对应服务当前页面。

## 配置入口

进入 `设置` -> `推荐 provider`，选择类型并填写 Base URL、Model、Dimension、API Key，然后先 `测试连接`，再设为当前 Provider。

更换模型或维度后，需要重新生成 embedding。Dibao 会保留旧阅读数据，但不同模型的向量不能直接混用。Provider 不可用时，Dibao 仍可阅读 RSS，只是推荐会退回基础排序。

当前接口参考：[SiliconFlow Embeddings](https://siliconflow.readme.io/reference/createembedding)、[Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)、[Gemini 价格](https://ai.google.dev/gemini-api/docs/pricing)。
