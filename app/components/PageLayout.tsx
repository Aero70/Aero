import { Link, useLocation } from "react-router";
import styles from "./Navbar.module.css";
import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { scrollDerivedVariables } from "./PageLayout.css.ts";
import { StripedCubeLogo } from "./logo/index"

import ListIcon from "./icon/list.tsx"
import CloseIcon from "./icon/close.tsx"

type NavbarLinkProps = {
  to: string;
  text: string;
  exact?: true;
};

const navbarItems: NavbarLinkProps[] = [
  { to: "/", text: "Hello", exact: true },
  { to: "/blog", text: "Blog" },
  { to: "/games", text: "Games" },
  { to: "/cv", text: "CV" },
];

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
    const { pathname } = useLocation();
    const isGamesPage = pathname.startsWith("/games");
    
    const currentNavbarItem = navbarItems.find(({ to, exact }) =>
      exact ? pathname === to : pathname.startsWith(to)
    );
    const currentPageTitle = currentNavbarItem?.text ?? "";
    const [navListCut, setnavListCut] = useState(false);

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
    
    const scrollProgressStyle = {
      "--scroll-progress": scrollTimelineSupported
        ? "var(--scroll-progress-root)"
        : scrollY,
    } as React.CSSProperties & { "--scroll-progress": string | typeof scrollY };
    
    return (
        <motion.div className="flex flex-col scroll-progress-provider"
          style={scrollProgressStyle}
        >
          <div className={`fixed top-0 left-0 z-20 w-full ${scrollDerivedVariables}`}>
            <div ref={headerRef} tabIndex={-1}
              className=" group py-2 border-b-2 bg-[#F7F7F7]/(--bg-opacity) dark:bg-[#0A0A0A]/(--bg-opacity) z-10
              border-[#DADADA]/(--border-opacity) dark:border-[#303031]/(--border-opacity)
                backdrop-blur-(--header-blur)
                focus:outline-none relative
              "
            >
              <div style={{ viewTransitionName: "header-pattern" }}>
                  <header 
                    className="max-w-4xl mx-auto w-full flex items-center  px-6 lg:px-16 mt-(--margin-top) gap-8 h-16 relative"
                  >
                    <StripedCubeLogo style={{ viewTransitionName: "header-logo" }} className="sm:w-(--logo-width) w-[60px] shrink-0 touch-none" onMouseDown={() => headerRef.current?.focus()} />
                    
                    <span className="pointer-events-none absolute text-[1.2rem] ml-1 left-1/2 -translate-x-1/2 sm:hidden text-sm font-semibold uppercase tracking-[1.7px] text-(--palette-main-color) " >
                      {currentPageTitle}
                    </span>
                    
                    <nav className="pt-px grow h-10 hidden items-center z-(--navbar-z-index) group-focus:z-20 active:z-20 group-hover:z-20 sm:flex">
                      <ul style={{ viewTransitionName: "header-nav" }} 
                        className="transition-[opacity,translate] duration-300 opacity-(--navbar-opacity) group-focus:opacity-100 group-hover:opacity-100 list-none m-0 p-0 flex gap-9 text-(--font-size) uppercase translate-x-(--navbar-translate-x) group-hover:translate-x-0 group-focus:translate-x-0">
                          <NavbarLink to="/" text="Hello" exact />
                          <NavbarLink to="/blog" text="Blog" />
                          <NavbarLink to="/games" text="Games" />
                          <NavbarLink to="/cv" text="CV" />
                      </ul>
                    </nav>

                    <div className="ml-auto sm:hidden">
                      {
                        navListCut ? 
                          <div onClick={()=>setnavListCut(false)} >
                            <CloseIcon className="w-8 text-(--palette-main-color) " />
                          </div>
                        :
                        <div onClick={()=>setnavListCut(true)} >
                          <ListIcon className="w-8 text-(--palette-main-color) " />
                        </div>
                      }
                      
                    </div>
                  </header>
              </div>
            </div>

            {navListCut && <div className='sm:hidden fixed inset-0 z-9 bg-white/35 dark:bg-black/35 backdrop-blur-[6px]'>
              <ul className=" absolute inset-0 top-(--navbar-small-Top) pt-6 px-6 flex flex-col border-t border-t-gray-300/20 dark:border-t-gray-600/20 gap-6 text-[1.2rem]">
                <div onClick={()=>setnavListCut(false)}><NavbarLink to="/" text="Hello" exact /></div>
                <div onClick={()=>setnavListCut(false)}><NavbarLink to="/blog" text="Blog" /></div>
                <div onClick={()=>setnavListCut(false)}><NavbarLink to="/games" text="Games" /></div>
                <div onClick={()=>setnavListCut(false)}><NavbarLink to="/cv" text="CV" /></div>
              </ul>
            </div>}
          </div>
            
          <main
            style={{ viewTransitionName: "content-view" }}
            className={[
              isGamesPage ? "overflow-x-visible mt-48" : "overflow-x-hidden mt-56",
              "max-w-4xl w-full mx-auto flex flex-col px-6 lg:px-16 gap-6 lg:mt-56 mb-10",
              ].join(' ')
            }
          >
              {children}
          </main>
        </motion.div>
    )
}
