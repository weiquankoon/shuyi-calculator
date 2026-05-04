/**
 * 数易生命数字 — 导出 PDF 模块 (原生打印方案)
 * 使用浏览器原生打印，支持完美的矢量文本与自动分页
 */
(function () {
  const btn = document.getElementById("export-pdf-btn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    // 隐藏不想打印的元素
    document.body.classList.add("pdf-exporting");
    
    // 稍微延迟一下，确保 CSS 已经应用，然后调用打印窗口
    setTimeout(() => {
      window.print();
      
      // 打印对话框关闭后，恢复原始页面样式
      document.body.classList.remove("pdf-exporting");
    }, 100);
  });
})();
