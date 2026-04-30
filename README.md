# 数易生命数字计算工具 (Numerology Calculator)

一款基于现代轻奢国风设计的生命数字自动计算与分析工具。

## 🌟 核心特性

- **现代轻奢国风 UI**：暖象牙白背景搭配朱砂红与雅金点缀，极具视觉冲击力。
- **九层深度分析**：从基础图谱到心理密码，再到 13 组联合数字的深度解析。
- **五行能量统计**：自动计算性格五行分布，一目了然。
- **专业级 PDF 导出**：支持多页排版导出，可直接作为专业报告交付。
- **移动端适配**：完美的竖屏响应式设计，适配各类手机浏览器。

## 🛠️ 技术栈

- **前端核心**：HTML5, Vanilla CSS3, JavaScript (ES6+)
- **图谱渲染**：原生 SVG 矢量技术
- **依赖库**：
  - [Flatpickr](https://flatpickr.js.org/) - 优雅的日期选择器
  - [html2canvas](https://html2canvas.hertzen.com/) - 网页转画布
  - [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) - PDF 生成引擎

## 🚀 快速启动

### 方式 1：直接运行
直接在浏览器中打开 `index.html` 即可开始使用。

### 方式 2：使用本地服务器 (推荐)
如果你安装了 Node.js，可以运行自带的静态服务器：
```bash
node server.mjs
```
然后访问 `http://127.0.0.1:5500`。

## 📂 项目结构

- `index.html` - 结构与布局
- `styles.css` - 现代国风视觉系统
- `app.js` - UI 交互与 DOM 渲染逻辑
- `calculator.js` - 数易核心算法引擎
- `meanings.js` - 数值解析数据字典
- `export.js` - PDF 导出功能模块

## 📝 备份说明
本项目当前版本为首个完整备份版。主要优化了移动端排版、PDF 导出逻辑以及 UI 细节。
