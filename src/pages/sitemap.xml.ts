import type { APIRoute } from 'astro';
import { runNewsPipeline } from '../news/pipeline';
import { LOCALES, localePrefix } from '../i18n';
import { getNewsSources } from '../news/sources';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://example.com')).toString().replace(/\/$/, '');
  const locales = LOCALES;

  const staticUrls = locales.map((locale) => `${base}${localePrefix(locale) || ''}/`);
  const rssUrls = locales.map((locale) => `${base}${localePrefix(locale) || ''}/rss.xml`);

  const sourceUrls = locales.flatMap((locale) =>
    getNewsSources(undefined, locale).map((source) => `${base}${localePrefix(locale)}/source/${source.id}`)
  );

  const articleUrls: string[] = [];
  for (const locale of locales) {
    const result = await runNewsPipeline({ limit: 150, locale });
    for (const article of result.articles) {
      articleUrls.push(`${base}${localePrefix(locale)}/article/${article.slug}`);
    }
  }

  const allUrls = [...new Set([...staticUrls, ...rssUrls, ...sourceUrls, ...articleUrls])];
  const items = allUrls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
