/**
 * remark-mermaid.mjs
 * 构建时将 ```mermaid 代码块转换为 <div class="mermaid">，
 * 绕过 Starlight 的 Expressive Code 语法高亮。
 *
 * 注意：Mermaid 源码直接嵌入 <div> 中。如果节点标签中包含
 * 尖括号（如 fn<T>），浏览器 HTML 解析器会将 <T> 当作标签
 * 吞掉。解决方式：在 .md 源文件中使用 Mermaid 的 #60;#62;
 * 转义语法（如 fn#60;T#62;），不要在标签中直接用 <>。
 */
import { visit } from 'unist-util-visit';

export default function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid') return;
      parent.children.splice(index, 1, {
        type: 'html',
        value: `<div class="mermaid">\n${node.value}\n</div>`,
      });
    });
  };
}
