---
title: 系统设计
tags: [system-design, load-balancing, caching, rate-limiting, circuit-breaker]
description: "从单体到百万 QPS——负载均衡、缓存策略、限流算法与熔断降级的系统设计核心"
draft: false
---

> 从单体到百万 QPS。

系统设计面试的经典问题"设计一个 Twitter/YouTube/Uber"背后是一套标准技术栈。本章覆盖这套技术栈的四大核心组件。

---

## 负载均衡

| 策略 | 原理 | 适用 |
|------|------|------|
| **Round Robin** | 轮流分配 | 无状态、同构服务 |
| **Least Connections** | 分配给连接数最少的节点 | 长连接场景 |
| **Consistent Hash** | 哈希环——节点增减只影响邻域 | 缓存集群（减少缓存失效） |

---

## 缓存策略

| 模式 | 读路径 | 写路径 |
|------|--------|--------|
| **Cache-Aside** | 应用查缓存 → 未命中 → 查 DB → 填缓存 | 应用写 DB → 失效缓存 |
| **Read-Through** | 缓存层自动查 DB | — |
| **Write-Behind** | — | 应用写缓存 → 异步写 DB |

---

## 限流与熔断

**令牌桶**：以恒定速率向桶中放入令牌，每个请求消耗一个令牌。桶有容量上限——允许短时突发流量。

**熔断器**（Circuit Breaker）：当下游服务错误率超过阈值（如 50%），熔断器跳闸——不再发送请求，直接返回降级响应。经过冷却期后，发送探测请求——如果成功，关闭熔断器；如果失败，继续熔断。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Consistent Hash | [分布式哈希表（DHT）——Chord 协议](../../04-yuanhai/03-distributed-fundamentals/) |
| 令牌桶 | [漏桶——与 TCP 的令牌桶流量整形的异同](../../03-qiankun/06-transport-tcp-udp-quic/) |
| 熔断器 | [TCP 超时重传——指数退避与熔断冷却期的类比](../../03-qiankun/06-transport-tcp-udp-quic/) |

:::tip[卷八内部路径]
- [**设计模式与原则**](../01-design-patterns-and-principles/)：代理模式——负载均衡的反向代理
- [**可观测性**](../04-observability/)：熔断器状态必须暴露 Metrics
:::
