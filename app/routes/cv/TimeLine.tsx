import { type TimelineDate,TimelineDateSquare } from "../../components/DateSquare";

type TimeLineItem = {
    date : TimelineDate | {from:TimelineDate; to?:TimelineDate},
    title : string,
    place?: string;
    subtitle : string,
    url ?: string,
    description ?: string[],
    stack ?: string[],
}

export type TimelineProps = {
    timeline : TimeLineItem[];
}

export const Timeline:React.FC<TimelineProps> = ({timeline}) =>{
    return <ul className="flex flex-col gap-16 mb-12">
        {timeline.map((line) =>(
            <li className="flex gap-8">
                <TimelineDateSquare date={line.date} />

                <div className="flex flex-col">
                    <div className="space-x-4 align-text-bottom leading-6 text-[1.5rem]">
                        <a
                            href={line.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold whitespace-break-spaces"
                        >
                            {line.title}
                        </a>

                        {line.place && (
                            <span className="text-gray-500">{line.place}</span>
                        )}
                    </div>

                    <div className="text-[1.2rem] leading-12">{line.subtitle}</div>


                    {line.description && (
                        <div className="text-[1.05rem] space-y-3 leading-[1.1rem]">
                            {line.description.map((descriptionLine, index) => (
                            <p key={index}>{descriptionLine}</p>
                            ))}
                        </div>
                    )}


                    {line.stack && (
                        <ul className="flex gap-2 flex-wrap mt-4">
                            {line.stack.map((item, index) => (
                            <li
                                key={index}
                                className="border-gray-400 text-gray-400 border rounded-sm text-[0.7rem] uppercase px-[3px] py-px whitespace-nowrap"
                            >
                                {item}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
            </li>
        ))}
    </ul>
}
