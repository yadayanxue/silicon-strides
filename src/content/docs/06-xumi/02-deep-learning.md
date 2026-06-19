---
title: 深度学习
tags: [deep-learning, cnn, rnn, resnet, normalization, initialization]
description: "多层抽象的特征学习——反向传播、CNN/RNN 架构与归一化技术全景"
draft: false
---

> 多层抽象的特征学习。

深度学习是机器学习在神经网络上的自然延伸——当网络的层数从 1-2 层扩展到数十层乃至数百层时，神奇的事情发生了：网络自动学习到**层次化的特征表示**。浅层学习边缘和纹理，中层学习形状和部件，深层学习语义概念。

---

## 反向传播与计算图

神经网络的前向传播是输入经过权重矩阵、激活函数的层层变换。反向传播是梯度的链式法则应用：从损失函数开始，逐层回传梯度，更新权重。

计算图（Computational Graph）将神经网络表示为有向无环图——节点是操作（加法、乘法、ReLU），边是数据流。PyTorch 的 autograd 和 TensorFlow 的 eager execution 都基于动态计算图。

---

## CNN 与 ResNet

CNN（卷积神经网络）通过**卷积核**的滑动窗口提取局部特征——权值共享使参数数量与输入尺寸解耦。ResNet 引入了**残差连接**（Skip Connection）：

$$
y = F(x) + x
$$

这一简单改造解决了深层网络的退化问题——恒等映射 $x$ 保证了深层网络至少不差于浅层网络。ResNet-152 首次在 ImageNet 上超越了人类的 top-5 错误率。

---

## 归一化技术

| 归一化 | 归一化维度 | 适用场景 |
|--------|-----------|---------|
| **Batch Norm** | 跨 batch 样本 | CNN 训练稳定 |
| **Layer Norm** | 跨特征维度 | Transformer（**必选**） |
| **Group Norm** | 跨通道分组 | 小 batch 训练 |

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| 卷积的滑动窗口 | [FPGA 流水线——卷积核的硬件并行化](../../01-weichen/02-digital-logic/) |
| 残差连接 | [CPU 流水线前递——旁路设计绕过冒险](../../01-weichen/03-microarchitecture/) |

:::tip[卷六内部路径]
- [**机器学习基础**](../01-machine-learning-basics/)：梯度下降——反向传播的优化引擎
- [**Transformer**](../03-transformer-family/)：自注意力——取代 CNN/RNN 的新范式
:::
