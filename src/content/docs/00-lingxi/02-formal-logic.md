---
title: 形式逻辑
tags: [logic, propositional-logic, first-order-logic, type-theory]
description: "从命题到证明，形式化是一切计算的元语言——从真值表到 Curry-Howard 同构"
draft: false
---

> 从命题到证明，形式化是一切计算的元语言。

程序在 CPU 上执行前，先经过编译器的类型检查。这个类型系统不是随意的语法糖——它的数学根基是**形式逻辑**。命题逻辑提供了布尔代数的真值表，一阶逻辑引入了"对所有"和"存在"的量词，而类型论通过 Curry-Howard 同构将**证明与程序**、**命题与类型**一一对应。

---

## 命题逻辑

命题逻辑处理的是"原子命题"和逻辑连接词（与 $\land$、或 $\lor$、非 $\neg$、蕴含 $\to$）。一个复合命题的真值完全由原子命题的真值和连接词的真值表决定——这正是[数字逻辑中组合电路](../../01-weichen/02-digital-logic/)的数学抽象。

### 德摩根定律

$$
\neg (A \land B) \equiv \neg A \lor \neg B
$$
$$
\neg (A \lor B) \equiv \neg A \land \neg B
$$

这两个定律在 [CMOS 门电路](../../01-weichen/02-digital-logic/#cmos-门电路实现)中直接体现——NAND 门用四个晶体管（PMOS 并联 + NMOS 串联）实现，NOR 门用互补拓扑实现。

---

## 一阶逻辑

一阶逻辑在命题逻辑的基础上引入了**量词**：$\forall x$（对所有 x）和 $\exists x$（存在 x）。这使形式逻辑可以表达诸如"所有进程最终都会终止"和"存在一个不进入死锁的调度"这样的声明。

一阶逻辑也是 SQL 基础——`SELECT * FROM users WHERE age > 18` 的逻辑形式是 $\{x \in \text{users} \mid \text{age}(x) > 18\}$——即**集合构造符号**的直接翻译。

---

## Curry-Howard 同构

Curry-Howard 同构揭示了逻辑学与计算机科学之间最深刻的联系：

| 逻辑 | 类型论 | 编程 |
|------|--------|------|
| 命题 $A$ | 类型 `A` | 类型声明 |
| 证明 $p$ of $A$ | 项 $t$ : `A` | 表达式 |
| $A \to B$ | 函数类型 `A -> B` | 函数 |
| $A \land B$ | 乘积类型 `(A, B)` | Pair / Record |
| $A \lor B$ | 和类型 `A \| B` | Variant / Either |

> **写一个程序就是构造一个证明。类型检查就是验证这个证明。**

这就是为什么 Rust 的类型系统可以保证内存安全、为什么 Coq 和 Lean 可以用类型来表达数学定理——它们都在同一座 Curry-Howard 大桥上行走。

---

## 跨卷连接

| 本章概念 | 在 CS 中的直接应用 |
|----------|------------------|
| 命题逻辑 | [组合逻辑门真值表](../../01-weichen/02-digital-logic/#基本逻辑门与真值表) |
| 德摩根定律 | [CMOS NAND/NOR 互补拓扑](../../01-weichen/02-digital-logic/#cmos-门电路实现) |
| 一阶逻辑量词 | [SQL WHERE/GROUP BY 语义](../../04-yuanhai/01-relational-database/) |
| Curry-Howard 同构 | [Rust 所有权类型的线性逻辑基础](../../08-qianli/01-design-patterns-and-principles/) |
| 类型推导 | [编译原理 Hindley-Milner 类型推导](../05-compiler-theory/) |

:::tip[卷零内部路径]
- [**计算理论**](../03-theory-of-computation/)：自动机与形式语言的逻辑对应
- [**编译原理**](../05-compiler-theory/)：类型系统在编译器中的完整实现
:::
