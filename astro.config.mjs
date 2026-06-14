import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://yadayanxue.github.io/silicon-strides/',
  markdown: unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }),
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
            import mermaid from 'mermaid';
            mermaid.initialize({ startOnLoad: true });
          `,
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
          items: [
            { label: '理论与算法', link: '/00-lingxi/' },
          ],
        },
        {
          label: '卷一 · 微尘',
          items: [
            { label: '物理与架构', link: '/01-weichen/' },
          ],
        },
        {
          label: '卷二 · 芥子',
          items: [
            { label: '裸机与实时', link: '/02-jiezi/' },
          ],
        },
        {
          label: '卷三 · 乾坤',
          items: [
            { label: '系统与网络', link: '/03-qiankun/' },
          ],
        },
        {
          label: '卷四 · 渊海',
          items: [
            { label: '数据与分布式', link: '/04-yuanhai/' },
          ],
        },
        {
          label: '卷五 · 万象',
          items: [
            { label: '图形与交互', link: '/05-wanxiang/' },
          ],
        },
        {
          label: '卷六 · 须弥',
          items: [
            { label: '智能与涌现', link: '/06-xumi/' },
          ],
        },
        {
          label: '卷七 · 天枢',
          items: [
            { label: '安全与御道', link: '/07-tianshu/' },
          ],
        },
        {
          label: '卷八 · 千里',
          items: [
            { label: '工程与道法', link: '/08-qianli/' },
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
