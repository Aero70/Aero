import { NavLink,useNavigate } from "react-router";

export function VTNavLink({
        to,
        style,
        state,
        children,
    }: {
        to: string
        style ?: any
        state ?: any
        children: React.ReactNode
    }) {
    const navigate = useNavigate()
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()

        if (!document.startViewTransition) {
            navigate(to)
            return
        }
        // 让 startViewTransition 等待 React 提交更新
        document.startViewTransition(() => {
            return new Promise<void>((resolve) => {
            navigate(to)
            // 等待下一帧，确保 React 渲染并提交到 DOM
            requestAnimationFrame(() => resolve())
            })
        })
    }

    return (
        <NavLink to={to} state ={state}  onClick={handleClick}
            className={style}>
            {children}
        </NavLink>
    )
}
