---
title: 机器学习基础
tags: [machine-learning, gradient-descent, regularization, cross-validation]
description: "让机器从数据中学习规律——梯度下降、偏差-方差与正则化的学习理论基石"
draft: false
---

> 让机器从数据中学习规律。

ML 不是程序员编写规则，而是数据驱动的自动参数调整。

---

## 三大范式

| 范式 | 数据 | 目标 |
|------|------|------|
| **监督学习** | (X, y) | 学习 $f(X) \approx y$ |
| **无监督学习** | X | 发现隐藏结构 |
| **强化学习** | (S, A, R) | 最大化累积奖励 |

---

### 线性回归：监督学习的起点

线性回归是最简单的监督学习模型——假设输出是输入特征的线性组合：

$$
\hat{y} = w^T x + b = \sum_{j=1}^{d} w_j x_j + b
$$

均方误差（MSE）损失函数：

$$
J(w, b) = \frac{1}{2m} \sum_{i=1}^{m} (\hat{y}^{(i)} - y^{(i)})^2
$$

当 $X^T X$ 可逆时（$d \leq m$ 且特征线性无关），存在闭式解（正规方程）：

$$
w^* = (X^T X)^{-1} X^T y
$$

:::note[闭式解与数值稳定性]
当 $X^T X$ 接近奇异（特征共线或 $d \gg m$），$(X^T X)^{-1}$ 的最小特征值趋近于零 → 参数估计的方差爆炸。这正是 [线性代数中特征值分解与矩阵条件数](../../00-lingxi/01-mathematical-foundations/) 的工程后果：条件数 $\kappa(X^T X) = \frac{\lambda_{\max}}{\lambda_{\min}}$ 决定了数值稳定性，$\kappa$ 每增 10 倍，精度损失约 1 位有效数字。
:::

---

## 梯度下降

$$
\theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
$$

**Adam** 结合 Momentum（累积历史梯度方向）和 RMSprop（自适应学习率）——深度学习的事实标准。

```mermaid
---
title: 梯度下降的收敛示意
---
graph LR
    START["初始参数 θ₀"] -->|"-η∇J"| STEP1["θ₁: 损失下降"]
    STEP1 -->|"-η∇J"| STEP2["θ₂: 接近最小值"]
    STEP2 -->|"-η∇J"| OPT["θ*: 局部最优点<br/>∇J≈0"]

    style START fill:#ffcdd2
    style OPT fill:#c8e6c9
```

### 梯度下降的三种形态

按每步更新所用样本数，梯度下降有三种变体：

| 形态 | 更新公式 | 每步样本 | 特点 |
|------|:--:|:--:|------|
| **Batch GD** | $\theta_{t+1} = \theta_t - \frac{\eta}{m}\sum_{i=1}^{m}\nabla J_i(\theta_t)$ | 全部 $m$ | 稳定，但大数据集慢 |
| **SGD** | $\theta_{t+1} = \theta_t - \eta \nabla J_i(\theta_t)$ | 1 个 | 快但噪声大，收敛振荡 |
| **Mini-batch GD** | $\theta_{t+1} = \theta_t - \frac{\eta}{|B|}\sum_{i \in B}\nabla J_i(\theta_t)$ | 32~256 | 两全——GPU 向量化 + 梯度平滑 |

### Momentum 与 Adam 的数学

朴素 SGD 在峡谷地形中锯齿状振荡。**Momentum** 引入指数加权移动平均，累积历史梯度方向：

$$
v_t = \beta v_{t-1} + (1 - \beta)\nabla J(\theta_t)
$$
$$
\theta_{t+1} = \theta_t - \eta v_t
$$

$\beta = 0.9$ 意味着过去 $\frac{1}{1-\beta} \approx 10$ 步的梯度有显著贡献。这与 [PID 控制器积分项消除稳态误差](../../02-jiezi/02-interrupts/) 共享同一设计原理——累积历史信号以抑制噪声。

**Adam**（Adaptive Moment Estimation）融合 Momentum 和 RMSprop：用一阶矩 $m_t$ 估算梯度方向，二阶矩 $v_t$ 自适应调整学习率：

$$
m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t,\quad
v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2
$$

偏差校正（因 $m_0 = v_0 = 0$ 导致初估计偏低）：

$$
\hat{m}_t = \frac{m_t}{1 - \beta_1^t},\quad
\hat{v}_t = \frac{v_t}{1 - \beta_2^t}
$$

最终更新：

$$
\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t
$$

默认超参数 $\eta = 0.001$，$\beta_1 = 0.9$，$\beta_2 = 0.999$，$\epsilon = 10^{-8}$。Adam 自 2015 年提出后成为深度学习事实标准——无需手动调学习率衰减。

---

## 偏差-方差分解

泛化误差可以分解为三个不可约减的组成部分。对于测试点 $x$，期望预测误差为：

$$
\mathbb{E}\big[(y - \hat{f}(x))^2\big] = \underbrace{\big(\mathbb{E}[\hat{f}(x)] - f(x)\big)^2}_{\text{Bias}^2} + \underbrace{\mathbb{E}\big[(\hat{f}(x) - \mathbb{E}[\hat{f}(x)])^2\big]}_{\text{Variance}} + \underbrace{\sigma^2_{\epsilon}}_{\text{Irreducible Error}}
$$

- **Bias$^2$**（偏差平方）：模型平均预测与真实值的差距——模型族**表达能力**的度量
- **Variance**（方差）：不同训练集训练的模型预测之间的差异——模型对数据**扰动敏感度**的度量
- **$\sigma_\epsilon^2$**（不可约误差）：数据本身的噪声——即使知道真实函数也无法消除

:::tip[Bias-Variance Tradeoff 与 VC 维]
增加模型复杂度 → Bias 下降但 Variance 上升。最优复杂度出现在 Bias$^2$ 与 Variance 交点附近。这一权衡在 [计算理论的 VC 维分析](../../00-lingxi/03-theory-of-computation/) 中有严格的 PAC 学习框架支撑：VC 维越高，Bias 越低但泛化界越松。
:::

| 问题 | 训练误差 | 验证误差 | 应对 |
|------|:--:|:--:|------|
| **高偏差（欠拟合）** | 高 | 高 | 增加模型容量、特征工程、减少正则化 |
| **高方差（过拟合）** | 低 | 高 | 正则化（L1/L2）、Dropout、数据增强、早停 |

---

## 正则化：L1 与 L2

正则化在损失函数上追加惩罚项，约束模型复杂度。L1 和 L2 是两种最基本的正则化范式——它们不仅数值行为不同，还导出了**截然不同的解结构**。

### L2 正则化（Ridge / 权重衰减）

$$
J_{L2}(\theta) = J(\theta) + \frac{\lambda}{2} \|\theta\|_2^2 = J(\theta) + \frac{\lambda}{2} \sum_{j} \theta_j^2
$$

梯度下降的更新变为：

$$
\theta_{t+1} = \theta_t - \eta \big(\nabla J(\theta_t) + \lambda \theta_t\big) = (1 - \eta\lambda)\theta_t - \eta \nabla J(\theta_t)
$$

每步将所有权重向零缩放 $1 - \eta\lambda$——这就是"权重衰减"名称的由来。$\lambda$ 越大，衰减越强。

### L1 正则化（Lasso / 稀疏特征选择）

$$
J_{L1}(\theta) = J(\theta) + \lambda \|\theta\|_1 = J(\theta) + \lambda \sum_{j} |\theta_j|
$$

绝对值在 $\theta_j = 0$ 处不可导，使用**次梯度**（Subgradient）：

$$
\frac{\partial J_{L1}}{\partial \theta_j} = \frac{\partial J}{\partial \theta_j} + \lambda \cdot \text{sign}(\theta_j), \quad \text{sign}(0) \in [-1, 1]
$$

L1 的关键性质：更新时无论 $\theta_j$ 多大，惩罚力度**恒定**（$\pm\lambda$）——这与 L2 的"越大越惩罚"截然不同。后果是许多 $\theta_j$ 被推到**精确零值**，实现特征自动选择。

:::tip[几何直觉：L1 钻石 vs L2 圆]
将正规化视为 Lagrange 约束：L1 的约束域 $|\theta_1| + |\theta_2| \leq t$ 是菱形（四角在坐标轴上），L2 的约束域 $\theta_1^2 + \theta_2^2 \leq t$ 是圆形。损失函数的等高线首次"碰到"约束边界时：
- L1 的菱形角在坐标轴上 → 解中某些 $\theta_j$ **精确为零** → 稀疏性
- L2 的圆与等高线切点通常在非轴位置 → 所有 $\theta_j$ **均非零** → 均匀收缩

这一几何性质直接链接到 [线性规划单纯形法的顶点最优解原理](../../00-lingxi/01-mathematical-foundations/)——两者都是"角点解"在凸优化中的实例。
:::

### Elastic Net

结合 L1 和 L2 的优点——处理特征高度相关时 Lasso 表现不稳定的问题：

$$
J_{Elastic}(\theta) = J(\theta) + \lambda_1 \|\theta\|_1 + \frac{\lambda_2}{2} \|\theta\|_2^2
$$

---

## 模型评估与交叉验证

### k 折交叉验证

将数据均匀划分为 $k$ 份，依次以 1 份为验证集、$k-1$ 份为训练集。最终性能为 $k$ 轮验证结果的平均：

$$
CV_{(k)} = \frac{1}{k} \sum_{i=1}^{k} \text{Err}_i
$$

- $k = m$（每样本一折）：**留一交叉验证**（LOOCV）——偏差低但计算代价高，等价于 [统计学 Jackknife 重采样](https://en.wikipedia.org/wiki/Jackknife_resampling) 的预测应用
- $k = 5$ 或 $k = 10$：计算与可靠性的工程平衡点

### 分类评估指标

混淆矩阵的四个象限导出所有二元分类指标：

|  | 预测正 | 预测负 |
|--|:--:|:--:|
| **实际正** | TP | FN |
| **实际负** | FP | TN |

$$
\text{Precision} = \frac{TP}{TP + FP},\quad
\text{Recall} = \frac{TP}{TP + FN},\quad
F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}
$$

Precision（精确率）关注"预测为正中有多少是真"，Recall（召回率）关注"真正的正中找到了多少"——$F_1$ 是二者的调和平均，惩罚极端的 Precision-Recall 失衡。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| 线性回归闭式解 | [特征值分解与矩阵条件数——κ 决定精度](../../00-lingxi/01-mathematical-foundations/) |
| 梯度下降 | [概率——最大似然估计的对数似然梯度](../../00-lingxi/01-mathematical-foundations/) |
| Adam 动量 | [PID 控制器——积分项消除稳态误差的递推平均](../../02-jiezi/02-interrupts/) |
| Bias-Variance Tradeoff | [计算理论——VC 维与 PAC 可学习性](../../00-lingxi/03-theory-of-computation/) |
| L1 正则化稀疏性 | [压缩感知——l0 范数的凸松弛 l1 范数](../../00-lingxi/04-algorithm-theory/) |
| 交叉验证 | [抽样理论与无偏估计——Jackknife 重采样](../../00-lingxi/01-mathematical-foundations/) |
| 朴素贝叶斯 | [贝叶斯定理——条件独立性与先验更新](../../00-lingxi/01-mathematical-foundations/) |

:::tip[卷六内部路径]
- [**深度学习**](../02-deep-learning/)：多层梯度下降——链式法则的反向传播
- [**Transformer**](../03-transformer-family/)：注意力——从手工特征到自学习表征
- [**大语言模型**](../04-large-language-models/)：正则化在 Scaling Law 中的作用
:::
