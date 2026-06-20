# 踩坑笔记

> 遇坑即记 → 解决即补。新建章节前完整阅读。

---

## 速查清单

- [ ] `npm run build` 通过
- [ ] Mermaid `grep 'class="mermaid"' dist/` 确认原生 `<div>`
- [ ] Mermaid 节点/标签不含 `→`，不含 `title` 关键字，边标签不用 `""`
- [ ] Admonition 行首裸 `:::`
- [ ] KaTeX `$` 前后与中文间有空格
- [ ] 跨卷 `../../`，卷内 `../`
- [ ] 每个跨卷链接带 `#fragment`，`python3 scripts/check-cross-links.py` 通过
- [ ] heading 不用 `→` 和 `：`
- [ ] 替换 Mermaid 块时包含闭合 ` ``` `
- [ ] 链接用相对路径，不用绝对 `/01-weichen/...`

---

## 问题记录

### 1. `unified()` 配置不生效
KaTeX 不渲染。用 `markdown: { remarkPlugins, rehypePlugins }` 而非 `unified()`。有 deprecation warning 但功能正常。

### 2. Expressive Code 吞噬 Mermaid 块
Mermaid 语法报错。用 `code.innerText` 取代 `code.textContent` 提取文本——`innerText` 保留块级换行。

### 3. 裸 `import mermaid from 'mermaid'` 浏览器不解析
用 CDN URL：`import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'`

### 4. Mermaid 保留关键字 `title` 不能做节点 ID
`title["..."]` 导致解析错误，换成 `T1["..."]` 等。

### 5. Unicode `→` 在 Mermaid 标签中解析失败
替换为 `>` 或中文描述。heading 中的 `→` 被 slug 引擎删除后留下 `--` 双连字符，导致 fragment 不稳定。

### 6. 空字符串边标签 `|""|` 解析错误
省略标签或使用 `|" "|`。

### 7. KaTeX `$` 与中文间缺空格
`参数$V_{GS}$是` 不被识别。改为 `参数 $V_{GS}$ 是`。

### 8. `base` 路径 + 静态 sidebar 链接
`astro.config.mjs` 设 `base: '/silicon-strides/'`。Markdown 原生的 `<a href>` 不会被 base 转换，用相对路径。

### 9. GitHub Pages 绝对路径断链
`/01-weichen/...` 不含 `/silicon-strides/` 前缀。全部改用相对路径 `../../01-weichen/...`。

### 10. Admonition 被 `> \`:::\`` 包裹
`:::tip` 必须在行首且不被任何字符包裹，否则静默降级为普通文本。

### 11. 替换 Mermaid 块时遗漏闭合反引号
new_string 忘记 ` ``` `，后续 Mermaid 块被吞入未闭合代码块。构建不报错，静默丢失。

### 12. `draft: true` 导致 sidebar 404
Starlight 排除 draft 页面但 sidebar 静态链接不感知。全程用 `draft: false`。

### 13. 数据准确性：虚构数字与概念混淆
处理器频率、分支预测准确率等需来自可查证资料；MIPS R2000 分类、Tomasulo 归属需核对历史事实。

### 14. 跨卷路径层级：`../` vs `../../`
同卷内 `../`，跨卷 `../../`。判断方法：看源文件和目标文件的目录前缀是否相同（如 `02-jiezi` vs `03-qiankun`）。

### 15. 链接无 `#fragment` → 跳转到页顶
指向特定小节必须带 fragment，构建后 `grep 'id="..."' dist/` 验证实际 ID，不可凭猜测。

### 16. 链接文本与目标 heading 不一致
写完链接后 `grep '^##' 目标文件` 逐字对照原文，不许自己概括。

### 17. 跨卷链接指向不存在的目标内容
创建链接时须同步确保目标文件有对应内容，并在目标文件添加反向链接。`python3 scripts/check-cross-links.py` 自动校验全部 fragment。

### 18. 内容宽度过窄
Starlight 默认 `--sl-content-width: 45rem`，表格压缩成一字一行。`custom.css` 覆盖为 `68rem`。

### 19. sticky header 遮挡锚点跳转
`custom.css` 加 `html { scroll-padding-top: 5rem }`，为顶栏留空间。
