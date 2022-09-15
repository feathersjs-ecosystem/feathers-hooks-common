import { defineConfig } from "vitepress";

export default defineConfig({
  title: "feathers-hooks-common",
  lastUpdated: true,
  description: "",
  head: [["link", { rel: "icon", href: "/feathers-hooks-common-logo.png" }]],
  themeConfig: {
    siteTitle: "feathers-hooks-common",
    editLink: {
      pattern:
        "https://github.com/feathersjs-ecosystem/feathers-hooks-common/edit/master/docs/:path",
    },
    lastUpdatedText: "Last Updated",
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/feathersjs-ecosystem/feathers-hooks-common",
      },
    ],
    logo: "/feathers-hooks-common-logo.png",
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Overview", link: "/overview" },
          { text: "Hooks", link: "/hooks" },
          { text: "Utilities", link: "/utilities" },
          { text: "Migrating", link: "/migrating" },
          { text: "Guides", link: "/guides" },
        ],
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2016-present Feathers contributors",
    },
  },
});
