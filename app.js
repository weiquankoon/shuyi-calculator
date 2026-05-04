/**
 * 数易生命数字 — 渲染与事件绑定模块
 * 依赖：calculator.js (ShuYiCalculator)
 */
(async function () {
  let config;
  let numberMeanings;

  try {
    const [contentRes, meaningsRes] = await Promise.all([
      fetch("data/content.json"),
      fetch("data/meanings.json")
    ]);
    config = await contentRes.json();
    numberMeanings = await meaningsRes.json();
  } catch (error) {
    console.error("加载数据文件失败:", error);
    alert("系统配置数据加载失败，请检查网络或配置目录。");
    return;
  }

  // --- UI 元素获取 ---
  const form = document.getElementById("profile-form");
  const nameInput = document.getElementById("name-input");
  const birthDayInput = document.getElementById("birth-day");
  const birthMonthInput = document.getElementById("birth-month");
  const birthYearInput = document.getElementById("birth-year");

  const summaryCardsEl = document.getElementById("summary-cards");
  const elementTableEl = document.getElementById("element-table");
  const comboGridEl = document.getElementById("combo-grid");
  const reportMetaEl = document.getElementById("report-meta");

  const dreamHighlightEl = document.getElementById("dream-highlight");
  const mainHighlightEl = document.getElementById("main-highlight");

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
    zodiac: document.getElementById("svg-zodiac")
  };

  // --- 渲染函数 ---
  function renderMeta(profile) {
    if (reportMetaEl) reportMetaEl.textContent = `${profile.name} · 阳历 ${profile.displayDate}`;
    const headerZodiacEl = document.getElementById("header-zodiac");
    if (headerZodiacEl) {
      headerZodiacEl.textContent = ` · ${profile.zodiac}`;
    }

    const getSingleMsg = (code) => numberMeanings.singleDigits?.[code] || { pos: "暂无解析", neg: "" };

    // 四大核心柱
    if (dreamHighlightEl) dreamHighlightEl.textContent = profile.dreamCode;
    document.getElementById("dream-text").textContent = numberMeanings.dreamMeanings?.[profile.dreamCode] || "";

    const formatPillar = (msg) => {
      return `<strong class="pillar-subtitle">${msg.name || ""}</strong>
              <span class="text-pos"><strong>正面：</strong>${msg.pos}</span>
              <span class="text-neg"><strong>负面：</strong>${msg.neg}</span>`;
    };

    if (mainHighlightEl) mainHighlightEl.textContent = profile.mainCode;
    const mainMsg = getSingleMsg(profile.nodes.O);
    document.getElementById("main-text").innerHTML = formatPillar(mainMsg);

    document.getElementById("star-i-highlight").textContent = profile.nodes.I;
    const starIMsg = getSingleMsg(profile.nodes.I);
    document.getElementById("star-i-text").innerHTML = formatPillar(starIMsg);

    document.getElementById("star-l-highlight").textContent = profile.nodes.L;
    const starLMsg = getSingleMsg(profile.nodes.L);
    document.getElementById("star-l-text").innerHTML = formatPillar(starLMsg);

    // 先天拥有数字
    const presentDigitsEl = document.getElementById("present-digits");
    if (presentDigitsEl) presentDigitsEl.textContent = profile.presentDigits.join(", ");

    // 重复号解析（使用专用字典）
    const dupContent = document.getElementById("duplicate-content");
    if (profile.duplicateList.length > 0) {
      dupContent.innerHTML = profile.duplicateList.map(num => `
        <div class="detail-item">
          <span class="badge">数字 ${num}</span>
          <p>${numberMeanings.duplicateDigits?.[num] || "暂无解析"}</p>
        </div>
      `).join("");
    } else {
      dupContent.innerHTML = "<p class='placeholder-text'>无重复数字（核心位均唯一）</p>";
    }

    // 缺失号解析（使用专用字典）
    const missContent = document.getElementById("missing-content");
    missContent.innerHTML = profile.missingDigits.map(num => `
      <div class="detail-item">
        <span class="badge missing">缺 ${num}</span>
        <p>${numberMeanings.missingDigits?.[num] || "暂无对应的缺失提醒"}</p>
      </div>
    `).join("");
  }

  function renderCombos(profile) {
    if (!comboGridEl) return;

    let html = profile.combos.map((item) => {
      const detail = numberMeanings.combos?.[item.value];
      return `
        <article class="combo-card-simple">
          <div class="combo-header-simple">
            <div class="pos-label">${item.title}</div>
            <div class="num-row">
              <span class="num">${item.value}</span>
              <span class="meaning-title">${detail?.title || ""}</span>
            </div>
          </div>
          <ul class="point-form-list">
            ${detail ? detail.points.map(p => `<li>${p}</li>`).join("") : "<li>暂无解析</li>"}
          </ul>
        </article>
      `;
    }).join("");

    // 隐藏号码
    const hd = numberMeanings.combos?.[profile.hiddenCode];
    html += `
      <article class="combo-card-simple hidden-logic-card">
        <div class="combo-header-simple">
          <div class="pos-label">隐藏号码</div>
          <div class="num-row">
            <span class="num">${profile.hiddenCode}</span>
            <span class="meaning-title">${hd?.title || ""}</span>
          </div>
          <span class="warning-tag">3万倍磁场</span>
        </div>
        <ul class="point-form-list">
          ${hd ? hd.points.map(p => `<li>${p}</li>`).join("") : "<li>暂无解析</li>"}
        </ul>
      </article>
    `;

    comboGridEl.innerHTML = html;
  }

  function renderSvg(profile) {
    if (!svgBindings.name) return;
    svgBindings.name.textContent = `您的姓名是：${profile.name}`;
    svgBindings.birth.textContent = `出生日期是：${profile.displayDate} · ${profile.zodiac}`;
    svgBindings.chunkDay.textContent = profile.rawChunks.day;
    svgBindings.chunkMonth.textContent = profile.rawChunks.month;
    svgBindings.chunkCentury.textContent = profile.rawChunks.century;
    svgBindings.chunkYear.textContent = profile.rawChunks.year;
    svgBindings.dream.textContent = profile.dreamCode;
    svgBindings.main.textContent = profile.mainCode;
    svgBindings.outer.textContent = profile.outerCore;
    svgBindings.inner.textContent = profile.innerCore;
    svgBindings.future.textContent = profile.futureCore;
    if (svgBindings.zodiac) svgBindings.zodiac.textContent = "";
    ["I", "J", "K", "L", "M", "N", "P", "Q", "T", "S", "U", "V", "W", "X"].forEach(k => {
      if (svgBindings[k]) svgBindings[k].textContent = profile.nodes[k];
    });
  }

  function renderSummary(profile) {
    if (!summaryCardsEl) return;
    summaryCardsEl.innerHTML = config.summaryCards.map((card) => {
      let val = "", note = "";
      if (card.key === "inner") { val = profile.innerCore; }
      else if (card.key === "outer") { val = profile.outerCore; }
      else if (card.key === "dream") { val = profile.dreamCode; }
      return `<article><h3>${card.title}</h3><p>${val}</p></article>`;
    }).join("");
  }

  function renderElements(profile) {
    if (!elementTableEl) return;
    elementTableEl.innerHTML = `<tbody>
      <tr><th class="element-cell header">类别</th>${profile.elementRows.map(i => `<th class="element-cell header">${i.category}</th>`).join("")}</tr>
      <tr><th class="element-cell header">五行</th>${profile.elementRows.map(i => `<td class="element-cell">${i.element}</td>`).join("")}</tr>
      <tr><th class="element-cell header">数量</th>${profile.elementRows.map(i => `<td class="element-cell value">${i.count}</td>`).join("")}</tr>
    </tbody>`;
  }

  function render(profile) {
    renderMeta(profile);
    renderSvg(profile);
    renderSummary(profile);
    renderElements(profile);
    renderCombos(profile);
  }

  // --- 事件绑定 ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const validation = ShuYiCalculator.validateDate(
      birthDayInput.value,
      birthMonthInput.value,
      birthYearInput.value
    );
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    render(ShuYiCalculator.calculateProfile(nameInput.value.trim(), validation.date, config));
  });

})();