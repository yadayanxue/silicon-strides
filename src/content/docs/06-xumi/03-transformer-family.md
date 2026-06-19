---
title: Transformer 家族
tags: [transformer, self-attention, multi-head-attention, positional-encoding]
description: "注意力即一切——自注意力、多头机制与位置编码的 Transformer 核心"
draft: false
---

> 注意力即一切。

2017 年，Google 的 *Attention Is All You Need* 提出了一种全新的序列建模架构——Transformer。它抛弃了 RNN 的循环结构和 CNN 的卷积核，完全基于**自注意力**（Self-Attention）机制。七年后的今天，Transformer 不仅统治了 NLP，还渗透到计算机视觉（ViT）、语音识别（Whisper）和蛋白质折叠（AlphaFold）。

---

## 自注意力机制

自注意力的计算可以概括为三个矩阵乘法：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

| 组件 | 含义 | 维度 |
|------|------|------|
| **Q**（Query） | "我在找什么？" | $n \times d_k$ |
| **K**（Key） | "我是什么？" | $n \times d_k$ |
| **V**（Value） | "我包含什么信息？" | $n \times d_v$ |

除以 $\sqrt{d_k}$ 的**缩放**至关重要——不缩放时，大 $d_k$ 下点积的方差增大，softmax 梯度趋近于零（饱和区）。

---

## 多头注意力

单头注意力只能学习一种"关注模式"。**多头注意力**并行运行 $h$ 个独立的注意力操作，每个头在不同的低维子空间中学习，最后拼接输出——使模型同时关注句法、语义和位置关系。

---

## 位置编码

Transformer 没有 RNN 的隐式位置信息，必须显式注入位置。**RoPE**（旋转位置编码，Rotary Position Embedding）是目前最广泛使用的位置编码方案——通过对 Q 和 K 向量施加旋转操作来编码相对位置，具有优雅的数学性质：RoPE 后 Q 和 K 的点积自然地包含了相对位置信息。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| softmax 缩放因子 | [GPU Tensor Core 的矩阵乘法——低精度加速](../../05-wanxiang/01-gpu-rendering-pipeline/) |
| FlashAttention | [Cache 分块——将注意力矩阵切分为 SRAM 友好的 tile](../../01-weichen/04-memory-hierarchy/) |
| RoPE 旋转矩阵 | [线性代数——二维旋转矩阵的正交性](../../00-lingxi/01-mathematical-foundations/) |

:::tip[卷六内部路径]
- [**深度学习**](../02-deep-learning/)：Layer Norm——Transformer 训练的必需品
- [**大语言模型**](../04-large-language-models/)：GPT——只有 Decoder 的 Transformer
:::
