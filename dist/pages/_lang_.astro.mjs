/* empty css                                  */
import { c as createAstro, a as createComponent, b as renderComponent, r as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CucOfbn2.mjs';
import { $ as $$BaseLayout, a as $$LanguageSwitcher, b as $$ThemeToggle } from '../chunks/LanguageSwitcher_CwJZC9Ne.mjs';
import { $ as $$NewsBoard } from '../chunks/NewsBoard_ga5YG2XL.mjs';
import { g as getNewsSources, r as runNewsPipeline } from '../chunks/pipeline_C7DKexp8.mjs';
import { i as isLocale, g as getUiText, l as localePrefix, L as LOCALES } from '../chunks/i18n_BRKz8T47.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://vadimchik.github.io");
function getStaticPaths() {
  return LOCALES.filter((locale) => locale !== "ru").map((locale) => ({
    params: { lang: locale },
    props: { locale }
  }));
}
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { locale } = Astro2.props;
  if (!isLocale(locale) || locale === "ru") {
    throw new Error("Unsupported locale route");
  }
  const t = getUiText(locale);
  const prefix = localePrefix(locale);
  const availableSources = getNewsSources(void 0, locale);
  const pipeline = await runNewsPipeline({ limit: 40, locale });
  const navLinks = [
    { label: t.navHome, href: `${prefix || "/"}` },
    { label: t.navCategories, href: "#" },
    { label: t.navAbout, href: "#" },
    { label: t.navContact, href: "#" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "PulseReader | Home", "description": "PulseReader article feed", "lang": locale, "navLinks": navLinks, "data-astro-cid-ct3bgug4": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "NewsBoard", $$NewsBoard, { "pipeline": pipeline, "sources": availableSources, "locale": locale, "data-astro-cid-ct3bgug4": true })} `, "header-actions": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "header-actions" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "LanguageSwitcher", $$LanguageSwitcher, { "locale": locale, "path": Astro2.url.pathname, "data-astro-cid-ct3bgug4": true })} ${maybeRenderHead()}<button class="search-icon" type="button" aria-label="Search" data-astro-cid-ct3bgug4> <span aria-hidden="true" data-astro-cid-ct3bgug4>⌕</span> </button> ${renderComponent($$result3, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-ct3bgug4": true })} ` })}` })} `;
}, "M:/Web/GitHub/Astro/pulsereader/src/pages/[lang]/index.astro", void 0);

const $$file = "M:/Web/GitHub/Astro/pulsereader/src/pages/[lang]/index.astro";
const $$url = "/pulsereader/[lang]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
