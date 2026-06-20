---
title: 关系型数据库
tags: [sql, index, query-optimizer, transaction, mvcc]
description: "关系代数如何统治世界——从 B+Tree 索引到 MVCC 事务的数据库内核剖析"
draft: false
---

> 关系代数如何统治世界。

1970 年 Codd 提出关系模型。五十年后，关系型数据库依然是数据存储的主流——因为它提供了 **ACID 事务**这一强大承诺。本章深入 B+Tree 索引、查询优化器与 MVCC 多版本并发控制。

---

## B+Tree 索引：磁盘友好的查找树

B+Tree 每个节点包含数百个键，使整棵树高度仅 2-4 层。所有数据指针只存在于叶节点——叶节点通过双向链表连接，范围查询沿链表顺序扫描。

```mermaid
---
title: B+Tree 结构——根到叶的查找路径
---
graph TD
    ROOT["根节点 [10 | 50 | 100]"]
    INT1["内部节点 [10|20|30|40]"]
    INT2["内部节点 [50|65|80|90]"]
    LEAF["叶节点 [50→row_ptr]<br/>[51→row_ptr]<br/>[52→row_ptr]..."]
    NEXT["下一个叶节点 ↻"]

    ROOT -->|"50 ≤ key < 100"| INT2
    INT2 -->|"查找 key=52"| LEAF
    LEAF --> NEXT

    style ROOT fill:#4caf50,color:#fff
    style LEAF fill:#ff9800,color:#fff
```

B+Tree 的查找高度由节点扇出（fanout）决定。假设页大小 $P = 16\text{KB}$，键大小 $K = 8$ 字节，指针大小 $P_{tr} = 6$ 字节，每个内部节点的容量：

$$
f = \left\lfloor \frac{P}{K + P_{tr}} \right\rfloor \approx \frac{16384}{14} \approx 1170
$$

这意味着**两层节点可索引约 1170 × 1170 ≈ 137 万行，三层可索引 16 亿行**——即便万亿级数据表，B+Tree 查找只需 4 次磁盘 I/O。

写入时触发**页分裂**：页填满后被一分为二，父节点更新键范围。这就是为什么自增主键（总是插入最右叶节点）比随机 UUID 高效——随机 UUID 导致频繁的页分裂，类似 [LSM Tree 的读写放大权衡](../02-storage-engine/)。

---

## 查询优化器：从声明式到执行计划

SQL 是声明式语言——你说"想要什么"而非"怎么拿"。查询优化器填补这个鸿沟。

### 成本模型

优化器为每个候选计划估算代价。一个简化的成本函数：

$$
\text{Cost} = w_{I/O} \cdot N_{pages} + w_{CPU} \cdot N_{rows}
$$

其中 $N_{pages}$ 是需读取的磁盘页数，$N_{rows}$ 是需处理的元组数。权重 $w_{I/O}$ 和 $w_{CPU}$ 在每台机器上由校准程序自动测算。

### 连接算法三剑客

| 算法 | 适用场景 | 复杂度 |
|------|---------|--------|
| **Nested Loop** | 小表 join 大表（小表有索引） | $O(R \cdot \log S)$ 带索引 |
| **Hash Join** | 等值连接、无索引 | $O(R + S)$ |
| **Merge Join** | 两表均按连接键排序 | $O(R + S)$（min，排序后） |

**谓词下推**将 WHERE 条件尽可能早执行——在扫描前过滤掉无关行。这等价于 [CPU 流水线中分支预测失败前的指令"不发退休"](../../01-weichen/03-microarchitecture/#流水线冒险打破时空的魔咒)——尽早过滤避免了后续无效计算。

---

## 事务与 MVCC

ACID 的四个保证：
- **原子性**（Atomicity）：Undo Log 回滚未完成事务
- **一致性**（Consistency）：约束（PRIMARY KEY、FOREIGN KEY、CHECK）守护数据完整性
- **隔离性**（Isolation）：MVCC + 锁，下面详述
- **持久性**（Durability）：WAL（Write-Ahead Log）+ fsync——[日志先于数据持久化](../02-storage-engine/#wal崩溃恢复的最后防线)

### MVCC：快照隔离的工程实现

MVCC 的核心机制：每行携带两个隐藏系统列——

$$
\text{tuple} = (xmin,\; xmax,\; \text{data})
$$

- `xmin`：创建该版本的事务 ID
- `xmax`：删除（或更新）该版本的事务 ID；NULL 表示行仍然可见

事务开始时获取一个全局递增的快照号。可见性判断：

```
行对事务 T 可见 ⟺ xmin 在 T 开始时已提交 且 (xmax 为 NULL 或 xmax 在 T 开始时未提交)
```

MVCC 的本质是**永不原地修改**——UPDATE 实际上是 INSERT 新版本 + 标记旧版本 xmax。这使**读操作从不阻塞写操作，写操作从不阻塞读操作**——相比基于锁的并发控制，吞吐量大幅提升。

### 隔离级别与异常

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 写偏斜 |
|---------|:--:|:--:|:--:|:--:|
| Read Uncommitted | ✓ | ✓ | ✓ | ✓ |
| Read Committed | ✗ | ✓ | ✓ | ✓ |
| Repeatable Read | ✗ | ✗ | ✓ (PG ✗) | ✓ |
| Serializable | ✗ | ✗ | ✗ | ✗ |

**写偏斜**（Write Skew）是 MVCC 快照隔离的经典陷阱：两个事务分别读取同一快照的不同行，然后基于读取结果修改对方——例如两个医生同时查看值班表，各自请假，结果两人都不在。Serializable 隔离通过**可串行化快照隔离（SSI）**检测这种冲突——跟踪谓词读的依赖图，在提交时检测环。

MVCC 的版本清理（Vacuum）与 [分代垃圾回收](../../00-lingxi/05-compiler-theory/#垃圾回收自动内存管理) 共享相同的挑战——如何在不阻塞写操作的情况下回收"不可见"的旧版本？PostgreSQL 使用 Vacuum 后台进程异步清理，InnoDB 使用 Undo Log 的清除线程。

---

## 跨卷连接

| 概念 | 关联 |
|----------|------|
| B+Tree 节点扇出计算 | [Cache 行大小——空间局部性的物理约束](../../01-weichen/04-memory-hierarchy/#cache-组织形式容量速度与复杂度的三角博弈) |
| 查询优化器 cost model | [分支预测器的 Bimodal/Two-Level cost-benefit 分析](../../01-weichen/03-microarchitecture/) |
| Hash Join 哈希表 | [HashMap 开放定址法——线性探测与 Robin Hood 哈希](../../00-lingxi/04-algorithm-theory/) |
| WAL 预写日志 | [ext4 日志三模式——journal/data=ordered/writeback](../../03-qiankun/03-filesystem/#ext4-磁盘布局inode-与-extent-树) |
| MVCC 快照隔离 | [Git 内容寻址——commit DAG 的版本管理](../../08-qianli/03-devops-practices/) |
| 谓词下推 | [CPU 流水线前递——数据提前可用减少等待](../../01-weichen/03-microarchitecture/) |
| SSI 依赖环检测 | [死锁检测——银行家算法与资源分配图](../../03-qiankun/04-synchronization/#死锁并发编程的头号杀手) |

:::tip[卷四内部路径]
- [**存储引擎**](../02-storage-engine/)：B+Tree vs LSM Tree——索引的物理实现
- [**共识协议**](../04-consensus-protocols/)：分布式事务提交依赖 Raft/Paxos 共识
:::
