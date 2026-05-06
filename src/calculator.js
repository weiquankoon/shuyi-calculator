/**
 * 数易生命数字 — 纯计算模块 (ESM)
 * 零 DOM 依赖，可复用到 Node.js 后端
 */

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
  return zodiacs[(year - 1900) % 12];
};

// ═══════════════════════════════════════════════════════════════
// 第一层：预处理（子时 + 双胞胎 + 日期解析）
// ═══════════════════════════════════════════════════════════════

/**
 * 子时处理：出生日期 +1 天（自动处理月末/年末溢出）
 */
export function applyZiHour(birthDate, isZiHour) {
  if (!isZiHour) return birthDate;
  const d = new Date(birthDate);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * 将 ISO 日期字符串解析为 rawChunks
 */
export function parseDateToChunks(birthDate) {
  const [y, m, d] = birthDate.split("-");
  return {
    century: y.slice(0, 2),
    year: y.slice(2, 4),
    month: m,
    day: d,
  };
}

/**
 * 双胞胎日期合并：按 CC/YY/MM/DD 四段分别相加，保留原始和
 * reduceToDigit 统一在 calculateProfileFromChunks 内部处理
 * 老大 → 父亲生日，老二 → 母亲生日（由调用方传入正确的 parentBirthDate）
 */
export function mergeTwinDate(userDate, parentDate) {
  const [uY, uM, uD] = userDate.split("-");
  const [pY, pM, pD] = parentDate.split("-");

  const processChunk = (c1, c2) => {
    const sum = Number(c1) + Number(c2);
    // 规则：不能破百。如果正常相加破百，则两边先各自化简至单数，再相加。
    if (sum >= 100) {
      return String(reduceToDigit(c1) + reduceToDigit(c2));
    }
    return String(sum);
  };

  return {
    century: processChunk(uY.slice(0, 2), pY.slice(0, 2)),
    year:    processChunk(uY.slice(2, 4), pY.slice(2, 4)),
    month:   processChunk(uM, pM),
    day:     processChunk(uD, pD),
  };
}

// ═══════════════════════════════════════════════════════════════
// 第二层：核心计算引擎（rawChunks → 完整 profile）
// ═══════════════════════════════════════════════════════════════

/**
 * 核心计算函数（接受 rawChunks，内部统一 reduceToDigit）
 * @param {string} name
 * @param {{ century: string, year: string, month: string, day: string }} rawChunks
 * @param {object} config - content.json 配置
 * @returns {object} 完整 profile 对象
 */
export function calculateProfileFromChunks(name, rawChunks, config) {
  const { century: centuryChunk, year: yearChunk, month: monthString, day: dayString } = rawChunks;

  const nodes = {
    I: reduceToDigit(dayString),
    J: reduceToDigit(monthString),
    K: reduceToDigit(centuryChunk),
    L: reduceToDigit(yearChunk),
  };

  nodes.M = reduceToDigit(nodes.I + nodes.J);
  nodes.N = reduceToDigit(nodes.K + nodes.L);
  nodes.O = reduceToDigit(nodes.M + nodes.N);
  nodes.T = reduceToDigit(nodes.I + nodes.M);
  nodes.S = reduceToDigit(nodes.J + nodes.M);
  nodes.U = reduceToDigit(nodes.T + nodes.S);
  nodes.P = reduceToDigit(nodes.N + nodes.O); // N+O → P (左下内)
  nodes.Q = reduceToDigit(nodes.M + nodes.O); // M+O → Q (右下内)
  nodes.R = reduceToDigit(nodes.Q + nodes.P);
  nodes.V = reduceToDigit(nodes.K + nodes.N);
  nodes.W = reduceToDigit(nodes.L + nodes.N);
  nodes.X = reduceToDigit(nodes.V + nodes.W);

  // 重复号逻辑 (I, J, K, L, M, N, O 中重复 2 次以上)
  const coreCheckList = [nodes.I, nodes.J, nodes.K, nodes.L, nodes.M, nodes.N, nodes.O];
  const counts = {};
  coreCheckList.forEach((num) => (counts[num] = (counts[num] || 0) + 1));
  const duplicateList = Object.keys(counts).filter((num) => counts[num] >= 2).map(Number);

  // 隐藏号码
  const hiddenCode = `${reduceToDigit(nodes.M + nodes.M)}${reduceToDigit(nodes.N + nodes.N)}${reduceToDigit(nodes.O + nodes.O)}`;

  const year = Number(centuryChunk) * 100 + Number(yearChunk);
  const paddedMonth = String(Number(monthString)).padStart(2, "0");
  const paddedDay = String(Number(dayString)).padStart(2, "0");
  const displayDate = `${paddedDay}/${paddedMonth}/${centuryChunk}${String(yearChunk).padStart(2, "0")}`;

  return {
    name: name || "未命名",
    displayDate,
    rawChunks: { day: dayString, month: monthString, century: centuryChunk, year: yearChunk },
    nodes,
    dreamCode: reduceToDigit(nodes.O + nodes.I + nodes.L),
    mainCode: nodes.O,
    innerCore: reduceToDigit(nodes.M + nodes.N + nodes.O),
    outerCore: reduceToDigit(nodes.U + nodes.R + nodes.X),
    futureCore: nodes.R,
    mainTriple: joinPath(nodes, ["M", "N", "O"]),
    outerTriple: joinPath(nodes, ["U", "R", "X"]),
    presentDigits: [...new Set(coreCheckList)].sort(),
    missingDigits: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !coreCheckList.includes(d)),
    elementRows: rotateElements(getElementByNumber(nodes.O, config.elementDefinitions), Object.values(nodes), config),
    combos: config.comboCards.map((c) => ({ ...c, value: joinPath(nodes, c.path) })),
    hiddenCode,
    duplicateList,
    zodiac: getZodiac(year),
  };
}

// ═══════════════════════════════════════════════════════════════
// 第三层：流年/流月/流日（基于 rawChunks + 查询日期）
// ═══════════════════════════════════════════════════════════════

/**
 * 计算流年/流月/流日面谱
 * @param {{ century, year, month, day }} birthChunks - 出生的原始 chunks
 * @param {string} queryDate - 查询目标日期 "YYYY-MM-DD"
 * @param {"year"|"month"|"day"} mode
 * @param {object} config
 */
export function calculateFlow(birthChunks, queryDate, mode, config) {
  const [qY, qM, qD] = queryDate.split("-");
  const qCC = qY.slice(0, 2);
  const qYY = qY.slice(2, 4);

  const flowChunks = {
    century: qCC,
    year: qYY,
    month: birthChunks.month,  // 默认保留出生月
    day: birthChunks.day,      // 默认保留出生日
  };

  if (mode === "month" || mode === "day") {
    // 流月：查询月 + 出生月（原始和，内部 reduceToDigit）
    flowChunks.month = String(Number(qM) + Number(birthChunks.month));
  }

  if (mode === "day") {
    // 流日：再叠加查询日 + 出生日
    flowChunks.day = String(Number(qD) + Number(birthChunks.day));
  }

  return calculateProfileFromChunks("流年", flowChunks, config);
}

// ═══════════════════════════════════════════════════════════════
// 兼容入口：保持 v1.5 调用方式可用
// ═══════════════════════════════════════════════════════════════

/**
 * @param {string} name
 * @param {string} birthDate - ISO 格式 "YYYY-MM-DD"
 * @param {object} config
 * @param {{ isZiHour?: boolean, isTwin?: boolean, parentBirthDate?: string }} [options]
 */
export function calculateProfile(name, birthDate, config, options = {}) {
  let date = birthDate;

  // 1. 子时处理
  if (options.isZiHour) {
    date = applyZiHour(date, true);
  }

  // 2. 解析或合并 chunks
  let chunks;
  if (options.isTwin && options.parentBirthDate) {
    chunks = mergeTwinDate(date, options.parentBirthDate);
  } else {
    chunks = parseDateToChunks(date);
  }

  return calculateProfileFromChunks(name, chunks, config);
}

/**
 * 校验日期是否有效
 */
export function validateDate(day, month, year) {
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

// 兼容旧版格式化工具
export { formatDisplayDate, pad2, buildBirthDate, joinPath, reduceToDigit };
