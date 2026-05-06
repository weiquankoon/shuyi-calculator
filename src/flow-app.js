/**
 * 流年运势页面 — 渲染与交互逻辑 (ESM)
 */
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';
import { calculateFlow, parseDateToChunks } from './calculator.js';

let config;
let numberMeanings;
let birthChunks;
let profileName;
let currentMode = 'year'; // year, month, day

async function init() {
  try {
    const [contentRes, meaningsRes] = await Promise.all([
      fetch("data/content.json"),
      fetch("data/meanings.json"),
    ]);
    config = await contentRes.json();
    numberMeanings = await meaningsRes.json();
  } catch (error) {
    console.error("加载数据文件失败:", error);
    alert("系统配置数据加载失败，请检查网络或配置目录。");
    return;
  }

  // 解析 URL 参数
  const params = new URLSearchParams(window.location.search);
  profileName = params.get('name') || '未命名';
  const birthStr = params.get('birth');

  if (!birthStr) {
    alert("缺少出生日期参数，请从主页重新进入。");
    window.location.href = 'index.html';
    return;
  }

  birthChunks = parseDateToChunks(birthStr);

  // 初始化 UI 和事件
  setupTabs();
  setupDatePicker();
  
  // 默认使用当天日期作为查询基准
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  document.getElementById('flow-date-picker')._flatpickr.setDate(`${y}-${m}-${d}`, true);
}

function setupTabs() {
  const tabs = document.querySelectorAll('.flow-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // 切换样式
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = 'var(--muted)';
      });
      const target = e.target;
      target.classList.add('active');
      target.style.background = 'var(--accent-soft)';
      target.style.color = 'var(--accent-strong)';

      currentMode = target.dataset.tab;
      
      // 更新含义标题
      const titles = { year: '流年含义', month: '流月含义', day: '流日含义' };
      document.getElementById('flow-meaning-title').textContent = titles[currentMode];

      // 重新渲染
      updateFlow();
    });
  });
}

function setupDatePicker() {
  flatpickr("#flow-date-picker", {
    locale: Mandarin,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    minDate: "1900-01-01",
    maxDate: null,
    monthSelectorType: "dropdown",
    disableMobile: true,
    onChange: function(selectedDates, dateStr) {
      if (selectedDates.length > 0) {
        updateFlow(dateStr);
      }
    }
  });
}

function updateFlow(dateStr) {
  if (!dateStr) {
    dateStr = document.getElementById('flow-date-picker').value;
  }
  if (!dateStr) return;

  const profile = calculateFlow(birthChunks, dateStr, currentMode, config);
  profile.name = profileName;
  
  // 补齐显示用的字段
  const [qY, qM, qD] = dateStr.split('-');
  if (currentMode === 'year') {
    profile.displayDate = `${qY}年`;
  } else if (currentMode === 'month') {
    profile.displayDate = `${qY}年 ${qM}月`;
  } else {
    profile.displayDate = `${qY}年 ${qM}月 ${qD}日`;
  }

  render(profile);
}

function render(profile) {
  // 1. Meta 渲染
  const reportMetaEl = document.getElementById("report-meta");
  if (reportMetaEl) reportMetaEl.textContent = `${profile.name} · 查询基准：${profile.displayDate}`;
  const headerZodiacEl = document.getElementById("header-zodiac");
  if (headerZodiacEl) headerZodiacEl.textContent = ``; // 流年不强调生肖

  // 2. SVG 图谱渲染
  const svgBindings = {
    name: document.getElementById("svg-name"),
    birth: document.getElementById("svg-birth"),
    chunkDay: document.getElementById("chunk-day"),
    chunkMonth: document.getElementById("chunk-month"),
    chunkCentury: document.getElementById("chunk-century"),
    chunkYear: document.getElementById("chunk-year"),
    dream: document.getElementById("dream-code"),
    main: document.getElementById("main-code"),
    outer: document.getElementById("outer-core"),
    inner: document.getElementById("inner-core"),
    future: document.getElementById("future-core"),
    I: document.getElementById("i-node"),
    J: document.getElementById("j-node"),
    K: document.getElementById("k-node"),
    L: document.getElementById("l-node"),
    M: document.getElementById("m-node"),
    N: document.getElementById("n-node"),
    P: document.getElementById("p-node"),
    Q: document.getElementById("q-node"),
    T: document.getElementById("t-node"),
    S: document.getElementById("s-node"),
    U: document.getElementById("u-node"),
    V: document.getElementById("v-node"),
    W: document.getElementById("w-node"),
    X: document.getElementById("x-node"),
  };

  if (svgBindings.name) {
    svgBindings.name.textContent = `您的姓名是：${profile.name}`;
    svgBindings.birth.textContent = `查询基准：${profile.displayDate}`;
    svgBindings.chunkDay.textContent = profile.rawChunks.day;
    svgBindings.chunkMonth.textContent = profile.rawChunks.month;
    svgBindings.chunkCentury.textContent = profile.rawChunks.century;
    svgBindings.chunkYear.textContent = profile.rawChunks.year;
    svgBindings.dream.textContent = profile.dreamCode;
    svgBindings.main.textContent = profile.mainCode;
    svgBindings.outer.textContent = profile.outerCore;
    svgBindings.inner.textContent = profile.innerCore;
    svgBindings.future.textContent = profile.futureCore;
    ["I", "J", "K", "L", "M", "N", "P", "Q", "T", "S", "U", "V", "W", "X"].forEach((k) => {
      if (svgBindings[k]) svgBindings[k].textContent = profile.nodes[k];
    });
  }

  // 3. 五行表格渲染
  const elementTableEl = document.getElementById("element-table");
  if (elementTableEl) {
    elementTableEl.innerHTML = `<tbody>
      <tr><th class="element-cell header">类别</th>${profile.elementRows.map((i) => `<th class="element-cell header">${i.category}</th>`).join("")}</tr>
      <tr><th class="element-cell header">五行</th>${profile.elementRows.map((i) => `<td class="element-cell">${i.element}</td>`).join("")}</tr>
      <tr><th class="element-cell header">数量</th>${profile.elementRows.map((i) => `<td class="element-cell value">${i.count}</td>`).join("")}</tr>
    </tbody>`;
  }

  // 4. 流年含义渲染
  const mainCode = profile.nodes.O; // 主性格位作为流年的代表数字
  let meaningDict;
  if (currentMode === 'year') meaningDict = numberMeanings.flowYear;
  else if (currentMode === 'month') meaningDict = numberMeanings.flowMonth;
  else meaningDict = numberMeanings.flowDay;

  // 4. 含义渲染 (流年、流月、流日内容均已就绪)
  const flowSection = document.querySelector('.flow-meaning-section');
  if (flowSection) flowSection.style.display = 'block';
  const meaningData = meaningDict?.[mainCode] || { title: "暂无数据", points: ["请在 meanings.json 中补充该数字的解释"] };
  
  // 处理 Point Form 格式 (兼容 points 数组和带 <br> 的 content 字符串)
  const pointsRaw = meaningData.points || (meaningData.content ? meaningData.content.split('<br>') : []);
  const regularPoints = [];
  let advicePoint = null;

  pointsRaw.forEach(p => {
    let text = p.replace(/^•\s*/, '').trim();
    // 自动加粗冒号前的文字
    text = text.replace(/^([^：:]+)([：:])/, '<strong>$1$2</strong>');
    
    // 仅在流月和流日中，将建议单独提取出来
    if (currentMode !== 'year' && (text.startsWith('<strong>建议：</strong>') || text.startsWith('<strong>建议:</strong>'))) {
      // 将“建议：”两字标红
      advicePoint = text.replace('<strong>', '<strong style="color: var(--accent);">');
    } else {
      regularPoints.push(text);
    }
  });

  const flowContentArea = document.getElementById('flow-content-area');
  if (flowContentArea) {
    flowContentArea.innerHTML = `
      <article class="combo-card-simple" style="margin-top: 16px; padding: 28px;">
        <div class="combo-header-simple" style="margin-bottom: 20px; border-bottom-width: 2px;">
          <div class="num-row">
            <span class="num" style="font-size: 36px; font-weight: 900;">${mainCode}</span>
            <span class="meaning-title" style="font-size: 24px; font-weight: 800;">${meaningData.title}</span>
          </div>
        </div>
        <ul class="point-form-list">
          ${regularPoints.map(p => `<li style="font-size: 16px; line-height: 1.8; color: var(--text); margin-bottom: 12px; padding-left: 18px;">${p}</li>`).join('')}
        </ul>
        ${advicePoint ? `
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px dashed var(--line-strong);">
          <div style="color: var(--text); font-size: 18px; line-height: 1.8;">
            ${advicePoint}
          </div>
        </div>
        ` : ''}
      </article>
    `;
  }
}

init();
