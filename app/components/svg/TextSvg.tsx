import "./index.css"

export default function TextSvg ({
    text,
    position,
    className
} : {
    text : string
    position : {
        x : number,
        y : number 
    }
    className ?: string
}) {
    const chars = Array.from(text);

    return (
        <svg viewBox="0 0 862 265" className={["textSVG",className].join(" ")}>
            {
                chars.map((char,index) => (
                    <text 
                        key={`${char}-${index}`}
                        x={index * position.x}
                        y={position.y}
                        className={['outlineChar'].join(' ')}
                        style={{
                            animationDelay: `${index * 160}ms`,
                        }}
                    >
                        {char}
                    </text>
                ))
            }
        </svg>
    );
}