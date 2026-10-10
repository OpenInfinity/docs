import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Generated from the docs collection, so it stays current as pages are added.
export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const root = new URL(base, site);
  // home first, then the sidebar order: start, guides, reference
  const SECTIONS = ["index", "start", "guides", "reference"];
  const rank = (id: string) => {
    const s = SECTIONS.indexOf(id.replace(/^en(\/|$)/, "").split("/")[0] || "index");
    return s === -1 ? SECTIONS.length : s;
  };
  const docs = (await getCollection("docs")).sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
  const url = (id: string) => new URL(id === "index" ? "" : `${id.replace(/\/index$/, "")}/`, root).href;
  const line = (d: (typeof docs)[number]) =>
    `- [${d.data.title}](${url(d.id)})${d.data.description ? `: ${d.data.description}` : ""}`;
  const isEn = (id: string) => id === "en" || id.startsWith("en/");
  const body = [
    "# OpenInfinity Docs",
    "",
    "> Guides and reference for OpenInfinity, a macOS-first workspace for AI agents, knowledge, automation and collaboration. The documentation is being written; Chinese is the default language and English pages live under /en/.",
    "",
    "OpenInfinity 的使用指南与参考资料（编写中）。默认中文，英文页面位于 /en/ 下。",
    "",
    "## 中文",
    "",
    ...docs.filter((d) => !isEn(d.id)).map(line),
    "",
    "## English",
    "",
    ...docs.filter((d) => isEn(d.id)).map(line),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
