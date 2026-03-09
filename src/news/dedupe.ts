export interface DedupeCandidate {
  slug: string;
  title: string;
  url: string;
  publishedAt?: Date;
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'].forEach((param) => {
      url.searchParams.delete(param);
    });

    url.hash = '';
    return `${url.origin}${url.pathname}${url.search}`.toLowerCase();
  } catch {
    return rawUrl.toLowerCase().trim();
  }
}

function makeKey(article: DedupeCandidate): string {
  const normalizedUrl = normalizeUrl(article.url);
  if (normalizedUrl) {
    return `url:${normalizedUrl}`;
  }

  return `title:${normalizeText(article.title)}`;
}

function isBetter(next: DedupeCandidate, prev: DedupeCandidate): boolean {
  const nextTime = next.publishedAt?.getTime() ?? 0;
  const prevTime = prev.publishedAt?.getTime() ?? 0;
  return nextTime > prevTime;
}

export function dedupeArticles<T extends DedupeCandidate>(articles: T[]): T[] {
  const unique = new Map<string, T>();

  for (const article of articles) {
    const key = makeKey(article);
    const existing = unique.get(key);

    if (!existing || isBetter(article, existing)) {
      unique.set(key, article);
    }
  }

  return [...unique.values()];
}
