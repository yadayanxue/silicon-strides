---
title: 设计模式与原则
tags: [design-patterns, solid, gof, functional-design, architecture]
description: "面向变化的代码组织之道——SOLID、GoF 模式与函数式设计的工程实践"
draft: false
---

> 面向变化的代码组织之道。

设计模式是对抗"代码一经写就、需求开始变化"悖论的武器——经过数十年验证的可复用经验。

---

## SOLID 原则

| 原则 | 含义 |
|------|------|
| **S** - 单一职责 | 一个类一个变化原因 |
| **O** - 开闭原则 | 对扩展开放，对修改关闭 |
| **L** - 里氏替换 | 子类必须可替换父类 |
| **I** - 接口隔离 | 不强迫实现不需要的接口 |
| **D** - 依赖反转 | 依赖抽象而非具体 |

---

## GoF 模式三族

| 族 | 代表模式 | 核心思想 |
|----|---------|---------|
| **创建型** | 工厂、单例、建造者 | 延迟实例化决策 |
| **结构型** | 适配器、装饰器、代理 | 接口转换 + 动态职责 |
| **行为型** | 观察者、策略、模板方法 | 算法 + 责任分离 |

---

## 函数式设计

**纯函数**（相同输入 always 相同输出）和**不可变性**是函数式的核心。Monad 将副作用封装在类型系统中——Rust `Result<T,E>` = $T \lor E$，是 [Curry-Howard 同构](../../00-lingxi/02-formal-logic/) 的编程实践。

### Go 并发模型：G:P:M 调度

Go 语言最著名的设计模式不是某一种代码结构，而是它独特的**协程调度模型**——G:P:M 三层架构。理解它是理解 Go 并发编程的前提。

```mermaid
---
title: Go G:P:M 三层调度模型
---
graph LR
    subgraph G_POOL["Goroutine 池 (用户态)"]
        G1["G1<br/>goroutine"]
        G2["G2<br/>goroutine"]
        G3["G3<br/>goroutine"]
        G4["G4<br/>goroutine"]
    end

    subgraph P_LIST["P (Processor) 列表"]
        P1["P1<br/>本地运行队列<br/>runq"]
        P2["P2<br/>本地运行队列<br/>runq"]
    end

    subgraph M_POOL["M (Machine / OS 线程)"]
        M1["M1<br/>OS 线程"]
        M2["M2<br/>OS 线程"]
    end

    G1 --> P1
    G2 --> P1
    G3 --> P2
    G4 --> P2
    P1 --> M1
    P2 --> M2

    M1 -.->|"系统调用阻塞"| P1
    P2 -.->|"work-stealing<br/>从 P1 偷 G"| P1

    style G_POOL fill:#e8f5e9
    style P_LIST fill:#e3f2fd
    style M_POOL fill:#fff3e0
```

三层角色的职责：

| 层 | 符号 | 含义 | 数量 | 关键属性 |
|----|------|------|------|---------|
| **G** | Goroutine | 用户态轻量协程 | 百万级 | 初始栈 2KB，按需增长/收缩 |
| **P** | Processor | 逻辑处理器（调度上下文） | `GOMAXPROCS`（默认 CPU 核数） | 持有 G 的本地运行队列（256 容量） |
| **M** | Machine | 操作系统线程 | 动态（空闲时回收） | 必须绑定一个 P 才能执行 G |

Go 调度器的核心规则：

1. **M 必须绑定 P 才能执行 G**——P 是 G 和 M 之间的中介
2. **系统调用时 M 会解绑 P**——P 被移交给另一个 M（或新建 M），保证 `GOMAXPROCS` 个 P 始终活跃
3. **Work-Stealing**——当 P 的本地队列为空时，它从全局队列或其它 P 的队列中"偷"一半 G

:::tip[跨卷链接]
G:P:M 的 Work-Stealing 策略与 [CFS 调度器的红黑树](../../03-qiankun/01-process-and-thread/#调度算法cfs-与-eevdf) 有着相通的公平性哲学——CFS 追求 CPU 时间公平（`vruntime` 最小优先），Go 追求 P 的利用率公平（空闲 P 主动偷取任务）。但实现层面截然不同：CFS 在**内核态**操作红黑树（O(log n)），Go 在**用户态**操作环形队列（O(1)）。这也是为什么 Go 能支撑百万级 goroutine——调度开销不经过内核上下文切换。

G:P:M 的 P 数量控制（`GOMAXPROCS`）与 [CPU 亲和性与 NUMA 调度](../../01-weichen/04-memory-hierarchy/) 直接相关——合理设置 P 的数量可以避免跨 NUMA 节点的缓存行乒乓（Cache Line Bouncing）。
:::

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| 观察者模式 | [epoll 事件驱动——发布-订阅](../../03-qiankun/08-network-programming/) |
| 策略模式 | [TCP 拥塞控制——算法族可替换](../../03-qiankun/06-transport-tcp-udp-quic/) |
| SOLID 依赖反转 | [VFS 抽象——依赖接口而非 ext4/XFS 实现](../../03-qiankun/03-filesystem/) |
| Go G:P:M Work-Stealing | [CFS 红黑树 `vruntime` 公平调度](../../03-qiankun/01-process-and-thread/#调度算法cfs-与-eevdf) |

:::tip[卷八内部路径]
- [**系统设计**](../02-system-design/)：设计模式在分布式中的规模延伸
- [**工程文化**](../05-engineering-culture/)：代码评审——模式的团队传播
:::
