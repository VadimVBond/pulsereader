import type { Locale } from '../i18n';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  locales: Locale[];
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'korrespondent',
    name: 'Korrespondent',
    url: 'https://korrespondent.net/rss_subscription/',
    category: 'News',
    locales: ['uk', 'ru']
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Technology',
    locales: ['en', 'uk', 'ru']
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Technology',
    locales: ['en', 'uk', 'ru']
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Technology',
    locales: ['en', 'uk', 'ru']
  },
  {
    id: 'hacker-news',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'Technology',
    locales: ['en', 'uk', 'ru']
  },
  {
    id: 'github-blog',
    name: 'GitHub Blog',
    url: 'https://github.blog/feed/',
    category: 'Technology',
    locales: ['en', 'uk', 'ru']
  }
];

export function getNewsSources(selectedIds?: string[], locale: Locale = 'ru'): NewsSource[] {
  const base = NEWS_SOURCES.filter((source) => source.locales.includes(locale));

  if (base.length === 0) {
    return NEWS_SOURCES;
  }

  if (!selectedIds || selectedIds.length === 0) {
    return base;
  }

  const selected = new Set(selectedIds);
  return base.filter((source) => selected.has(source.id));
}
