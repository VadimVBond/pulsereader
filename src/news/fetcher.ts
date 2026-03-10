import type { NewsSource } from './sources';

export interface FeedFetchSuccess {
  source: NewsSource;
  xml: string;
  ok: true;
}

export interface FeedFetchFailure {
  source: NewsSource;
  error: string;
  ok: false;
}

export type FeedFetchResult = FeedFetchSuccess | FeedFetchFailure;

export interface FetchFeedsOptions {
  timeoutMs?: number;
}

function sanitizeXml(xml: string): string {
  return xml.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

function looksLikeFeed(text: string, contentType: string): boolean {
  if (/xml|rss|atom/i.test(contentType)) {
    return true;
  }

  return /<rss[\s>]|<feed[\s>]|<rdf:RDF[\s>]/i.test(text);
}

function getCandidateUrls(source: NewsSource): string[] {
  const list = [source.url, ...(source.feedUrls ?? [])];
  return [...new Set(list.filter(Boolean))];
}

function getHeaders(url: string): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36',
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  };

  if (/k\.img\.com\.ua/i.test(url)) {
    headers.Referer = 'https://korrespondent.net/';
  }

  return headers;
}

async function fetchByUrl(
  url: string,
  timeoutMs: number
): Promise<{ ok: true; xml: string; url: string } | { ok: false; error: string; url: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: getHeaders(url)
    });

    if (!response.ok) {
      return { ok: false, url, error: `${url} -> HTTP ${response.status}` };
    }

    const rawText = await response.text();
    const xml = sanitizeXml(rawText);
    const contentType = response.headers.get('content-type') ?? '';

    if (!looksLikeFeed(xml, contentType)) {
      return { ok: false, url, error: `${url} -> Not RSS/Atom (content-type: ${contentType || 'unknown'})` };
    }

    return { ok: true, url, xml };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown fetch error';
    return { ok: false, url, error: `${url} -> ${message}` };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchSingleFeed(source: NewsSource, timeoutMs: number): Promise<FeedFetchResult> {
  const urls = getCandidateUrls(source);

  if (urls.length === 1) {
    const result = await fetchByUrl(urls[0], timeoutMs);

    if (result.ok) {
      return {
        source,
        ok: true,
        xml: result.xml
      };
    }

    return {
      source,
      ok: false,
      error: result.error
    };
  }

  const perUrlTimeout = Math.min(timeoutMs, 7000);
  const settled = await Promise.all(urls.map((url) => fetchByUrl(url, perUrlTimeout)));
  const success = settled.find((item) => item.ok);

  if (success && success.ok) {
    return {
      source,
      ok: true,
      xml: success.xml
    };
  }

  return {
    source,
    ok: false,
    error: settled.map((item) => item.error).join(' | ')
  };
}

export async function fetchFeeds(
  sources: NewsSource[],
  options: FetchFeedsOptions = {}
): Promise<FeedFetchResult[]> {
  const timeoutMs = options.timeoutMs ?? 9000;

  return Promise.all(sources.map((source) => fetchSingleFeed(source, timeoutMs)));
}
