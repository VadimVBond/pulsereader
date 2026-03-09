export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'bbc-world',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'World'
  },
  {
    id: 'reuters-world',
    name: 'Reuters World',
    url: 'https://feeds.reuters.com/Reuters/worldNews',
    category: 'World'
  },
  {
    id: 'nyt-world',
    name: 'NYT World',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    category: 'World'
  },
  {
    id: 'hn-frontpage',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'Technology'
  }
];

export function getNewsSources(selectedIds?: string[]): NewsSource[] {
  if (!selectedIds || selectedIds.length === 0) {
    return NEWS_SOURCES;
  }

  const selected = new Set(selectedIds);
  return NEWS_SOURCES.filter((source) => selected.has(source.id));
}
