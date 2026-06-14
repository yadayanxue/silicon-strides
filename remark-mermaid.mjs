/**
 * remark-mermaid.mjs
 * 构建时将 ```mermaid 代码块转换为 <div class="mermaid">，
 * 绕过 Starlight 的 Expressive Code 语法高亮。
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
