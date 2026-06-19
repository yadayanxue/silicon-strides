---
title: 数据流水线
tags: [kafka, flink, stream-processing, batch-processing, etl]
description: "让数据流动起来——从 Kafka 分区到 Flink 状态管理的流式数据引擎"
draft: false
---

> 让数据流动起来。

数据库擅长存储和查询"当前状态"——但不擅长描述"状态如何变化"。**数据流水线**（Data Pipeline）将数据视为持续的**事件流**——用户的每一次点击、传感器的每一次采样、交易的每一次提交——由流处理引擎实时响应，或由批处理引擎定期分析。

本章从 Kafka 的分布式日志架构出发，解剖流处理的两种时间语义，深入 Flink 的状态管理与检查点机制，最后对比 Lambda 与 Kappa 架构的演进路线。

---

## Kafka：分布式不可变日志

Kafka 的核心抽象是一个**分区化的不可变日志**（Partitioned Immutable Log）。每个主题（Topic）被切分为多个有序分区（Partition），每条消息在分区内有一个单调递增的**偏移量**（Offset）：

```
Topic: orders
 ├── Partition 0: [offset0, offset1, offset2, ...]
 ├── Partition 1: [offset0, offset1, offset2, ...]
 └── Partition 2: [offset0, offset1, offset2, ...]
```

分区内的消息**严格有序**，但跨分区无顺序保证。消费者通过维护消费偏移量（Consumer Offset）来追踪进度——这与[LSM Tree](../02-storage-engine/#lsm-tree写优化的崛起)的 SSTable 结构共享同一种设计哲学（追加写 + 不可变）。

### ISR：同步副本集

Kafka 的每条消息在集群中复制 N 份（由 `replication.factor` 决定）。**ISR**（In-Sync Replicas）是当前与 Leader 保持同步的副本集合——当 Follower 落后超过 `replica.lag.time.max.ms`（默认 30s），它被踢出 ISR。消息只有在 ISR 中的所有副本确认后才视为已提交——类似 [Raft 的多数确认](../04-consensus-protocols/#raft为可理解性而设计)。

---

## 流处理：事件时间 vs 处理时间

流处理引擎对"时间"的定义有两种：

| 时间语义 | 定义 | 窗口计算示例 | 优点 | 缺点 |
|---------|------|------------|------|------|
| **事件时间**（Event Time） | 事件在数据源实际发生的时间 | 过去 1 小时内发生的所有点击 | 语义正确，与延迟无关 | 需要处理乱序和水位线 |
| **处理时间**（Processing Time） | 事件被流处理引擎收到的时间 | 过去 1 小时内收到的所有点击 | 低延迟，实现简单 | 结果取决于消费速度 |

**水位线**（Watermark）是事件时间处理的基石——它告诉引擎"所有时间戳早于 T 的事件都已到达"。水位线使引擎可以在正确时间触发窗口计算，同时允许一定的乱序容忍度。

---

## Flink：状态化的流处理

Apache Flink 将**状态**（State）作为第一公民——每个算子都可以持有本地状态，状态与事件流一起参与计算。Flink 通过**检查点**（Checkpoint）实现状态的故障恢复：

1. 协调者向所有算子注入**栅栏**（Barrier），Barrier 沿数据流图传播
2. 每个算子收到 Barrier 后，将自己的状态异步写入持久化存储
3. 所有算子完成状态备份后，本次检查点完成

如果故障发生，Flink 从最近的检查点恢复所有状态，并将事件流回退到检查点时的偏移量——实现 **Exactly-Once** 语义。

### Lambda vs Kappa 架构

| 架构 | 批处理层 | 流处理层 | 存储 | 复杂度 |
|------|---------|---------|------|--------|
| **Lambda** | MapReduce/Spark 批处理（长延迟、高精度） | Storm/Flink 流处理（低延迟、近似） | 批处理层 + 流处理层双写 | 高（两套代码、两套逻辑） |
| **Kappa** | 不需要——流处理引擎本身提供 Reprocessing | Flink/Kafka Streams（单引擎） | Kafka 日志长期保留 + 重置偏移量回放 | 低（单套代码） |

Kappa 架构的核心思想：**批处理只是流处理的一个特例——从第一个偏移量回放到最后一个偏移量**。Kafka 的长期日志保留（可配置为永久）使这一思想成为现实。

---

## 跨卷连接

数据流水线是数据库存储引擎的"流式镜像"——Kafka 的日志就是 LSM Tree 的 WAL 在网络上的投影，Flink 的状态检查点就是数据库的检查点加上分布式快照：

| 本章概念 | 依赖的底层原理 | 支撑的上层抽象 |
|----------|---------------|---------------|
| Kafka 分区日志 | [LSM Tree 的 SSTable 分层追加](../02-storage-engine/#lsm-tree写优化的崛起) | [事件溯源（Event Sourcing）模式](../../08-qianli/01-design-patterns-and-principles/) |
| Exactly-Once 语义 | [数据库 WAL + 两阶段提交](../03-distributed-fundamentals/#分布式事务2pc3pctcc) | [微服务 Saga 的补偿事务](../../08-qianli/02-system-design/) |
| Flink 检查点 | [操作系统的进程快照 CRIU](../03-qiankun/01-process-and-thread/) | [Kubernetes 的容器检查点](../../08-qianli/03-devops-practices/) |
| 水位线乱序处理 | [TCP 乱序包的重排缓冲区](../03-qiankun/06-transport-tcp-udp-quic/) | [实时仪表板的最大延迟显示](../../05-wanxiang/04-data-visualization/) |

:::tip[卷四内部路径]
- [**关系型数据库**](../01-relational-database/)：MVCC 快照隔离——流处理的时间旅行语义
- [**存储引擎**](../02-storage-engine/)：LSM Tree 压缩——Kafka Log Compaction 的原型
- [**共识协议**](../04-consensus-protocols/)：Raft——Kafka 的 ISR 与 KRaft 共识基础
:::
