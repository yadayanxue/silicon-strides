---
title: 卷一 · 微尘（物理与架构）
tags: [semiconductor, architecture, isa, hardware]
---

> 于微尘中，见大千世界。

微尘者，硅基之始。此卷从半导体的物理本质出发，逐层构建对计算机体系结构的理解——从 MOSFET 的开关特性到超标量流水线，从内存层次到片上网络。每一层抽象，都建立在对下一层物理规律的尊重之上。

## 章节导览

- [**半导体物理**](./01-semiconductor-physics/)：PN 结、MOSFET、CMOS 工艺
- [**数字逻辑**](./02-digital-logic/)：布尔代数、组合逻辑、时序逻辑
- [**体系结构**](./03-microarchitecture/)：流水线、超标量、乱序执行、分支预测
- [**存储层次**](./04-memory-hierarchy/)：寄存器 → L1/L2/L3 Cache → 主存 → 磁盘
- [**指令集架构**](./05-instruction-set-architecture/)：RISC-V、x86、ARM 的设计哲学与权衡

:::tip[跨卷链接]
Cache 一致性协议 → [卷三 · 乾坤](/03-qiankun/) 中的多核同步
SIMD 向量指令 → [卷六 · 须弥](/06-xumi/) 中的张量运算加速
中断与异常机制 → [卷二 · 芥子](/02-jiezi/) 中的裸机中断处理
:::
