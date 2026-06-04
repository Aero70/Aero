import { Link, useLocation } from "react-router";
import styles from "./Navbar.module.css";
import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { scrollDerivedVariables } from "./PageLayout.css.ts";
import { StripedCubeLogo } from "./logo/index"

type NavbarLinkProps = {
  to: string;
  text: string;
  exact?: true;
};

const NavbarLink: React.FC<NavbarLinkProps> = ({ to, text, exact }) => {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  return (
    <li>
      <Link
        className={[
            styles.navbarlink,
            isActive ? styles.active : undefined
        ].filter(Boolean).join(" ")}
        to={to}
        data-text={text}
        viewTransition={pathname !== to}
      >
        <span>{text}</span>
      </Link>
    </li>
  );
};

export const PageLayout:React.FC<React.PropsWithChildren> = ({children}) =>{
    // 如果支持 CSS ScrollTimeline，用 CSS 变量
    // 如果不支持，就用 motion/react 的 useScroll()
    const { scrollY } = useScroll();
    const [scrollTimelineSupported, setScrollTimelineSupported] = useState(true);
    useEffect(() => {
      setScrollTimelineSupported("ScrollTimeline" in window);
      // 组件挂载后检测浏览器支持情况
    }, []);

    // 对于 Safari: 没有悬停效果, 所以使用 :focus 
    const headerRef = useRef<HTMLDivElement>(null); // 保存 header DOM，用来处理 focus/blur
    scrollY.on("change", () => headerRef.current?.blur());// 页面滚动时取消 header focus，避免移动端导航一直展开
    
    return (
        <motion.div className="flex flex-col scroll-progress-provider"
          style={{
            // @ts-expect-error React.CSSProperties typing does not support CSS variables
            "--scroll-progress": scrollTimelineSupported
              ? "var(--scroll-progress-root)"
              : scrollY,
          }}
        >
          <div className={`fixed top-0 left-0 z-10 w-full ${scrollDerivedVariables}`}>
            <div ref={headerRef} tabIndex={-1}
              className="
                group
                py-2
                border-b-2
              bg-[#F7F7F7]/[var(--bg-opacity)] dark:bg-[#0A0A0A]/[var(--bg-opacity)]
              border-[#DADADA]/[var(--border-opacity)] dark:border-[#303031]/[var(--border-opacity)]
                backdrop-blur-(--header-blur)
                focus:outline-none
              "
            >
              <div style={{ viewTransitionName: "header-pattern" }}>
                  <header 
                    className="max-w-4xl mx-auto w-full flex items-center px-16 mt-(--margin-top) gap-8 h-16"
                  >
                    <StripedCubeLogo style={{ viewTransitionName: "header-logo" }} className="w-(--logo-width) shrink-0 touch-none" onMouseDown={() => headerRef.current?.focus()} />
                    <nav className="relative pt-px grow h-10 flex items-center z-(--navbar-z-index) group-focus:z-20 active:z-20 group-hover:z-20">
                        <ul style={{ viewTransitionName: "header-nav" }} 
                            className="transition-[opacity,translate] duration-300 opacity-(--navbar-opacity) group-focus:opacity-100 group-hover:opacity-100 list-none m-0 p-0 flex gap-9 text-(--font-size) uppercase translate-x-(--navbar-translate-x) group-hover:translate-x-0 group-focus:translate-x-0">
                            <NavbarLink to="/" text="Hello" exact />
                            <NavbarLink to="/blog" text="Blog" />
                            <NavbarLink to="/cv" text="CV" />
                        </ul>
                    </nav>
                  </header>
              </div>
            </div>
          </div>
            
            <main style={{ viewTransitionName: "content-view" }} className="max-w-4xl w-full mx-auto flex flex-col gap-6 px-16 mt-56 mb-10 overflow-x-hidden">
                {children}
            </main>
        </motion.div>
    )
}
