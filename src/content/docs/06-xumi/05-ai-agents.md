---
title: AI Agent
tags: [ai-agent, tool-calling, planning, memory, multi-agent]
description: "从生成到行动——LLM 驱动的智能体架构、ReAct 规划与多Agent 协作"
draft: false
---

> 从生成到行动。

AI Agent 将 LLM 置于感知-规划-执行的循环中——Agent 观察环境、LLM 推理下一步、调用工具、观察结果——将"聊天机器人"升级为**自主智能体**。

---

## Agent 架构

四个核心组件：**感知**（用户输入 + 环境反馈）、**规划**（LLM 将目标分解为步骤）、**工具调用**（搜索/计算/代码执行）、**记忆**（短期 = 对话历史 + 长期 = 向量数据库检索）。

---

## 规划策略

| 策略 | 原理 | 适用 |
|------|------|------|
| **ReAct** | 交替推理（Thought）和行动（Action） | 多步工具调用 |
| **Tree-of-Thought** | 探索多条推理路径，BFS/DFS 选最佳 | 复杂回溯推理 |
| **Plan-and-Solve** | 先生成完整计划再逐步执行 | 步骤可预测任务 |

---

## 多智能体协作

ChatDev 等框架将软件开发分配给多个 Agent 角色——产品经理写需求、架构师设计方案、程序员写代码、测试员验证——模拟人类团队协作流程。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| ReAct 推理 | [CFS 调度器时间片轮转](../../03-qiankun/01-process-and-thread/) |
| 向量检索 RAG | [B+Tree vs HNSW 近似搜索](../../04-yuanhai/01-relational-database/) |

:::tip[卷六内部路径]
- [**大语言模型**](../04-large-language-models/)：Agent 的核心推理引擎
:::
