/**
 * 将页面的 SVG 图谱转换为 Base64 PNG 图片
 */
export async function svgToImage(svgElement) {
  return new Promise((resolve, reject) => {
    try {
      // 1. 克隆 SVG 元素
      const clone = svgElement.cloneNode(true);
      
      // 2. 注入必要的样式（防止外部 CSS 丢失导致截图错乱）
      const style = document.createElement('style');
      style.textContent = `
        text { font-family: "Noto Sans SC", "SimHei", sans-serif; }
        .svg-meta { font-size: 16px; fill: #2C363F; font-family: "Noto Serif SC", "SimKai", serif; }
        .svg-label { font-size: 16px; fill: #8A817C; }
        .svg-box { fill: #FAF9F6; stroke: #D4A373; stroke-width: 2; }
        .template-stroke { stroke: #D4A373; stroke-width: 1.5; }
        .svg-node { fill: #FFFFFF; stroke: #C93A3A; stroke-width: 2; }
        .svg-star { font-size: 24px; fill: #C93A3A; font-family: Arial; }
        .svg-box-value { font-size: 28px; font-weight: bold; fill: #C93A3A; }
        .svg-node-value { font-size: 24px; font-weight: bold; fill: #2C363F; }
        .dream { stroke-width: 3; }
        .focus { fill: #C93A3A; }
        .focus-text { fill: #FFFFFF; font-size: 32px; }
      `;
      clone.insertBefore(style, clone.firstChild);

      // 3. 序列化为 XML
      const svgData = new XMLSerializer().serializeToString(clone);
      
      // 4. 创建 Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 放大倍数，保证打印清晰度 (A4 打印需要较高分辨率)
      const scaleFactor = 3; 
      // SVG 原始 viewbox 宽760 高880
      const width = 760;
      const height = 880;
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      
      const img = new Image();
      img.onload = () => {
        // 绘制白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 绘制 SVG 图像
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 导出为 PNG
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      
      // 使用 btoa 编码 SVG 数据，注意处理中文
      const b64 = btoa(unescape(encodeURIComponent(svgData)));
      img.src = 'data:image/svg+xml;base64,' + b64;
    } catch (e) {
      reject(e);
    }
  });
}
