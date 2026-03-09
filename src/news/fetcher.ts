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

async function fetchSingleFeed(source: NewsSource, timeoutMs: number): Promise<FeedFetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PulseReader/1.0 (+https://example.com)'
      }
    });

    if (!response.ok) {
      return {
        source,
        ok: false,
        error: `HTTP ${response.status}`
      };
    }

    const xml = sanitizeXml(await response.text());

    return {
      source,
      ok: true,
      xml
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown fetch error';

    return {
      source,
      ok: false,
      error: message
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchFeeds(
  sources: NewsSource[],
  options: FetchFeedsOptions = {}
): Promise<FeedFetchResult[]> {
  const timeoutMs = options.timeoutMs ?? 9000;

  return Promise.all(sources.map((source) => fetchSingleFeed(source, timeoutMs)));
}
