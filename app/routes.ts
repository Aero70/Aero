import { 
    type RouteConfig,
    index,
    route 
} 
from "@react-router/dev/routes";

export default [
    index("./routes/hello/index.tsx"),
    route("blog","./routes/blog/index.tsx"),
    route("blog/:slug","./routes/blog/article.tsx"),
    route("games","./routes/games/index.tsx"),
    route("cv","./routes/cv/index.tsx"),
    route("rss.xml", "./routes/rss.xml.tsx"),
    // route("game","routes/game/index.tsx"),
] satisfies RouteConfig;
