import { defineConfig } from "vitepress";
import { set_sidebar } from "./utils/auto_sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LeafNode Docs",
  description:
    "My personal knowledge repository, meticulously organized to capture and grow my understanding. Each entry is a 'leaf' in this ever-expanding tree of insights, powered by VitePress.",
  themeConfig: {
    outlineTitle: "文章目錄",
    outline: [2, 6],
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "主界面",
        items: [
          { text: "首頁", link: "/" },
          { text: "markdown示例", link: "/markdown-examples" },
        ],
      },
      { text: "樣例", link: "/markdown-examples" },
      { text: "自動生成側邊欄1", link: "/backend/java" },
      { text: "自動生成側邊欄2", link: "/frontend/electron" },
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
