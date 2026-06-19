---
title: 可观测性
tags: [observability, logging, metrics, tracing, slo, sli]
description: "你不能优化你看不见的东西——Logs/Metrics/Traces 三大支柱与 OpenTelemetry 标准"
draft: false
---

> 你不能优化你看不见的东西。

分布式系统的一个请求可能经过数十个微服务。当延迟突然飙升，如何快速定位是哪个服务出了问题？**可观测性**（Observability）通过三大信号回答这个问题。

---

## 三大支柱

| 信号 | 用途 | 示例 |
|------|------|------|
| **Logs** | 不可变的事件记录 | `ERROR: connection refused to postgres:5432` |
| **Metrics** | 随时间聚合的数值 | `http_request_duration_seconds{quantile=0.99}` |
| **Traces** | 请求在服务间的传播路径 | 前端 → API Gateway → UserService → DB |

---

## Prometheus 指标模型

Prometheus 的四种指标类型：

| 类型 | 行为 | 适用 |
|------|------|------|
| **Counter** | 只增不减 | 请求次数、错误次数 |
| **Gauge** | 可增可减 | CPU 使用率、内存占用 |
| **Histogram** | 分桶计数 | 请求延迟分布（P50/P95/P99） |
| **Summary** | 客户端分位数 | 同上但不需要服务端计算分位数 |

---

## SLO/SLI/Error Budget

- **SLI**（Service Level Indicator）：服务质量的客观衡量——如"99.9% 的请求在 300ms 内完成"
- **SLO**（Service Level Objective）：SLI 的目标值——如"99.9% → 99.5% 为告警阈值"
- **Error Budget**：允许的"不完美"额度——$1 - \text{SLO}$。Error Budget 耗尽意味着暂停新功能、专注稳定性

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Histogram 分桶 | [快速选择（Quickselect）——P99 的分位数近似算法](../../00-lingxi/04-algorithm-theory/) |
| 分布式链路追踪 | [TCP 的 IP 分包 ID——端到端追踪的标识传播](../../03-qiankun/05-network-protocol-stack/) |
| Error Budget | [CRC——错误预算驱动的重传策略](../../03-qiankun/06-transport-tcp-udp-quic/) |

:::tip[卷八内部路径]
- [**系统设计**](../02-system-design/)：熔断器——Error Budget 耗尽后的自动保护
- [**工程文化**](../05-engineering-culture/)：Blameless Postmortem——从事故中学习而非追责
:::
