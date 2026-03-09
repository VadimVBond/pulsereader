import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { runNewsPipeline } from '../../news/pipeline';
import { LOCALES, type Locale } from '../../i18n';

export function getStaticPaths() {
  return LOCALES.filter((locale) => locale !== 'ru').map((locale) => ({
    params: { lang: locale },
    props: { locale }
  }));
}

export async function GET(context: APIContext) {
  const locale = (context.props as { locale: Locale }).locale;

  const result = await runNewsPipeline({ limit: 80, locale });
  const prefix = `/${locale}`;

  return rss({
    title: `PulseReader RSS (${locale.toUpperCase()})`,
    description: 'Latest PulseReader aggregated articles',
    site: context.site ?? 'https://example.com',
    items: result.articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      pubDate: article.publishedAt,
      link: `${prefix}/article/${article.slug}`
    }))
  });
}
