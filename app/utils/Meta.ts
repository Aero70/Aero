import type { MetaDescriptor } from "react-router";

type CreateMetaProps = {
    title: string;
    description?: string;
    url?: string;
    image?: string;
};

const DEFAULT_META = {
    siteName : "Aero",
    description : "Aero.io"
};

export function createMeta({
  title,
  description = DEFAULT_META.description,
  url,
  image,
}: CreateMetaProps): MetaDescriptor[] {

  return [
    { title },
    { name: "description",content: description },
    /**
     * Open Graph 标题
     *
     * 用于：
     * 微信分享
     * Discord
     * Twitter
     * Facebook
     *
     * 等社交平台卡片
     */
    { property: "og:title", content: title},
    { property: "og:url", content: url},
    { property: "og:description",content: description },
    /**
     * 条件添加 og:image
     *
     * ...(数组)
     * 是展开运算符
     *
     * 如果 image 存在：
     * 返回数组
     *
     * 如果不存在：
     * 返回空数组
     */
    ...(image
      ? [
          {
            property: "og:image",
            content: image,
          },
        ]
      : []),
  ];
}