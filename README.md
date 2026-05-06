# 数易生命数字计算工具 (ShuYi Numerology Calculator)

当前版本：**v1.8 (Stable)**

一款基于现代轻奢国风设计的生命数字深度分析工具。

## 🌟 核心特性 (v1.8)

- **深度流年/流月/流日分析**：新增独立的流年运势分析模块，支持 1-9 全维度的运势解析。采用结构化 JSON 数据驱动，支持“建议”内容的视觉高亮与分步渲染。
- **状态持久化与无缝导航**：引入 `sessionStorage` 机制，实现姓名、日期及计算结果在页面跳转（主页 ⇄ 流年页）时的实时记忆。返回页面时自动触发重新计算，确保用户体验连贯。
- **原生 PDF 导出突破**：采用浏览器原生打印方案（`@media print`），自动实现智能防切割分页，导出纯矢量高清文本。
- **现代轻奢国风 UI 2.0**：优化了联合数字、流年解析卡片的视觉排版。支持“建议”内容的智能分割与视觉强调，提升阅读专业感。
- **高精度计算引擎**：精确校准菱形底部的 P/Q 交叉映射关系，修正 R 节点显示，支持生肖自动测算。
- **前后端解耦架构**：核心文案、计算规则与五行定义全部托管于 `data/*.json`。

## 🛠️ 技术栈

- **核心**：HTML5, Vanilla CSS3, JavaScript (ES6+ Async/Await)
- **数据流**：JSON + Fetch API
- **图谱与排版**：SVG Vector Graphics, CSS Print Media Queries
- **依赖库**：
  - [Flatpickr](https://flatpickr.js.org/) - 优雅的日期选择器（支持未来日期与直观下拉）

## 🚀 开发者指南

### 1. 本地运行 (重要)
由于采用了 `fetch` 异步加载数据，**严禁直接双击 index.html 运行**（会被浏览器安全策略拦截）。请使用以下方式：

- **VS Code 快捷键**：按下 `F5` 选择 “一键运行”，将自动启动 Node 服务器并打开 Chrome。
- **手动启动**：
  ```bash
  node server.mjs
  ```
  然后访问 `http://127.0.0.1:5500`。

### 2. 项目目录结构
- `index.html` - 响应式布局结构
- `app.js` - 异步数据加载与 DOM 渲染逻辑
- `calculator.js` - 数易核心算法引擎（无 DOM 依赖，可复用到后端）
- `styles.css` - 现代国风视觉系统（含移动端媒体查询及原生打印配置）
- `data/` - **数据中心**：存放 `meanings.json` 和 `content.json`
- `export.js` - PDF 导出调用模块（原生 `window.print`）
- `chart-config.js` - 图谱坐标参数底稿（开发参考文档）

## 📝 维护说明
- **修改文案**：直接编辑 `data/meanings.json` 即可实时生效，无需改动代码。
- **修改布局**：移动端样式集中在 `styles.css` 的 `@media` 查询区块，打印样式在 `@media print` 块。
- **坐标调整**：若需修改 SVG 布局，请参考 `chart-config.js` 中的坐标参数。

---
*本项目仅供学习与学术交流使用。*
