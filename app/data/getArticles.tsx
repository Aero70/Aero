export type ArticleType = {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: any;
    published?: boolean;
};

let articles:ArticleType[] = [];

export function getAllArticle () {
    // 有缓存直接返回;
    if(articles.length){
        return articles;
    }
    
    // 没有缓存 -> 获取文章
    articles = Object.values(
        import.meta.glob('./articles/**/article.mdx',{eager:true})
    ).map<ArticleType>((item:any) =>({
        ...item.frontmatter,
        content : item.default,
    }))
    .filter((item) => item.published !== false) // 只显示发布的文章
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 文章排序

    return articles;
}

export function getArticle(slug: string) {
    const articles = getAllArticle();
    const article = articles.find(a => a.slug === slug);

    if (!article) {
        throw new Error("Article not found");
    }

    return article;
}