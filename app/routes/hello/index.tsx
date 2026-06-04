import { H1 } from "../../components/Typography";
import { TimelineDateSquare } from "../../components/DateSquare";
import { getAllArticle } from "../../data/getArticles";
import { Link } from "react-router";
import { SocialLinks } from "../../components/SocialLinks"

function HELLO () {
    const articles = getAllArticle();
    
    return (  
    <>
      <H1 id="hello">Hello.</H1>
      <h2 className="text-[2rem] leading-6">I build Software & Design.</h2>
      <h2 className="text-neutral-500 mt-10">LATEST CONTENT</h2>

      <ol className="flex flex-col gap-12">
        {
          articles.map((post) => {
            const date = new Date(post.date);
            const slug = post.slug;
            return (
              <li key={slug} className="flex gap-6">
                <TimelineDateSquare date={{
                  year:date.getUTCFullYear(),
                  month:date.getUTCMonth(),
                  day:date.getUTCDate(),
                }} />
                
                <div className="flex flex-col text-lg gap-3 text-[.95rem] leading-[1.4rem]">
                  <h2 className="font-semibold text-4xl leading-8 mt-2">
                    <Link to={`/blog/${slug}`} viewTransition>{post.title}</Link>
                  </h2>
                  {post.description}
                </div>
              </li>
            )
          })
        }
      </ol>

      <h2 className="text-lg uppercase tracking-wider opacity-60 mt-10">
        Social
      </h2>
      <SocialLinks />
    </>
  )
}

export default HELLO;