---
title: 大语言模型
tags: [llm, pre-training, sft, rlhf, inference-optimization]
description: "涌现：当参数规模跨越阈值——从预训练 Scaling Law 到 RLHF 对齐与推理优化"
draft: false
---

> 涌现：当参数规模跨越阈值。

2020 年，GPT-3 用 1750 亿参数证明了一件事：当语言模型足够大时，它会涌现出**上下文学习**（In-Context Learning）能力——不需要微调，只需在提示中给出几个示例，模型就能完成同类任务。这标志着大语言模型时代的开启。本章走过 LLM 的完整生命周期：预训练、对齐、推理优化和幻觉问题。

---

## 预训练与 Scaling Law

LLM 的预训练任务通常是**下一个 token 预测**——给定前文 token 序列，预测下一个 token。训练数据规模以万亿 token 计，训练算力以数千 GPU-月计。

**Scaling Law**（Kaplan et al., 2020）揭示了模型性能与三个变量的幂律关系：参数量 $N$、数据量 $D$、训练算力 $C$。三者必须同步扩展——用大量数据训练小模型或少量数据训练大模型都是次优的。

---

## 对齐训练：RLHF 与 DPO

预训练模型学到的只是"模仿互联网文本"，而非"回答用户问题"。**RLHF**（Reinforcement Learning from Human Feedback）通过三个步骤对齐：

1. **SFT**（监督微调）：在高质量问答对上微调
2. **奖励模型**：人类标注员对多个回答排序，训练奖励模型
3. **PPO 优化**：使用强化学习最大化奖励模型的得分

**DPO**（Direct Preference Optimization）跳过步骤 2-3，直接从偏好数据中优化——数学上等价于 RLHF 但实现更简单。

---

## 推理优化

大模型推理的瓶颈是显存带宽而非计算——每生成一个 token 需要遍历全部参数。优化技术：

| 技术 | 原理 | 效果 |
|------|------|------|
| **KV Cache** | 缓存已计算的 Key/Value 矩阵 | 避免重复计算历史 token |
| **量化（INT4/INT8）** | 将 FP16 权重压缩为低位整数 | 显存减半、速度翻倍 |
| **投机解码** | 用小模型快速生成候选，大模型验证 | 2-3x 加速 |

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| GPT 自回归生成 | [Transformer Decoder——因果注意力掩码](../03-transformer-family/) |
| 分布式训练 DP/TP/PP | [共识协议——AllReduce 梯度同步](../../04-yuanhai/04-consensus-protocols/) |
| KV Cache 显存管理 | [Cache 替换策略——LRU vs 页置换](../../03-qiankun/02-memory-management/) |

:::tip[卷六内部路径]
- [**Transformer**](../03-transformer-family/)：GPT 架构——仅 Decoder 的 Transformer
- [**AI Agent**](../05-ai-agents/)：工具调用——LLM 从生成到行动的跃迁
:::
