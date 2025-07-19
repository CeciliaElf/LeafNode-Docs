import path from "node:path";
import fs from "node:fs";

// 文件根目录
// 注意：path.resolve() 默认解析到当前工作目录，即项目根目录。
// 如果你的 VitePress 文档在子目录（如 docs/），你可能需要调整 DIR_PATH
// 例如：const DIR_PATH = path.resolve(__dirname, '../'); // 如果此文件在 .vitepress/utils，docs在项目根目录
// 或者：const DIR_PATH = path.resolve(__dirname, '../../'); // 如果此文件在 .vitepress/utils，docs在项目根目录，但你需要到项目根目录
// 最常见的是：const DIR_PATH = path.resolve(process.cwd()); // 项目启动的根目录
// 这里我们假设你的 VitePress 项目的根目录就是你运行命令的目录
const DIR_PATH = path.resolve();

// 白名单，过滤不是文章的文件和文件夹
const WHITE_LIST = [
  "index.md",
  ".vitepress",
  "node_modules",
  ".idea",
  "assets",
  // 你可以根据需要添加更多不需要显示在侧边栏的文件或文件夹
];

// 判断是否是文件夹
const isDirectory = (filePath) => fs.lstatSync(filePath).isDirectory();

// 取差值：从 arr1 中过滤掉 arr2 中存在的元素
// 实际上是 arr1 - arr2
const intersections = (arr1, arr2) =>
  Array.from(new Set(arr1)).filter((item) => !new Set(arr2).has(item));

/**
 * 递归获取目录下的文件和文件夹列表，并格式化为 VitePress 侧边栏所需的结构
 * @param {string[]} files - 当前目录下的文件/文件夹名称数组
 * @param {string} currentDirPath - 当前目录的绝对路径
 * @param {string} currentPathname - 当前目录在 URL 中的相对路径 (例如 /guide)
 * @returns {Array} VitePress 侧边栏 items 数组
 */
function getList(files, currentDirPath, currentPathname) {
  const res = [];

  // 遍历当前目录下的所有文件和文件夹
  for (let file of files) {
    // 拼接当前文件/文件夹的绝对路径
    const fullPath = path.join(currentDirPath, file);

    // 判断是否是文件夹
    const isDir = isDirectory(fullPath);

    if (isDir) {
      // 如果是文件夹，递归读取其内容
      const subFiles = fs.readdirSync(fullPath);
      res.push({
        text: file, // 文件夹名称作为标题
        collapsible: true, // 可折叠
        items: getList(subFiles, fullPath, `${currentPathname}/${file}`), // 递归调用
      });
    } else {
      // 如果是文件
      const name = path.basename(file); // 获取文件名（带后缀）
      const suffix = path.extname(file); // 获取文件后缀

      // 排除非 .md 文件
      if (suffix !== ".md") {
        continue; // 跳过非 Markdown 文件
      }

      res.push({
        text: name, // 文件名作为显示文本
        link: `${currentPathname}/${name}`, // 文件在 URL 中的链接
      });
    }
  }

  // 对结果中的文本（文件名）做一下处理，把 .md 后缀删除
  res.forEach((item) => {
    if (item.text) {
      // 确保 text 存在
      item.text = item.text.replace(/\.md$/, "");
    }
  });

  return res;
}

/**
 * 导出用于生成 VitePress 侧边栏的函数
 * @param {string} pathname - 文档在 URL 中的根路径，例如 '/guide/'
 * @returns {Array} 侧边栏配置数组
 */
export const set_sidebar = (pathname) => {
  // 确保 pathname 以 '/' 开头和结尾，方便后续路径拼接
  if (!pathname.startsWith("/")) {
    pathname = "/" + pathname;
  }
  if (!pathname.endsWith("/")) {
    pathname = pathname + "/";
  }

  // 获取当前文档路径的绝对路径
  const dirPath = path.join(DIR_PATH, pathname);

  // 读取该路径下的所有文件或者文件夹
  const allFiles = fs.readdirSync(dirPath);

  // 过滤掉白名单中的文件和文件夹
  const filteredItems = intersections(allFiles, WHITE_LIST);

  // 调用 getList 函数，生成侧边栏结构
  return getList(filteredItems, dirPath, pathname);
};
