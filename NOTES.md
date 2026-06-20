# 踩坑笔记

> 遇坑即记 → 解决即补。新建章节前完整阅读。
>
> **编写原则**：
> - 规则用抽象模式描述，不绑定项目具体目录名/文件名
> - 问题条目固定三段：`**症状**` / `**根因**` / `**方案**`

---

## 速查清单

- [ ] `npm run build` 通过
- [ ] `python3 scripts/check-cross-links.py` 通过（路径深度 + fragment 校验）
- [ ] 跨卷链接格式 `概念名（目标 heading 原文）`，缺 fragment 的补充
- [ ] 相对路径：上溯到共同父目录的 `../` + 目标路径。`grep -rn '\.\./\.\./\.\./' src/content/docs/` 为空
- [ ] heading 自然书写，不改动以迁就 slug
- [ ] Mermaid 不含 `title` 关键字做节点 ID，边标签不用 `""`
- [ ] Admonition 行首裸 `:::`
- [ ] KaTeX `$` 前后与中文间有空格
- [ ] 替换 Mermaid 块时包含闭合 ` ``` `
- [ ] 链接用相对路径，不用绝对 `/01-weichen/...`

---

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
