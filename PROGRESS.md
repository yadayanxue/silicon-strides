# 硅步千里 · 内容撰写进度

> 最后更新：2026-06-14 18:21

## 状态标记

| 标记 | 含义 |
|------|------|
| 📋 | 待撰写（文件已创建，`draft: true`） |
| ✍️ | 撰写中（`draft: true`，内容进行中） |
| ✅ | 已完稿（`draft: false`，可发布） |
| 🔄 | 需修订（已发布但需更新） |

---

## 撰写路线图

```
Phase 1 — 底层硬核（先跑通 Mermaid + KaTeX 工具链）
  └─ 卷一：半导体物理 → 数字逻辑 → 体系结构
  └─ 卷三：进程与线程 → 内存管理

Phase 2 — 数学底座
  └─ 卷零：数学基础 → 算法理论

Phase 3 — 操作系统 + 网络
  └─ 卷三：文件系统 → 同步原语 → 网络协议栈 I/II/III → 网络编程

Phase 4 — 数据库 + 安全 + 嵌入式
  └─ 卷四：存储引擎 → 关系型数据库 → 分布式基础 → 共识协议 → 数据流水线
  └─ 卷七：对称加密 → 非对称加密 → 哈希签名 → 零知识证明 → 系统安全
  └─ 卷二：裸机 → 中断 → RTOS → 外设驱动 → 低功耗

Phase 5 — 上层应用
  └─ 卷五：GPU 管线 → 图形学 → 前端 → 可视化 → HCI
  └─ 卷六：ML 基础 → 深度学习 → Transformer → LLM → AI Agent
  └─ 卷八：设计模式 → 系统设计 → DevOps → 可观测性 → 工程文化

Phase 6 — 理论收尾
  └─ 卷零：形式逻辑 → 计算理论 → 编译原理 → 密码学数学
```

> **原则**：从最稳定、最底层的内容开始（半导体物理不会每月过时），最后写变化最快的领域（AI）。形式逻辑、编译原理等理论内容放最后，因为它们需要引用其他卷的概念作为实例。

---

## 进度总览

| 卷宗 | 总章节 | ✅ 已完稿 | ✍️ 撰写中 | 📋 待撰写 | 完成率 |
|------|--------|-----------|-----------|-----------|--------|
| 卷零 · 灵犀 | 6 | 0 | 0 | 6 | 0% |
| 卷一 · 微尘 | 5 | 2 | 0 | 3 | 40% |
| 卷二 · 芥子 | 5 | 0 | 0 | 5 | 0% |
| 卷三 · 乾坤 | 8 | 0 | 0 | 8 | 0% |
| 卷四 · 渊海 | 5 | 0 | 0 | 5 | 0% |
| 卷五 · 万象 | 5 | 0 | 0 | 5 | 0% |
| 卷六 · 须弥 | 5 | 0 | 0 | 5 | 0% |
| 卷七 · 天枢 | 5 | 0 | 0 | 5 | 0% |
| 卷八 · 千里 | 5 | 0 | 0 | 5 | 0% |
| **合计** | **49** | **2** | **0** | **47** | **4%** |

---

## 详细进度表

### 卷零 · 灵犀（理论与算法）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 0.1 | 数学基础 | `00-lingxi/01-mathematical-foundations.md` | 📋 | — | — | |
| 0.2 | 形式逻辑 | `00-lingxi/02-formal-logic.md` | 📋 | — | — | |
| 0.3 | 计算理论 | `00-lingxi/03-theory-of-computation.md` | 📋 | — | — | |
| 0.4 | 算法理论 | `00-lingxi/04-algorithm-theory.md` | 📋 | — | — | |
| 0.5 | 编译原理 | `00-lingxi/05-compiler-theory.md` | 📋 | — | — | |
| 0.6 | 密码学数学 | `00-lingxi/06-cryptographic-mathematics.md` | 📋 | — | — | |

### 卷一 · 微尘（物理与架构）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 1.1 | 半导体物理 | `01-weichen/01-semiconductor-physics.md` | ✅ | 2026-06-14 | 2026-06-14 | |
| 1.2 | 数字逻辑 | `01-weichen/02-digital-logic.md` | ✅ | 2026-06-14 | 2026-06-14 | 4 Mermaid + 45 KaTeX |
| 1.3 | 体系结构 | `01-weichen/03-microarchitecture.md` | 📋 | — | — | |
| 1.4 | 存储层次 | `01-weichen/04-memory-hierarchy.md` | 📋 | — | — | |
| 1.5 | 指令集架构 | `01-weichen/05-instruction-set-architecture.md` | 📋 | — | — | |

### 卷二 · 芥子（裸机与实时）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 2.1 | 裸机编程 | `02-jiezi/01-bare-metal.md` | 📋 | — | — | |
| 2.2 | 中断与异常 | `02-jiezi/02-interrupts.md` | 📋 | — | — | |
| 2.3 | RTOS 基础 | `02-jiezi/03-rtos-fundamentals.md` | 📋 | — | — | |
| 2.4 | 外设驱动 | `02-jiezi/04-peripheral-drivers.md` | 📋 | — | — | |
| 2.5 | 低功耗设计 | `02-jiezi/05-low-power-design.md` | 📋 | — | — | |

### 卷三 · 乾坤（系统与网络）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 3.1 | 进程与线程 | `03-qiankun/01-process-and-thread.md` | 📋 | — | — | |
| 3.2 | 内存管理 | `03-qiankun/02-memory-management.md` | 📋 | — | — | |
| 3.3 | 文件系统 | `03-qiankun/03-filesystem.md` | 📋 | — | — | |
| 3.4 | 同步原语 | `03-qiankun/04-synchronization.md` | 📋 | — | — | |
| 3.5 | 网络协议栈 I · TCP/IP | `03-qiankun/05-network-protocol-stack.md` | 📋 | — | — | |
| 3.6 | 网络协议栈 II · 传输层 | `03-qiankun/06-transport-tcp-udp-quic.md` | 📋 | — | — | |
| 3.7 | 网络协议栈 III · 应用层 | `03-qiankun/07-application-protocols.md` | 📋 | — | — | |
| 3.8 | 网络编程 | `03-qiankun/08-network-programming.md` | 📋 | — | — | |

### 卷四 · 渊海（数据与分布式）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 4.1 | 关系型数据库 | `04-yuanhai/01-relational-database.md` | 📋 | — | — | |
| 4.2 | 存储引擎 | `04-yuanhai/02-storage-engine.md` | 📋 | — | — | |
| 4.3 | 分布式基础 | `04-yuanhai/03-distributed-fundamentals.md` | 📋 | — | — | |
| 4.4 | 共识协议 | `04-yuanhai/04-consensus-protocols.md` | 📋 | — | — | |
| 4.5 | 数据流水线 | `04-yuanhai/05-data-pipelines.md` | 📋 | — | — | |

### 卷五 · 万象（图形与交互）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 5.1 | GPU 渲染管线 | `05-wanxiang/01-gpu-rendering-pipeline.md` | 📋 | — | — | |
| 5.2 | 计算机图形学 | `05-wanxiang/02-computer-graphics.md` | 📋 | — | — | |
| 5.3 | 前端工程 | `05-wanxiang/03-frontend-engineering.md` | 📋 | — | — | |
| 5.4 | 数据可视化 | `05-wanxiang/04-data-visualization.md` | 📋 | — | — | |
| 5.5 | 人机交互 | `05-wanxiang/05-human-computer-interaction.md` | 📋 | — | — | |

### 卷六 · 须弥（智能与涌现）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 6.1 | 机器学习基础 | `06-xumi/01-machine-learning-basics.md` | 📋 | — | — | |
| 6.2 | 深度学习 | `06-xumi/02-deep-learning.md` | 📋 | — | — | |
| 6.3 | Transformer 家族 | `06-xumi/03-transformer-family.md` | 📋 | — | — | |
| 6.4 | 大语言模型 | `06-xumi/04-large-language-models.md` | 📋 | — | — | |
| 6.5 | AI Agent | `06-xumi/05-ai-agents.md` | 📋 | — | — | |

### 卷七 · 天枢（安全与御道）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 7.1 | 对称加密 | `07-tianshu/01-symmetric-cryptography.md` | 📋 | — | — | |
| 7.2 | 非对称加密 | `07-tianshu/02-asymmetric-cryptography.md` | 📋 | — | — | |
| 7.3 | 哈希与签名 | `07-tianshu/03-hash-and-signature.md` | 📋 | — | — | |
| 7.4 | 零知识证明 | `07-tianshu/04-zero-knowledge-proofs.md` | 📋 | — | — | |
| 7.5 | 系统安全 | `07-tianshu/05-system-security.md` | 📋 | — | — | |

### 卷八 · 千里（工程与道法）

| # | 章节 | 文件 | 状态 | 开始日 | 完成日 | 备注 |
|---|------|------|------|--------|--------|------|
| 8.1 | 设计模式与原则 | `08-qianli/01-design-patterns-and-principles.md` | 📋 | — | — | |
| 8.2 | 系统设计 | `08-qianli/02-system-design.md` | 📋 | — | — | |
| 8.3 | DevOps 实践 | `08-qianli/03-devops-practices.md` | 📋 | — | — | |
| 8.4 | 可观测性 | `08-qianli/04-observability.md` | 📋 | — | — | |
| 8.5 | 工程文化 | `08-qianli/05-engineering-culture.md` | 📋 | — | — | |

---

## 每章完稿检查清单

撰写者在将章节标记为 `✅` 前，确认以下事项：

- [ ] Mermaid 图至少 1 幅（如适用），含 `title` 属性
- [ ] KaTeX 数学公式至少 1 处（如适用）
- [ ] 至少 1 条跨卷引用（`:::tip[跨卷链接]`）
- [ ] 术语首次出现时链接至 `/glossary/#段`
- [ ] `draft: false` 已设置
- [ ] 本地 `npm run build` 通过
- [ ] 更新本进度表状态
