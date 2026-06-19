---
title: 存储引擎
tags: [storage-engine, b-tree, lsm-tree, wal, compaction]
description: "数据如何持久、如何查找——B+Tree 与 LSM Tree 的存储哲学对决"
draft: false
---

> 数据如何持久、如何查找。

关系型数据库的 SQL 层提供了统一的查询语言，但数据真正"落地"的方式由**存储引擎**决定。同一份 MySQL 实例，使用 InnoDB 还是 MyRocks 存储引擎，性能特征可能相差十倍——前者擅长随机读写（B+Tree），后者擅长顺序写入（LSM Tree）。

本章对比了两大存储引擎家族——B+Tree 和 LSM Tree——在数据结构、写放大、读放大的根本差异，深入 WAL 的崩溃恢复机制和压缩策略的选择，最后触及列式存储与 OLAP 的分析范式。

---

## B+Tree：读优化的经典

InnoDB 的 B+Tree 将数据直接存储在叶节点中（聚簇索引），主键查找仅需从根到叶的一次遍历（通常 2-4 次 I/O）。但**写入不是原地更新**——修改一行数据可能需要页分裂（Page Split）：当一页填满到超过填充率阈值时，B+Tree 将页一分为二，更新父节点的键范围指针。

写入放大的根源就在于页分裂和页合并——一次逻辑写入可能触发多次物理页的重组织。

---

## LSM Tree：写优化的崛起

LSM Tree（Log-Structured Merge Tree）采用完全不同的哲学：**所有写入都是顺序追加到内存中的 MemTable**。MemTable 填满后冻结为不可变的 SSTable（Sorted String Table），刷写到磁盘。多个 SSTable 在后台通过**压缩**（Compaction）合并为更大、更稀疏的 SSTable：

```
写入路径：WAL → MemTable（内存）→ SSTable L0 → L1 → L2 → ... → Ln
读取路径：MemTable → SSTable L0 → L1 → ...（逐层查找，直到找到 key）
```

LSM Tree 的**写放大**远低于 B+Tree（顺序写 vs 随机写），但**读放大**更高（需要查找多层 SSTable）。这正是为什么 LSM Tree 引擎（如 RocksDB、MyRocks）在写入密集型工作负载（时序数据、消息队列）中表现优异，但在频繁点查场景下不如 InnoDB。

### 压缩策略的选择

| 策略 | 特点 | 写放大 | 读放大 |
|------|------|--------|--------|
| **Size-Tiered** | 等大小的 SSTable 合并 | 低 | 高（多层重叠） |
| **Leveled** | 每层内部无重叠，按 key 范围分布 | 较高 | 低（每层至多一个 SSTable 包含某 key） |

---

## WAL：崩溃恢复的最后防线

WAL（Write-Ahead Log）是存储引擎的"黑匣子"——在任何数据页被修改之前，修改的 redo 日志必须先持久化到 WAL。崩溃恢复时，存储引擎从最后一个检查点（Checkpoint）开始重放 WAL，将已提交但未写入数据页的事务重新应用到数据页。

WAL 的关键设计约束：**日志必须在数据之前持久化**（WAL 规则）。违反这一规则，InnoDB 在崩溃后可能丢失已提交的事务——这正是 `innodb_flush_log_at_trx_commit = 1`（每次提交都 fsync WAL）成为生产环境最佳实践的原因。

---

## 列式存储与 OLAP

行式存储（如 InnoDB）将一行的所有列连续存储——适合 `SELECT *` 的事务型查询（OLTP）。列式存储（如 Parquet、ClickHouse）将同一列的所有行的值连续存储——适合聚合分析（OLAP）：

```
行式：Row1[colA|colB|colC] Row2[colA|colB|colC]
列式：colA[Row1|Row2|...] colB[Row1|Row2|...]
```

当查询 `SELECT AVG(price) FROM orders` 时，列式引擎只需读取 `price` 这一列的压缩数据——其他列完全不需要访问。配合向量化执行（SIMD 指令一次处理 256 位数据），列式引擎的聚合分析速度可以是行式引擎的 100 倍以上。

---

## 跨卷连接

存储引擎是"数据从内存落盘"的终极学问——它的 WAL、页缓存和压缩策略直接对接操作系统的文件系统和 I/O 接口：

| 本章概念 | 依赖的底层原理 | 支撑的上层抽象 |
|----------|---------------|---------------|
| B+Tree 页分裂 | [虚拟内存的缺页中断——写时复制语义](../03-qiankun/02-memory-management/#缺页中断与页面置换) | [Git 的 Merkle DAG 存储模型](../../08-qiankuai/) |
| LSM Tree 分层压缩 | [DRAM 行缓冲与刷新周期](../../01-weichen/04-memory-hierarchy/#dram-内部结构一个单元的微观世界) | [Kafka 分段日志与 Log Compaction](../05-data-pipelines/) |
| WAL 与 REDO Log | [ext4 日志的有序模式](../03-qiankun/03-filesystem/#日志崩溃一致性的保证) | [Raft 的 RSM 日志复制](../04-consensus-protocols/) |
| 列式 SIMD 向量化 | [GPU SIMD 指令与数据并行](../../01-weichen/05-instruction-set-architecture/#cisc-与-risc两套哲学的五十年对决) | [Parquet + Arrow 内存格式](../05-data-pipelines/) |

:::tip[卷四内部路径]
- [**关系型数据库**](../01-relational-database/)：SQL 层 + 查询优化器——存储引擎的上层接口
- [**分布式基础**](../03-distributed-fundamentals/)：分库分表——存储引擎的水平扩展
- [**数据流水线**](../05-data-pipelines/)：CDC（Change Data Capture）——存储引擎日志的流式消费
:::
