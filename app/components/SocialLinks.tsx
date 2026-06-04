import Github from "./icon/github"
import Getee from "./icon/Getee"
import { Link } from "react-router"

const SocialLinkIcon: React.FC<{
    to : string;
    icon : (props: any) => React.ReactElement;
    className :  string;
}> = ({to,icon: Icon,className}) =>{
    return <Link
        to={to}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-12 items-center justify-center overflow-hidden"
    >
        <Icon className={[
            "size-9 origin-center transform-gpu transition-transform duration-200 ease-out hover:scale-105",
            className
        ].join(" ")} />
    </Link>
}

export function SocialLinks () {
    return <footer className="flex items-center gap-4">
        <SocialLinkIcon 
            to="//github.com/2661689585"
            icon={Github}                           
            className="fill-(var(--palette-main-color))"
        />
        <SocialLinkIcon 
            to="//gitee.com/liang-xiang01"
            icon={Getee}                           
            className=""
        />
    </footer>
}