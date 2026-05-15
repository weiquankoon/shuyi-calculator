import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { registerFonts } from './pdf-fonts.js';
import { svgToImage } from './pdf-chart.js';
import { drawPage1, drawPage2, drawPages3to4 } from './pdf-template.js';

/**
 * 生成并下载 PDF 报告
 * @param {object} profile - 从 calculator.js 获取的用户数据
 * @param {object} meanings - content.json / meanings.json 中的解析数据
 */
export async function generatePDF(profile, meanings) {
  try {
    // 1. 初始化 jsPDF，A4 竖排，单位 mm
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true // 开启压缩减小体积
    });
    
    // 2. 注册中文字体 (SimHei, SimKai)
    registerFonts(doc);
    
    // 3. 将页面上的 SVG 图谱转换为图片
    const svgElement = document.getElementById('life-chart');
    if (!svgElement) throw new Error("无法找到图谱元素");
    const chartImageBase64 = await svgToImage(svgElement);
    
    // 4. 绘制页面
    drawPage1(doc, profile, chartImageBase64);
    
    doc.addPage();
    drawPage2(doc, profile, meanings);
    
    doc.addPage();
    drawPages3to4(doc, profile, meanings);
    
    // 5. 保存文件
    const filename = `${profile.name}的生命数字报告.pdf`;
    doc.save(filename);
    
  } catch (error) {
    console.error("PDF生成失败:", error);
    alert("生成 PDF 失败，请查看控制台日志");
  }
}
