import type { Locale } from '../i18n';
import { dedupeArticles } from './dedupe';
import { fetchFeeds } from './fetcher';
import {
  resolveArticleImageForSource,
  type MissingImageReason
} from './image';
import { parseFeed } from './parser';
import { getNewsSources, type NewsSource } from './sources';

export interface PipelineArticle {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  url: string;
  sourceId: string;
  sourceName: string;
  sourceCategory: string;
  publishedAt?: Date;
  imageUrl?: string;
  imageUnavailableReason?: MissingImageReason;
}

export type ImageIssueCounters = Record<MissingImageReason, number>;

export interface PipelineResult {
  articles: PipelineArticle[];
  sources: NewsSource[];
  totalFetched: number;
  totalParsed: number;
  totalNormalized: number;
  totalFilteredOut: number;
  totalDuplicatesRemoved: number;
  totalDeduped: number;
  totalUnique: number;
  errors: Array<{ sourceId: string; error: string }>;
  imageIssuesBySource: Record<string, ImageIssueCounters>;
}

export interface PipelineOptions {
  sourceIds?: string[];
  limit?: number;
  timeoutMs?: number;
  locale?: Locale;
}

interface PipelineCacheEntry {
  expiresAt: number;
  result: PipelineResult;
}

const PIPELINE_CACHE_TTL_MS = 5 * 60 * 1000;
const PIPELINE_CACHE_MAX_ENTRIES = 40;
const pipelineCache = new Map<string, PipelineCacheEntry>();

function buildPipelineCacheKey(options: PipelineOptions): string {
  const locale = options.locale ?? 'ru';
  const limit = options.limit ?? 60;
  const timeoutMs = options.timeoutMs ?? 9000;
  const ids = [...(options.sourceIds ?? [])].sort().join(',');

  return `${locale}|${limit}|${timeoutMs}|${ids}`;
}

function clonePipelineResult(input: PipelineResult): PipelineResult {
  return {
    ...input,
    articles: input.articles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined
    })),
    sources: input.sources.map((source) => ({
      ...source,
      feedUrls: source.feedUrls ? [...source.feedUrls] : undefined
    })),
    errors: input.errors.map((error) => ({ ...error })),
    imageIssuesBySource: Object.fromEntries(
      Object.entries(input.imageIssuesBySource).map(([sourceId, counters]) => [sourceId, { ...counters }])
    )
  };
}

function getCachedPipelineResult(cacheKey: string): PipelineResult | null {
  const cached = pipelineCache.get(cacheKey);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    pipelineCache.delete(cacheKey);
    return null;
  }

  return clonePipelineResult(cached.result);
}

function setCachedPipelineResult(cacheKey: string, result: PipelineResult): void {
  pipelineCache.set(cacheKey, {
    expiresAt: Date.now() + PIPELINE_CACHE_TTL_MS,
    result: clonePipelineResult(result)
  });

  if (pipelineCache.size <= PIPELINE_CACHE_MAX_ENTRIES) {
    return;
  }

  for (const [key] of pipelineCache) {
    pipelineCache.delete(key);
    if (pipelineCache.size <= PIPELINE_CACHE_MAX_ENTRIES) {
      break;
    }
  }
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

function cleanupSummary(rawSummary: string): string {
  return rawSummary
    .replace(/(^|\s)Article\s+URL:\s*https?:\/\/\S+/gi, ' ')
    .replace(/\bhttps?:\/\/\S+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
  const cleaned = cleanupSummary(parsed.summary);
  const description = normalizeText(cleaned, 2400);
  const excerpt = normalizeText(description, 180);
  const hasImage = Boolean(parsed.imageUrl);

  if (isLowQuality(title, excerpt, hasImage)) {
    return null;
  }

  const fallbackText = 'Summary is unavailable in this RSS feed.';

  return {
    slug: slugify(title, parsed.url),
    title,
    excerpt: excerpt || fallbackText,
    description: description || fallbackText,
    url: parsed.url,
    sourceId: parsed.sourceId,
    sourceName: parsed.sourceName,
    sourceCategory: parsed.sourceCategory,
    publishedAt: parsed.publishedAt,
    imageUrl: parsed.imageUrl
  };
}

function emptyImageIssueCounters(): ImageIssueCounters {
  return {
    no_media_tag: 0,
    blocked_hotlink: 0,
    no_og_image: 0,
    timeout: 0
  };
}

function initImageIssuesBySource(sources: NewsSource[]): Record<string, ImageIssueCounters> {
  const map: Record<string, ImageIssueCounters> = {};

  for (const source of sources) {
    map[source.id] = emptyImageIssueCounters();
  }

  return map;
}

function collectImageIssue(
  imageIssuesBySource: Record<string, ImageIssueCounters>,
  sourceId: string,
  reason: MissingImageReason | undefined
): void {
  if (!reason) return;

  if (!imageIssuesBySource[sourceId]) {
    imageIssuesBySource[sourceId] = emptyImageIssueCounters();
  }

  imageIssuesBySource[sourceId][reason] += 1;
}

async function enrichImages(
  articles: PipelineArticle[],
  maxCount: number,
  imageIssuesBySource: Record<string, ImageIssueCounters>
): Promise<void> {
  const targets = articles.slice(0, maxCount);

  await Promise.all(
    targets.map(async (article) => {
      const resolved = await resolveArticleImageForSource(article.sourceId, article.url, article.imageUrl);

      article.imageUrl = resolved.imageUrl;
      article.imageUnavailableReason = resolved.reason;
      collectImageIssue(imageIssuesBySource, article.sourceId, resolved.reason);
    })
  );

  for (const article of articles.slice(maxCount)) {
    if (!article.imageUrl) {
      article.imageUnavailableReason = 'no_media_tag';
      collectImageIssue(imageIssuesBySource, article.sourceId, article.imageUnavailableReason);
    }
  }
}

function logImageIssues(imageIssuesBySource: Record<string, ImageIssueCounters>): void {
  const lines = Object.entries(imageIssuesBySource)
    .map(([sourceId, counters]) => {
      const total =
        counters.no_media_tag +
        counters.blocked_hotlink +
        counters.no_og_image +
        counters.timeout;

      if (total === 0) return '';

      return `${sourceId}: no_media_tag=${counters.no_media_tag}, blocked_hotlink=${counters.blocked_hotlink}, no_og_image=${counters.no_og_image}, timeout=${counters.timeout}`;
    })
    .filter(Boolean);

  if (lines.length > 0) {
    console.info(`[PulseReader:image] ${lines.join(' | ')}`);
  }
}

export async function runNewsPipeline(options: PipelineOptions = {}): Promise<PipelineResult> {
  const cacheKey = buildPipelineCacheKey(options);
  const cached = getCachedPipelineResult(cacheKey);

  if (cached) {
    return cached;
  }

  const locale = options.locale ?? 'ru';
  const selectedSources = getNewsSources(options.sourceIds, locale);
  const feedResults = await fetchFeeds(selectedSources, {
    timeoutMs: options.timeoutMs
  });

  const errors: PipelineResult['errors'] = [];
  let totalParsed = 0;
  const normalizedArticles: PipelineArticle[] = [];

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
        normalizedArticles.push(normalized);
      }
    }
  }

  const dedupedAll = dedupeArticles(normalizedArticles).sort(
    (a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
  );

  const imageIssuesBySource = initImageIssuesBySource(selectedSources);

  const limit = options.limit ?? 60;
  const maxImageEnrichment = Math.min(32, Math.max(10, limit));
  await enrichImages(dedupedAll, maxImageEnrichment, imageIssuesBySource);

  const articles = dedupedAll.slice(0, limit);

  const totalNormalized = normalizedArticles.length;
  const totalFilteredOut = Math.max(0, totalParsed - totalNormalized);
  const totalDuplicatesRemoved = Math.max(0, totalNormalized - dedupedAll.length);
  const totalDeduped = dedupedAll.length;

  logImageIssues(imageIssuesBySource);

  const result: PipelineResult = {
    articles,
    sources: selectedSources,
    totalFetched: feedResults.length,
    totalParsed,
    totalNormalized,
    totalFilteredOut,
    totalDuplicatesRemoved,
    totalDeduped,
    totalUnique: articles.length,
    errors,
    imageIssuesBySource
  };

  setCachedPipelineResult(cacheKey, result);
  return clonePipelineResult(result);
}

export async function getNewsArticles(options: PipelineOptions = {}): Promise<PipelineArticle[]> {
  const result = await runNewsPipeline(options);
  return result.articles;
}
