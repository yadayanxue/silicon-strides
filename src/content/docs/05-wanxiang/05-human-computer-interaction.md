---
title: 人机交互
tags: [hci, usability, accessibility, interaction-design]
description: "技术的终点是人——可用性评估、无障碍设计与交互范式的演进"
draft: false
---

> 技术的终点是人。

HCI（Human-Computer Interaction）是计算机科学中"最不计算机"的领域——它关注的是人的感知、认知和行为。一个技术上完美的系统，如果用户无法理解如何使用它，仍然是失败的。

---

## 可用性工程

Nielsen 的十大启发式评估原则：系统状态可见、系统与现实匹配（说人话）、用户控制与自由（撤销）、一致性与标准、错误预防、识别而非回忆、灵活高效、美观简约、帮助诊断错误、帮助文档。

### Fitts 法则与 Hick 法则

**Fitts 法则**：移动到目标的时间与距离成正比，与目标大小成反比——$T = a + b \log_2(2D/W)$。解释了为什么屏幕角落的按钮最容易点击（无限大的有效面积）。

**Hick 法则**：选择时间随选项数量对数增长——$T = b \log_2(n+1)$。解释了为什么汉堡菜单隐藏低频选项可以提高高频操作的效率。

---

## 无障碍设计

WCAG（Web Content Accessibility Guidelines）定义了四个原则：可感知、可操作、可理解、健壮。ARIA 属性补充了 HTML 原生语义——`aria-label`、`aria-live`、`role="button"` 使屏幕阅读器能够正确解读现代 Web 应用。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Fitts 法则 | [DMA 乒乓缓冲——距离 vs 延迟的帕累托前沿](../../02-jiezi/04-peripheral-drivers/) |
| 交互范式演进 | [CLI → Shell 脚本 → GUI → 自然语言 VUI](../../03-qiankun/01-process-and-thread/) |

:::tip[卷五内部路径]
- [**前端工程**](../03-frontend-engineering/)：WCAG 实现——CSS `:focus-visible` 与语义 HTML
- [**数据可视化**](../04-data-visualization/)：信息设计——HCI 原则的可视化应用
:::
