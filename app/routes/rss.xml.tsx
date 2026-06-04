// LoaderFunctionArgs 是 React Router 提供的 loader 参数类型。
import type { LoaderFunctionArgs } from "react-router";

// 引入 feed 数据函数和 XML 转义函数。
// getFeedData 负责拿文章和站点配置。
// escapeXml 负责防止 XML 被特殊字符破坏。
import { escapeXml, getFeedData } from "../data/feeds";

// React Router 的 loader。
// 普通页面路由通常返回 JSX，但资源路由可以直接返回 Response。
// 这里访问 /rss.xml 时，React Router 会执行这个 loader。
export async function loader(_: LoaderFunctionArgs) {
    // 获取文章列表和站点配置。
    const { posts, config } = getFeedData();
     // 把每篇文章转换成 RSS 的 <item> 节点。
    const items = posts
        .filter((post:any) => post.published !== false)
        .map((post:any) => {
            const link = `${config.origin}/blog/${post.slug}`;
            const title = escapeXml(post.title);
            // 如果 description 可能为空，用 ?? "" 防止报错。
            const description = escapeXml(post.description ?? "");
            const pubDate = new Date(post.date).toUTCString();
            // 返回单篇文章的 RSS item。
            // guid 是文章唯一标识，这里直接用文章链接。
            return `
                <item>
                    <title>${title}</title>
                    <link>${link}</link>
                    <guid>${link}</guid>
                    <pubDate>${pubDate}</pubDate>
                    <description>${description}</description>
                </item>`;
            })
        .join("\n");


    // RSS XML。
    // rss version="2.0" 表示这是 RSS 2.0 格式。
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
            <channel>
                <title>${escapeXml(config.title)}</title>
                <link>${config.origin}</link>
                <description>${escapeXml(config.description)}</description>
                <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            ${items}
            </channel>
        </rss>`;

    // 返回 HTTP Response。
    // 直接返回 XML 文本。
    return new Response(xml, {
        headers: {
        // 告诉浏览器和 RSS 阅读器：这个响应是 RSS XML。
        "Content-Type": "application/rss+xml; charset=utf-8",

        // 缓存 300 秒，也就是 5 分钟。
        // 订阅器不需要每秒重新抓取。
        "Cache-Control": "public, max-age=300",
        },
    });
}
