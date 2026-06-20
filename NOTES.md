# 踩坑笔记

> 遇坑即记 → 解决即补。每次编辑前阅读。
>
> **编写原则**：
> - 规则用抽象模式描述，不绑定项目具体目录名/文件名
> - 问题条目固定三段：`**症状**` / `**根因**` / `**方案**`

---

## 速查清单

> **定位**：本清单是 AGENTS.md 规则的实操速查卡，非独立规范。如有冲突，以 **AGENTS.md** 为准。
> 项目 Agent `silicon-archivist`（`.pi/agents/silicon-archivist.md`）已预载全部约束，子 Agent 调用时无需重复粘贴。

### 每次编辑后必检

- [ ] `npm run build` 通过，零警告
- [ ] `python3 scripts/check-cross-links.py` 通过（路径深度 + fragment 校验）
- [ ] Mermaid/KaTeX/跨卷链接数量不低于编辑前（只增不减）
- [ ] 无新增 TODO 或占位符

### 关键格式（详见 AGENTS.md Section 3.2 + NOTES.md #4-#6-#22）

- [ ] 跨卷链接格式 `概念名（目标 heading 原文）`
- [ ] 相对路径 `../../`（禁止 `../../../` 和绝对路径）
- [ ] heading 不改动（fragment 依赖）
- [ ] Mermaid 含 `title` 属性，节点 ID 不用 `title` 关键字，标签泛型用 `#60;` / `#62;`
- [ ] KaTeX `$` 与中文间有空格
- [ ] Admonition `:::` 顶格
- [ ] 替换 Mermaid 块时包含完整 ` ```mermaid...``` `

### 编辑规则（详见 AGENTS.md Section 9 + Section 12）

- [ ] 一次只改一个章节文件
- [ ] 先 Read 再 Edit，只增不删
- [ ] 不改已有 heading 文本
- [ ] 不执行 `git commit` / `git push`

### 多章批改工作流（详见 NOTES.md #27）

当用户要求改进一整卷（多章）时，必须三阶段拆分，不可一对话连改：

- [ ] **阶段 1 · 分析**：父 Agent Read 全卷，产出"逐章编辑要点卡"（每章 3-5 个精确插入点 + 建议要素 + 最小行数），展示给用户确认
- [ ] **阶段 2 · 执行**：逐章启动 `silicon-archivist` 子 Agent，task 传入编辑要点卡。子 Agent 只装 1 章 + AGENTS.md，深度编辑。父 Agent 验收后询问用户再继续下一章
- [ ] **阶段 3 · 收尾**：更新 PROGRESS.md 全局指标

核心创新：编辑要点卡将"分析广度"（需看全卷）与"编辑深度"（需上下文充裕）解耦。

## 问题记录

### 1. `unified()` 配置不生效
**症状**：KaTeX 不渲染。
**根因**：Starlight 需要 `markdown: { remarkPlugins, rehypePlugins }` 形式，`unified()` 形式不生效。
**方案**：改用 `remarkPlugins: [remarkMermaid, remarkMath]`、`rehypePlugins: [rehypeKatex]`，deprecation warning 可忽略。 ✅

### 2. Expressive Code 吞噬 Mermaid 块
**症状**：Mermaid 语法报错，构建时部分块被当作普通代码块处理。
**根因**：`code.textContent` 丢失块级换行，导致 Expressive Code 错误解析 Mermaid 块边界。
**方案**：用 `code.innerText` 提取文本——`innerText` 保留块级换行。 ✅

### 3. 裸 `import mermaid from 'mermaid'` 浏览器不解析
**症状**：浏览器控制台报模块加载错误。
**根因**：裸 specifier 不被浏览器支持，需要完整 URL。
**方案**：用 CDN URL `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'`。 ✅

### 4. Mermaid 保留关键字 `title` 不能做节点 ID
**症状**：`title["..."]` 导致 Mermaid 解析错误。
**根因**：`title` 是 Mermaid 保留关键字，不能用作节点 ID。
**方案**：节点 ID 换用 `T1["..."]` 等非保留字。Mermaid `title:` 属性用 `：` 而非 `——` 作为分隔符。 ✅

### 5. 空字符串边标签 `|""|` 解析错误
**症状**：Mermaid 边标签 `|""|` 导致解析失败。
**根因**：空字符串不符合 Mermaid 边标签语法。
**方案**：省略标签或使用 `|" "|`。 ✅

### 6. KaTeX `$` 与中文间缺空格
**症状**：`参数$V_{GS}$是` 不被 KaTeX 识别为行内公式。
**根因**：KaTeX 要求 `$` 与相邻中文字符间有空格分隔。
**方案**：改为 `参数 $V_{GS}$ 是`。 ✅

### 7. `base` 路径 + 静态 sidebar 链接
**症状**：sidebar 静态链接在 GitHub Pages 上 404。
**根因**：Markdown 原生 `<a href>` 不会被 Astro 自动加 base 前缀。
**方案**：所有 Markdown 链接使用相对路径，不依赖 base 自动转换。 ✅

### 8. GitHub Pages 绝对路径断链
**症状**：`/01-weichen/...` 绝对路径在 GitHub Pages 上 404。
**根因**：绝对路径不含 `/silicon-strides/` 前缀，GitHub Pages 从域名根解析。
**方案**：全部改用相对路径。 ✅

### 9. Admonition 被 `> :::` 包裹
**症状**：`> :::tip` 静默降级为普通引用块，不渲染为提示框。
**根因**：`:::` 必须在行首且不被任何字符包裹。
**方案**：`:::tip` 顶格书写，前方无 `>` 无空格。 ✅

### 10. 替换 Mermaid 块时遗漏闭合反引号
**症状**：编辑后后续 Mermaid 块被吞入未闭合代码块，构建不报错但静默丢失。
**根因**：`new_string` 未包含闭合 ` ``` `。
**方案**：替换 Mermaid 块时必须包含完整 ` ```mermaid\n...\n``` `。 ✅

### 11. `draft: true` 导致 sidebar 404
**症状**：sidebar 中页面链接点击 404。
**根因**：Starlight 排除 draft 页面，但 sidebar 静态链接不感知 draft 状态。
**方案**：已发布页面一律 `draft: false`，未完成用 `<!-- TODO -->` 而非 draft 隐藏。 ✅

### 12. 数据准确性：虚构数字与概念混淆
**症状**：处理器频率、分支预测准确率等数据无法查证。
**根因**：凭记忆写作，未经可查证来源核对。
**方案**：技术数字必须来自 datasheet/论文/手册。 ✅

### 13. 相对路径层级算错（`../../../` 代替 `../../`）
**症状**：`check-cross-links.py` 通过但仍存在死链——fragment 存在但路径不可达。
**根因**：按卷号差直觉算 `../` 个数，而非从文件位置数目录层级。
**方案**：规则——从当前文件上溯到所有 `.md` 共同父目录需要几层 `../` 就写几层。禁止 `../../../`。`check-cross-links.py` 增加路径深度校验。 ✅

### 14. 跨卷章节链接缺 fragment
**症状**：链接指向具体章节页但无 `#fragment`，点击跳页顶而非相关小节。2026-06-20 从 199 条降至 149 条（剩余为章节级引用，无需 fragment）。
**根因**：写链接时只定位到章，未定位到节。
**方案**：可自动匹配的已补齐（46 条），剩余 149 条为章节级引用，不需 fragment。`check-cross-links.py` 验证全部通过。

### 15. 链接文本格式：概念名（目标 heading 原文）
**症状**：跨卷链接两边对同一概念的叫法不同，读者看不出要跳去哪。
**根因**：只写概念名，丢失了目标 heading 信息；只写目标 heading，丢失了源视角语境。
**方案**：链接文本格式 `概念名（目标 heading 原文）`，两端信息都呈现。fragment 与 heading slug 一致，`check-cross-links.py` 自动校验。 ✅

### 16. 跨卷链接两端内容缺失
**症状**：链接指向的段落是占位符或空泛描述；或链接引用了某个概念但本章未覆盖，也未链接到讲解该概念的其他章节。
**根因**：创建链接时只验了 fragment 存在，没验两端内容是否真的兑现了链接承诺。
**方案**：补充 fragment 时同步审查两端内容——目标段落有实质内容，源文件中的被引用概念在本章或其他章有对应小节。

### 17. 内容宽度过窄
**症状**：表格列多时压缩成一字一行。
**根因**：Starlight 默认 `--sl-content-width: 45rem`。
**方案**：`custom.css` 覆盖为 `68rem`。 ✅

### 18. sticky header 遮挡锚点跳转
**症状**：点击 fragment 链接后目标 heading 被顶部导航栏遮挡。
**根因**：sticky header 覆盖在锚点上方。
**方案**：`custom.css` 加 `html { scroll-padding-top: 5rem }`。 ✅

### 19. Mermaid 渲染延迟导致锚点偏移
**症状**：fragment 正确但锚点位置每次刷新不一致。
**根因**：`.mermaid` 初始高度为 0，SVG 异步渲染撑高后浏览器首次 hash 滚动位置已过时。
**方案**：`astro.config.mjs` 注入内联脚本拦截 hash，`mermaid-loader.js` 渲染完成后恢复。一次定位到位。 ✅

### 20. 错误修改 heading 以迁就 slug 美观
**症状**：为消除 slug 中的 `--` 双连字符，把 heading 里的 `——` `→` `+` `/` 改成 `：`，破坏了原文风格。
**根因**：slug 由 build 自动生成，`check-cross-links.py` 自动验证对应关系。改 heading 是本末倒置。
**方案**：heading 永远保持原样不动。fragment 用 build 后 dist 中的实际 `id`，脚本自动校验。 ✅ 已回退所有误改。

### 21. 规则有但无人执行——自动化断层
**症状**：NOTES.md 规则靠人手工 grep，导致 `../../../`、缺 fragment 等问题反复出现。
**根因**：规则写在笔记里，没变成机器门禁。Agent 工作流只要求 `npm run build`，不强制跑其他检查。
**方案**：将所有可自动化的检查收敛到 `check-cross-links.py`，Agent 工作流强制运行。待执行。

### 22. Mermaid 标签中的 `<T>` 被浏览器 HTML 解析器吞掉
**症状**：`fn<T>(x: T)` 在渲染后变为 `fn<t>(x: T)`（`<T>` 被当作 HTML 标签），Mermaid 解析失败，图不显示。
**根因**：remark-mermaid 将 Mermaid 源码嵌入 `<div class="mermaid">`，浏览器 HTML 解析器将标签内的 `<T>` 等模式当作 HTML 标签，lowercase 处理并破坏文本。Astro 在处理 `type: 'html'` 节点时完全解码所有 HTML 实体，因此 `&lt;` `&amp;lt;` 等转义均无效。
**方案**：在 .md 源文件中使用 Mermaid 的 Unicode escape 语法 `#60;` 替代 `<`，`#62;` 替代 `>`。例如 `fn#60;T#62;(x: T)`。Mermaid 渲染为 `<` `>` 字符，但 HTML 源码中不含尖括号，浏览器不误解析。仅适用于 Mermaid 节点标签中的泛型尖括号等非 HTML 语义的 `<>`——Mermaid 原生 HTML 标签（`<br/>` `<sub>` `<sup>`）不需要转义。 ✅

### 23. 一次改多章 = 多章都浅——缺少作用域闸门
**症状**：用户说"改进卷四"时，Agent 试图一次性处理 5 章，每章只撒胡椒面（加一两句话/一个图），质量远差于一次一章的深度改进。
**根因**：AGENTS.md 虽有"一次一章"规则（Section 6.1），但缺少强制执行机制——无编辑前闸门、无违反检测、无回退流程。Agent 上下文窗口装不下 5 章 × 200+ 行的深度编辑。
**方案**：在 AGENTS.md 中增加三层约束：① Section 9.0「作用域闸门」——编辑前声明目标文件、复核范围、提取优先级；② Section 12 Forbidden Actions 增加"单 session 不碰多内容文件"禁止项；③ Section 8 Quick Start 将闸门嵌入启动流程。多章请求转为"取优先级第一 → 做完再问"的串行模式。 ✅

### 24. 多章改进缺少自动化编排——父 Agent 手工逐章效率低
**症状**：父 Agent 手工逐章改进时，每章都需要重新加载 AGENTS.md/NOTES.md/PROGRESS.md 上下文并手工构造编辑指令，重复劳动多且容易遗漏步骤。
**根因**：AGENTS.md 有"一次一章"约束和增量编辑协议，但没有多章自动化编排机制。子 Agent 天然隔离 + 一次一章，但缺少标准化的调用模板。
**方案**：在 AGENTS.md 新增 Section 6.3「子 Agent 编排工作流」——三阶段（计划 → 串行执行 → 收尾），提供完整的子 Agent 任务模板。父 Agent 从 PROGRESS.md 自动提取优先级章节目录，按模板为每章生成 worker task，异步启动、验收、更新进度、询问下一章。每个子 Agent 只改一个文件，自动执行三检。 ✅

### 25. 子 Agent 任务模板冗长——规则内联导致重复和臃肿
**症状**：AGENTS.md Section 6.3 的"子 Agent 任务模板"包含完整的规则内联文本（硬约束 6 条 + 格式规则 + 启动文件清单），每次调用都要粘贴大段重复指令，污染父 Agent 上下文。
**根因**：所有约束通过 task 参数手工传递，没有持久化的项目 Agent。AGENTS.md 中 Section 6.3 的内容组织方式与文档 Section 的命名风格一致（"作用域闸门""编排工作流"），缺少独立、简洁的配置层。
**方案**：① 创建 `.pi/agents/silicon-archivist.md`——预载全部约束（Role/Startup/Rules/Format/Edit/Links/Validate/Report 八段短名结构），用 `systemPromptMode: add` 叠加到 worker 上；② AGENTS.md Section 6.3 缩减为编排指令（引用 `silicon-archivist` agent、父 Agent 验收清单），不再内联规则文本。子 Agent task 只需指定目标和报告格式。 ✅

### 26. 三文件间指标过时 + 验收清单重复 + 速查清单冗余
**症状**：① AGENTS.md Section 11 KaTeX 写 27/49 实际 42/49，fragment 写 94 实际 100；② Section 6.3"父 Agent 验收清单"与 Section 9.3"编辑后必检清单"内容一致但不互引用；③ NOTES.md 速查清单是 AGENTS.md Sections 3-4-9 的压缩版，缺少权威声明和子 Agent 引用。
**根因**：多轮增量编辑后三个文件各自演化，未做系统性一致性审查。
**方案**：① Section 11 指标更新为实测值；② 6.3 验收清单改为引用 9.3 + 补充 cross-links 和计数检查；③ NOTES.md 速查清单添加"以 AGENTS.md 为准"声明 + "关键格式/编辑规则"引用具体 Section，同时声明 `silicon-archivist` agent 已预载约束。从 4 节 24 条 checklist → 3 节 15 条，去重 9 条。 ✅

### 27. 一对话多章连改仍有稀释——需要"编辑要点卡"隔离分析广度与编辑深度
**症状**：2026-06-20 第七轮改进中，父 Agent 手工连续改进卷零 6 章。每章有实质改进（+37% 行数），但后几章编辑深度逐章下降——第六章的新增内容不如第一章细致。根因是上下文被 5 个必读文件 + 6 章内容稀释。
**根因**：#23 的"一次一章"闸门解决了多章同时改的问题，但没有解决"同一对话串行多章时上下文疲劳"的问题。父 Agent 既要做分析（加载所有章）又要做编辑（加载 AGENTS.md 约束），上下文窗被两头挤压，越往后编辑越模板化。
**方案**：三阶段分拆——
1. **阶段 1 · 分析**（父 Agent）：Read 目标卷全部 N 章，产出"逐章编辑要点卡"。要点卡含：精确插入点（在哪个 heading/段落之后）、需展开的概念、建议包含的要素（手算示例/Mermaid/跨卷链接）、最小行数。展示给用户确认优先级。
2. **阶段 2 · 深度执行**（子 Agent × 确认循环）：逐章启动 `silicon-archivist` 子 Agent，task 参数传递该章的编辑要点卡。子 Agent 上下文只装 1 章内容 + AGENTS.md 约束，剩余空间全部用于深度编辑。每章完成后父 Agent 验收（build + cross-links + 指标），展示结果，询问用户确认后继续下一章。
3. **阶段 3 · 收尾**（父 Agent）：更新 PROGRESS.md 全局指标，汇总卷宗改进报告。

核心创新是"编辑要点卡"——它把分析阶段的广度（需要看全卷才能判断每章缺什么）与执行阶段的深度（需要上下文富余才能写好）解耦。要点卡是分析产出的结构化施工图，子 Agent 拿到的是精确指令而非需求文档，无需自行分析文件结构。初始对话中分析全部 N 章消耗 N × 文件大小的 token，但后续每章子 Agent 对话只需 1 章 + 要点卡，深度编辑空间充裕。 ✅
