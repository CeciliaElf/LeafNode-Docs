import { defineConfig } from "vitepress";
import { set_sidebar } from "./utils/auto_sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/LeafNode-Docs/",
  head: [["link", { rel: "icon", href: "/LeafNode-Docs/logo.svg" }]],
  title: "LeafNode Docs",
  description: "我的個人知識庫。",
  themeConfig: {
    outlineTitle: "文章目錄",
    outline: [2, 6],
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "主界面",
        items: [{ text: "首頁", link: "/" }],
      },
      {
        text: "後端",
        items: [
          { text: "Java", link: "/backend/java" },
          { text: "Go", link: "/backend/go" },
        ],
      },
      {
        text: "前端",
        items: [
          { text: "JavaScript", link: "/frontend/javascript" },
          { text: "Vue", link: "/frontend/vue" },
          { text: "Electron", link: "/frontend/electron" },
          { text: "React", link: "/frontend/react" },
        ],
      },
      {
        text: "專案學習筆記",
        items: [{ text: "Talkie", link: "/project_learn/talkie" }],
      },
      {
        text: "其他",
        items: [{ text: "GitHub", link: "/others/github" }],
      },
    ],

    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],
    sidebar: {
      "/backend/java": set_sidebar("/backend/java"),
      "/frontend/electron": set_sidebar("/frontend/electron"),
      "/project_learn/talkie": set_sidebar("/project_learn/talkie"),
      "/others/github": set_sidebar("/others/github"),
    },

    socialLinks: [{ icon: "github", link: "https://github.com/CeciliaElf" }],
    footer: {
      copyright: "Copyright © 2025-present Cecilia",
    },
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
});
