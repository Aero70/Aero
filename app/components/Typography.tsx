type H1Props = React.PropsWithChildren<{
  className?: string;
  id: string;
}>;


export const H1:React.FC<H1Props> = ({ id,children} ) => {
  return (
    <h1
      className={`inline-block text-[3.2rem] leading-16 lg:text-[5.2rem] lg:leading-[5rem] md:text-[4.2rem] md:leading-[4rem] tracking-wide font-bold `}
    >
      <span style={{ viewTransitionName: `hero-title-${id}` }}
        className="[view-transition-class:herotitle]">
        {children}
      </span>
    </h1>
  );
};

export const H2: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="text-[3rem] max-sm:text-[2.5rem] tracking-wide leading-[2.8rem] max-sm:leading-[2.3rem] font-light">
    {children}
  </h2>
);