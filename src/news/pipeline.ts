import { dedupeArticles } from './dedupe';
import { fetchFeeds } from './fetcher';
import { parseFeed } from './parser';
import { getNewsSources, type NewsSource } from './sources';

export interface PipelineArticle {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  sourceId: string;
  sourceName: string;
  sourceCategory: string;
  publishedAt?: Date;
  imageUrl?: string;
}

export interface PipelineResult {
  articles: PipelineArticle[];
  sources: NewsSource[];
  totalFetched: number;
  totalParsed: number;
  totalUnique: number;
  errors: Array<{ sourceId: string; error: string }>;
}

export interface PipelineOptions {
  sourceIds?: string[];
  limit?: number;
  timeoutMs?: number;
}

function shortHash(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function slugify(title: string, url: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 72);

  return `${base || 'article'}-${shortHash(url)}`;
}

function normalizeText(value: string, maxLen: number): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1)}…`;
}

function isLowQuality(title: string, excerpt: string, hasImage: boolean): boolean {
  const normalizedTitle = title.toLowerCase();
  const genericTitle =
    normalizedTitle === "here's the latest." ||
    normalizedTitle === "here's the latest" ||
    normalizedTitle === 'latest updates';

  const poorExcerpt = excerpt.length < 30;

  return (genericTitle && poorExcerpt) || (!hasImage && poorExcerpt);
}

function toPipelineArticle(parsed: ReturnType<typeof parseFeed>[number]): PipelineArticle | null {
  const title = normalizeText(parsed.title, 120);
  const excerpt = normalizeText(parsed.summary, 180);
  const hasImage = Boolean(parsed.imageUrl);

  if (isLowQuality(title, excerpt, hasImage)) {
    return null;
  }

  return {
    slug: slugify(title, parsed.url),
    title,
    excerpt: excerpt || 'Summary is unavailable in this RSS feed.',
    url: parsed.url,
    sourceId: parsed.sourceId,
    sourceName: parsed.sourceName,
    sourceCategory: parsed.sourceCategory,
    publishedAt: parsed.publishedAt,
    imageUrl: parsed.imageUrl
  };
}

export async function runNewsPipeline(options: PipelineOptions = {}): Promise<PipelineResult> {
  const selectedSources = getNewsSources(options.sourceIds);
  const feedResults = await fetchFeeds(selectedSources, {
    timeoutMs: options.timeoutMs
  });

  const errors: PipelineResult['errors'] = [];
  let totalParsed = 0;
  const parsedArticles: PipelineArticle[] = [];

  for (const feed of feedResults) {
    if (!feed.ok) {
      errors.push({
        sourceId: feed.source.id,
        error: feed.error
      });
      continue;
    }

    const parsed = parseFeed(feed.xml, feed.source);
    totalParsed += parsed.length;

    for (const article of parsed) {
      const normalized = toPipelineArticle(article);
      if (normalized) {
        parsedArticles.push(normalized);
      }
    }
  }

  const deduped = dedupeArticles(parsedArticles)
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .slice(0, options.limit ?? 60);

  return {
    articles: deduped,
    sources: selectedSources,
    totalFetched: feedResults.length,
    totalParsed,
    totalUnique: deduped.length,
    errors
  };
}

export async function getNewsArticles(options: PipelineOptions = {}): Promise<PipelineArticle[]> {
  const result = await runNewsPipeline(options);
  return result.articles;
}
