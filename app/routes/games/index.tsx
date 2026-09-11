import { useState } from "react";
import { createMeta } from "../../utils/Meta";
import { GetGameData } from "../../data/game/getGame";
import { Link } from 'react-router';

import TextSVG from "../../components/svg/TextSvg"
import PhoneMockup from "../../components/mockup/PhoneMockup/PhoneMockup"
import RightIcon from "../../components/icon/right"


export const meta = () => {
  return createMeta({
    title: "Games - Aero",
    description: "Game Production and Learning.",
    url: "https://Aero/games",
  });
};


export default function Games() {
  const [isMockupExpanded, setIsMockupExpanded] = useState(false);
  const gameUrl = GetGameData.url.find(({ name }) => name === "gameUrl")?.src ?? "";
  const previewSrc = GetGameData.url.find(({ name }) => name === "previewSrc")?.src ?? "";

  return (
    <>
      <h1 className={`text-[1.6rem] text-(--palette-main-color) leading-1`}>
        <span
          style={{ viewTransitionName: `hero-title` }}
          className="[view-transition-class:herotitle]"
        >Games</span>
      </h1>
      <span className="text-[1rem] w-64 leading-5 lg:leading-6 -mt-2 text-neutral-400 tracking-widest dark:text-neutral-500">
        Experiments that can be touched, turned, and play.
      </span>
      
      <section className="relative isolate w-full">
        <TextSVG text="PLAY" position={{x:210,y:230}} className="stroke-4 lg:stroke-1 lg:mt-0 stroke-[#000000]/20 dark:stroke-[#fff]/15" />
        <TextSVG text="HERE" position={{x:215,y:230}} className="stroke-4 lg:stroke-1 lg:hidden mt-38 stroke-[#000000]/20 dark:stroke-[#fff]/15" />
        <div 
          style={{ viewTransitionName: `hero-title-Games` }} 
          className={['flex flex-col lg:mt-52 mt-76','[view-transition-class:herotitle]'].join(' ')}
        >
          
          <h1 className={`text-[1rem] text-(--palette-main-color) leading-2`}>
            <span>{GetGameData.tags.join(" - ")}</span>
          </h1>
          <span className="text-[2.8rem] font-bold leading-16" >
              {GetGameData.title}
          </span>
          <span className="text-[.8rem] lg:text-[1rem] w-xs lg:w-[32rem] text-neutral-400 dark:text-(--palette-text-light-black)/50 leading-4 lg:leading-6">
            {GetGameData.description}
          </span> 

          <div className="flex gap-12 ">
            <Link 
              to={gameUrl} 
              target="_blank"
              className=" mt-3 lg:mt-5 w-fit  cursor-pointer "
            >
              <span className="flex items-center text-black dark:text-(--palette-main-color) border-b-2 border-black dark:border-(--palette-main-color)">
                OPEN GAME!
                <RightIcon className="w-3 ml-2 fill-black dark:fill-(--palette-main-color)"></RightIcon>
              </span>
              
            </Link>
          </div>
        </div>

        <div className="absolute right-1/2 translate-x-1/2 lg:translate-none -top-30 lg:-right-42 lg:-top-32 scale-60 lg:scale-100">
          <PhoneMockup isExpanded={isMockupExpanded} setIsExpanded={setIsMockupExpanded} screenSrc={gameUrl} previewSrc={previewSrc} />
        </div>

        <div className="hidden sm:flex justify-center items-center absolute mt-2 lg:mt-25 w-full sm:border-t border-t-black/10 pt-6 ">
          <div className="hidden sm:block absolute w-3 h-3 bg-(--palette-main-color) top-0 -translate-y-1/2 rounded-full border-2 border-black/10"></div>

          <div className="flex flex-col items-center text-(--palette-main-color)">
            <span className="leading-4 sm:leading-8 font-bold text-[1rem] lg:text-[1.5rem]">{GetGameData.title}</span>
            <span className="text-[.9rem] lg:text-[1rem]">{GetGameData.platform}</span>
          </div>

        </div>
      </section>
    </>
  );
}