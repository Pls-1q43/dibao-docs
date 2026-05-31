import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.dibao.app",
  integrations: [
    starlight({
      title: "Dibao Docs",
      description: "Dibao self-hosted RSS recommendation reader documentation.",
      defaultLocale: "zh",
      locales: {
        zh: {
          label: "中文",
          lang: "zh-CN"
        },
        en: {
          label: "English",
          lang: "en-US"
        },
        ja: {
          label: "日本語",
          lang: "ja-JP"
        }
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Pls-1q43/Dibao"
        }
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { slug: "index" },
        { slug: "quick-install" },
        { slug: "providers" },
        { slug: "backup-upgrade" },
        {
          label: "插件",
          translations: {
            "en-US": "Plugins",
            "ja-JP": "プラグイン"
          },
          items: [{ slug: "plugins/installation" }, { slug: "plugins/development" }]
        },
        { slug: "license" },
        { slug: "release-notes" },
        {
          label: "开发者",
          translations: {
            "en-US": "Developers",
            "ja-JP": "開発者"
          },
          items: [{ slug: "developers" }, { slug: "reference" }]
        }
      ],
      editLink: {
        baseUrl: "https://github.com/Pls-1q43/dibao-docs/edit/main/"
      }
    })
  ]
});
