/* empty css                                     */
import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, F as Fragment, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_CucOfbn2.mjs';
import { $ as $$BaseLayout, a as $$LanguageSwitcher, b as $$ThemeToggle } from '../../chunks/LanguageSwitcher_CwJZC9Ne.mjs';
import { r as runNewsPipeline } from '../../chunks/pipeline_C7DKexp8.mjs';
import { l as localePrefix, g as getUiText } from '../../chunks/i18n_BRKz8T47.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://vadimchik.github.io");
async function getStaticPaths() {
  const result = await runNewsPipeline({ limit: 120, locale: "ru" });
  return result.articles.map((article) => ({
    params: { slug: article.slug },
    props: { article }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const locale = "ru";
  const t = getUiText(locale);
  const homeHref = localePrefix(locale);
  const { article } = Astro2.props;
  const publishedAt = article.publishedAt ? article.publishedAt.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }) : null;
  const navLinks = [
    { label: t.navHome, href: homeHref },
    { label: t.navCategories, href: "#" },
    { label: t.navAbout, href: "#" },
    { label: t.navContact, href: "#" }
  ];
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (() => {\n    const controls = document.querySelector('[data-controls]');\n    if (!controls) return;\n\n    const buttons = Array.from(controls.querySelectorAll('.translate-btn'));\n    const targets = Array.from(document.querySelectorAll('[data-translatable]'));\n    if (targets.length === 0) return;\n\n    const translatingLabel =\n      document.querySelector('[data-translatable=\"description\"]')?.getAttribute('data-translating') || 'Translating...';\n\n    const sourceText = {};\n    for (const el of targets) {\n      const key = el.getAttribute('data-translatable');\n      if (!key) continue;\n      sourceText[key] = el.getAttribute('data-original') || el.textContent || '';\n    }\n\n    const cache = {\n      en: {},\n      uk: {},\n      ru: {}\n    };\n\n    async function translateText(text, target) {\n      const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;\n      const response = await fetch(endpoint);\n      if (!response.ok) return text;\n\n      const payload = await response.json();\n      const translated = Array.isArray(payload?.[0])\n        ? payload[0].map((chunk) => chunk?.[0] || '').join('')\n        : text;\n\n      return translated || text;\n    }\n\n    function setActive(lang) {\n      buttons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));\n    }\n\n    async function applyLanguage(lang) {\n      const langCache = cache[lang];\n\n      const pending = [];\n      for (const el of targets) {\n        const key = el.getAttribute('data-translatable');\n        if (!key) continue;\n\n        if (langCache[key]) {\n          el.textContent = langCache[key];\n          continue;\n        }\n\n        pending.push({ el, key, original: sourceText[key] || '' });\n      }\n\n      for (const item of pending) {\n        item.el.textContent = translatingLabel;\n      }\n\n      await Promise.all(\n        pending.map(async (item) => {\n          try {\n            const translated = await translateText(item.original, lang);\n            langCache[item.key] = translated;\n            item.el.textContent = translated;\n          } catch {\n            item.el.textContent = item.original;\n          }\n        })\n      );\n    }\n\n    buttons.forEach((button) => {\n      button.addEventListener('click', async () => {\n        const lang = button.dataset.lang;\n        if (!lang) return;\n\n        setActive(lang);\n        await applyLanguage(lang);\n      });\n    });\n  })();\n<\/script> "], ["", " <script>\n  (() => {\n    const controls = document.querySelector('[data-controls]');\n    if (!controls) return;\n\n    const buttons = Array.from(controls.querySelectorAll('.translate-btn'));\n    const targets = Array.from(document.querySelectorAll('[data-translatable]'));\n    if (targets.length === 0) return;\n\n    const translatingLabel =\n      document.querySelector('[data-translatable=\"description\"]')?.getAttribute('data-translating') || 'Translating...';\n\n    const sourceText = {};\n    for (const el of targets) {\n      const key = el.getAttribute('data-translatable');\n      if (!key) continue;\n      sourceText[key] = el.getAttribute('data-original') || el.textContent || '';\n    }\n\n    const cache = {\n      en: {},\n      uk: {},\n      ru: {}\n    };\n\n    async function translateText(text, target) {\n      const endpoint = \\`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=\\${target}&dt=t&q=\\${encodeURIComponent(text)}\\`;\n      const response = await fetch(endpoint);\n      if (!response.ok) return text;\n\n      const payload = await response.json();\n      const translated = Array.isArray(payload?.[0])\n        ? payload[0].map((chunk) => chunk?.[0] || '').join('')\n        : text;\n\n      return translated || text;\n    }\n\n    function setActive(lang) {\n      buttons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));\n    }\n\n    async function applyLanguage(lang) {\n      const langCache = cache[lang];\n\n      const pending = [];\n      for (const el of targets) {\n        const key = el.getAttribute('data-translatable');\n        if (!key) continue;\n\n        if (langCache[key]) {\n          el.textContent = langCache[key];\n          continue;\n        }\n\n        pending.push({ el, key, original: sourceText[key] || '' });\n      }\n\n      for (const item of pending) {\n        item.el.textContent = translatingLabel;\n      }\n\n      await Promise.all(\n        pending.map(async (item) => {\n          try {\n            const translated = await translateText(item.original, lang);\n            langCache[item.key] = translated;\n            item.el.textContent = translated;\n          } catch {\n            item.el.textContent = item.original;\n          }\n        })\n      );\n    }\n\n    buttons.forEach((button) => {\n      button.addEventListener('click', async () => {\n        const lang = button.dataset.lang;\n        if (!lang) return;\n\n        setActive(lang);\n        await applyLanguage(lang);\n      });\n    });\n  })();\n<\/script> "])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `PulseReader | ${article.title}`, "description": article.excerpt, "containerSize": "md", "lang": locale, "navLinks": navLinks, "data-astro-cid-yvq5cjnk": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<article class="article-page" data-astro-cid-yvq5cjnk> <header class="article-head" data-astro-cid-yvq5cjnk> <div class="article-head-top" data-astro-cid-yvq5cjnk> <p class="article-kicker" data-astro-cid-yvq5cjnk>${article.sourceName}</p> <div class="translate-controls" data-controls data-astro-cid-yvq5cjnk> <span data-astro-cid-yvq5cjnk>${t.translateDescription}:</span> <button type="button" class="translate-btn" data-lang="en" data-astro-cid-yvq5cjnk>EN</button> <button type="button" class="translate-btn" data-lang="uk" data-astro-cid-yvq5cjnk>UK</button> <button type="button" class="translate-btn" data-lang="ru" data-astro-cid-yvq5cjnk>RU</button> </div> </div> <h1 data-translatable="title"${addAttribute(article.title, "data-original")} data-astro-cid-yvq5cjnk>${article.title}</h1> ${publishedAt && renderTemplate`<p class="article-date" data-astro-cid-yvq5cjnk>${publishedAt}</p>`} <p class="article-excerpt" data-translatable="excerpt"${addAttribute(article.excerpt, "data-original")} data-astro-cid-yvq5cjnk>${article.excerpt}</p> </header> <figure class="article-cover" data-astro-cid-yvq5cjnk> <img${addAttribute(article.imageUrl ?? "/images/og-default.svg", "src")}${addAttribute(article.title, "alt")} loading="lazy" data-astro-cid-yvq5cjnk> </figure> <section class="article-body" data-astro-cid-yvq5cjnk> <p class="article-description" data-translatable="description"${addAttribute(article.description, "data-original")}${addAttribute(t.translating, "data-translating")} data-astro-cid-yvq5cjnk> ${article.description} </p> <p data-astro-cid-yvq5cjnk>${t.aggregatedNote}</p> <p data-astro-cid-yvq5cjnk> <a${addAttribute(article.url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-yvq5cjnk>${t.readOriginal}</a> </p> </section> <p class="article-back" data-astro-cid-yvq5cjnk> <a${addAttribute(homeHref, "href")} data-astro-cid-yvq5cjnk>${t.backHome}</a> </p> </article> `, "header-actions": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "header-actions" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "LanguageSwitcher", $$LanguageSwitcher, { "locale": locale, "path": Astro2.url.pathname, "data-astro-cid-yvq5cjnk": true })} ${renderComponent($$result3, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-yvq5cjnk": true })} ` })}` }));
}, "M:/Web/GitHub/Astro/pulsereader/src/pages/article/[slug].astro", void 0);

const $$file = "M:/Web/GitHub/Astro/pulsereader/src/pages/article/[slug].astro";
const $$url = "/pulsereader/article/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
