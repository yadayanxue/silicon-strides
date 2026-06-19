---
title: 计算机图形学
tags: [computer-graphics, transformation, lighting, ray-tracing, pbr]
description: "数学变成光影的艺术——从 MVP 变换到 PBR 与光线追踪的图形学核心"
draft: false
---

> 数学变成光影的艺术。

GPU 提供硬件加速，着色器代码需要数学来指导——这就是图形学。它解答：如何用矩阵表达旋转？如何模拟光的反射？如何用蒙特卡洛积分模拟全局光照？

---

## 齐次坐标与变换矩阵

三维图形学使用 4D 齐次坐标——因为 4×4 矩阵可统一表示旋转、平移、缩放和透视投影。旋转矩阵正交（$R^T = R^{-1}$），平移在第四列，投影矩阵将视锥体映射到 NDC 立方体。

---

## PBR 与渲染方程

PBR（Physically Based Rendering）基于 Kajiya 1986 年的渲染方程：

$$
L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i)(\omega_i \cdot n) d\omega_i
$$

实时渲染通过重要性采样近似，离线渲染通过路径追踪的蒙特卡洛积分求解。

---

## 光线追踪

```mermaid
---
title: 光线追踪——从眼睛到光源
---
graph LR
    EYE["相机"] -->|"发射光线"| PIXEL["像素"]
    PIXEL --> BVH["BVH 加速<br/>包围盒层次"]
    BVH -->|"相交测试"| OBJ["物体表面"]
    OBJ -->|"反射/折射"| RECURSE["递归追踪"]
    OBJ -->|"阴影光线"| LIGHT["光源"]

    style EYE fill:#e3f2fd
    style LIGHT fill:#ffeb3b
```

NVIDIA RTX 的 RT Core 硬件加速了光线-三角形相交——将光线追踪带入实时渲染。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| 矩阵正交性 | [线性代数——特征值分解](../../00-lingxi/01-mathematical-foundations/) |
| BVH | [B+Tree 分层查找](../../04-yuanhai/01-relational-database/) |

:::tip[卷五内部路径]
- [**GPU 渲染管线**](../01-gpu-rendering-pipeline/)：着色器——图形学的执行器
:::
