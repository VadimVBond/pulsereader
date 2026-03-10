/* empty css                                  */
import { c as createAstro, a as createComponent, b as renderComponent, r as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CucOfbn2.mjs';
import { $ as $$BaseLayout, a as $$LanguageSwitcher, b as $$ThemeToggle } from '../chunks/LanguageSwitcher_CwJZC9Ne.mjs';
import { $ as $$NewsBoard } from '../chunks/NewsBoard_ga5YG2XL.mjs';
import { g as getNewsSources, r as runNewsPipeline } from '../chunks/pipeline_C7DKexp8.mjs';
import { g as getUiText, l as localePrefix } from '../chunks/i18n_BRKz8T47.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://vadimchik.github.io");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const locale = "ru";
  const t = getUiText(locale);
  const homeHref = localePrefix(locale);
  const availableSources = getNewsSources(void 0, locale);
  const pipeline = await runNewsPipeline({ limit: 40, locale });
  const navLinks = [
    { label: t.navHome, href: homeHref },
    { label: t.navCategories, href: "#" },
    { label: t.navAbout, href: "#" },
    { label: t.navContact, href: "#" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "PulseReader | Home", "description": "PulseReader article feed", "lang": locale, "navLinks": navLinks, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "NewsBoard", $$NewsBoard, { "pipeline": pipeline, "sources": availableSources, "locale": locale, "data-astro-cid-j7pv25f6": true })} `, "header-actions": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "header-actions" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "LanguageSwitcher", $$LanguageSwitcher, { "locale": locale, "path": Astro2.url.pathname, "data-astro-cid-j7pv25f6": true })} ${maybeRenderHead()}<button class="search-icon" type="button" aria-label="Search" data-astro-cid-j7pv25f6> <span aria-hidden="true" data-astro-cid-j7pv25f6>⌕</span> </button> ${renderComponent($$result3, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-j7pv25f6": true })} ` })}` })} `;
}, "M:/Web/GitHub/Astro/pulsereader/src/pages/index.astro", void 0);

const $$file = "M:/Web/GitHub/Astro/pulsereader/src/pages/index.astro";
const $$url = "/pulsereader";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
