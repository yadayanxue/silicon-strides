import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkMermaid from './remark-mermaid.mjs';

export default defineConfig({
  site: 'https://yadayanxue.github.io/silicon-strides/',
  markdown: {
    remarkPlugins: [remarkMermaid, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    starlight({
      title: '硅步千里',
      description: '从一粒硅沙，到数字宇宙的漫游指南',
      favicon: '/favicon.svg',
      lastUpdated: true,
      pagefind: true,
      editLink: {
        baseUrl: 'https://github.com/yadayanxue/silicon-strides/edit/main/',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            type: 'module',
          },
          content: `
            import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs').then(function(mod) {
              var mermaid = mod.default || mod;
              mermaid.initialize({ startOnLoad: false, theme: 'default' });
              var ready = function() { mermaid.run({ querySelector: '.mermaid' }); };
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', ready);
              } else {
                ready();
              }
            }).catch(function() {
              console.warn('Mermaid CDN 加载失败，流程图将不显示');
            });
          `,
        },
        {
          tag: 'script',
          attrs: {
            src: '/mermaid-zoom.js',
            defer: true,
          },
        },
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: [
        { label: '首页', link: '/' },
        {
          label: '卷零 · 灵犀',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/00-lingxi/' },
            { label: '数学基础', link: '/00-lingxi/01-mathematical-foundations/' },
            { label: '形式逻辑', link: '/00-lingxi/02-formal-logic/' },
            { label: '计算理论', link: '/00-lingxi/03-theory-of-computation/' },
            { label: '算法理论', link: '/00-lingxi/04-algorithm-theory/' },
            { label: '编译原理', link: '/00-lingxi/05-compiler-theory/' },
            { label: '密码学数学', link: '/00-lingxi/06-cryptographic-mathematics/' },
          ],
        },
        {
          label: '卷一 · 微尘',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/01-weichen/' },
            { label: '半导体物理', link: '/01-weichen/01-semiconductor-physics/' },
            { label: '数字逻辑', link: '/01-weichen/02-digital-logic/' },
            { label: '体系结构', link: '/01-weichen/03-microarchitecture/' },
            { label: '存储层次', link: '/01-weichen/04-memory-hierarchy/' },
            { label: '指令集架构', link: '/01-weichen/05-instruction-set-architecture/' },
          ],
        },
        {
          label: '卷二 · 芥子',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/02-jiezi/' },
            { label: '裸机编程', link: '/02-jiezi/01-bare-metal/' },
            { label: '中断与异常', link: '/02-jiezi/02-interrupts/' },
            { label: 'RTOS 基础', link: '/02-jiezi/03-rtos-fundamentals/' },
            { label: '外设驱动', link: '/02-jiezi/04-peripheral-drivers/' },
            { label: '低功耗设计', link: '/02-jiezi/05-low-power-design/' },
          ],
        },
        {
          label: '卷三 · 乾坤',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/03-qiankun/' },
            { label: '进程与线程', link: '/03-qiankun/01-process-and-thread/' },
            { label: '内存管理', link: '/03-qiankun/02-memory-management/' },
            { label: '文件系统', link: '/03-qiankun/03-filesystem/' },
            { label: '同步原语', link: '/03-qiankun/04-synchronization/' },
            { label: '网络协议栈 I · TCP/IP', link: '/03-qiankun/05-network-protocol-stack/' },
            { label: '网络协议栈 II · 传输层', link: '/03-qiankun/06-transport-tcp-udp-quic/' },
            { label: '网络协议栈 III · 应用层', link: '/03-qiankun/07-application-protocols/' },
            { label: '网络编程', link: '/03-qiankun/08-network-programming/' },
          ],
        },
        {
          label: '卷四 · 渊海',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/04-yuanhai/' },
            { label: '关系型数据库', link: '/04-yuanhai/01-relational-database/' },
            { label: '存储引擎', link: '/04-yuanhai/02-storage-engine/' },
            { label: '分布式基础', link: '/04-yuanhai/03-distributed-fundamentals/' },
            { label: '共识协议', link: '/04-yuanhai/04-consensus-protocols/' },
            { label: '数据流水线', link: '/04-yuanhai/05-data-pipelines/' },
          ],
        },
        {
          label: '卷五 · 万象',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/05-wanxiang/' },
            { label: 'GPU 渲染管线', link: '/05-wanxiang/01-gpu-rendering-pipeline/' },
            { label: '计算机图形学', link: '/05-wanxiang/02-computer-graphics/' },
            { label: '前端工程', link: '/05-wanxiang/03-frontend-engineering/' },
            { label: '数据可视化', link: '/05-wanxiang/04-data-visualization/' },
            { label: '人机交互', link: '/05-wanxiang/05-human-computer-interaction/' },
          ],
        },
        {
          label: '卷六 · 须弥',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/06-xumi/' },
            { label: '机器学习基础', link: '/06-xumi/01-machine-learning-basics/' },
            { label: '深度学习', link: '/06-xumi/02-deep-learning/' },
            { label: 'Transformer 家族', link: '/06-xumi/03-transformer-family/' },
            { label: '大语言模型', link: '/06-xumi/04-large-language-models/' },
            { label: 'AI Agent', link: '/06-xumi/05-ai-agents/' },
          ],
        },
        {
          label: '卷七 · 天枢',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/07-tianshu/' },
            { label: '对称加密', link: '/07-tianshu/01-symmetric-cryptography/' },
            { label: '非对称加密', link: '/07-tianshu/02-asymmetric-cryptography/' },
            { label: '哈希与签名', link: '/07-tianshu/03-hash-and-signature/' },
            { label: '零知识证明', link: '/07-tianshu/04-zero-knowledge-proofs/' },
            { label: '系统安全', link: '/07-tianshu/05-system-security/' },
          ],
        },
        {
          label: '卷八 · 千里',
          collapsed: true,
          items: [
            { label: '卷首语', link: '/08-qianli/' },
            { label: '设计模式与原则', link: '/08-qianli/01-design-patterns-and-principles/' },
            { label: '系统设计', link: '/08-qianli/02-system-design/' },
            { label: 'DevOps 实践', link: '/08-qianli/03-devops-practices/' },
            { label: '可观测性', link: '/08-qianli/04-observability/' },
            { label: '工程文化', link: '/08-qianli/05-engineering-culture/' },
          ],
        },
        {
          label: '术语表',
          link: '/glossary/',
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/yadayanxue/silicon-strides' },
      ],
    }),
  ],
});
