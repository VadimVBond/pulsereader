import { g as getNewsSources, r as runNewsPipeline } from '../chunks/pipeline_C7DKexp8.mjs';
import { L as LOCALES, l as localePrefix } from '../chunks/i18n_BRKz8T47.mjs';
export { renderers } from '../renderers.mjs';

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const GET = async ({ site }) => {
  const base = (site ?? new URL("https://example.com")).toString().replace(/\/$/, "");
  const locales = LOCALES;
  const staticUrls = locales.map((locale) => `${base}${localePrefix(locale) || ""}/`);
  const rssUrls = locales.map((locale) => `${base}${localePrefix(locale) || ""}/rss.xml`);
  const sourceUrls = locales.flatMap(
    (locale) => getNewsSources(void 0, locale).map((source) => `${base}${localePrefix(locale)}/source/${source.id}`)
  );
  const articleUrls = [];
  for (const locale of locales) {
    const result = await runNewsPipeline({ limit: 150, locale });
    for (const article of result.articles) {
      articleUrls.push(`${base}${localePrefix(locale)}/article/${article.slug}`);
    }
  }
  const allUrls = [.../* @__PURE__ */ new Set([...staticUrls, ...rssUrls, ...sourceUrls, ...articleUrls])];
  const items = allUrls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
