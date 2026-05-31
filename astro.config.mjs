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
        {
          label: "中文",
          autogenerate: { directory: "zh", collapsed: false }
        },
        {
          label: "English",
          autogenerate: { directory: "en", collapsed: false }
        },
        {
          label: "日本語",
          autogenerate: { directory: "ja", collapsed: false }
        }
      ],
      editLink: {
        baseUrl: "https://github.com/Pls-1q43/dibao-docs/edit/main/"
      }
    })
  ]
});
