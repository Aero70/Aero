import {
  type CSSProperties,
  type MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createLogoPath,
  easeOutCubic,
  escapeSvgAttribute,
  svgToCssUrl,
} from "./math";

/**
 * 点击旋转方向。
 *
 * 1 表示 angleY 增加，也就是向一个方向旋转一整圈。
 * -1 表示 angleY 减少，也就是反方向旋转一整圈。
 */
type SpinDirection = 1 | -1;
type DragValue = { x: number; y: number }; // 拖拽偏移值

/**
 * 一次拖拽开始时保存的信息。
 *
 * x/y: 鼠标或触控点按下时的位置。
 * moved: 是否真的发生过拖动，用来区分 click 和 drag。
 * origin: 本次拖拽开始时 logo 已经存在的拖拽偏移。
 */
type DragStart = {
  x: number;
  y: number;
  moved: boolean;
  origin: DragValue;
};

type LogoCssVariables = CSSProperties & {
  "--striped-cube-logo-color"?: string;
  "--striped-cube-logo-stroke-width"?: string | number;
};

type LogoBackgroundImageOptions = {
  color?: string;
  strokeWidth?: number | string;
  backgroundColor?: string;
  patternScale?: number;
  patternRotation?: number;
  strokeLinecap?: "butt" | "round" | "square";
};

type LogoBackgroundVariablesOptions = {
  light?: LogoBackgroundImageOptions;
  dark?: LogoBackgroundImageOptions;
  lightVariableName?: `--${string}`;
  darkVariableName?: `--${string}`;
  sizeVariableName?: `--${string}`;
  repeatVariableName?: `--${string}`;
  positionVariableName?: `--${string}`;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundAttachment?: CSSProperties["backgroundAttachment"];
};

type LogoBackgroundVariables = CSSProperties & Record<`--${string}`, string | number>;


const FULL_TURN = Math.PI * 2;//  一整圈的弧度值
const LOAD_SPIN_DURATION_MS = 1100;//页面首次渲染后自动旋转一圈的时长
const CLICK_SPIN_DURATION_MS = 850; // 鼠标点击后左右交替旋转一圈的时长
const DRAG_FOLLOW_STIFFNESS = 0.01;// 拖动时 logo 追向鼠标目标位置的力度
const DRAG_FOLLOW_DAMPING = 0.44;// 拖动过程中的阻尼
const DRAG_RETURN_DAMPING = 0.88;// 松手回正时的阻尼
const DRAG_SETTLE_DISTANCE = 0.08; // spring 动画停止阈值
const INITIAL_DRAG: DragValue = { x: -16, y: 9 }; // 首次渲染时的拖拽偏移。

const AERO_BACKGROUND_PATTERN_PATH =
  "M17.62 0l-6.07 10.5m2.74 4.76L8.22 4.75m-5.48 0h12.13M.01 0h23.07M6.07 20L0 9.5m2.74-4.75l-6.07 10.5m-5.48 0H3.33m8.2 4.75L0 .02-11.54 20m40.68 0L23.07 9.5m2.74-4.75l-6.06 10.5m-5.49 0H26.4M34.6 20L23.08.02 11.53 20m-5.46 0L0 30.51m2.74 4.75l-6.07-10.5m-5.48 0H3.33m8.2-4.75L0 40l-11.54-19.98zM17.6 40l-6.06-10.5m2.74-4.76L8.2 35.25m-5.48 0h12.13M0 40h23.07L11.54 20.01m17.6 0l-6.07 10.5m2.74 4.75l-6.06-10.5m-5.49 0H26.4M11.53 20h23.08L23.07 40";


// 背景生成
export function createLogoBackgroundImage({
  color = "#000000ff",
  strokeWidth = 2.5,
  backgroundColor = "#2b2b3100",
  patternScale = 5,
  patternRotation = 0,
  strokeLinecap = "round",
}: LogoBackgroundImageOptions = {}): string {
  const svg = [
    "<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>",
    "<defs>",
    `<pattern id='a' patternUnits='userSpaceOnUse' width='23.07' height='40' patternTransform='scale(${patternScale}) rotate(${patternRotation})'>`,
    `<rect x='0' y='0' width='100%' height='100%' fill='${escapeSvgAttribute(
      backgroundColor
    )}'/>`,
    `<path d='${AERO_BACKGROUND_PATTERN_PATH}' stroke-linejoin='round' stroke-linecap='${strokeLinecap}' stroke-width='${escapeSvgAttribute(
      strokeWidth
    )}' stroke='${escapeSvgAttribute(color)}' fill='none'/>`,
    "</pattern>",
    "</defs>",
    "<rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)'/>",
    "</svg>",
  ].join("");

  return svgToCssUrl(svg);
}

export function createLogoBackgroundVariables({
  light,
  dark,
  lightVariableName = "--Aero-background-light",
  darkVariableName = "--Aero-background-dark",
  sizeVariableName = "--Aero-background-size",
  repeatVariableName = "--Aero-background-repeat",
  positionVariableName = "--Aero-background-position",
  backgroundSize,
  backgroundRepeat = "repeat",
  backgroundPosition = "top left",
  backgroundAttachment = "fixed",
}: LogoBackgroundVariablesOptions = {}): LogoBackgroundVariables {
  const variables = {
    [lightVariableName]: createLogoBackgroundImage(light),
    [darkVariableName]: createLogoBackgroundImage({
      color: "#fff",
      ...dark,
    }),
    [repeatVariableName]: backgroundRepeat,
    [positionVariableName]: backgroundPosition,
    backgroundRepeat: `var(${repeatVariableName})`,
    backgroundPosition: `var(${positionVariableName})`,
    backgroundAttachment,
  } as LogoBackgroundVariables;

  if (backgroundSize) {
    variables[sizeVariableName] = backgroundSize;
    variables.backgroundSize = `var(${sizeVariableName})`;
  }

  return variables;
}


export function StripedCubeLogo({
  className,
  color = "#7160b7",
  strokeWidth = 6,
  style,
  onMouseDown,
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
  style?: LogoCssVariables;
  onMouseDown?: MouseEventHandler<SVGSVGElement>;
}) {
  /**
   * 自动旋转和点击旋转产生的 Y 轴角度。
   *
   * 页面加载时会增加 2π，转一整圈。
   * 点击时会左右交替增加或减少 2π。
   */
  const [spinAngle, setSpinAngle] = useState(0);

  /**
   * 当前实际显示出来的拖拽偏移。
   *
   * 注意：
   * 鼠标位置不会直接写进 drag。
   * 鼠标移动只更新 dragTargetRef，drag 会用 spring 慢慢追过去。
   */
  const [drag, setDrag] = useState<DragValue>(INITIAL_DRAG);

  /**
   * 保存最新 spinAngle。
   *
   * requestAnimationFrame 回调里读 state 容易遇到旧值，
   * ref 可以随时拿到最新值。
   */
  const spinAngleRef = useRef(0);

  /**
   * 当前实际显示的拖拽值。
   *
   * 和 drag state 同步，但 ref 更适合动画循环实时读取。
   */
  const dragRef = useRef<DragValue>(INITIAL_DRAG);

  /**
   * 拖拽目标值。
   *
   * 鼠标拖到哪里，这个值就更新到哪里。
   * logo 本身不会瞬间跳过去，而是通过 spring 追过去。
   */
  const dragTargetRef = useRef<DragValue>({ x: 0, y: 0 });

  /**
   * spring 当前速度。
   *
   * 释放拖拽时保留速度，就能得到冲过头再回弹的效果。
   */
  const dragVelocityRef = useRef<DragValue>({ x: 0, y: 0 });

  /**
   * 下一次点击旋转方向。
   *
   * 每次点击后都会在 1 和 -1 之间切换。
   */
  const nextClickDirection = useRef<SpinDirection>(1);

  /**
   * 防止 React 严格模式或重新渲染时重复触发首次动画。
   */
  const initialSpinStarted = useRef(false);

  /**
   * 当前拖拽手势的起点信息。
   * 为 null 表示当前没有拖拽。
   */
  const dragStart = useRef<null | DragStart>(null);
  const spinAnimation = useRef<number | null>(null); // 自动旋转/点击旋转的 requestAnimationFrame id。

  /**
   * 保留这个 ref 是为了集中清理旧的回正动画。
   * 当前回正由 dragFollowAnimation 驱动，因此这里主要作为兼容清理点。
   */
  const returnAnimation = useRef<number | null>(null);

  /**
   * 拖拽跟随和松手回弹的 requestAnimationFrame id。
   */
  const dragFollowAnimation = useRef<number | null>(null);

  /**
   * 同时更新 spinAngle 的 state 和 ref。
   */
  function setSpinAngleValue(value: number) {
    spinAngleRef.current = value;
    setSpinAngle(value);
  }

  /**
   * 停止自动旋转或点击旋转动画。
   */
  function stopSpinAnimation() {
    if (spinAnimation.current !== null) {
      cancelAnimationFrame(spinAnimation.current);
      spinAnimation.current = null;
    }
  }

  /**
   * 停止旧的回正动画。
   */
  function stopReturnAnimation() {
    if (returnAnimation.current !== null) {
      cancelAnimationFrame(returnAnimation.current);
      returnAnimation.current = null;
    }
  }

  /**
   * 停止拖拽跟随动画。
   */
  function stopDragFollowAnimation() {
    if (dragFollowAnimation.current !== null) {
      cancelAnimationFrame(dragFollowAnimation.current);
      dragFollowAnimation.current = null;
    }
  }

  /**
   * 同步更新 drag 的 ref 和 state。
   *
   * state 负责触发重新渲染。
   * ref 负责动画循环读取最新值。
   */
  function setDragValue(value: DragValue) {
    dragRef.current = value;
    setDrag(value);
  }

  /**
   * 设置拖拽目标值，并确保 spring 动画正在运行。
   */
  function setDragTarget(value: DragValue) {
    dragTargetRef.current = value;
    startDragFollowAnimation();
  }

  /**
   * 启动拖拽 spring 动画。
   *
   * 计算方式：
   * 1. target - current 得到当前位置和目标之间的距离。
   * 2. 距离乘 stiffness 得到本帧加速度倾向。
   * 3. 加到 velocity 上，形成惯性。
   * 4. 再乘 damping，让速度逐渐衰减。
   * 5. current + velocity 得到下一帧位置。
   */
  function startDragFollowAnimation() {
    if (dragFollowAnimation.current !== null) {
      return;
    }

    function tick() {
      const current = dragRef.current;
      const target = dragTargetRef.current;
      const velocity = dragVelocityRef.current;

      /**
       * 拖动中使用更高阻尼，让 logo 稳定跟手。
       * 松手后使用更低阻尼，让回正时更容易冲过中心。
       */
      const damping = dragStart.current
        ? DRAG_FOLLOW_DAMPING
        : DRAG_RETURN_DAMPING;

      const nextVelocity = {
        x:
          (velocity.x + (target.x - current.x) * DRAG_FOLLOW_STIFFNESS) *
          damping,
        y:
          (velocity.y + (target.y - current.y) * DRAG_FOLLOW_STIFFNESS) *
          damping,
      };

      const next = {
        x: current.x + nextVelocity.x,
        y: current.y + nextVelocity.y,
      };

      dragVelocityRef.current = nextVelocity;
      setDragValue(next);

      const distanceToTarget = Math.hypot(target.x - next.x, target.y - next.y);
      const speed = Math.hypot(nextVelocity.x, nextVelocity.y);

      if (
        distanceToTarget < DRAG_SETTLE_DISTANCE &&
        speed < DRAG_SETTLE_DISTANCE
      ) {
        dragVelocityRef.current = { x: 0, y: 0 };
        setDragValue(target);
        dragFollowAnimation.current = null;
        return;
      }

      dragFollowAnimation.current = requestAnimationFrame(tick);
    }

    dragFollowAnimation.current = requestAnimationFrame(tick);
  }

  /**
   * 旋转一整圈。
   *
   * 参数：
   * direction: 旋转方向，1 或 -1。
   * duration: 动画时长，单位毫秒。
   */
  function animateOneTurn(direction: SpinDirection, duration: number) {
    stopSpinAnimation();

    const from = spinAngleRef.current;
    const to = from + FULL_TURN * direction;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);

      setSpinAngleValue(from + (to - from) * eased);

      if (progress < 1) {
        spinAnimation.current = requestAnimationFrame(tick);
      } else {
        setSpinAngleValue(to);
        spinAnimation.current = null;
      }
    }

    spinAnimation.current = requestAnimationFrame(tick);
  }

  /**
   * 松手后把拖拽目标设置回中心。
   *
   * 参数：
   * from: 松手瞬间 logo 当前显示出来的拖拽值。
   *
   * 注意：
   * 真正的回弹由 startDragFollowAnimation 里的 spring 处理。
   */
  function animateBackToCenter(from: DragValue) {
    stopReturnAnimation();
    dragRef.current = from;
    setDragTarget({ x: 0, y: 0 });
  }

  /**
   * 处理点击旋转。
   *
   * 第一次点击向右转，第二次向左转，之后继续交替。
   */
  function handleClickSpin() {
    const direction = nextClickDirection.current;

    animateOneTurn(direction, CLICK_SPIN_DURATION_MS);
    nextClickDirection.current = direction === 1 ? -1 : 1;
  }

  useEffect(() => {
    /**
     * 首次挂载后：
     * 1. 自动旋转一整圈。
     * 2. 把拖拽目标设为中心，让 INITIAL_DRAG 产生入场回弹。
     */
    if (!initialSpinStarted.current) {
      initialSpinStarted.current = true;
      animateOneTurn(1, LOAD_SPIN_DURATION_MS);
      setDragTarget({ x: 0, y: 0 });
    }

    return () => {
      stopSpinAnimation();
      stopReturnAnimation();
      stopDragFollowAnimation();
    };
  }, []);

  const path = useMemo(() => {
    /**
     * 最终角度由三部分组成：
     *
     * baseX/baseY:
     * logo 的默认姿态。
     *
     * spinAngle:
     * 加载动画和点击动画产生的一整圈旋转。
     *
     * drag.x/drag.y:
     * spring 处理后的拖拽偏移。
     *
     * 除以 65：
     * 把像素级拖拽距离转换成弧度角。
     * 数字越大，拖动越不敏感。
     */
    const baseX = 0.12;
    const baseY = 0;

    const angleX = baseX + drag.y / 65;
    const angleY = baseY + spinAngle + drag.x / 65;

    return createLogoPath(angleX, angleY);
  }, [spinAngle, drag]);

  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      role="img"
      aria-label="Triangle SVG mapped 3D logo"
      overflow="visible"
      style={
        {
          cursor: "grab",
          touchAction: "none",
          overflow: "visible",
          color,
          "--striped-cube-logo-color": color,
          "--striped-cube-logo-stroke-width": strokeWidth,
          ...style,
        } as LogoCssVariables
      }
      onPointerDown={(event) => {
        /**
         * pointer down 是拖拽或点击的起点。
         *
         * 这里会暂停其它动画，把当前 drag 作为本次手势的 origin。
         */
        stopSpinAnimation();
        stopReturnAnimation();
        stopDragFollowAnimation();

        const origin = dragRef.current;
        dragTargetRef.current = origin;
        dragVelocityRef.current = { x: 0, y: 0 };

        event.currentTarget.setPointerCapture(event.pointerId);

        dragStart.current = {
          x: event.clientX,
          y: event.clientY,
          moved: false,
          origin,
        };
      }}
      onMouseDown={onMouseDown}
      onPointerMove={(event) => {
        if (!dragStart.current) return;

        /**
         * dx/dy 是本次手势相对按下点移动了多少像素。
         */
        const dx = event.clientX - dragStart.current.x;
        const dy = event.clientY - dragStart.current.y;

        /**
         * 4px 阈值用于区分点击和拖动。
         * 小于这个范围的轻微抖动仍然算点击。
         */
        if (Math.abs(dx) + Math.abs(dy) > 4) {
          dragStart.current.moved = true;
        }

        /**
         * 只更新目标值，不直接 setDrag。
         *
         * logo 会通过 spring 追向这个目标，
         * 因此会有“跟随延迟”的手感。
         */
        setDragTarget({
          x: dragStart.current.origin.x + dx,
          y: dragStart.current.origin.y + dy,
        });
      }}
      onPointerUp={(event) => {
        if (!dragStart.current) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }

        /**
         * 没有真正移动时，认为这是点击，触发左右交替旋转。
         */
        if (!dragStart.current.moved) {
          handleClickSpin();
        }

        /**
         * 清空 dragStart 后，spring 会切换到回正阻尼，
         * 让释放后的回弹更明显。
         */
        dragStart.current = null;
        animateBackToCenter(dragRef.current);
      }}
      onPointerCancel={() => {
        dragStart.current = null;
        animateBackToCenter(dragRef.current);
      }}
    >
      <path
        d={path}
        fill="none"
        stroke="var(--striped-cube-logo-color, currentColor)"
        strokeWidth="var(--striped-cube-logo-stroke-width, 6)"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
