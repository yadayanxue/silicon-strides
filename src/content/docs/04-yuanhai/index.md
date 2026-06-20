---
title: 卷四 · 渊海（数据与分布式）
tags: [database, distributed, storage, consensus]
---

> 数据如渊，共识如海。

渊海者，深邃无垠。此卷从单机数据库引擎深入到分布式系统的广阔海洋——事务的 ACID、复制的取舍、共识的极限、一致性的光谱。当一台机器无法承载时，我们如何让万千节点协同如一？

## 章节导览

- [**关系型数据库**](./01-relational-database/)：SQL、索引、查询优化、事务与 MVCC
- [**存储引擎**](./02-storage-engine/)：B+ Tree、LSM Tree、WAL、压缩与合并
- [**分布式基础**](./03-distributed-fundamentals/)：CAP 定理、一致性模型、向量时钟
- [**共识协议**](./04-consensus-protocols/)：Paxos、Raft、Zab、PBFT
- [**数据流水线**](./05-data-pipelines/)：Kafka、Flink、流批一体

:::tip[跨卷链接]
B+ Tree 与内存页 → [卷三 · 乾坤](../../03-qiankun/) 中的虚拟内存页面管理
向量时钟与逻辑时钟 → [卷零 · 灵犀](../../00-lingxi/) 中的偏序关系
分布式训练数据管道 → [卷六 · 须弥](../../06-xumi/) 中的数据并行策略
:::
