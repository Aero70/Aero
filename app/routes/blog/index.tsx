import { H1 } from "../../components/Typography";
import { TimelineDateSquare } from "../../components/DateSquare"
import { getAllArticle } from "../../data/getArticles";
import { Link } from "react-router";
import { createMeta } from "../../utils/Meta"

export const meta = () => {
  return createMeta({
    title : "Articles — Aero",
    description:
      "Just a quiet place to share code and ideas.",
    url: "https://Aero/blog",
  })
}

export default function Blog () {
    const articles = getAllArticle();
    return (
        <>
            <H1 id="blog" >Articles</H1>
            <div className="mt-12">
                <ol className="flex flex-col gap-12">
                    {
                    articles.map((post) => {
                        const date = new Date(post.date);
                        const slug = post.slug;
                        return (
                        <li key={slug} style={{ viewTransitionName: `blog-article-container-${slug}` }} className="flex gap-6">
                            <TimelineDateSquare 
                                style={{ viewTransitionName: `blog-article-date-${slug}` }}
                                date={{
                                    year:date.getUTCFullYear(),
                                    month:date.getUTCMonth(),
                                    day:date.getUTCDate(),
                                }}
                            />
                            <div className="flex flex-col text-lg gap-4 text-[1rem] leading-[1.4rem]">
                            <h2 className="text-[2rem] lg:text-[2.2rem] leading-[2.1rem] mt-1">
                                <Link 
                                    to={slug} 
                                    style={{ viewTransitionName: `blog-article-title-${slug}` }} 
                                    viewTransition
                                >
                                    {post.title}
                                </Link>
                            </h2>
                            {post.description}
                            </div>
                        </li>
                        )
                    })
                    }
                </ol>
            </div>
        </>
    )
}