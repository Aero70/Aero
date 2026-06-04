/**
 * Remove left padding on multiline-text
 */
export const paddedText = ([text]: TemplateStringsArray) =>
  text
    .replace(/^\n/, "")
    .replace(/\n\s+$/, "")
    .replace(/^\s+\|/gm, "");

export const CV_DATA = {
  work: [
    {
      date: { from: { month: 7, year: 2025 }, to: { month: 6, year: 2026 } },
      title: "森尔商贸",
      place: "广州",
      subtitle: "平面设计",
      description: [
        "负责跨境电商平台定制订单处理及生产流程跟进,根据客户需求完成图片处理及打印文件制作",
        "使用 Photoshop 完成定制内容排版、图片优化及 TIFF/PDF 生产文件输出",
        "参与 ERP 系统日常使用与流程优化,分析业务场景中的效率问题",
        "使用 JavaScript 开发 Tampermonkey 插件,对 ERP 页面进行功能增强、快捷操作及自动化流程优化",
        "协助订单生产、数据维护及异常问题处理,保障业务流程顺利运行",
      ],
      stack: [
        "JavaScript",
        "Photoshop",
        "Tampermonkey",
      ],
    },
    {
      date: { from: { month: 10, year: 2024 }, to: { month: 5, year: 2025 } },
      title: "微雪电子",
      place: "深圳",
      subtitle: "网站编辑",
      description: [
        "负责公司官网及产品展示页面开发与维护，根据设计稿完成页面实现及样式优化",
        "配合产品、运营及工程团队完成网站内容更新、文档维护及功能优化工作",
        "根据文档完成前后端联调，处理页面数据展示及交互逻辑开发",
        "使用 Photoshop 完善产品详情图、展示图及运营素材的设计优化与制作",
      ],
      stack: [
        "JavaScript",
        "Photoshop",
        "php",
      ],
    },
    {
      date: { from: { month: 6, year: 2021 }, to: { month: 8, year: 2024 } },
      title: "极米科技",
      place: "韶关",
      subtitle: "软件开发",
      description: [
        "负责 UniApp 项目 Web/App/小程序多端开发，完成页面实现、组件封装及前后端联调",
        "使用 ThinkPHP6 + MySQL 开发业务接口及后台功能,实现 CRUD、支付接口及核心业务逻辑开发",
        "基于 Workerman 开发实时聊天功能,支持一对一、一对多消息通信",
        "负责第三方数据对接,使用 Redis 队列进行数据处理与性能优化",
      ],
      stack: [
        "Vue.js",
        "Uniapp",
        "thinkphp",
        "MySql",
        "Node.JS",
      ],
    },
  ],
};
