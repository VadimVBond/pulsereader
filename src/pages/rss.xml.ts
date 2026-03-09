import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { runNewsPipeline } from '../news/pipeline';

export async function GET(context: APIContext) {
  const result = await runNewsPipeline({ limit: 80 });

  return rss({
    title: 'PulseReader RSS',
    description: 'Latest PulseReader aggregated articles',
    site: context.site ?? 'https://example.com',
    items: result.articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      pubDate: article.publishedAt,
      link: `/article/${article.slug}`
    }))
  });
}
