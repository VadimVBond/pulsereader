import type { Locale } from '../i18n';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  locales: Locale[];
  feedUrls?: string[];
}

const KORRESPONDENT_RU_FEEDS = [
  'https://k.img.com.ua/rss/ru/all_news2.0.xml',
  'https://k.img.com.ua/rss/ru/ukraine.xml',
  'https://k.img.com.ua/rss/ru/world.xml'
];

const KORRESPONDENT_UK_FEEDS = [
  'https://k.img.com.ua/rss/ua/all_news2.0.xml',
  'https://k.img.com.ua/rss/ua/ukraine.xml',
  'https://k.img.com.ua/rss/ua/world.xml'
];

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'korrespondent',
    name: 'Korrespondent',
    url: KORRESPONDENT_RU_FEEDS[0],
    category: 'News',
    locales: ['uk', 'ru'],
    feedUrls: KORRESPONDENT_RU_FEEDS
  },
  {
    id: 'ukrainska-pravda',
    name: 'Ukrainska Pravda',
    url: 'https://www.pravda.com.ua/rss/',
    category: 'News',
    locales: ['uk', 'ru']
  },
  {
    id: 'bbc-ukrainian',
    name: 'BBC Ukrainian',
    url: 'https://feeds.bbci.co.uk/ukrainian/rss.xml',
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

  const localized = base.map((source) => {
    if (source.id !== 'korrespondent') return source;

    const feedUrls =
      locale === 'uk'
        ? [...KORRESPONDENT_UK_FEEDS, ...KORRESPONDENT_RU_FEEDS]
        : [...KORRESPONDENT_RU_FEEDS, ...KORRESPONDENT_UK_FEEDS];

    return {
      ...source,
      url: feedUrls[0],
      feedUrls
    };
  });

  if (!selectedIds || selectedIds.length === 0) {
    return localized;
  }

  const selected = new Set(selectedIds);
  return localized.filter((source) => selected.has(source.id));
}
