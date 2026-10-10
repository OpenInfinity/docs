import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// SITE_URL / BASE_PATH come from actions/configure-pages in CI, so the same build works at
// openinfinity.github.io/docs/ (before the custom domain) and at docs.open-infinity.com.
// configure-pages reports http:// until HTTPS is enforced; the sites are always served over https
const site = (process.env.SITE_URL || "https://docs.open-infinity.com").replace(/^http:/, "https:");
const base = process.env.BASE_PATH || "/";
const withBase = (path) => `${base.replace(/\/$/, "")}/${path}`;

// Arriving from outside the site: show Chinese to Chinese-language systems and English to everyone else.
// Moving within the site (including the language menu) counts as a choice and is remembered.
// Crawlers are never redirected, so both language versions stay indexable (hreflang links them).
const languageRedirect = `(function () {
  try {
    if (/bot|crawl|spider|slurp|preview|lighthouse/i.test(navigator.userAgent)) return;
    var KEY = "oi-docs-lang";
    var root = ${JSON.stringify(base.replace(/\/$/, ""))};
    var rest = location.pathname.slice(root.length) || "/";
    var here = rest === "/en" || rest.indexOf("/en/") === 0 ? "en" : "zh";
    var internal = false;
    try { internal = !!document.referrer && new URL(document.referrer).host === location.host; } catch (e) {}
    if (internal) { localStorage.setItem(KEY, here); return; }
    var want = localStorage.getItem(KEY);
    if (want !== "zh" && want !== "en") {
      var n = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
      want = n.indexOf("zh") === 0 ? "zh" : "en";
    }
    if (want === here) return;
    var target = want === "en" ? "/en" + rest : rest === "/en" ? "/" : rest.slice(3);
    location.replace(root + target + location.search + location.hash);
  } catch (e) {}
})();`;

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: { "zh-CN": "OpenInfinity 文档", en: "OpenInfinity Docs" },
      description: "OpenInfinity 的使用指南与参考资料。Guides and reference for OpenInfinity.",
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
        root: { label: "简体中文", lang: "zh-CN" },
        en: { label: "English", lang: "en" },
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/OpenInfinity" },
      ],
      editLink: { baseUrl: "https://github.com/OpenInfinity/docs/edit/main/" },
      lastUpdated: true,
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "开始", translations: { en: "Getting started" }, items: [{ autogenerate: { directory: "start" } }] },
        { label: "指南", translations: { en: "Guides" }, items: [{ autogenerate: { directory: "guides" } }] },
        { label: "参考", translations: { en: "Reference" }, items: [{ autogenerate: { directory: "reference" } }] },
      ],
    }),
  ],
});
