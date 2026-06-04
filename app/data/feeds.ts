// 引入你现有的文章获取函数。
import { getAllArticle } from "./getArticles";

// 站点 RSS 配置的数据结构。
// TypeScript interface 只是用来约束 config 的形状，运行时不会存在。
export interface FeedConfig {
    title: string; // RSS 频道标题
    description: string; // RSS 频道描述
    origin: string; // 网站根地址，必须是完整 URL，比如 https://example.com
    author: {
        name: string; // 作者名
        email: string; // 作者邮箱
        url?: string; // 作者主页，可选
    };
}

// 获取生成 feed 所需的所有数据。
// 这个函数把“文章数据”和“站点配置”打包在一起，方便 rss.xml、atom.xml、feed.json 复用。
export function getFeedData() {
    const posts = getAllArticle();

    // RSS 频道的基础配置。
    // 这里的 origin 非常重要，因为 RSS 里的链接应该是绝对地址。
    const config: FeedConfig = {
        title: "Areo",
        description: "Articles",
        origin: "https://Areo.com",
        author: {
            name: "Areo",
            email: "",
            url: "https://Areo.com",
        },
    };

    // 返回给 RSS 路由使用。
    return { posts, config };
}

// XML 转义函数。
// 因为 RSS 本质是 XML，如果标题里出现 &、<、> 这些字符，XML 会坏掉。
// 所以要把特殊字符转成 XML 安全写法。
export function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;") // & 变成 &amp;
        .replace(/</g, "&lt;") // < 变成 &lt;
        .replace(/>/g, "&gt;") // > 变成 &gt;
        .replace(/"/g, "&quot;") // " 变成 &quot;
        .replace(/'/g, "&apos;"); // ' 变成 &apos;
}