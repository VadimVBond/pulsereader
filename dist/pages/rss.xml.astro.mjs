import rss from '@astrojs/rss';
import { r as runNewsPipeline } from '../chunks/pipeline_C7DKexp8.mjs';
export { renderers } from '../renderers.mjs';

async function GET(context) {
  const result = await runNewsPipeline({ limit: 80 });
  return rss({
    title: "PulseReader RSS",
    description: "Latest PulseReader aggregated articles",
    site: context.site ?? "https://example.com",
    items: result.articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      pubDate: article.publishedAt,
      link: `/article/${article.slug}`
    }))
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
