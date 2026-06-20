---
title: 人机交互
tags: [hci, usability, accessibility, interaction-design]
description: "技术的终点是人——可用性评估、Fitts 法则与无障碍设计原则"
draft: false
---

> 技术的终点是人。

HCI 关注人的感知、认知和行为。一个技术上完美的系统，如果用户无法理解如何使用它，仍然是失败的。

---

## Nielsen 十大启发

系统状态可见、匹配现实世界、用户控制自由、一致标准、错误预防、识别而非回忆、灵活高效、美观简约、帮助诊断、帮助文档。

## Fitts 法则

到达目标的时间 $T = a + b \log_2(2D/W)$——距离越远、目标越小，时间越长。解释了为什么屏幕角落的按钮最容易点击（无限大的有效面积）。

## Hick 法则

选择时间 $T = b \log_2(n+1)$——选项越多选择越慢。解释了为什么汉堡菜单隐藏低频选项可提高高频操作效率。

---

## 无障碍设计

WCAG 四原则：可感知、可操作、可理解、健壮。ARIA 属性补充 HTML 原生语义使屏幕阅读器能正确解读现代 Web 应用。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Fitts 法则 | [DMA：解放 CPU 的数据搬运工](../../02-jiezi/04-peripheral-drivers/#dma解放-cpu-的数据搬运工) |
| 交互范式演进 | [CLI → GUI → 自然语言 VUI](../../03-qiankun/01-process-and-thread/) |

:::tip[卷五内部路径]
- [**前端工程**](../03-frontend-engineering/)：WCAG 实现——语义 HTML 与 ARIA
- [**数据可视化**](../04-data-visualization/)：信息设计——HCI 原则的可视化应用
:::
