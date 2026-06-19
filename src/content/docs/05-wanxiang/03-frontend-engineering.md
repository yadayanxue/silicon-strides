---
title: 前端工程
tags: [frontend, dom, css, responsive-design, state-management]
description: "浏览器的画布，交互的舞台——DOM 渲染流程与状态管理的工程之道"
draft: false
---

> 浏览器的画布，交互的舞台。

浏览器是世界上最广泛部署的**跨平台运行时**——它集成了 HTML 解析器、CSS 布局引擎、JavaScript JIT 编译器、WebGL 图形引擎和网络协议栈。前端工程的核心挑战在于：如何在这套复杂运行时之上构建可维护、高性能的用户界面。

---

## DOM 与渲染流水线

浏览器将 HTML/CSS/JavaScript 转化为屏幕像素的过程称为**渲染流水线**（Critical Rendering Path）：

1. **解析**：HTML → DOM 树，CSS → CSSOM 树
2. **样式计算**：将 CSS 规则应用到 DOM 节点
3. **布局**（Layout/Reflow）：计算每个元素的盒模型（位置、尺寸）
4. **绘制**（Paint）：生成绘制指令（矩形、文本、渐变）
5. **合成**（Composite）：将多个图层合并为最终屏幕图像

`transform` 和 `opacity` 的动画只触发合成（不触发 Layout/Paint）——这是 60fps 流畅动画的关键优化。

---

## CSS 布局

Flexbox 和 Grid 是现代 CSS 布局的两大支柱：

- **Flexbox**：一维布局——沿主轴排列，沿交叉轴对齐
- **Grid**：二维布局——行列定义、区域命名、自动填充

CSS Containment（`contain: layout style paint`）让开发者告诉浏览器"这个元素的渲染独立于页面其余部分"，浏览器可以安全地跳过全局重排——这是大型 SPA 渲染性能的秘诀。

---

## 状态管理与渲染范式

| 方案 | 范式 | 代表 |
|------|------|------|
| Redux | 单一不可变状态树 + 纯函数 Reducer | React 经典搭配 |
| Signals | 细粒度响应式原语 | Solid.js / Preact Signals |
| 编译时框架 | 编译器将声明式 UI 转为直接 DOM 操作 | Svelte |

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| 浏览器合成器 | [GPU 的多图层合成——硬件加速](../01-gpu-rendering-pipeline/) |
| CSS Grid 布局算法 | [图论——网格的二维约束求解](../../00-lingxi/04-algorithm-theory/) |
| 虚拟 DOM Diff | [最长公共子序列——动态规划](../../00-lingxi/04-algorithm-theory/) |

:::tip[卷五内部路径]
- [**GPU 渲染管线**](../01-gpu-rendering-pipeline/)：WebGL/WebGPU——浏览器中的 GPU 能力
- [**数据可视化**](../04-data-visualization/)：D3.js——前端工程的图形侧
- [**人机交互**](../05-human-computer-interaction/)：WCAG——前端工程的可访问性
:::
