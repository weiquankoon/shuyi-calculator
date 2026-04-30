/**
 * 数易图谱坐标配置
 * 所有 SVG 魔法数字集中在这里，视觉效果不变，方便维护
 */
const CHART_CONFIG = {
  viewBox: "0 0 760 880",

  // 上方四个方块（日期 / 月份 / 世纪 / 年代）
  boxes: {
    day:     { x: 166, y: 190, w: 86, h: 52, label: "日期",  labelX: 189, labelY: 174, valueX: 209, valueY: 224 },
    month:   { x: 252, y: 190, w: 86, h: 52, label: "月份",  labelX: 275, labelY: 174, valueX: 295, valueY: 224 },
    century: { x: 422, y: 190, w: 86, h: 52, label: "世纪",  labelX: 485, labelY: 174, valueX: 465, valueY: 224 },
    year:    { x: 508, y: 190, w: 86, h: 52, label: "年代",  labelX: 571, labelY: 174, valueX: 551, valueY: 224 }
  },

  // 下方六个方块（S T U / V W X）
  lowerBoxes: {
    U: { x: 106, y: 690, w: 72, h: 52, valueX: 142, valueY: 726 },
    S: { x: 178, y: 690, w: 72, h: 52, valueX: 214, valueY: 726 },
    T: { x: 250, y: 690, w: 72, h: 52, valueX: 286, valueY: 726 },
    V: { x: 438, y: 690, w: 72, h: 52, valueX: 474, valueY: 726 },
    W: { x: 510, y: 690, w: 72, h: 52, valueX: 546, valueY: 726 },
    X: { x: 582, y: 690, w: 72, h: 52, valueX: 618, valueY: 726 }
  },

  // 图谱框架线条
  frame: [
    "M 164 266 L 596 266",
    "M 164 266 L 380 532",
    "M 596 266 L 380 532",
    "M 176 648 L 584 648",
    "M 176 648 L 380 386",
    "M 584 648 L 380 386",
    "M 380 156 L 380 782",
    "M 104 460 L 656 460"
  ],
  centerCircle: { cx: 380, cy: 460, r: 112 },

  // 五个节点圆
  nodes: {
    dream:  { cx: 380, cy: 150, r: 38 },
    main:   { cx: 380, cy: 460, r: 40 },
    outer:  { cx: 72,  cy: 460, r: 34 },
    inner:  { cx: 688, cy: 460, r: 34 },
    future: { cx: 380, cy: 784, r: 34 }
  },

  // 节点值文字位置
  nodeValues: {
    dream:  { x: 380, y: 164 },
    main:   { x: 380, y: 472 },
    outer:  { x: 72,  y: 474 },
    inner:  { x: 688, y: 474 },
    future: { x: 380, y: 798 }
  },

  // ★ 星号位置
  stars: [
    { x: 186, y: 288 },
    { x: 558, y: 288 }
  ],

  // 中间小节点文字（I J K L M N P Q）
  smallValues: {
    I: { x: 236, y: 318 },
    J: { x: 314, y: 318 },
    K: { x: 446, y: 318 },
    L: { x: 524, y: 318 },
    M: { x: 332, y: 406 },
    N: { x: 428, y: 406 },
    P: { x: 334, y: 538 },
    Q: { x: 426, y: 538 }
  },

  // SVG 顶部元信息文字
  meta: {
    name:  { x: 62, y: 54 },
    birth: { x: 62, y: 98 }
  }
};

// Node.js 环境导出
if (typeof module !== "undefined") {
  module.exports = CHART_CONFIG;
}
