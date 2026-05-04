/**
 * 数易生命数字 — 纯计算模块
 * 零 DOM 依赖，可复用到 Node.js 后端
 */
const ShuYiCalculator = (function () {

  function reduceToDigit(value) {
    const total = String(Math.abs(Number(value)))
      .split("")
      .map(Number)
      .reduce((sum, num) => sum + (isNaN(num) ? 0 : num), 0);
    return total > 9 ? reduceToDigit(total) : total;
  }

  function joinPath(nodes, path) {
    return path.map((key) => nodes[key]).join("");
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatDisplayDate(isoDate) {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  }

  function buildBirthDate(day, month, year) {
    if (!day || !month || !year) return "";
    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  function getElementByNumber(number, elementDefinitions) {
    const match = elementDefinitions.find((item) => item.numbers.includes(number));
    return match ? match.element : "";
  }

  function rotateElements(startElement, values, config) {
    const startIndex = config.elementSequence.indexOf(startElement);
    const orderedElements = config.elementSequence.slice(startIndex)
      .concat(config.elementSequence.slice(0, startIndex));
    return orderedElements.map((element, index) => {
      const def = config.elementDefinitions.find((item) => item.element === element);
      const count = values.filter((v) => def.numbers.includes(v)).length;
      return { category: config.categories[index], element, count };
    });
  }

  const getZodiac = (year) => {
    const zodiacs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    // 1900年是鼠年
    return zodiacs[(year - 1900) % 12];
  };

  /**
   * 核心计算函数
   * @param {string} name - 姓名
   * @param {string} birthDate - ISO 格式日期 "YYYY-MM-DD"
   * @param {object} config - APP_CONTENT 配置对象
   * @returns {object} 完整的 profile 对象
   */
  function calculateProfile(name, birthDate, config) {
    const [yearString, monthString, dayString] = birthDate.split("-");
    const centuryChunk = yearString.slice(0, 2);
    const yearChunk = yearString.slice(2, 4);

    const nodes = {
      I: reduceToDigit(dayString),
      J: reduceToDigit(monthString),
      K: reduceToDigit(centuryChunk),
      L: reduceToDigit(yearChunk)
    };

    nodes.M = reduceToDigit(nodes.I + nodes.J);
    nodes.N = reduceToDigit(nodes.K + nodes.L);
    nodes.O = reduceToDigit(nodes.M + nodes.N);
    nodes.T = reduceToDigit(nodes.I + nodes.M);
    nodes.S = reduceToDigit(nodes.J + nodes.M);
    nodes.U = reduceToDigit(nodes.T + nodes.S);
    // 修正：交叉相加
    nodes.P = reduceToDigit(nodes.N + nodes.O); // N+O 对应 P (左下内)
    nodes.Q = reduceToDigit(nodes.M + nodes.O); // M+O 对应 Q (右下内)
    nodes.R = reduceToDigit(nodes.Q + nodes.P);
    nodes.V = reduceToDigit(nodes.K + nodes.N);
    nodes.W = reduceToDigit(nodes.L + nodes.N);
    nodes.X = reduceToDigit(nodes.V + nodes.W);

    // 重复号逻辑 (I, J, K, L, M, N, O 中重复2次以上)
    const coreCheckList = [nodes.I, nodes.J, nodes.K, nodes.L, nodes.M, nodes.N, nodes.O];
    const counts = {};
    coreCheckList.forEach(num => counts[num] = (counts[num] || 0) + 1);
    const duplicateList = Object.keys(counts).filter(num => counts[num] >= 2).map(Number);

    // 隐藏号码
    const hiddenCode = `${reduceToDigit(nodes.M + nodes.M)}${reduceToDigit(nodes.N + nodes.N)}${reduceToDigit(nodes.O + nodes.O)}`;

    return {
      name: name || "未命名",
      displayDate: formatDisplayDate(birthDate),
      rawChunks: { day: dayString, month: monthString, century: centuryChunk, year: yearChunk },
      nodes,
      dreamCode: reduceToDigit(nodes.O + nodes.I + nodes.L),
      mainCode: nodes.O,
      innerCore: reduceToDigit(nodes.M + nodes.N + nodes.O),
      outerCore: reduceToDigit(nodes.U + nodes.R + nodes.X),
      futureCore: nodes.R, // 修正：底部圆圈显示 R 而非 W
      mainTriple: joinPath(nodes, ["M", "N", "O"]),
      outerTriple: joinPath(nodes, ["U", "R", "X"]),
      presentDigits: [...new Set(coreCheckList)].sort(),
      missingDigits: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !coreCheckList.includes(d)),
      elementRows: rotateElements(getElementByNumber(nodes.O, config.elementDefinitions), Object.values(nodes), config),
      combos: config.comboCards.map(c => ({ ...c, value: joinPath(nodes, c.path) })),
      hiddenCode,
      duplicateList,
      zodiac: getZodiac(parseInt(yearChunk) + (parseInt(centuryChunk) * 100))
    };
  }

  /**
   * 校验日期是否有效
   * @param {string} day
   * @param {string} month
   * @param {string} year
   * @returns {{ valid: boolean, error?: string, date?: string }}
   */
  function validateDate(day, month, year) {
    const d = parseInt(day, 10), m = parseInt(month, 10), y = parseInt(year, 10);
    if (!d || !m || !y) return { valid: false, error: "请填写完整的出生日期" };
    if (y < 1900 || y > 2500) return { valid: false, error: "年份范围：1900 - 2500" };
    if (m < 1 || m > 12) return { valid: false, error: "月份无效" };

    const testDate = new Date(y, m - 1, d);
    if (testDate.getFullYear() !== y || testDate.getMonth() !== m - 1 || testDate.getDate() !== d) {
      return { valid: false, error: "日期无效" };
    }

    return { valid: true, date: buildBirthDate(day, month, year) };
  }

  // 公开 API
  return {
    reduceToDigit,
    joinPath,
    pad2,
    buildBirthDate,
    formatDisplayDate,
    calculateProfile,
    validateDate
  };

})();

// Node.js 环境导出
if (typeof module !== "undefined") {
  module.exports = ShuYiCalculator;
}
