import rss from '@astrojs/rss';
import { r as runNewsPipeline } from '../../chunks/pipeline_C7DKexp8.mjs';
import { L as LOCALES } from '../../chunks/i18n_BRKz8T47.mjs';
export { renderers } from '../../renderers.mjs';

function getStaticPaths() {
  return LOCALES.filter((locale) => locale !== "ru").map((locale) => ({
    params: { lang: locale },
    props: { locale }
  }));
}
async function GET(context) {
  const locale = context.props.locale;
  const result = await runNewsPipeline({ limit: 80, locale });
  const prefix = `/${locale}`;
  return rss({
    title: `PulseReader RSS (${locale.toUpperCase()})`,
    description: "Latest PulseReader aggregated articles",
    site: context.site ?? "https://example.com",
    items: result.articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      pubDate: article.publishedAt,
      link: `${prefix}/article/${article.slug}`
    }))
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  getStaticPaths
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
