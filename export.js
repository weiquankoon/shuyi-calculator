/**
 * 数易生命数字 — PDF 导出模块
 * 依赖：html2canvas, jsPDF (CDN)
 */
(function () {
  const btn = document.getElementById("export-pdf-btn");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    if (typeof html2canvas === "undefined" || typeof jspdf === "undefined") {
      alert("PDF 库尚未加载，请检查网络连接后重试。");
      return;
    }

    const { jsPDF } = jspdf;

    btn.disabled = true;
    btn.textContent = "生成中…";
    document.body.classList.add("pdf-exporting");

    try {
      btn.style.visibility = "hidden";

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const pageIds = ["pdf-page-1", "pdf-page-2", "pdf-page-3", "pdf-page-4"];

      for (let i = 0; i < pageIds.length; i++) {
        const pageEl = document.getElementById(pageIds[i]);
        if (!pageEl) continue;

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          foreignObjectRendering: false
        });

        const imgData = canvas.toDataURL("image/png");
        let imgHeight = (canvas.height * usableWidth) / canvas.width;

        if (i > 0) pdf.addPage();

        let yOffset = margin;
        
        // 如果是第一页（图谱），我们尽量让它居中一点
        if (i === 0 && imgHeight < pageHeight - margin) {
            yOffset = (pageHeight - imgHeight) / 2;
        }

        let remainingHeight = imgHeight;

        // 第一张切片
        pdf.addImage(imgData, "PNG", margin, yOffset, usableWidth, imgHeight);
        // remainingHeight 是图片本身高度。如果超出一页能显示的高度，我们就要把图片往上挪并换页
        remainingHeight -= usableHeight;

        // 如果长内容导致当前逻辑块（如第四页）超过了一页 A4 纸的高度，继续分页打印
        while (remainingHeight > 0) {
          pdf.addPage();
          // 图片往上挪动：每次移动一整页的可视高度
          yOffset -= usableHeight;
          pdf.addImage(imgData, "PNG", margin, yOffset, usableWidth, imgHeight);
          remainingHeight -= usableHeight;
        }
      }

      const metaText = document.getElementById("report-meta")?.textContent || "数易图谱";
      const fileName = `数易图谱_${metaText.replace(/[\s·\/]/g, "_")}.pdf`;

      pdf.save(fileName);

    } catch (err) {
      console.error("PDF 导出失败:", err);
      alert("PDF 导出失败，请查看控制台了解详情。");
    } finally {
      document.body.classList.remove("pdf-exporting");
      btn.disabled = false;
      btn.textContent = "📄 导出 PDF";
      btn.style.visibility = "visible";
    }
  });
})();
