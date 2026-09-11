import { motion } from "motion/react";
import type { RefObject } from "react";

export const METAL_DEPTH = 38; // 机身厚度
export const BUTTON_RISE = 3; // 按钮厚度

// 动画运动过渡
export const PHONE_SPRING = {
    type: "spring",
    stiffness: 240,
    damping: 28,
} as const;

// 按钮组件
export function SideButton({
  side,
  top,
  height,
  isExpanded
}: {
    side: "left" | "right";
    top: string;
    height: string;
    isExpanded: boolean
}) {
  const isLeft = side === "left";

  return (
    <div
      className="absolute w-0 transform-3d"
      style={{
        top,
        height,
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
      }}
    >
        {Array.from({ length: isExpanded ? 0 : BUTTON_RISE }).map((_, index) => {
            const offset = index + 3;
            const isOuterLayer = isExpanded ? false : index === BUTTON_RISE - 1;

            return (
            <div
                key={index}
                className="absolute top-0 h-full w-[13px]"
                style={{
                left: isLeft ? `-${offset}px` : undefined,
                right: isLeft ? undefined : `-${offset}px`,
                transform: isLeft ? "rotateY(90deg)" : "rotateY(-90deg)",
                transformOrigin:isLeft ? "left center" : "right center",
                borderRadius: "6px",
                background: isOuterLayer
                    ? "linear-gradient(140deg, #616161 6%, #bfbfbf 47%, #808080 79%, #212121 98%)"
                    : "linear-gradient(181deg, #242424 4%, #dbdbdb 10%, #b0b0b0 14%, #4f4f4f 80%, #242424 92%, #bfbfbf 95%, #242424 98%)",
                border: isOuterLayer ? "1px solid #66666b" : "none",
                }}
            />
            );
        })}

        {
            isExpanded && (<div
                className="absolute top-0 h-full w-[1.8px] rounded-[5px]"
                style={{
                    left: isLeft ? "-2.1px" : undefined,
                    right: isLeft ? undefined : "-2.1px",
                    borderRadius:isLeft ? "10px 0 0 10px " : "0 10px 10px 0 ",
                    transform: "translateZ(3px)",
                    background:
                    "linear-gradient(181deg, #242424 4%, #dbdbdb 10%, #b0b0b0 14%, #4f4f4f 80%, #242424 92%, #bfbfbf 95%, #242424 98%)",
                }}
            />)
        }
    </div>
  );
}

// 天线带
export function AntennaBand({
  side,
  top,
  bottom,
}: {
    side: "left" | "right";
    top?: string;
    bottom?: string;
}) {
  const isLeft = side === "left";

  return (
    <>
      <div
        className="absolute h-[3px]"
        style={{
            top,
            bottom,
            width: `${METAL_DEPTH + 3 }px`,
            left: isLeft ? "0px" : undefined,
            right: isLeft ? undefined : "0px",
            transform: isLeft ? "rotateY(90deg) translateX(-3px)" : "rotateY(-90deg)",
            transformOrigin: isLeft ? "left center" : "right center",
            background: "#707070",
        }}
      />

      <div
        className="absolute z-20 h-[3px] w-[2px]"
        style={{
            top,
            bottom,
            left: isLeft ? "0px" : undefined,
            right: isLeft ? undefined : "0px",
            transform: "translateZ(3px)",
            background: "#707070",
        }}
      />
    </>
  );
}


// 手机模型
export function PhoneNode ({
    phoneRef,
    expandedScale,
    isExpanded,
    screenSrc,
    previewSrc,
    onActivate,
}:{
    phoneRef : RefObject<HTMLDivElement | null>
    expandedScale:number
    isExpanded:boolean
    screenSrc:string
    previewSrc?: string
    onActivate: () => void;
}) {
    const previewPose = {
        rotateX: 4,
        rotateY: 24,
        rotateZ: -6,
        scale: 1,
    };

    const expandedPose = {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: expandedScale,
    };
    const targetPose = isExpanded ? expandedPose : previewPose;
  
     return (
        <motion.div
            ref={phoneRef}
            onClick={onActivate}
            className={[
                "pointer-events-auto relative h-[30rem] w-58 bg-transparent p-0",
                isExpanded ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
        >
            <motion.div
                className="absolute inset-0"
                initial={false}
                animate={targetPose}
                transition={PHONE_SPRING}
                style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                }}
            >
                {/* 整体机身 */}
                {Array.from({ length: METAL_DEPTH }).map((_, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 rounded-[2.4rem] border-2 border-white/25"
                        style={{
                        transform: `translateZ(-${index + 1}px)`,
                        background:
                            "linear-gradient(100deg, #f4f4f5 0%, #71717a 14%, #18181b 45%, #52525b 72%, #d4d4d8 100%)",
                        }}
                    />
                ))}

                {/* 天线带 */}
                <AntennaBand side="left" top="4rem" />
                <AntennaBand side="left" bottom="4rem" />
                <AntennaBand side="right" top="4rem" />
                <AntennaBand side="right" bottom="4rem" />

                {/* 按键 */}
                <SideButton side="left" top="6.5rem" height="1.5rem" isExpanded={isExpanded} />
                <SideButton side="left" top="9rem" height="2.5rem" isExpanded={isExpanded} />
                {
                    isExpanded && <SideButton side="right" top="9rem" height="4.2rem" isExpanded={isExpanded} />
                }
                <SideButton side="left" top="12.3rem" height="2.5rem" isExpanded={isExpanded} />

                {/* 屏幕 */}
                <div 
                    className="absolute inset-0 rounded-[2.4rem] shadow-[0_35px_70px_-20px_rgb(0_0_0/0.5)]" 
                    style={{
                        transform: "translateZ(2px)",
                        background:
                        "linear-gradient(135deg, #141414 0%, #262626 18%, #141414 100%)",
                    }}
                >
                    <div className=" relative h-full w-full rounded-[2.5rem] bg-[#141414] p-[0.15rem] overflow-hidden border-2 border-white/60">
                        {/* 灵动岛 */}
                        <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-950" />
                        
                        {/* 屏幕视口 */}
                        {/* <div className="h-full w-full">
                            {previewSrc || !screenSrc ? (
                                <img
                                    alt="Game preview"
                                    src={
                                        previewSrc ||
                                        "https://images.pexels.com/photos/32296537/pexels-photo-32296537.jpeg"
                                    }
                                    draggable={false}
                                    className={[
                                        "h-full w-full rounded-[2.2rem] pointer-events-none object-cover",
                                    ].join(" ")}
                                />
                            ) : (
                                <iframe
                                    title="view game"
                                    src={screenSrc}
                                    className={[
                                        "h-full w-full rounded-[2.2rem] border-0 bg-black",
                                        isExpanded ? "pointer-events-auto" : "pointer-events-none",
                                    ].join(" ")}
                                />
                            )}
                        </div> */}

                        {/* 屏幕玻璃反光 */}
                        {!isExpanded && (<div
                            className="pointer-events-none absolute inset-[0.2rem] z-10 rounded-[2.2rem] "
                            style={{
                                background: `
                                    linear-gradient(135deg, rgba(255, 255, 255, .25) 0%, rgba(255, 255, 255, .1) 25%, rgba(255, 255, 255, .05) 42%, rgba(0, 0, 0, .2) 100%)
                                `,
                            }}
                        />)}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}