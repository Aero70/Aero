import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
} from "motion/react";

import { 
    PhoneNode,
    PHONE_SPRING 
} from "./parts"


// 模型
export default function PhoneMockup(
{
    className,
    isExpanded,
    screenSrc,
    previewSrc,
    setIsExpanded
} : {
    className ?: string
    isExpanded : boolean
    screenSrc : string
    previewSrc : string
    setIsExpanded : (value:boolean) => void
}) {
    const placeholderRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [expandedScale, setExpandedScale] = useState(1);
    const hasPosition = useRef(false); 

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const previewScale = useMotionValue(1);

    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);

    useEffect(() => {
        const media = window.matchMedia("(width < 640px)");

        function syncScreen() {
            setIsSmallScreen(media.matches);

            if (media.matches) {
                setIsExpanded(false);
            }
        }

        syncScreen();
        media.addEventListener("change", syncScreen);

        return () => {
            media.removeEventListener("change", syncScreen);
        };
    }, [setIsExpanded]);

    useEffect(() => {
        if (isSmallScreen !== false) {
            hasPosition.current = false;
            return;
        }

        const placeholder = placeholderRef.current;
        if (!placeholder) return;

        // 点击手机后的位置变化
        function measureLayout() {
            if (!placeholder) return null;

            const width = placeholder.offsetWidth;
            const height = placeholder.offsetHeight;
            if (!width || !height) return null;

            const rect = placeholder.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight;

            const centerX = isExpanded
                ? viewportWidth / 2
                : rect.left + rect.width / 2;

            const centerY = isExpanded
                ? viewportHeight / 2
                : rect.top + rect.height / 2;

            const phone = phoneRef.current;

            const fittedScale =
                phone && phone.offsetWidth > 0 && phone.offsetHeight > 0
                    ? Math.min(
                        1.8,
                        (viewportWidth - 48) / phone.offsetWidth,
                        (viewportHeight - 48) / phone.offsetHeight,
                    )
                    : null;

            return {
                x: centerX - width / 2,
                y: centerY - height / 2,
                scale: isExpanded ? 1 : rect.width / width,
                expandedScale: fittedScale,
            };
        }

        function updatePosition(withAnimation: boolean) {
            const layout = measureLayout();
            if (!layout) return;

            if (layout.expandedScale !== null) {
                setExpandedScale(layout.expandedScale);
            }

            const targets = [
                [x, layout.x],
                [y, layout.y],
                [previewScale, layout.scale],
            ] as const;

            for (const [value, target] of targets) {
                if (withAnimation) {
                    animate(value, target, PHONE_SPRING);
                } else {
                    value.jump(target);
                }
            }
        }

        updatePosition(hasPosition.current);
        hasPosition.current = true;
        setIsMounted(true);

        function syncPosition() {
            const isMoving =
                x.isAnimating() ||
                y.isAnimating() ||
                previewScale.isAnimating();

            updatePosition(isMoving);
        }

        const handleScroll = () => {
            if (!isExpanded) syncPosition();
        };

        const handleResize = () => {
            syncPosition();
        };

        addEventListener("scroll", handleScroll, { passive: true });
        addEventListener("resize", handleResize);

        return () => {
            removeEventListener("scroll", handleScroll);
            removeEventListener("resize", handleResize);
            x.stop();
            y.stop();
            previewScale.stop();
        };
    }, [isSmallScreen,isExpanded, x, y, previewScale]);


    return (
        <div
            ref={placeholderRef}
            className={[
                "relative h-[32rem] w-[24rem]",
                className,
            ].filter(Boolean).join(" ")}
        >
            {isSmallScreen === true && (
                <div className="flex h-full w-full items-center justify-center perspective-[1200px]">
                    <PhoneNode
                        phoneRef={phoneRef}
                        expandedScale={1}
                        isExpanded={false}
                        screenSrc={screenSrc}
                        previewSrc={previewSrc}
                        onActivate={() => {
                            if (screenSrc) {
                                window.open(
                                    screenSrc,
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                            }
                        }}
                    />
                </div>
            )}
            {isSmallScreen === false && isMounted && createPortal(
                <div className="pointer-events-none fixed inset-0" style={{zIndex : isExpanded ? 100 : 15}}>
                    <AnimatePresence initial={false}>
                        {isExpanded && (
                            <motion.div
                                key="phone-backdrop"
                                onClick={() => setIsExpanded(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="pointer-events-auto absolute inset-0 bg-white/75 backdrop-blur-[2px] "
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="pointer-events-none absolute left-0 top-0 z-10 flex h-[32rem] w-[24rem] items-center justify-center perspective-[1200px]"
                        style={{
                            x,
                            y,
                            scale: previewScale,
                            transformOrigin: "center",
                        }}
                    >
                        <PhoneNode
                            phoneRef={phoneRef}
                            expandedScale = {expandedScale}
                            isExpanded={isExpanded}
                            onActivate = {() => {
                                if (isExpanded) return;
                
                                // 小屏幕直接去新标签页
                                if (window.matchMedia("(width < 640px)").matches) {
                                    if (screenSrc) {
                                        window.open(screenSrc, "_blank", "noopener,noreferrer");
                                    }
                                    return;
                                }
                                setIsExpanded(true);
                            }}
                            screenSrc={screenSrc}
                        />
                    </motion.div>
                </div>,

                // 挂载到body的兄弟层,不然点开的遮罩盖不住nav 
                document.body,
            )}
        </div>
    );
}