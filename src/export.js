/**
 * 数易生命数字 — 导出 PDF 模块 (ESM)
 * 使用浏览器原生打印
 */

const btn = document.getElementById("export-pdf-btn");
if (btn) {
  btn.addEventListener("click", function () {
    document.body.classList.add("pdf-exporting");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("pdf-exporting");
    }, 100);
  });
}
