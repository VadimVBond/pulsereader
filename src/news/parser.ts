import type { NewsSource } from './sources';

export interface ParsedFeedArticle {
  sourceId: string;
  sourceName: string;
  sourceCategory: string;
  title: string;
  summary: string;
  url: string;
  publishedAt?: Date;
  imageUrl?: string;
}

function decodeNumericEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

function decodeHtml(text: string): string {
  return decodeNumericEntities(
    text
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
  );
}

function stripHtml(text: string): string {
  return decodeHtml(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractAll(xml: string, tagName: string): string[] {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = re.exec(xml)) !== null) {
    matches.push(match[0]);
  }

  return matches;
}

function extractTag(block: string, tagName: string): string | undefined {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = block.match(re);
  return match?.[1]?.trim();
}

function extractAttr(block: string, tagName: string, attr: string): string | undefined {
  const re = new RegExp(`<${tagName}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, 'i');
  const match = block.match(re);
  return match?.[1]?.trim();
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseRssItem(itemBlock: string, source: NewsSource): ParsedFeedArticle | null {
  const title = stripHtml(extractTag(itemBlock, 'title') ?? '');
  const url = stripHtml(extractTag(itemBlock, 'link') ?? '');
  const summaryRaw =
    extractTag(itemBlock, 'description') ??
    extractTag(itemBlock, 'content:encoded') ??
    extractTag(itemBlock, 'content') ??
    '';
  const summary = stripHtml(summaryRaw);

  if (!title || !url) {
    return null;
  }

  const imageUrl =
    extractAttr(itemBlock, 'media:content', 'url') ??
    extractAttr(itemBlock, 'media:thumbnail', 'url') ??
    extractAttr(itemBlock, 'enclosure', 'url');

  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceCategory: source.category,
    title,
    summary,
    url,
    publishedAt: parseDate(extractTag(itemBlock, 'pubDate') ?? extractTag(itemBlock, 'dc:date')),
    imageUrl
  };
}

function parseAtomItem(entryBlock: string, source: NewsSource): ParsedFeedArticle | null {
  const title = stripHtml(extractTag(entryBlock, 'title') ?? '');
  const link =
    extractAttr(entryBlock, 'link', 'href') ??
    stripHtml(extractTag(entryBlock, 'link') ?? '');
  const summaryRaw = extractTag(entryBlock, 'summary') ?? extractTag(entryBlock, 'content') ?? '';
  const summary = stripHtml(summaryRaw);

  if (!title || !link) {
    return null;
  }

  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceCategory: source.category,
    title,
    summary,
    url: link,
    publishedAt: parseDate(extractTag(entryBlock, 'updated') ?? extractTag(entryBlock, 'published'))
  };
}

export function parseFeed(xml: string, source: NewsSource): ParsedFeedArticle[] {
  const rssItems = extractAll(xml, 'item').map((item) => parseRssItem(item, source));

  if (rssItems.length > 0) {
    return rssItems.filter((item): item is ParsedFeedArticle => Boolean(item));
  }

  const atomEntries = extractAll(xml, 'entry').map((entry) => parseAtomItem(entry, source));
  return atomEntries.filter((item): item is ParsedFeedArticle => Boolean(item));
}
