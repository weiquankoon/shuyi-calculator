/**
 * 转换脚本：把 meanings.js 输出为 meanings.json
 * 使用方式：在浏览器控制台里执行（页面已加载 meanings.js 的情况下）
 * 把输出结果复制，保存为 data/meanings.json
 */
console.log(JSON.stringify(numberMeanings, null, 2));
