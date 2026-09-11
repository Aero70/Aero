import { style } from "@vanilla-extract/css";// 从 vanilla-extract 引入 style，用 TypeScript 写 CSS

function map(
  [o1, o2]: [number, number], // origin
  [d1, d2]: [number, number], // destination
  unit = ""
) {
  // 把滚动区间 o1-o2 映射成目标区间 d1-d2
  const s = (d2 - d1) / (o2 - o1); // scale // 计算映射比例
  const expr = `calc(((var(--scroll-progress) - ${o1}) * ${s} + ${d1}) * 1${unit})`; // 用 CSS calc 根据 --scroll-progress 算出当前值
  const dMin = Math.min(d1, d2);// 目标值最小值
  const dMax = Math.max(d1, d2);// 目标值最大值
  return `clamp(${dMin}${unit}, ${expr}, ${dMax}${unit})`; // 用 clamp 限制结果不会小于最小值，也不会大于最大值
}

// threshold 用来做“超过某个滚动值后切换状态”
function threshold(threshold: number, [v1, v2]: [number, number], unit = "") {
  // 滚动没超过 threshold 时是 v1
  // 超过后立刻变成 v2
  const trigger = `(clamp(0, (var(--scroll-progress) - ${threshold}) * 999, 1)`;
  return `calc(${trigger} * (${v2} - ${v1}) + ${v1}) * 1${unit})`;
}

export const scrollDerivedVariables = style({
  // 导出一个 CSS class，里面放所有导航栏需要的变量
  // vars 是 vanilla-extract 设置 CSS 变量的写法
  vars: {
    // 滚动 130 时，opacity 是 0
    // 滚动到 180 时，opacity 变成 40
    // 中间平滑变化
    "--bg-opacity": map([130, 180], [0, 40], "%"),

    "--border-opacity": map([160, 220], [0, 90], "%"),
    "--header-pattern-opacity": map([0, 160], [0, 40], "%"),
    "--navbar-opacity": threshold(200, [100, 0], "%"),
    "--navbar-translate-x": threshold(200, [0, -13], "px"),
    "--navbar-z-index": threshold(200, [0, -10]),
    "--navbar-small-Top": map([0, 160], [10.5, 5.5],"rem"),
    "--logo-width": map([70, 160], [64, 48], "px"),
    "--header-blur": map([150, 220], [0, 9], "px"),
    "--margin-top": map([0, 160], [70, 0], "px"),
    "--font-size": map([0, 160], [1.5, 1.3], "rem"),
  },
});
