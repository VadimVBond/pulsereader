import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderTemplate, b as renderComponent, F as Fragment } from './astro/server_CucOfbn2.mjs';
/* empty css                         */
import { g as getUiText, l as localePrefix } from './i18n_BRKz8T47.mjs';

const $$Astro$1 = createAstro("https://vadimchik.github.io");
const $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ArticleCard;
  const {
    title,
    excerpt,
    href,
    linkLabel = "Read article",
    publishedAt,
    imageSrc,
    category = "Category",
    source = "Source",
    compact = false,
    imageUnavailableLabel
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(["article-card", { compact }], "class:list")} data-astro-cid-di2nlc57> <a class="thumb"${addAttribute(href, "href")}${addAttribute(title, "aria-label")} data-astro-cid-di2nlc57> ${imageSrc ? renderTemplate`<img${addAttribute(imageSrc, "src")}${addAttribute(title, "alt")} loading="lazy" data-astro-cid-di2nlc57>` : renderTemplate`<div class="thumb-fallback" data-astro-cid-di2nlc57>${imageUnavailableLabel || "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0432 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0435"}</div>`} </a> <div class="card-body" data-astro-cid-di2nlc57> <p class="article-category" data-astro-cid-di2nlc57>${category}</p> <h3 class="article-title" data-astro-cid-di2nlc57> <a${addAttribute(href, "href")} data-astro-cid-di2nlc57>${title}</a> </h3> <p class="article-excerpt" data-astro-cid-di2nlc57>${excerpt}</p> <div class="card-meta" data-astro-cid-di2nlc57> <span class="meta-dot" aria-hidden="true" data-astro-cid-di2nlc57></span> <span data-astro-cid-di2nlc57>${source}</span> ${publishedAt && renderTemplate`<span class="meta-sep" data-astro-cid-di2nlc57>•</span>`} ${publishedAt && renderTemplate`<span data-astro-cid-di2nlc57>${publishedAt}</span>`} </div> <a class="article-link"${addAttribute(href, "href")} data-astro-cid-di2nlc57>${linkLabel}</a> </div> </article> `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/ArticleCard.astro", void 0);

const $$Astro = createAstro("https://vadimchik.github.io");
const $$NewsBoard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NewsBoard;
  const { pipeline, sources, selectedSourceId, locale = "ru" } = Astro2.props;
  const t = getUiText(locale);
  const prefix = localePrefix(locale);
  const articles = pipeline.articles;
  const trending = articles.filter((article) => Boolean(article.imageUrl)).slice(0, 3);
  const trendingSlugs = new Set(trending.map((article) => article.slug));
  const moreStories = articles.filter((article) => !trendingSlugs.has(article.slug)).slice(0, 8);
  const hasNews = articles.length > 0;
  const activeSource = selectedSourceId ? sources.find((source) => source.id === selectedSourceId) : null;
  const showingLabel = activeSource ? activeSource.name : t.allSources;
  const formatDate = (value) => value ? value.toLocaleDateString(locale === "en" ? "en-US" : locale === "uk" ? "uk-UA" : "ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : void 0;
  const localizeCategory = (category) => {
    if (category === "Technology") {
      if (locale === "ru") return "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438";
      if (locale === "uk") return "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457";
    }
    if (category === "News") {
      if (locale === "ru") return "\u041D\u043E\u0432\u043E\u0441\u0442\u0438";
      if (locale === "uk") return "\u041D\u043E\u0432\u0438\u043D\u0438";
    }
    return category;
  };
  const sourceHref = (id) => `${prefix}/source/${id}`;
  const articleHref = (slug) => `${prefix}/article/${slug}`;
  const homeHref = prefix || "/";
  return renderTemplate`${maybeRenderHead()}<div class="page-shell" data-astro-cid-ca6yufmu> <section class="search-panel" aria-label="Source filters" data-astro-cid-ca6yufmu> <input type="search"${addAttribute(t.searchPlaceholder, "placeholder")}${addAttribute(t.searchPlaceholder, "aria-label")} data-astro-cid-ca6yufmu> <div class="search-toolbar" data-astro-cid-ca6yufmu> <div class="chips" data-astro-cid-ca6yufmu> <a${addAttribute(["chip", { active: !selectedSourceId }], "class:list")}${addAttribute(homeHref, "href")} data-astro-cid-ca6yufmu>${t.allSources}</a> ${sources.map((source) => renderTemplate`<a${addAttribute(["chip", { active: selectedSourceId === source.id }], "class:list")}${addAttribute(sourceHref(source.id), "href")} data-astro-cid-ca6yufmu> ${source.name} </a>`)} </div> <button type="button" class="search-btn" data-astro-cid-ca6yufmu>${t.searchButton}</button> </div> </section> <section class="stats-row" aria-label="Stats" data-astro-cid-ca6yufmu> <article class="stat-card" data-astro-cid-ca6yufmu><strong data-astro-cid-ca6yufmu>${pipeline.totalDeduped}</strong><span data-astro-cid-ca6yufmu>${t.articlesFound}</span></article> <article class="stat-card" data-astro-cid-ca6yufmu><strong data-astro-cid-ca6yufmu>${pipeline.sources.length}</strong><span data-astro-cid-ca6yufmu>${t.sourcesUsed}</span></article> <article class="stat-card" data-astro-cid-ca6yufmu><strong data-astro-cid-ca6yufmu>${pipeline.totalDuplicatesRemoved}</strong><span data-astro-cid-ca6yufmu>${t.duplicatesRemoved}</span></article> </section> <p class="source-indicator" data-astro-cid-ca6yufmu> ${t.showingFrom}: <strong data-astro-cid-ca6yufmu>${showingLabel}</strong> </p> ${!hasNews && renderTemplate`<section class="empty-state" data-astro-cid-ca6yufmu> <h2 data-astro-cid-ca6yufmu>${t.noNewsTitle}</h2> <p data-astro-cid-ca6yufmu>${t.noNewsText}</p> </section>`} ${hasNews && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-ca6yufmu": true }, { "default": ($$result2) => renderTemplate` <section class="section-block" data-astro-cid-ca6yufmu> <h2 data-astro-cid-ca6yufmu>${t.trending}</h2> <div class="trending-grid" data-astro-cid-ca6yufmu> ${trending.map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "title": article.title, "excerpt": article.excerpt, "href": articleHref(article.slug), "linkLabel": t.readArticle, "publishedAt": formatDate(article.publishedAt), "imageSrc": article.imageUrl, "category": localizeCategory(article.sourceCategory), "source": article.sourceName, "imageUnavailableLabel": t.imageUnavailable, "data-astro-cid-ca6yufmu": true })}`)} </div> </section> <section class="section-block" data-astro-cid-ca6yufmu> <h2 data-astro-cid-ca6yufmu>${t.moreStories}</h2> <div class="stories-grid" data-astro-cid-ca6yufmu> ${moreStories.map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "title": article.title, "excerpt": article.excerpt, "href": articleHref(article.slug), "linkLabel": t.readArticle, "publishedAt": formatDate(article.publishedAt), "imageSrc": article.imageUrl, "category": localizeCategory(article.sourceCategory), "source": article.sourceName, "compact": true, "imageUnavailableLabel": t.imageUnavailable, "data-astro-cid-ca6yufmu": true })}`)} </div> </section> ` })}`} </div> `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/NewsBoard.astro", void 0);

export { $$NewsBoard as $ };
