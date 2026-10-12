import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// SITE_URL / BASE_PATH come from actions/configure-pages in CI, so the same build works at
// openinfinity.github.io/docs/ (before the custom domain) and at docs.open-infinity.com.
// configure-pages reports http:// until HTTPS is enforced; the sites are always served over https
const site = (process.env.SITE_URL || "https://docs.open-infinity.com").replace(/^http:/, "https:");
const base = process.env.BASE_PATH || "/";
const withBase = (path) => `${base.replace(/\/$/, "")}/${path}`;

// English lives at the root and Chinese under /zh/ (x-default is English).
// Arriving from outside the site: show Chinese to Chinese-language systems and English to everyone else.
// Moving within the site (including the language menu) counts as a choice and is remembered.
// Crawlers and headless renderers are never redirected, so both language versions stay indexable (hreflang links them).
const languageRedirect = `(function () {
  try {
    if (/bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(navigator.userAgent)) return;
    var KEY = "oi-docs-lang";
    var root = ${JSON.stringify(base.replace(/\/$/, ""))};
    var rest = location.pathname.slice(root.length) || "/";
    var here = rest === "/zh" || rest.indexOf("/zh/") === 0 ? "zh" : "en";
    var internal = false;
    try { internal = !!document.referrer && new URL(document.referrer).host === location.host; } catch (e) {}
    if (internal) { localStorage.setItem(KEY, here); return; }
    var want = localStorage.getItem(KEY);
    if (want !== "zh" && want !== "en") {
      var n = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
      want = n.indexOf("zh") === 0 ? "zh" : "en";
    }
    if (want === here) return;
    var target = want === "zh" ? "/zh" + rest : rest === "/zh" ? "/" : rest.slice(3);
    location.replace(root + target + location.search + location.hash);
  } catch (e) {}
})();`;

export default defineConfig({
  site,
  base,
  // English used to live under /en/ (2026-10-11 to 2026-10-12); keep those addresses working
  redirects: {
    "/en": "/",
    "/en/start/introduction": "/start/introduction/",
    "/en/guides/overview": "/guides/overview/",
    "/en/reference/overview": "/reference/overview/",
  },
  integrations: [
    starlight({
      title: { en: "OpenInfinity Docs", "zh-CN": "OpenInfinity 文档" },
      description: "Guides and reference for OpenInfinity. OpenInfinity 的使用指南与参考资料。",
      logo: { light: "./src/assets/logo-black.svg", dark: "./src/assets/logo-white.svg", replacesTitle: true },
      favicon: "/favicon.svg",
      head: [
        { tag: "link", attrs: { rel: "icon", href: withBase("favicon.ico"), sizes: "48x48" } },
        { tag: "link", attrs: { rel: "apple-touch-icon", href: withBase("apple-touch-icon.png") } },
        { tag: "meta", attrs: { property: "og:image", content: new URL(withBase("og.png"), site).href } },
        { tag: "script", content: languageRedirect },
      ],
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        zh: { label: "简体中文", lang: "zh-CN" },
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/OpenInfinity" },
      ],
      editLink: { baseUrl: "https://github.com/OpenInfinity/docs/edit/main/" },
      lastUpdated: true,
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "Getting started", translations: { "zh-CN": "开始" }, items: [{ autogenerate: { directory: "start" } }] },
        { label: "Guides", translations: { "zh-CN": "指南" }, items: [{ autogenerate: { directory: "guides" } }] },
        { label: "Reference", translations: { "zh-CN": "参考" }, items: [{ autogenerate: { directory: "reference" } }] },
      ],
    }),
  ],
});
