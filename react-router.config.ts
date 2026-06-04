import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import type { Config } from "@react-router/dev/config";

const projectRoot = dirname(fileURLToPath(import.meta.url));

function getArticlePrerenderPaths() {
  const articlesDir = join(projectRoot, "app", "data", "articles");

  if (!existsSync(articlesDir)) {
    return [];
  }

  return readdirSync(articlesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const articlePath = join(articlesDir, entry.name, "article.mdx");

      if (!existsSync(articlePath)) {
        return [];
      }

      const { data } = matter(readFileSync(articlePath, "utf8"));

      if (data.published === false || !data.slug) {
        return [];
      }

      return [`/blog/${data.slug}`];
    });
}

export default {
  ssr: false,

  async prerender() {
    return ["/", "/blog", "/cv", "/rss.xml", ...getArticlePrerenderPaths()];
  },
} satisfies Config;
