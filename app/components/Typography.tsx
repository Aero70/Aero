type H1Props = React.PropsWithChildren<{
  className?: string;
  id: string;
}>;


export const H1:React.FC<H1Props> = ({ id,children} ) => {
  return (
    <h1
      className={`inline-block text-[3.6rem] leading-12 lg:text-[5.6rem] lg:leading-[4.5rem] md:text-[4.6rem] md:leading-[3.5rem] tracking-wide font-bold `}
    >
      <span style={{ viewTransitionName: `hero-title-${id}` }}
        className="[view-transition-class:herotitle]">
        {children}
      </span>
    </h1>
  );
};

export const H2: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="text-[2.6rem] max-sm:text-[2rem] tracking-wide leading-[2.8rem] max-sm:leading-[2rem] font-light">
    {children}
  </h2>
);