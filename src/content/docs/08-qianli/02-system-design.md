---
title: 系统设计
tags: [system-design, load-balancing, caching, rate-limiting, circuit-breaker]
description: "从单体到百万 QPS——负载均衡、缓存与熔断的系统设计核心"
draft: false
---

> 从单体到百万 QPS。

系统设计的标准技术栈覆盖四大核心组件。

---

## 负载均衡与缓存

| 负载均衡策略 | 适用 |
|-------------|------|
| **Round Robin** | 无状态同构服务 |
| **Least Connections** | 长连接场景 |
| **Consistent Hash** | 缓存集群（减少缓存失效） |

| 缓存模式 | 读写路径 |
|---------|---------|
| **Cache-Aside** | 应用查缓存→未命中→查DB→填缓存 |
| **Write-Behind** | 写缓存→异步写 DB |

---

## 限流与熔断

```mermaid
---
title: 令牌桶限流 + 熔断器状态机
---
graph LR
    TOKENS["令牌桶<br/>恒定速率放令牌<br/>容量上限允许突发"] --> PASS["请求通过"]
    PASS --> CB{"熔断器状态"}
    CB -->|"关闭"| FWD["正常转发"]
    CB -->|"打开"| FALLBACK["返回降级响应"]
    CB -->|"半开"| PROBE["探测请求"]

    style TOKENS fill:#e3f2fd
    style FALLBACK fill:#ffcdd2
```

**令牌桶**：恒定速率放令牌，容量上限允许短时突发。**熔断器**：错误率超阈值 → 跳闸 → 冷却期后发送探测 → 成功则关闭。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Consistent Hash | [Chord DHT 分布式哈希表](../../04-yuanhai/03-distributed-fundamentals/) |
| 令牌桶 | [TCP 流量整形的漏桶算法](../../03-qiankun/06-transport-tcp-udp-quic/) |

:::tip[卷八内部路径]
- [**可观测性**](../04-observability/)：熔断器状态必须暴露 Metrics
- [**DevOps 实践**](../03-devops-practices/)：K8s——系统设计的编排实现
:::
