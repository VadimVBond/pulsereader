import type { APIRoute } from 'astro';
import { runNewsPipeline } from '../news/pipeline';

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
  const pipeline = await runNewsPipeline({ limit: 300 });

  const staticUrls = [
    `${base}/`,
    `${base}/rss.xml`
  ];

  const articleUrls = pipeline.articles.map((article) => `${base}/article/${article.slug}`);
  const allUrls = [...staticUrls, ...articleUrls];

  const items = allUrls
    .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
