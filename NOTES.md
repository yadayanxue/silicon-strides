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
- [ ] **跨卷链接必须用相对路径** `../../01-weichen/...` 而非绝对 `/01-weichen/...`（见 #14）

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

---

### 13. 2026-06-16：卷一级别全面审阅

**审阅范围**：半导体物理（01）、数字逻辑（02）、体系结构（03）、存储层次（04）、指令集架构（05）

**01 半导体物理**：内容准确，公式正确，无问题。✅
**02 数字逻辑**：内容准确，Verilog 示例正确，无问题。✅

**03 体系结构章发现的问题**：

1. **MIPS R2000 归类错误（L139）**：原文标注"多周期方案"，但 MIPS R2000（1986）是第一款商用 5 级流水线 RISC 处理器。已修正为"率先采用 5 级流水线方案" ✅
2. **Tomasulo 算法历史归属错误（L286-289）**：原文称"单周期超标量处理器（如 VAX 11/780）"，但 VAX 11/780 是顺序 CISC 微码机器。Tomasulo 算法诞生于 IBM System/360 Model 91（1966）浮点单元。已修正 ✅
3. **SATC 公式逻辑错误（L251）**：`count = min(4, max(0, last-1))` 总是递减，无递增路径。已修正为标准 2-bit 饱和计数器行为：taken → `min(3, count+1)`，not taken → `max(0, count-1)` ✅
4. **显示公式格式不一致**：三处 `# 硅步千里 · 踩坑笔记

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
- [ ] **跨卷链接必须用相对路径** `../../01-weichen/...` 而非绝对 `/01-weichen/...`（见 #14）

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

 应为 `$`（L79-87, L529-537）。已修正 ✅

**04 存储层次章发现的断链**：

1. `[冯·诺依曼架构](../03-microarchitecture/#冯·诺依曼架构)` — 03 章无此标题/文本，grep 返回空。已改为纯文本 ✅
2. `[半导体存储单元](../01-semiconductor-physics/#dram-单元单管一电容的极致简约)` — 01 章无 DRAM 章节。已改为同文件内链 `[DRAM 内部结构](#dram-内部结构一个单元的微观世界)` ✅
3. `../../04-yuanhai/02-query-processing-and-optimization/` — 实际文件名为 `02-storage-engine.md`。已修正（2 处） ✅

**05 指令集架构章发现的断链**：

1. `../../02-jiezi/01-bare-metal-programming/` — 实际文件名为 `01-bare-metal.md`（多了 `-programming` 后缀）。已修正（2 处） ✅

**通用经验**：
- 跨章节链接必须验证**目标文件存在**且**片段锚点存在**
- 历史事实（如 MIPS R2000、IBM 360/91）应以教科书/权威资料为准
- 公式语义必须自洽——`count = min(4, max(0, last-1))` 只减不增，一眼可识破
- 审阅时用 `grep -n '^##'` 列出所有标题，逐一对比链接中的 fragment

### 14. 2026-06-16：卷二 01/02 章撰写——裸机编程 + 中断与异常

**撰写范围**：`02-jiezi/01-bare-metal.md`（裸机编程）、`02-jiezi/02-interrupts.md`（中断与异常）

**构建结果**：`npm run build` 通过，61 页，零错误 ✅

**Mermaid 统计**：01 章 4 幅、02 章 4 幅，全部渲染为原生 `<div class="mermaid">` ✅
**Admonition 统计**：01 章 9 个、02 章 7 个，dist 中 `starlight-aside` 数量匹配，无 `:::` 残留 ✅
**KaTeX 渲染**：01 章 4 处、02 章 3 处，katex CSS 类正常 ✅
**跨卷链接**：01/02 章均包含卷内（Scroll 2 内部）和跨卷（Scroll 1 → Scroll 3）链接，目标均验证存在 ✅

**发现的小问题**：
1. **`armasm` 语法高亮不识别**：代码块 ```armasm 被 Expressive Code 降级为 txt 高亮。系 Expressive Code 默认不含 ARM 汇编语言包。无功能影响，仅代码块颜色平淡。后续可考虑在 `astro.config.mjs` 中添加 `expressiveCode.langs` 配置 ✅

**遇到问题**：
1. **绝对路径链接不含 `base` 前缀**（关键 Bug）：
   - 症状：Markdown 中使用 `[text](/01-weichen/02-digital-logic/#时序逻辑)` 绝对路径时，Astro **不会**自动添加 `base` 前缀。dist 中渲染为 `href="/01-weichen/02-digital-logic/#..."`（缺少 `/silicon-strides/`），部署到 GitHub Pages 后点击即 404
   - 根因：Astro 仅对构建时识别为"内部链接"的路径（相对路径或已注册的 content collection 引用）自动添加 `base`。以 `/` 开头的绝对路径被视为外部链接，不做转换。这与 NOTES.md #9 记录的"原始 HTML 不转换"同根同源
   - 解决方案：所有跨卷链接改为相对路径，如 `[数字逻辑](../../01-weichen/02-digital-logic/#时序逻辑)` ✅

**撰写经验**：
- 卷二内容跨卷连接密——裸机编程同时依赖 MOS 物理（卷1）、数字逻辑（卷1）、ISA（卷1）和 OS 进程模型（卷3），撰写时需频繁跳转验证目标锚点存在
- 汇编代码示例使用 `cpsid i` / `cpsie i` 等 ARM 特有指令，需确保上下文解释充分
- 中断延迟公式使用 `$` 块级数学，包含 `t_{sync}` 等下标，KaTeX 渲染无问题
- `sequenceDiagram` 与 `graph TD` 混合使用时，`sequenceDiagram` 不支持 `style` 指令——颜色标注在序列图中静默丢失
- **跨卷链接必须使用相对路径，否则 GitHub Pages 部署后断链** ✅

### 15. 2026-06-16：卷二 01/02 章架构对比 + 卷一 CMOS 门电路原理图补充

**补充内容**：

1. **卷二 01/02 章架构对比**（详见 #14）：
   - 01 章新增 "裸机编程的架构全景"：四架马车对比表 (8 维度 × 4 架构) + 特权级深度解析
   - 02 章新增 "四大中断控制器对比"：一表纵览 (10 维度 × 4 控制器) + 设计哲学的分野

2. **卷一 02 章 CMOS 门电路原理图**（本次新增）：
   - 在 "基本逻辑门与真值表" 之后、德摩根定律之前，新增 `### CMOS 门电路实现` 小节
   - 3 幅 Mermaid 晶体管级电路图：NOT (反相器)、NAND (并联 PMOS + 串联 NMOS)、NOR (串联 PMOS + 并联 NMOS)
   - 1 个 CMOS 对偶设计规则表格 + AND = NAND + NOT 实现说明
   - Mermaid 总数 4 → 7，无 `::: ` 残留，构建 61 页零错误 ✅

**Mermaid 晶体管级电路图经验**：
- `style` 指令对 `graph TB` 有效，可用颜色区隔 VDD (红)、GND (蓝)、PMOS (绿)、NMOS (橙)、OUT (黄)
- 虚线 (`-.->`) 表示栅极控制关系，实线 (`-->`) 表示电流通路的做法在 Mermaid 中效果良好
- 多个边从同一节点发出用独立 `VDD --> PA` + `VDD --> PB`（不用 `&` 语法，避免兼容问题）

---

### 16. 2026-06-19：内容宽度过窄，表格被压缩成一字一行

**症状**：带侧边栏的文档页面 `--sl-content-width` 仅 45rem (720px)，较宽的表格（如四大中断控制器对比、四架马车对比表）被严重压缩，内容一字一行排列，可读性极差。

**根因**：Starlight 默认 `--sl-content-width: 45rem`（`props.css`）。无侧边栏的 splash 首页通过 `Page.astro` 内联样式设置为 `67.5rem`，但带侧边栏的文档页面维持 45rem，内容区宽度仅为首页的 67%。

**解决方案**：在 `custom.css` `:root` 中设置 `--sl-content-width: 68rem`。用户 CSS 为 unlayered 样式，优先级高于 Starlight 的 `@layer starlight.base` 层，因此能覆盖 45rem 默认值。68rem 在 1440px 屏幕上与首页视觉宽度一致 ✅

**验证**：构建通过，`dist/_astro/common.*.css` 中确认 `:root{--sl-content-width: 68rem}` ✅

---

### 17. 2026-06-19：卷二全面完成——RTOS 基础、外设驱动、低功耗设计

**撰写范围**：`02-jiezi/03-rtos-fundamentals.md`、`04-peripheral-drivers.md`、`05-low-power-design.md`

**构建结果**：`npm run build` 通过，61 页，零错误 ✅

**各章统计**：

| 章节 | Mermaid | Admonition | KaTeX | 行数 | 主题覆盖 |
|------|---------|------------|-------|------|----------|
| 2.3 RTOS 基础 | 5 | 8 | 3 | ~320 | 任务状态机、抢占式调度、RMS 可调度性分析、信号量/互斥量/优先级继承、消息队列/事件组、heap_1-5 内存策略、FreeRTOS 调度器剖析 |
| 2.4 外设驱动 | 4 | 6 | 6 | ~330 | 推挽/开漏电路、UART 波特率与中断收发、SPI 四种模式、I²C 起始/停止/仲裁、DMA 乒乓缓冲/分散-聚集/Cache 一致性 |
| 2.5 低功耗设计 | 2 | 4 | 14 | ~300 | 动态/静态/浪涌功耗、Sleep-Stop-Standby-Shutdown 四级睡眠、时钟/电源门控、唤醒延迟预算、Tickless 空闲模式 |

**卷二状态**：5/5 章全部完成（100%），总进度从 14% 升至 20%

**撰写经验**：
- 三章全部遵循 01/02 章既成模式：中文引语 + 散文开头 → `---` → H2/H3 分层 → `## 跨卷连接` 6 行对照表 + `:::tip[卷二内部路径]`
- 对照表是嵌入式章节的核心叙事工具——RTOS 章 5 张、外设章 4 张、低功耗章 4 张
- RTOS 章中最有深度的内容：RMS 可调度性公式 $U \leq n(2^{1/n} - 1)$、优先级继承的序列图、FreeRTOS `vTaskStartScheduler()` 的"伪造异常返回"原理
- 外设章注重电路级说明：推挽 vs 开漏的 Mermaid 晶体管图、I²C 线与仲裁的逐位比较逻辑
- 低功耗章公式密集（14 处 KaTeX）：$P = \alpha C V^2 f$、亚阈值漏电流指数关系、唤醒延迟 $t_{wakeup}$ 累加公式、Tickless 时序对比
- 跨卷链接密集：三章共引用卷 1 的半导体物理、数字逻辑、存储层次、ISA 四章，以及卷 3 的进程/同步/内存/文件系统/应用协议五章（含占位章节）
- `:::` 残留全部为 0，Mermaid 全部含 `title` directive，无 `→` 和空字符串边标签 ✅

### 18. 2026-06-19：卷三全面完成——OS 内核与网络协议栈

**撰写范围**：`03-qiankun/01-08` 全部 8 章

**构建结果**：`npm run build` 通过，61 页，零错误 ✅

**各章统计**：

| 章节 | Mermaid | Admonition | KaTeX | 核心主题 |
|------|---------|------------|-------|----------|
| 3.1 进程与线程 | 2 | 3 | 1 | PCB/task_struct、CFS 红黑树、EEVDF、IPC 六机制对比 |
| 3.2 内存管理 | 1 | 3 | 0 | 分段 vs 分页、四级页表、TLB、缺页中断、mmap |
| 3.3 文件系统 | 2 | 2 | 0 | VFS 四对象、ext4 extent 树、日志、Page Cache |
| 3.4 同步原语 | 1 | 3 | 0 | 自旋锁/互斥锁、RCU 宽限期、futex 快慢路径、CAS/ABA |
| 3.5 网络协议栈 I | 1 | 1 | 2 | OSI vs TCP/IP、IP 分片、Bellman-Ford 路由、ARP/NAT |
| 3.6 传输层 | 1 | 2 | 3 | TCP 状态机、CUBIC/BBR 拥塞控制、QUIC 0-RTT |
| 3.7 应用层协议 | 0 | 1 | 0 | DNS 递归、HTTP 1.1-3 进化、TLS 1.3 握手 |
| 3.8 网络编程 | 1 | 2 | 1 | epoll 红黑树、io_uring SQ/CQ、sendfile 零拷贝、DPDK/XDP |

**卷三状态**：8/8 章全部完成（100%），总进度从 20% 升至 37%（18/49）

**撰写经验**：
- 卷三内容"承上启下"特征明显：跨卷链接密集指向卷一（存储层次、ISA、微架构）和卷二（裸机、中断、RTOS、外设）
- 每一章都设置了 `:::tip[卷三内部路径]` 形成卷内知识网
- OS 四章（01-04）注重数据结构（task_struct/mm_struct/inode/futex）和算法（CFS/RCU/页面置换）
- 网络四章（05-08）注重协议分层和演进历史（HTTP 1→3、TCP Tahoe→BBR、select→io_uring）
- 本卷章节尺寸（~180-280 行）比卷二（~300-500 行）略短，但信息密度更高——每段包含多个概念交叉引用
- 所有链接均使用相对路径，零 `:::` 残留，Mermaid 均含 `title` ✅

### 19. 2026-06-19：卷四全面完成——数据库与分布式系统

**撰写范围**：`04-yuanhai/01-05` 全部 5 章

**构建结果**：`npm run build` 通过，61 页，零错误 ✅

**各章**：关系型数据库（B+Tree/MVCC/ACID）、存储引擎（LSM Tree/WAL/列式）、分布式基础（CAP/向量时钟/2PC）、共识协议（Paxos/Raft/ZAB/PBFT）、数据流水线（Kafka/Flink/Kappa）

**进度**：47%（23/49），卷四 100% ✅
