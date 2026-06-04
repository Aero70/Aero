import React from "react";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export type TimelineDate =
  | { year: number; month?: number; day?: undefined }
  | { year: number; month: number; day: number };

export type TimelineDateSquareProps = {
    style ?: React.CSSProperties;
    className ?: string;
    date : TimelineDate | {from:TimelineDate; to?:TimelineDate};
}

// 单独时间
const DateSingle = ({date,showYear = true} : {
    date:TimelineDate;
    showYear ?: boolean
}) =>{
    return (
        <>
            <div className="text-lg flex flex-col tabular-nums space-y-1">
                {showYear && <div className="text-[1.05rem] flex justify-center">{date.year}</div>}

                {date.month && (
                    <div className="flex justify-between leading-[.3rem] text-[1rem]">
                        {MONTHS[date.month - 1].split("").map((letter,index) => (
                            <span key={index}>{letter}</span>
                        ))}
                    </div>
                )}

                {date.day && (
                    <div className="text-[1.9rem] flex justify-center leading-[3.2rem] tabular-nums">
                        {[date.day < 10 ? "0" : null , ...date.day.toString().split("")].map(
                            (digit , index) => (
                                <span key={index}>{digit}</span>
                            )
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

// 时间范围
const DateRange = ({from,to}:{
    from : TimelineDate,
    to ?: TimelineDate,
}) =>{
    return (
        <>
            {!to && (
                <div className="leading-4 uppercase text-sm flex justify-between ">
                    {"Since".split("").map((letter,index) => (
                        <span key={index}>{letter}</span>
                    ))}
                </div>
            )}

            <DateSingle date={from} />

            {to && (
                <>
                    <div className="text-center leading-3 mt-2">—</div>
                    <DateSingle date={to} showYear={to.year !== from.year} />
                </>
            )}
        </>
    )
}

export const TimelineDateSquare = ({ style,className,date } : TimelineDateSquareProps) =>{
    return(
        <div
            style={style}
            className={`${className} text-black/50 dark:text-gray-500`}
        >
            {"from" in date ? (
                <DateRange from={date.from} to={date.to} />
            ) : (<DateSingle date={date} />)}
        </div>
    )
}