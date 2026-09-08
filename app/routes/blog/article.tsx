import { useParams } from "react-router";

import { getArticle } from "../../data/getArticles";
import { Link } from "react-router";
import { createMeta } from "../../utils/Meta"
import { TimelineDateSquare } from "../../components/DateSquare"
import type { MDXProvider } from "@mdx-js/react";

export const meta = () => {
  return createMeta({
    title : "Articles — Aero",
    description:
      "Just a quiet place to share code and ideas.",
    url: "https://Aero/blog",
  })
}

export default function BlogIndex () {
    const params = useParams();
    const article = getArticle(params.slug!);
    
    const { slug } = article;
    const date = new Date(article.date);

    const Article: typeof MDXProvider = article.content;

    return (
        <>
            <h1
                className={`text-[1.2rem] sm:text-[1.6rem] tracking-wide font-light`}
            >
                <Link to="/blog" viewTransition>
                    <span 
                        style={{ viewTransitionName: "hero-title-blog" }}
                        className="[view-transition-class:herotitle]"
                    >Articles /</span>
                </Link>
            </h1>
            
            <div style={{ viewTransitionName: `blog-article-container-${slug}` }}>
                <div className="flex gap-3 lg:gap-6 mb-10">
                    <TimelineDateSquare 
                        style={{ viewTransitionName: `blog-article-date-${slug}` }}
                        date={{
                            year:date.getUTCFullYear(),
                            month:date.getUTCMonth(),
                            day:date.getUTCDate(),
                        }}
                    />
                    <h1 className="text-[3.2rem] leading-[3.2rem] sm:text-[4rem] sm:leading-[4rem] lg:text-[5rem] lg:leading-[4.5rem] md:text-[4rem] md:leading-[3.9rem] tracking-wide font-bold mt-[3px]">
                        <span style={{ viewTransitionName: `blog-article-title-${slug}` }}
                            className="[view-transition-class:article-title]">
                            { article.title }
                        </span>
                    </h1>
                </div>
                
                <div className="space-y-8 text-[16px] " >
                    <Article
                        components={(() => {
                        const slugify = (text: string) =>
                            text
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-");

                        const extractText = (node: any): string => {
                            if (node == null) return "";
                            if (typeof node === "string" || typeof node === "number")
                            return String(node);
                            if (Array.isArray(node)) return node.map(extractText).join("");
                            if (node.props && node.props.children)
                            return extractText(node.props.children);
                            return "";
                        };

                        const withId = (children: any) => slugify(extractText(children));

                        return {
                            h1: ({ children }: { children: any }) => {
                            const id = withId(children);
                            return (
                                <h1
                                id={id}
                                className="group scroll-mt-36 relative text-[36px] sm:text-[40px] leading-[38px] mt-[180px] font-bold font-sans"
                                >
                                <a
                                    href={`#${id}`}
                                    className="absolute -left-8 top-0 opacity-0 group-hover:opacity-70 transition focus:opacity-100"
                                    aria-label="Permalink"
                                >
                                    #
                                </a>
                                {children}
                                </h1>
                            );
                            },
                            h2: ({ children }: { children: any }) => {
                            const id = withId(children);
                            return (
                                <h2
                                id={id}
                                className="group scroll-mt-30 relative text-[27px] leading-[28px] mt-[100px] font-bold font-sans"
                                >
                                <a
                                    href={`#${id}`}
                                    className="absolute -left-7 top-0 opacity-0 group-hover:opacity-70 transition focus:opacity-100"
                                    aria-label="Permalink"
                                >
                                    #
                                </a>
                                {children}
                                </h2>
                            );
                            },
                            h3: ({ children }: { children: any }) => (
                            <h3 className="text-[24px] leading-[26px] mt-[40px] font-semibold font-sans">
                                {children}
                            </h3>
                            ),
                            p: ({ children }: { children: any }) => (
                            <p className="text-left sm:text-justify">{children}</p>
                            ),
                            ul: ({ children }: { children: any }) => (
                            <ul className="list-disc pl-6 space-y-3">{children}</ul>
                            ),
                            li: ({ children }: { children: any }) => (
                            <li className="text-left">{children}</li>
                            ),
                            pre: ({ children }: { children: any }) => {
                            const isCodeBlock = (children as any).type === "code";
                            if (isCodeBlock) {
                                return (
                                <pre className="bg-gray-900/85 dark:bg-gray-800/70 rounded-md py-4 overflow-x-auto font-mono text-[13px]">
                                    {children}
                                </pre>
                                );
                            }
                            return <pre>{children}</pre>;
                            },
                            blockquote: ({ children }: { children: any }) => (
                            <blockquote className="border-l-4 py-4 border-gray-300 dark:border-gray-600 pl-5 italic text-gray-700 dark:text-gray-300">
                                {children}
                            </blockquote>
                            ),
                        };
                        })()}
                    />
                </div>
            </div>
        </>
    )
}