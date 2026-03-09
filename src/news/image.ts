export interface ImageEnrichmentOptions {
  timeoutMs?: number;
}

export type MissingImageReason = 'no_media_tag' | 'blocked_hotlink' | 'no_og_image' | 'timeout';

export interface ImageResolutionResult {
  imageUrl?: string;
  reason?: MissingImageReason;
}

const OG_FIRST_SOURCES = new Set(['techcrunch', 'the-verge', 'github-blog']);
const DIRECT_FALLBACK_SOURCES = new Set(['hacker-news']);

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractMetaContent(html: string, attrName: string, attrValue: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+${attrName}=["']${attrValue}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+${attrName}=["']${attrValue}["'][^>]*>`,
    'i'
  );

  const match = html.match(re);
  return match?.[1] ?? match?.[2];
}

function extractImageFromHtml(html: string): string | undefined {
  return (
    extractMetaContent(html, 'property', 'og:image') ??
    extractMetaContent(html, 'name', 'og:image') ??
    extractMetaContent(html, 'name', 'twitter:image') ??
    extractMetaContent(html, 'property', 'twitter:image')
  );
}

function toAbsoluteUrl(rawUrl: string, pageUrl: string): string | undefined {
  try {
    return new URL(decodeHtmlEntities(rawUrl).trim(), pageUrl).toString();
  } catch {
    return undefined;
  }
}

function toProxyUrl(rawUrl: string): string {
  const clean = rawUrl.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=1200&h=630&fit=cover`;
}

async function fetchHtml(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchHtmlWithReason(
  url: string,
  timeoutMs: number
): Promise<{ html: string | null; reason?: MissingImageReason }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return { html: null, reason: 'no_og_image' };
    }

    return { html: await response.text() };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { html: null, reason: 'timeout' };
    }

    return { html: null, reason: 'no_og_image' };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function probeImageUrl(url: string, timeoutMs: number): Promise<MissingImageReason | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36'
      }
    });

    if (response.status === 401 || response.status === 403) {
      return 'blocked_hotlink';
    }

    return undefined;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'timeout';
    }

    return undefined;
  } finally {
    clearTimeout(timeoutId);
  }
}

const pageImageCache = new Map<string, ImageResolutionResult>();

export async function resolveArticleImage(
  articleUrl: string,
  existingImageUrl?: string,
  options: ImageEnrichmentOptions = {}
): Promise<string | undefined> {
  if (existingImageUrl) {
    return toProxyUrl(existingImageUrl);
  }

  const cached = pageImageCache.get(articleUrl);
  if (cached) {
    return cached.imageUrl;
  }

  const html = await fetchHtml(articleUrl, options.timeoutMs ?? 6000);
  if (!html) {
    pageImageCache.set(articleUrl, { reason: 'no_og_image' });
    return undefined;
  }

  const rawImage = extractImageFromHtml(html);
  if (!rawImage) {
    pageImageCache.set(articleUrl, { reason: 'no_og_image' });
    return undefined;
  }

  const absolute = toAbsoluteUrl(rawImage, articleUrl);
  if (!absolute) {
    pageImageCache.set(articleUrl, { reason: 'no_og_image' });
    return undefined;
  }

  const resolved = { imageUrl: toProxyUrl(absolute) };
  pageImageCache.set(articleUrl, resolved);
  return resolved.imageUrl;
}

export async function resolveArticleImageForSource(
  sourceId: string,
  articleUrl: string,
  existingImageUrl?: string,
  options: ImageEnrichmentOptions = {}
): Promise<ImageResolutionResult> {
  const timeoutMs = options.timeoutMs ?? 6000;
  const sourceKey = sourceId.toLowerCase();

  if (DIRECT_FALLBACK_SOURCES.has(sourceKey) && !existingImageUrl) {
    return { reason: 'no_media_tag' };
  }

  const cached = pageImageCache.get(articleUrl);
  if (cached) {
    return cached;
  }

  const useOgFirst = OG_FIRST_SOURCES.has(sourceKey);

  if (useOgFirst) {
    const htmlResult = await fetchHtmlWithReason(articleUrl, timeoutMs);

    if (htmlResult.html) {
      const rawImage = extractImageFromHtml(htmlResult.html);
      if (rawImage) {
        const absolute = toAbsoluteUrl(rawImage, articleUrl);
        if (absolute) {
          const blockedReason = await probeImageUrl(absolute, 3500);
          if (!blockedReason) {
            const resolved = { imageUrl: toProxyUrl(absolute) };
            pageImageCache.set(articleUrl, resolved);
            return resolved;
          }
        }
      } else if (!existingImageUrl) {
        const resolved = { reason: 'no_og_image' as MissingImageReason };
        pageImageCache.set(articleUrl, resolved);
        return resolved;
      }
    } else if (!existingImageUrl) {
      const resolved = { reason: htmlResult.reason ?? 'no_og_image' };
      pageImageCache.set(articleUrl, resolved);
      return resolved;
    }
  }

  if (existingImageUrl) {
    const blockedReason = await probeImageUrl(existingImageUrl, 3500);
    if (blockedReason) {
      return { reason: blockedReason };
    }

    return { imageUrl: toProxyUrl(existingImageUrl) };
  }

  const htmlResult = await fetchHtmlWithReason(articleUrl, timeoutMs);
  if (!htmlResult.html) {
    const reason = htmlResult.reason ?? 'no_og_image';
    const resolved = { reason };
    pageImageCache.set(articleUrl, resolved);
    return resolved;
  }

  const rawImage = extractImageFromHtml(htmlResult.html);
  if (!rawImage) {
    const resolved = { reason: 'no_og_image' as MissingImageReason };
    pageImageCache.set(articleUrl, resolved);
    return resolved;
  }

  const absolute = toAbsoluteUrl(rawImage, articleUrl);
  if (!absolute) {
    const resolved = { reason: 'no_og_image' as MissingImageReason };
    pageImageCache.set(articleUrl, resolved);
    return resolved;
  }

  const blockedReason = await probeImageUrl(absolute, 3500);
  if (blockedReason) {
    const resolved = { reason: blockedReason };
    pageImageCache.set(articleUrl, resolved);
    return resolved;
  }

  const resolved = { imageUrl: toProxyUrl(absolute) };
  pageImageCache.set(articleUrl, resolved);
  return resolved;
}
