function normalizeText$1(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
function normalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"].forEach((param) => {
      url.searchParams.delete(param);
    });
    url.hash = "";
    return `${url.origin}${url.pathname}${url.search}`.toLowerCase();
  } catch {
    return rawUrl.toLowerCase().trim();
  }
}
function makeKey(article) {
  const normalizedUrl = normalizeUrl(article.url);
  if (normalizedUrl) {
    return `url:${normalizedUrl}`;
  }
  return `title:${normalizeText$1(article.title)}`;
}
function isBetter(next, prev) {
  const nextTime = next.publishedAt?.getTime() ?? 0;
  const prevTime = prev.publishedAt?.getTime() ?? 0;
  return nextTime > prevTime;
}
function dedupeArticles(articles) {
  const unique = /* @__PURE__ */ new Map();
  for (const article of articles) {
    const key = makeKey(article);
    const existing = unique.get(key);
    if (!existing || isBetter(article, existing)) {
      unique.set(key, article);
    }
  }
  return [...unique.values()];
}

function sanitizeXml(xml) {
  return xml.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}
function looksLikeFeed(text, contentType) {
  if (/xml|rss|atom/i.test(contentType)) {
    return true;
  }
  return /<rss[\s>]|<feed[\s>]|<rdf:RDF[\s>]/i.test(text);
}
function getCandidateUrls(source) {
  const list = [source.url, ...source.feedUrls ?? []];
  return [...new Set(list.filter(Boolean))];
}
function getHeaders(url) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
  };
  if (/k\.img\.com\.ua/i.test(url)) {
    headers.Referer = "https://korrespondent.net/";
  }
  return headers;
}
async function fetchByUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: getHeaders(url)
    });
    if (!response.ok) {
      return { ok: false, error: `${url} -> HTTP ${response.status}` };
    }
    const rawText = await response.text();
    const xml = sanitizeXml(rawText);
    const contentType = response.headers.get("content-type") ?? "";
    if (!looksLikeFeed(xml, contentType)) {
      return { ok: false, error: `${url} -> Not RSS/Atom (content-type: ${contentType || "unknown"})` };
    }
    return { ok: true, xml };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    return { ok: false, error: `${url} -> ${message}` };
  } finally {
    clearTimeout(timeoutId);
  }
}
async function fetchSingleFeed(source, timeoutMs) {
  const urls = getCandidateUrls(source);
  const errors = [];
  for (const url of urls) {
    const result = await fetchByUrl(url, timeoutMs);
    if (result.ok) {
      return {
        source,
        ok: true,
        xml: result.xml
      };
    }
    errors.push(result.error);
  }
  return {
    source,
    ok: false,
    error: errors.join(" | ")
  };
}
async function fetchFeeds(sources, options = {}) {
  const timeoutMs = options.timeoutMs ?? 9e3;
  return Promise.all(sources.map((source) => fetchSingleFeed(source, timeoutMs)));
}

const OG_FIRST_SOURCES = /* @__PURE__ */ new Set(["techcrunch", "the-verge", "github-blog"]);
const DIRECT_FALLBACK_SOURCES = /* @__PURE__ */ new Set(["hacker-news"]);
function decodeHtmlEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function extractMetaContent(html, attrName, attrValue) {
  const re = new RegExp(
    `<meta[^>]+${attrName}=["']${attrValue}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+${attrName}=["']${attrValue}["'][^>]*>`,
    "i"
  );
  const match = html.match(re);
  return match?.[1] ?? match?.[2];
}
function extractImageFromHtml(html) {
  return extractMetaContent(html, "property", "og:image") ?? extractMetaContent(html, "name", "og:image") ?? extractMetaContent(html, "name", "twitter:image") ?? extractMetaContent(html, "property", "twitter:image");
}
function toAbsoluteUrl(rawUrl, pageUrl) {
  try {
    return new URL(decodeHtmlEntities(rawUrl).trim(), pageUrl).toString();
  } catch {
    return void 0;
  }
}
function toProxyUrl(rawUrl) {
  const clean = rawUrl.replace(/^https?:\/\//i, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=1200&h=630&fit=cover`;
}
async function fetchHtmlWithReason(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml"
      }
    });
    if (!response.ok) {
      return { html: null, reason: "no_og_image" };
    }
    return { html: await response.text() };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { html: null, reason: "timeout" };
    }
    return { html: null, reason: "no_og_image" };
  } finally {
    clearTimeout(timeoutId);
  }
}
async function probeImageUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) PulseReader/1.0 Safari/537.36"
      }
    });
    if (response.status === 401 || response.status === 403) {
      return "blocked_hotlink";
    }
    return void 0;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "timeout";
    }
    return void 0;
  } finally {
    clearTimeout(timeoutId);
  }
}
const pageImageCache = /* @__PURE__ */ new Map();
async function resolveArticleImageForSource(sourceId, articleUrl, existingImageUrl, options = {}) {
  const timeoutMs = options.timeoutMs ?? 6e3;
  const sourceKey = sourceId.toLowerCase();
  if (DIRECT_FALLBACK_SOURCES.has(sourceKey) && !existingImageUrl) {
    return { reason: "no_media_tag" };
  }
  const cached = pageImageCache.get(articleUrl);
  if (cached) {
    return cached;
  }
  const useOgFirst = OG_FIRST_SOURCES.has(sourceKey);
  if (useOgFirst) {
    const htmlResult2 = await fetchHtmlWithReason(articleUrl, timeoutMs);
    if (htmlResult2.html) {
      const rawImage2 = extractImageFromHtml(htmlResult2.html);
      if (rawImage2) {
        const absolute2 = toAbsoluteUrl(rawImage2, articleUrl);
        if (absolute2) {
          const blockedReason2 = await probeImageUrl(absolute2, 3500);
          if (!blockedReason2) {
            const resolved2 = { imageUrl: toProxyUrl(absolute2) };
            pageImageCache.set(articleUrl, resolved2);
            return resolved2;
          }
        }
      } else if (!existingImageUrl) {
        const resolved2 = { reason: "no_og_image" };
        pageImageCache.set(articleUrl, resolved2);
        return resolved2;
      }
    } else if (!existingImageUrl) {
      const resolved2 = { reason: htmlResult2.reason ?? "no_og_image" };
      pageImageCache.set(articleUrl, resolved2);
      return resolved2;
    }
  }
  if (existingImageUrl) {
    const blockedReason2 = await probeImageUrl(existingImageUrl, 3500);
    if (blockedReason2) {
      return { reason: blockedReason2 };
    }
    return { imageUrl: toProxyUrl(existingImageUrl) };
  }
  const htmlResult = await fetchHtmlWithReason(articleUrl, timeoutMs);
  if (!htmlResult.html) {
    const reason = htmlResult.reason ?? "no_og_image";
    const resolved2 = { reason };
    pageImageCache.set(articleUrl, resolved2);
    return resolved2;
  }
  const rawImage = extractImageFromHtml(htmlResult.html);
  if (!rawImage) {
    const resolved2 = { reason: "no_og_image" };
    pageImageCache.set(articleUrl, resolved2);
    return resolved2;
  }
  const absolute = toAbsoluteUrl(rawImage, articleUrl);
  if (!absolute) {
    const resolved2 = { reason: "no_og_image" };
    pageImageCache.set(articleUrl, resolved2);
    return resolved2;
  }
  const blockedReason = await probeImageUrl(absolute, 3500);
  if (blockedReason) {
    const resolved2 = { reason: blockedReason };
    pageImageCache.set(articleUrl, resolved2);
    return resolved2;
  }
  const resolved = { imageUrl: toProxyUrl(absolute) };
  pageImageCache.set(articleUrl, resolved);
  return resolved;
}

function decodeNumericEntities(value) {
  return value.replace(/&#(\d+);/g, (_, dec) => {
    const code = Number(dec);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  }).replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    const code = Number.parseInt(hex, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
}
function decodeHtml(text) {
  return decodeNumericEntities(
    text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
  );
}
function stripHtml(text) {
  return decodeHtml(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function extractFirstImageFromHtml(rawHtml) {
  const html = decodeHtml(rawHtml);
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  const src = imgMatch?.[1]?.trim();
  if (!src) return void 0;
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  return void 0;
}
function extractAll(xml, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  const matches = [];
  let match;
  while ((match = re.exec(xml)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}
function extractTag(block, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = block.match(re);
  return match?.[1]?.trim();
}
function extractAttr(block, tagName, attr) {
  const re = new RegExp(`<${tagName}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i");
  const match = block.match(re);
  return match?.[1]?.trim();
}
function parseDate(value) {
  if (!value) return void 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? void 0 : date;
}
function parseRssItem(itemBlock, source) {
  const title = stripHtml(extractTag(itemBlock, "title") ?? "");
  const url = stripHtml(extractTag(itemBlock, "link") ?? "");
  const summaryRaw = extractTag(itemBlock, "description") ?? extractTag(itemBlock, "content:encoded") ?? extractTag(itemBlock, "content") ?? "";
  const summary = stripHtml(summaryRaw);
  if (!title || !url) {
    return null;
  }
  const imageUrl = extractAttr(itemBlock, "media:content", "url") ?? extractAttr(itemBlock, "media:thumbnail", "url") ?? extractAttr(itemBlock, "enclosure", "url") ?? extractFirstImageFromHtml(summaryRaw);
  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceCategory: source.category,
    title,
    summary,
    url,
    publishedAt: parseDate(extractTag(itemBlock, "pubDate") ?? extractTag(itemBlock, "dc:date")),
    imageUrl
  };
}
function parseAtomItem(entryBlock, source) {
  const title = stripHtml(extractTag(entryBlock, "title") ?? "");
  const link = extractAttr(entryBlock, "link", "href") ?? stripHtml(extractTag(entryBlock, "link") ?? "");
  const summaryRaw = extractTag(entryBlock, "summary") ?? extractTag(entryBlock, "content") ?? "";
  const summary = stripHtml(summaryRaw);
  if (!title || !link) {
    return null;
  }
  const imageUrl = extractAttr(entryBlock, "media:content", "url") ?? extractAttr(entryBlock, "media:thumbnail", "url") ?? extractAttr(entryBlock, "enclosure", "url") ?? extractFirstImageFromHtml(summaryRaw);
  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceCategory: source.category,
    title,
    summary,
    url: link,
    publishedAt: parseDate(extractTag(entryBlock, "updated") ?? extractTag(entryBlock, "published")),
    imageUrl
  };
}
function parseFeed(xml, source) {
  const rssItems = extractAll(xml, "item").map((item) => parseRssItem(item, source));
  if (rssItems.length > 0) {
    return rssItems.filter((item) => Boolean(item));
  }
  const atomEntries = extractAll(xml, "entry").map((entry) => parseAtomItem(entry, source));
  return atomEntries.filter((item) => Boolean(item));
}

const KORRESPONDENT_RU_FEEDS = [
  "https://k.img.com.ua/rss/ru/all_news2.0.xml",
  "https://k.img.com.ua/rss/ru/ukraine.xml",
  "https://k.img.com.ua/rss/ru/world.xml"
];
const KORRESPONDENT_UK_FEEDS = [
  "https://k.img.com.ua/rss/ua/all_news2.0.xml",
  "https://k.img.com.ua/rss/ua/ukraine.xml",
  "https://k.img.com.ua/rss/ua/world.xml"
];
const NEWS_SOURCES = [
  {
    id: "korrespondent",
    name: "Korrespondent",
    url: KORRESPONDENT_RU_FEEDS[0],
    category: "News",
    locales: ["uk", "ru"],
    feedUrls: KORRESPONDENT_RU_FEEDS
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "Technology",
    locales: ["en", "uk", "ru"]
  },
  {
    id: "the-verge",
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Technology",
    locales: ["en", "uk", "ru"]
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Technology",
    locales: ["en", "uk", "ru"]
  },
  {
    id: "hacker-news",
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    category: "Technology",
    locales: ["en", "uk", "ru"]
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "Technology",
    locales: ["en", "uk", "ru"]
  }
];
function getNewsSources(selectedIds, locale = "ru") {
  const base = NEWS_SOURCES.filter((source) => source.locales.includes(locale));
  if (base.length === 0) {
    return NEWS_SOURCES;
  }
  const localized = base.map((source) => {
    if (source.id !== "korrespondent") return source;
    const feedUrls = locale === "uk" ? [...KORRESPONDENT_UK_FEEDS, ...KORRESPONDENT_RU_FEEDS] : [...KORRESPONDENT_RU_FEEDS, ...KORRESPONDENT_UK_FEEDS];
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

function shortHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
function slugify(title, url) {
  const base = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 72);
  return `${base || "article"}-${shortHash(url)}`;
}
function normalizeText(value, maxLen) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1)}…`;
}
function cleanupSummary(rawSummary) {
  return rawSummary.replace(/(^|\s)Article\s+URL:\s*https?:\/\/\S+/gi, " ").replace(/\bhttps?:\/\/\S+/gi, " ").replace(/\s+/g, " ").trim();
}
function isLowQuality(title, excerpt, hasImage) {
  const normalizedTitle = title.toLowerCase();
  const genericTitle = normalizedTitle === "here's the latest." || normalizedTitle === "here's the latest" || normalizedTitle === "latest updates";
  const poorExcerpt = excerpt.length < 30;
  return genericTitle && poorExcerpt || !hasImage && poorExcerpt;
}
function toPipelineArticle(parsed) {
  const title = normalizeText(parsed.title, 120);
  const cleaned = cleanupSummary(parsed.summary);
  const description = normalizeText(cleaned, 2400);
  const excerpt = normalizeText(description, 180);
  const hasImage = Boolean(parsed.imageUrl);
  if (isLowQuality(title, excerpt, hasImage)) {
    return null;
  }
  const fallbackText = "Summary is unavailable in this RSS feed.";
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
function emptyImageIssueCounters() {
  return {
    no_media_tag: 0,
    blocked_hotlink: 0,
    no_og_image: 0,
    timeout: 0
  };
}
function initImageIssuesBySource(sources) {
  const map = {};
  for (const source of sources) {
    map[source.id] = emptyImageIssueCounters();
  }
  return map;
}
function collectImageIssue(imageIssuesBySource, sourceId, reason) {
  if (!reason) return;
  if (!imageIssuesBySource[sourceId]) {
    imageIssuesBySource[sourceId] = emptyImageIssueCounters();
  }
  imageIssuesBySource[sourceId][reason] += 1;
}
async function enrichImages(articles, maxCount, imageIssuesBySource) {
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
      article.imageUnavailableReason = "no_media_tag";
      collectImageIssue(imageIssuesBySource, article.sourceId, article.imageUnavailableReason);
    }
  }
}
function logImageIssues(imageIssuesBySource) {
  const lines = Object.entries(imageIssuesBySource).map(([sourceId, counters]) => {
    const total = counters.no_media_tag + counters.blocked_hotlink + counters.no_og_image + counters.timeout;
    if (total === 0) return "";
    return `${sourceId}: no_media_tag=${counters.no_media_tag}, blocked_hotlink=${counters.blocked_hotlink}, no_og_image=${counters.no_og_image}, timeout=${counters.timeout}`;
  }).filter(Boolean);
  if (lines.length > 0) {
    console.info(`[PulseReader:image] ${lines.join(" | ")}`);
  }
}
async function runNewsPipeline(options = {}) {
  const locale = options.locale ?? "ru";
  const selectedSources = getNewsSources(options.sourceIds, locale);
  const feedResults = await fetchFeeds(selectedSources, {
    timeoutMs: options.timeoutMs
  });
  const errors = [];
  let totalParsed = 0;
  const normalizedArticles = [];
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
  await enrichImages(dedupedAll, Math.min(120, limit * 2), imageIssuesBySource);
  const articles = dedupedAll.slice(0, limit);
  const totalNormalized = normalizedArticles.length;
  const totalFilteredOut = Math.max(0, totalParsed - totalNormalized);
  const totalDuplicatesRemoved = Math.max(0, totalNormalized - dedupedAll.length);
  const totalDeduped = dedupedAll.length;
  logImageIssues(imageIssuesBySource);
  return {
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
}

export { getNewsSources as g, runNewsPipeline as r };
