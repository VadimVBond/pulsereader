/* empty css                                        */
import { c as createAstro, a as createComponent, b as renderComponent, r as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../../chunks/astro/server_CucOfbn2.mjs';
import { $ as $$BaseLayout, a as $$LanguageSwitcher, b as $$ThemeToggle } from '../../../chunks/LanguageSwitcher_CwJZC9Ne.mjs';
import { $ as $$NewsBoard } from '../../../chunks/NewsBoard_ga5YG2XL.mjs';
import { g as getNewsSources, r as runNewsPipeline } from '../../../chunks/pipeline_C7DKexp8.mjs';
import { i as isLocale, l as localePrefix, g as getUiText, L as LOCALES } from '../../../chunks/i18n_BRKz8T47.mjs';
/* empty css                                      */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://vadimchik.github.io");
function getStaticPaths() {
  const langs = LOCALES.filter((locale) => locale !== "ru");
  return langs.flatMap(
    (locale) => getNewsSources(void 0, locale).map((source) => ({
      params: { lang: locale, id: source.id },
      props: { locale, sourceId: source.id, sourceName: source.name }
    }))
  );
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { locale, sourceId, sourceName } = Astro2.props;
  if (!isLocale(locale) || locale === "ru") {
    throw new Error("Unsupported locale route");
  }
  const prefix = localePrefix(locale);
  const t = getUiText(locale);
  const availableSources = getNewsSources(void 0, locale);
  const pipeline = await runNewsPipeline({ sourceIds: [sourceId], limit: 40, locale });
  const navLinks = [
    { label: t.navHome, href: `${prefix || "/"}` },
    { label: t.navCategories, href: "#" },
    { label: t.navAbout, href: "#" },
    { label: t.navContact, href: "#" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `PulseReader | ${sourceName}`, "description": `News from ${sourceName}`, "lang": locale, "navLinks": navLinks, "data-astro-cid-jmlnaxf7": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "NewsBoard", $$NewsBoard, { "pipeline": pipeline, "sources": availableSources, "selectedSourceId": sourceId, "locale": locale, "data-astro-cid-jmlnaxf7": true })} `, "header-actions": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "header-actions" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "LanguageSwitcher", $$LanguageSwitcher, { "locale": locale, "path": Astro2.url.pathname, "data-astro-cid-jmlnaxf7": true })} ${maybeRenderHead()}<button class="search-icon" type="button" aria-label="Search" data-astro-cid-jmlnaxf7> <span aria-hidden="true" data-astro-cid-jmlnaxf7>⌕</span> </button> ${renderComponent($$result3, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-jmlnaxf7": true })} ` })}` })} `;
}, "M:/Web/GitHub/Astro/pulsereader/src/pages/[lang]/source/[id].astro", void 0);

const $$file = "M:/Web/GitHub/Astro/pulsereader/src/pages/[lang]/source/[id].astro";
const $$url = "/pulsereader/[lang]/source/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
