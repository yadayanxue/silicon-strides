---
title: AI Agent
tags: [ai-agent, tool-calling, planning, memory, multi-agent]
description: "从生成到行动——LLM 驱动的智能体架构、工具调用与多智能体协作"
draft: false
---

> 从生成到行动。

LLM 单独使用时是"静态的知识库"——它能回答，但不能行动。**AI Agent** 将 LLM 置于一个感知-规划-执行的循环中：Agent 观察环境，使用 LLM 推理下一步，调用工具（搜索、计算、代码执行），观察结果，继续推理。这个循环将 LLM 从"聊天机器人"升级为**自主智能体**。

---

## Agent 架构

标准的 Agent 循环包含四个组件：

1. **感知**（Perception）：接收用户输入和环境反馈
2. **规划**（Planning）：使用 LLM 将高层目标分解为可执行的步骤
3. **工具调用**（Tool Use）：调用外部 API、数据库、代码解释器
4. **记忆**（Memory）：短期记忆（对话历史） + 长期记忆（向量数据库检索）

---

## 规划策略

| 策略 | 原理 | 适用 |
|------|------|------|
| **ReAct** | 交替推理（Thought）和行动（Action） | 需要多步工具调用的任务 |
| **Tree-of-Thought** | 探索多条推理路径，用 BFS/DFS 选择最佳 | 需要回溯的复杂推理 |
| **Plan-and-Solve** | 先生成完整计划，再逐步执行 | 步骤可提前预测的任务 |

---

## 多智能体协作

ChatDev 等框架将软件开发过程分配给多个 Agent 角色——产品经理写需求、架构师设计方案、程序员写代码、测试员验证。角色之间的协作遵循结构化的对话协议，模拟人类团队的开发流程。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| ReAct 推理 | [CFS 调度器——时间片轮转的交替执行](../../03-qiankun/01-process-and-thread/) |
| 向量数据库检索 | [B+Tree vs 近似最近邻搜索（HNSW）](../../04-yuanhai/01-relational-database/) |
| 多 Agent 协作 | [共识协议——分布式决策的投票机制](../../04-yuanhai/04-consensus-protocols/) |

:::tip[卷六内部路径]
- [**大语言模型**](../04-large-language-models/)：Agent 的核心推理引擎
:::
