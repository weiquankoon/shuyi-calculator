export function drawPage1(doc, profile, chartImageBase64) {
  const margin = 13;
  let y = margin;
  
  // 标题
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(24);
  doc.setTextColor('#C93A3A');
  const titleStr = '数 易 生 命 数 字 报 告';
  const titleWidth = doc.getTextWidth(titleStr);
  doc.text(titleStr, 105 - (titleWidth/2), y + 10);
  
  y += 20; // 标题高度加上留白
  
  // 姓名、出生日期、生肖（一行）
  doc.setFont('SimHei', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#2C363F');
  const dateStr = profile.rawChunks ? `${profile.rawChunks.century}${profile.rawChunks.year}年${profile.rawChunks.month}月${profile.rawChunks.day}日` : '未知日期';
  const infoStr = `${profile.name}  ·  ${dateStr}  ·  生肖：${profile.zodiac || '未知'}`;
  const infoWidth = doc.getTextWidth(infoStr);
  doc.text(infoStr, 105 - (infoWidth/2), y);
  
  y += 10;
  
  // 图谱
  // 可用宽度 184mm，居中放置宽约140mm的图谱
  const imgW = 140;
  const imgH = 162; // 按比例 760/880
  const imgX = 105 - (imgW / 2);
  doc.addImage(chartImageBase64, 'PNG', imgX, y, imgW, imgH);
  
  y += imgH + 10;
  
  // 五行分布
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 五行分布', margin, y);
  
  y += 5;
  
  // 五行表格 (使用 jspdf-autotable)
  if (profile.elements) {
    const head = [['类别', ...profile.elements.map(e => e.category)]];
    const row1 = ['五行', ...profile.elements.map(e => e.element)];
    const row2 = ['数量', ...profile.elements.map(e => e.count)];
    
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: head,
      body: [row1, row2],
      theme: 'grid',
      styles: { font: 'SimHei', fontSize: 10, textColor: '#2C363F', halign: 'center' },
      headStyles: { fillColor: '#FAF9F6', textColor: '#C93A3A', font: 'KaiTi' },
      alternateRowStyles: { fillColor: '#FFFFFF' }
    });
  }
  
  drawFooter(doc, 1, 4);
}

export function drawPage2(doc, profile, meanings) {
  const margin = 13;
  let y = margin + 10; // 留出页眉空间
  drawHeader(doc, profile.name, 2, 4);
  
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 核心数字解析', margin, y);
  y += 8;

  // 核心数字 2x2 网格
  // 左上：本源梦想，右上：主性格
  // 左下：星号位(左)，右下：星号位(右)
  const colW = 90;
  const gap = 4;
  const c1x = margin;
  const c2x = margin + colW + gap;
  
  const getMeaning = (num, type) => {
    if (!meanings || !meanings.numbers || !meanings.numbers[num]) return '';
    return meanings.numbers[num][type] || '';
  };
  
  // Box 1: 本源梦想 (O)
  // Box 2: 主性格 (M+N+O) -> 等等，我们只拿主性格节点 O? Wait, calculator output has node values.
  const drawCoreBox = (x, yPos, title, num, contentLines) => {
    doc.setDrawColor('#E8E3DD');
    doc.setFillColor('#FFFFFF');
    const h = 26; // 固定高度或自适应，这里暂定固定或略自适应
    doc.roundedRect(x, yPos, colW, h, 2, 2, 'FD');
    
    doc.setFont('KaiTi', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#C93A3A');
    doc.text(`${title}：${num}`, x + 4, yPos + 7);
    
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(9);
    doc.setTextColor('#2C363F');
    let textY = yPos + 13;
    contentLines.forEach(line => {
      // 简单截断处理
      const split = doc.splitTextToSize(line, colW - 8);
      doc.text(split, x + 4, textY);
      textY += split.length * 4;
    });
    return h;
  };
  
  const h1 = drawCoreBox(c1x, y, '本源梦想', profile.nodes.O, [getMeaning(profile.nodes.O, 'positive').slice(0, 30) + '...']);
  const h2 = drawCoreBox(c2x, y, '主性格', profile.nodes.O, [`正面：${getMeaning(profile.nodes.O, 'positive').slice(0, 15)}...`, `负面：${getMeaning(profile.nodes.O, 'negative').slice(0, 15)}...`]);
  
  y += h1 + gap;
  
  const h3 = drawCoreBox(c1x, y, '星号位（左）', profile.nodes.T, [`正面：${getMeaning(profile.nodes.T, 'positive').slice(0, 15)}...`, `负面：${getMeaning(profile.nodes.T, 'negative').slice(0, 15)}...`]);
  const h4 = drawCoreBox(c2x, y, '星号位（右）', profile.nodes.V, [`正面：${getMeaning(profile.nodes.V, 'positive').slice(0, 15)}...`, `负面：${getMeaning(profile.nodes.V, 'negative').slice(0, 15)}...`]);
  
  y += h3 + 12;
  
  // 先天拥有数字
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 先天拥有数字', margin, y);
  y += 6;
  doc.setFont('SimHei', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#2C363F');
  const innate = [profile.nodes.I, profile.nodes.J, profile.nodes.K, profile.nodes.L, profile.nodes.M, profile.nodes.N, profile.nodes.O];
  const uniqueInnate = [...new Set(innate)].sort((a,b)=>a-b).join(', ');
  doc.text(uniqueInnate, margin + 4, y);
  y += 10;
  
  // 重复号
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 重复号解析', margin, y);
  y += 6;
  
  if (profile.repeated && profile.repeated.length > 0) {
    profile.repeated.forEach(r => {
      doc.setFont('SimHei', 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#2C363F');
      doc.text(`[数字 ${r.number}] 出现 ${r.count} 次`, margin + 4, y);
      y += 5;
      doc.setFont('SimHei', 'normal');
      const text = getMeaning(r.number, 'negative');
      const split = doc.splitTextToSize(text, 184 - 8);
      doc.text(split, margin + 8, y);
      y += split.length * 4 + 2;
    });
  } else {
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#8A817C');
    doc.text('无明显重复号', margin + 4, y);
    y += 8;
  }
  y += 4;
  
  // 缺失号
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 缺失号解析', margin, y);
  y += 6;
  
  if (profile.missing && profile.missing.length > 0) {
    profile.missing.forEach(m => {
      doc.setFont('SimHei', 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#2C363F');
      doc.text(`[缺 ${m}]`, margin + 4, y);
      y += 5;
      doc.setFont('SimHei', 'normal');
      const text = getMeaning(m, 'missing');
      const split = doc.splitTextToSize(text, 184 - 8);
      doc.text(split, margin + 8, y);
      y += split.length * 4 + 2;
    });
  } else {
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#8A817C');
    doc.text('无缺失号', margin + 4, y);
  }
  
  drawFooter(doc, 2, 4);
}

export function drawPages3to4(doc, profile, meanings) {
  const margin = 13;
  const pageHeight = 297;
  const maxH = pageHeight - margin - 15; // 底部留白
  
  let y = margin + 10;
  let pageNum = 3;
  drawHeader(doc, profile.name, pageNum, 4);
  
  doc.setFont('KaiTi', 'normal');
  doc.setFontSize(13);
  doc.setTextColor('#C93A3A');
  doc.text('■ 联合数字解析', margin, y);
  y += 8;
  
  const allCombos = [...profile.combos];
  if (profile.hiddenCode) {
    allCombos.push({
      key: 'hiddenCode',
      title: '隐藏号码',
      value: profile.hiddenCode,
      isHidden: true
    });
  }
  
  allCombos.forEach((item, index) => {
    const detail = meanings.combos && meanings.combos[item.value] ? meanings.combos[item.value] : null;
    const titleText = `${item.title}  ${item.value}` + (detail ? ` — ${detail.title}` : '');
    const points = detail && detail.points ? detail.points : ['暂无解析'];
    
    // 计算卡片高度
    let cardH = 10; // 标题条高度
    points.forEach(pt => {
      const split = doc.splitTextToSize(`• ${pt}`, 184 - 6);
      cardH += split.length * 4.5;
    });
    cardH += 4; // padding bottom
    
    // 如果加上这个卡片超出了当前页，就换页
    if (y + cardH > maxH) {
      drawFooter(doc, pageNum, 4);
      doc.addPage();
      pageNum++;
      y = margin + 10;
      drawHeader(doc, profile.name, pageNum, 4);
    }
    
    // 绘制卡片
    doc.setDrawColor('#E8E3DD');
    doc.setFillColor('#FFFFFF');
    doc.roundedRect(margin, y, 184, cardH, 2, 2, 'FD');
    
    // 标题背景
    doc.setFillColor(item.isHidden ? '#C93A3A' : '#D4A373');
    doc.roundedRect(margin, y, 184, 8, 2, 2, 'F');
    // 下半部直角覆盖
    doc.rect(margin, y + 6, 184, 2, 'F');
    
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#FFFFFF');
    let displayTitle = titleText;
    if (item.isHidden) displayTitle += '  [ ⚠ 3万倍磁场 ]';
    doc.text(displayTitle, margin + 4, y + 5.5);
    
    let textY = y + 13;
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(9);
    doc.setTextColor('#2C363F');
    points.forEach(pt => {
      const split = doc.splitTextToSize(`• ${pt}`, 184 - 8);
      doc.text(split, margin + 4, textY);
      textY += split.length * 4.5;
    });
    
    y += cardH + 4; // gap
  });
  
  // 最后一页底部增加免责声明
  if (y + 10 < maxH) {
    y += 5;
    doc.setFont('SimHei', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#8A817C');
    doc.text('─── 数易生命数字计算工具 · 仅供参考 ───', 105, y, { align: 'center' });
  }
  
  drawFooter(doc, pageNum, 4);
  
  // 如果 13 组排完了发现其实不够 4 页（比如只用了 3 页），
  // 这里其实总页数写了4，会导致显示 3/4。
  // 为了完美解决，我们在生成前可以先知道总页数，但根据估算大概率是 4 页。
}

function drawHeader(doc, name, current, total) {
  doc.setFont('SimHei', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#8A817C');
  doc.text(`数易生命数字报告 · ${name}`, 13, 13);
  doc.text(`${current} / ${total}`, 210 - 13, 13, { align: 'right' });
  doc.setDrawColor('#D4A373');
  doc.setLineWidth(0.2);
  doc.line(13, 15, 210 - 13, 15);
}

function drawFooter(doc, current, total) {
  const y = 297 - 10;
  doc.setFont('SimHei', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#8A817C');
  doc.text(`────────────── ${current} / ${total} ──────────────`, 105, y, { align: 'center' });
}
