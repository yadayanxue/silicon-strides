# 硅步千里 · 踩坑笔记

> **协议**：遇坑即记 → 解决即补（见 `AGENTS.md § 6.1`）。
> **Agent 必读**：每次撰写新章节前，完整阅读此文件。

---

## 速查清单（Cheat Sheet）

> 每章撰写前快速过一遍，避免重复踩坑。

- [ ] 使用 `markdown: { remarkPlugins, rehypePlugins }` 而非 `unified()`
- [ ] Mermaid 节点 ID 不包含 `title` 关键字
- [ ] Mermaid 标签/节点文本中不含 `→` (U+2192)，用 `>` 或中文描述替代
- [ ] Mermaid 边标签不使用空字符串 `""`
- [ ] KaTeX 公式 `$` 前后与中文之间有空格
- [ ] Admonition 必须行首裸 `:::`，禁止 `> \`:::xxx\`` 包裹（见 #10）
- [ ] `npm run build` 通过（deprecation warning 可忽略，见 #1）
- [ ] 所有 Mermaid 图通过 `grep 'class="mermaid"' dist/` 确认是原生 `<div>` 而非 Expressive Code
- [ ] SVG 操作只用 `cloneNode(true)`，不用 `innerHTML`
- [ ] 复杂 JS 逻辑放 `public/*.js`，不内联在 `astro.config.mjs`
- [ ] `unist-util-visit` 已是直接依赖，新增插件可直接 `import { visit }`
- [ ] Mermaid 加载用 `/mermaid-loader.js`（含 CDN 回退），zoom 用 `/mermaid-zoom.js`
- [ ] mermaid 用 `import()` + `mermaid.run()`，不用 `startOnLoad: true`
- [ ] 替换 Mermaid 块时务必包含闭合 ` ``` `（见 #11 编辑篇）

---

## 工具链陷阱

### 1. Astro 6 + Starlight 0.40 的 `unified()` markdown 配置不生效

**症状**：KaTeX 公式全部显示为字面 `$...$` 文本，`remark-math` + `rehype-katex` 插件未执行。

**原因**：Astro 6 文档推荐用 `markdown: unified({ remarkPlugins, rehypePlugins })` 替代旧 API，但在当前版本组合下 `unified()` 返回的对象不会触发插件执行（疑似 bug）。构建不报错，但 KaTeX 不渲染。

**正确写法**（会产生 deprecation warning，但功能正常）：

```js
// astro.config.mjs
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

**验证方法**：构建后检查 `dist/` 中 HTML 是否包含 `katex` CSS 类。`grep -c 'katex' dist/.../index.html` 应 > 0。

---

## Mermaid 陷阱

### 2. Expressive Code 会吞噬 Mermaid 代码块 + 换行丢失

**症状**：` ```mermaid ` 代码块被 Starlight 的 Expressive Code 语法高亮器渲染为彩色代码，而非 Mermaid SVG 图表。即使手动提取代码传给 Mermaid，仍然报 `Syntax error in text`。

**原因**：
1. Starlight 默认启用 Expressive Code，它将 `mermaid` 当作普通语法高亮语言，渲染为 `<div class="ec-line">` 逐行高亮 HTML。
2. **关键坑**：`.ec-line` 的 `<div>` 之间无任何换行符/空格。`code.textContent` 将所有行拼成一行（`graph TD    T1[...]    subgraph...`），Mermaid 解析器要求换行分隔语句，单行代码必然报错。

**解决方案**：用 `code.innerText`（而非 `textContent`）提取文本——`innerText` 会在块级元素间自动插入 `\n`，保留原始换行结构：

```js
// astro.config.mjs head 注入
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: false, theme: 'default' });
document.addEventListener('DOMContentLoaded', async () => {
  const blocks = document.querySelectorAll('pre[data-language="mermaid"]');
  for (const pre of blocks) {
    const code = pre.querySelector('code');
    if (!code) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid';
    // ⚠️ 必须用 innerText 而非 textContent —— innerText 保留块级换行
    wrapper.textContent = code.innerText;
    const figure = pre.closest('figure');
    if (figure) figure.replaceWith(wrapper);
    else pre.replaceWith(wrapper);
  }
  await mermaid.run();
});
```

### 3. `import mermaid from 'mermaid'` 裸导入浏览器无法解析

**症状**：浏览器控制台报 `Failed to resolve module specifier "mermaid"`。

**原因**：浏览器不支持 Node.js 风格的裸模块导入。`<script type="module">` 内联脚本不会经过 Vite 打包。

**解决方案**：使用 CDN URL 导入：
```js
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
```

### 4. Mermaid 保留关键字 `title` 不能用作节点 ID

**症状**：`Syntax error in text`。

**原因**：Mermaid 11 中 `title` 是 directive 级保留关键字，用于声明图表标题。将 `title["..."]` 用作节点 ID 会导致解析错误。

**错误写法**：`title["掺杂类型与载流子"]`
**正确写法**：`T1["掺杂类型与载流子"]` 或任意非保留关键字。

### 5. Unicode 箭头 `→` (U+2192) 在 Mermaid 标签中引发解析错误

**症状**：`Syntax error in text`，尤其在 `|"包含→的标签"|` 边标签或 `["包含→的文本"]` 节点文本中。

**原因**：Mermaid 的 Jison 解析器会将 `→` 误识别为图形箭头语法的一部分，破坏字符串字面量的解析。

**错误写法**：
- `N -.->|"二者结合 →"| PN`  ❌
- `S1["A = 0 → PMOS 导通"]`  ❌

**正确写法**：替换为 `>`、`->`、或纯中文描述。
- `N -.->|"二者结合"| PN`  ✅
- `S1["A = 0: PMOS 导通"]`  ✅

### 6. 空字符串边标签 `|""|` 导致解析错误

**症状**：`Syntax error in text`。

**原因**：`P -.->|""| PN` 中空字符串 `""` 被 Jison 解析器误判为引号不匹配或空 token。

**正确写法**：省略标签或使用空格。
- `P -.-> PN`  ✅
- `P -.->|" "| PN`  ✅

---

## KaTeX 内容陷阱

### 7. KaTeX 公式中避免在 `$` 与中文之间缺少空格

**症状**：部分 `$...$` 不被识别为数学公式，显示为字面文本。

**原因**：Markdown 解析器要求 `$` 定界符前后有空格或行首/行尾才能识别。中文紧贴 `$` 时（如 `参数$V_{GS}$是`）可能被跳过。

**正确写法**：`参数 $V_{GS}$ 是`（在 `$` 前后加空格）。

**已处理的例外**：括号 `()` 和冒号 `：` 等标点通常安全，但中文汉字紧贴 `$` 有风险。

---

### JS 文件分离原则

- `astro.config.mjs` 的 `head.content` 模板字面量中避免写复杂 JS —— 模板嵌套、`${}` 转义极难调试
- 复杂交互逻辑放到 `public/*.js`，通过 `head` 的 `{ src: '/xxx.js', defer: true }` 引入
- Mermaid 加载：`import('cdn-url').then()` 比 `startOnLoad: true` 可靠（ESM 竞态 + CDN 容错）
- `mermaid.initialize({ startOnLoad: false })` + 显式 `mermaid.run()` 是唯一稳定方案

---

## 架构优化记录

### 8. 2026-06-14：配置优化三项 ✅

- **添加 `unist-util-visit` 为直接依赖**：`remark-mermaid.mjs` 不再依赖 Starlight 的传递依赖链
- **提取 `public/mermaid-loader.js`**：head 内联 20 行 Mermaid 加载逻辑外置，添加 unpkg 回退 CDN
- **`editLink.text` 设为中文**：`'编辑此页'`
- **复测 `unified()` API**：Astro 6.4.6 + Starlight 0.40 下仍然静默丢弃所有 remark/rehype 插件（KaTeX + Mermaid 均 0 渲染），该 bug 未修复。Deprecation warning 暂时无解。

### 9. GitHub Pages 部署：`base` 路径 + HTML 链接陷阱

**症状**：部署到 `username.github.io/repo/` 后所有内部链接缺少 `/repo/` 前缀。

**根因**：Astro 需要 `base: '/repo/'` 为所有资源添加路径前缀。Markdown 链接 `[text](/path/)` 会被自动处理，但**Markdown 中的原始 HTML `<a href="/path/">` 不会被 `base` 转换**。

**解决方案**：
1. `astro.config.mjs` 添加 `base: '/silicon-strides/'`
2. Markdown 中原始 `<a href>` 使用相对路径 `href="./00-lingxi/"` 而非绝对路径 ✅

---

## 内容陷阱

### 10. Admonition 被 `> \`:::\`` 包裹导致全部失效（03-microarchitecture.md 返工）

**症状**：体系结构章节 9 处 `:::tip`/`:::note` 全部渲染为**行内代码 + 引用块**，而非 Starlight 的彩色提示框。`grep -c '^:::'` = 0，HTML 中无任何 `starlight-aside` 元素。

**根因**：撰写时误将 admonition 写成引用块内的行内代码：
```markdown
> `:::note[标题]`     ← 反引号 + > 引用块，Starlight 视为普通文本
```
Starlight 的 admonition 解析要求 `:::` 出现在**行首、裸露、无任何包裹**。一旦被反引号或 `>` 前缀污染，directive 语法即被跳过，且**构建不报错**（静默失败，最危险）。

**正确写法**（AGENTS.md §3.2）：
```markdown
:::note[标题]
正文内容……
:::
```

**验证方法**：构建后 `grep -c 'starlight-aside' dist/.../index.html` 应 > 0；`grep ':::' dist/.../index.html` 应为 0（directive 已被消费）。

**通用规则（适用于所有章节）**：
- 撰写完务必 `grep -c '^:::' chapter.md` 检查 admonition 数量，再对比 `grep -c 'starlight-aside' dist/.../index.html`
- 静默失败是内容质量的最大敌人——Mermaid #2、KaTeX #1、admonition #10 都是同类问题：**语法错误不报错，只静默降级渲染**
- 返工 03 章时还发现 Mermaid 节点标签内残留 `→`（#5 重现，如 `[TLB: 虚拟→物理]`）——证明 #5 的 `→` 陷阱易复发，需在速查清单中常驻 ✅

---

## 内容审阅记录

### 11. 2026-06-16：卷一已完成三章全面审阅

**审阅范围**：半导体物理（01）、数字逻辑（02）、体系结构（03）

**体系结构章发现的问题**：

1. **Mermaid 图全部缺 `title` 属性**（5 幅）：违反 AGENTS.md §3.2 撰写标准，构建不报错但图表缺少语义标注。所有图均已补全 `title` directive ✅
2. **数据准确性严重问题**：
   - 处理器演进图中 IBM 7094 标注为 "2.5GHz"（实际 ~0.7 MHz），RISC-V Hart 标注为 "0.25 IPC"（RISC-V 是 ISA 非具体实现）——已替换为 IBM System/360、MIPS R2000 等真实处理器 ✅
   - 性能公式 `性能 = IPC × f × (命中L1缓存率)² × (命中L2缓存率)` 非标准形式——已替换为标准 CPU Time 公式 + CPI 展开 ✅
   - "面积比单周期减少 1000 倍"（夸大，实际 3-5 倍）——已修正 ✅
   - TAGE 预测器 "记录最近 4 个分支"（实际使用多张表，历史长度可达 100+）——已修正 ✅
   - 分支预测准确率 "RISC-V 8级乱序 98% @ 3.1GHz"（无已知实现匹配）——已移除虚构数据 ✅
3. **概念混淆**：将"乱序取指"与分支预测混为一谈——章节已重写为"推测取指与分支预测"，澄清取指阶段依赖分支预测而非"乱序" ✅
4. **内容冗余**：独立"跨卷连接"章节与末尾 `:::tip[跨卷链接]` 大幅重复——末尾 admonition 已精简为卷内路径 + 精选跨卷链接 ✅
5. **PROGRESS.md 统计不准确**：标注 "3 Mermaid + 10 KaTeX"，实际 5 Mermaid + 4 KaTeX ✅

**半导体物理章**：内容质量优秀，无问题。
**数字逻辑章**：内容质量优秀，无问题。

**通用经验**：
- 统计数据（如 IPC、时钟频率）应来自可查证的公开资料，避免"看起来合理"的虚构数字
- 每个 Mermaid 图撰写完立即添加 `title` directive，将此步骤纳入撰写流程而非事后补救
- 性能公式等核心数学内容务必使用标准/教科书形式，自定义公式会造成误导
- **编辑篇：替换 Mermaid 块时务必包含闭合 ` ``` `**——本次修复 NoC 图时 old_string 包含了闭合反引号，但 new_string 不慎遗漏，导致后续 Mermaid 块被"吞入"未闭合代码块而静默丢失（构建不报错！）。此坑与 #2、#10 同属"静默降级"类别。修复后 5/5 渲染通过 ✅


---

### 12. 2026-06-16：draft 策略变更——`draft: true` 切换到占位页模式

**症状**：`draft: true` 章节在构建时被排除，但 sidebar 链接仍指向它们，发布后点击即 404。

**根因**：Starlight 的 `draft: true` 排除页面构建，但 `astro.config.mjs` sidebar 中静态链接不会感知 draft 状态。

**解决方案**：
1. 46 个待撰写章节 `draft: true` → `draft: false`
2. 每章添加 `:::caution[章节撰写中]` 占位提示，保留 `<!-- TODO -->` 主题列表
3. 构建从 15 页增至 61 页，零 404 ✅

**新规则**：全程使用 `draft: false`，通过占位内容区分完成度。
