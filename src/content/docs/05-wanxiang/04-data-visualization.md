---
title: 数据可视化
tags: [visualization, d3js, echarts, information-design]
description: "让数据讲故事——可视化编码、D3.js 与信息设计原则"
draft: false
---

> 让数据讲故事。

一幅精心设计的图表能在瞬间传达表格数百行的关系。数据可视化是感知心理学、图形设计和计算机图形学的交叉学科。

---

## 可视化编码

Bertin 的六大视觉通道：

| 通道 | 适合 | 不适合 |
|------|------|--------|
| **位置** | 定量（散点图） | — |
| **长度** | 定量比较 | 面积比较不精确 |
| **颜色** | 分类（最多 7 类） | 定量（人眼不敏感） |

---

## D3.js：数据绑定

D3 的核心是 **Data Join**——`enter()`/`update()`/`exit()` 三元组精确定义数据驱动的 DOM 操作。过渡动画 `transition()` 在 250ms 内平滑插值。

## 信息设计原则

**格式塔原则**（接近、相似、连续）解释人类视觉自动分组。**墨尔本准则**：最大化数据-墨水比，消除 chart junk。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| D3 Data Join | [虚拟 DOM enter/update/exit 三态](../03-frontend-engineering/) |
| WebGL 大规模渲染 | [GPU 片元着色器并行绘制](../01-gpu-rendering-pipeline/) |

:::tip[卷五内部路径]
- [**前端工程**](../03-frontend-engineering/)：D3 的 Web 技术栈集成
- [**人机交互**](../05-human-computer-interaction/)：信息设计的感知心理学基础
:::
