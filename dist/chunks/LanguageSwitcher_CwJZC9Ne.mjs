import { c as createAstro, a as createComponent, b as renderComponent, e as renderSlot, r as renderTemplate, m as maybeRenderHead, d as addAttribute, f as renderHead } from './astro/server_CucOfbn2.mjs';
/* empty css                          */
import { L as LOCALES, l as localePrefix } from './i18n_BRKz8T47.mjs';

const $$Astro$5 = createAstro("https://vadimchik.github.io");
const $$Container = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Container;
  const { as = "div", size = "lg", class: className = "" } = Astro2.props;
  const Tag = as;
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class:list": [
    "container-base",
    {
      "container-sm": size === "sm",
      "container-md": size === "md",
      "container-lg": size === "lg"
    },
    className
  ], "data-astro-cid-d6puh33w": true }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })} `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/Container.astro", void 0);

const $$Astro$4 = createAstro("https://vadimchik.github.io");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Header;
  const {
    brand = "PulseReader",
    homeHref = "/",
    links = [
      { label: "Home", href: "/" },
      { label: "Categories", href: "#" },
      { label: "About", href: "#" },
      { label: "Contact", href: "#" }
    ]
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="header" data-astro-cid-3ef6ksr2> <a class="brand"${addAttribute(homeHref, "href")} data-astro-cid-3ef6ksr2>${brand}</a> <nav aria-label="Main navigation" data-astro-cid-3ef6ksr2> <ul class="nav-list" data-astro-cid-3ef6ksr2> ${links.map((link) => renderTemplate`<li data-astro-cid-3ef6ksr2> <a${addAttribute(link.href, "href")} data-astro-cid-3ef6ksr2>${link.label}</a> </li>`)} </ul> </nav> <div class="actions" data-astro-cid-3ef6ksr2> ${renderSlot($$result, $$slots["actions"])} </div> </header> `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/Header.astro", void 0);

const $$Astro$3 = createAstro("https://vadimchik.github.io");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    text = `\xA9 ${currentYear} PulseReader. All rights reserved.`,
    links = []
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<footer class="footer" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>${text}</p> ${links.length > 0 && renderTemplate`<ul class="links" data-astro-cid-sz7xmlte> ${links.map((link) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(link.href, "href")} data-astro-cid-sz7xmlte>${link.label}</a> </li>`)} </ul>`} </footer> `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("https://vadimchik.github.io");
const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ThemeToggle;
  const {
    label = "Toggle theme",
    storageKey = "theme"
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<button type="button" class="theme-toggle"', " data-theme-toggle", " data-astro-cid-x3pjskd3> <span data-theme-icon aria-hidden=\"true\" data-astro-cid-x3pjskd3>\u25D0</span> <span data-theme-label data-astro-cid-x3pjskd3>Theme</span> </button> <script>\n  const getPreferredTheme = () => {\n    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n  };\n\n  const applyTheme = (theme) => {\n    document.documentElement.dataset.theme = theme;\n  };\n\n  const setupToggle = (button) => {\n    const storageKey = button.dataset.storageKey || 'theme';\n    const savedTheme = window.localStorage.getItem(storageKey);\n    const initialTheme = savedTheme || getPreferredTheme();\n\n    applyTheme(initialTheme);\n\n    const setLabel = (theme) => {\n      const nextTheme = theme === 'dark' ? 'light' : 'dark';\n      const label = nextTheme === 'dark' ? 'Dark' : 'Light';\n      const textNode = button.querySelector('[data-theme-label]');\n      if (textNode) {\n        textNode.textContent = label;\n      }\n      button.setAttribute('aria-pressed', String(theme === 'dark'));\n      button.setAttribute('title', `Switch to ${nextTheme} theme`);\n    };\n\n    setLabel(initialTheme);\n\n    button.addEventListener('click', () => {\n      const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';\n      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';\n\n      applyTheme(nextTheme);\n      window.localStorage.setItem(storageKey, nextTheme);\n      setLabel(nextTheme);\n    });\n  };\n\n  document.querySelectorAll('[data-theme-toggle]').forEach(setupToggle);\n<\/script> "], ["", '<button type="button" class="theme-toggle"', " data-theme-toggle", " data-astro-cid-x3pjskd3> <span data-theme-icon aria-hidden=\"true\" data-astro-cid-x3pjskd3>\u25D0</span> <span data-theme-label data-astro-cid-x3pjskd3>Theme</span> </button> <script>\n  const getPreferredTheme = () => {\n    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n  };\n\n  const applyTheme = (theme) => {\n    document.documentElement.dataset.theme = theme;\n  };\n\n  const setupToggle = (button) => {\n    const storageKey = button.dataset.storageKey || 'theme';\n    const savedTheme = window.localStorage.getItem(storageKey);\n    const initialTheme = savedTheme || getPreferredTheme();\n\n    applyTheme(initialTheme);\n\n    const setLabel = (theme) => {\n      const nextTheme = theme === 'dark' ? 'light' : 'dark';\n      const label = nextTheme === 'dark' ? 'Dark' : 'Light';\n      const textNode = button.querySelector('[data-theme-label]');\n      if (textNode) {\n        textNode.textContent = label;\n      }\n      button.setAttribute('aria-pressed', String(theme === 'dark'));\n      button.setAttribute('title', \\`Switch to \\${nextTheme} theme\\`);\n    };\n\n    setLabel(initialTheme);\n\n    button.addEventListener('click', () => {\n      const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';\n      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';\n\n      applyTheme(nextTheme);\n      window.localStorage.setItem(storageKey, nextTheme);\n      setLabel(nextTheme);\n    });\n  };\n\n  document.querySelectorAll('[data-theme-toggle]').forEach(setupToggle);\n<\/script> "])), maybeRenderHead(), addAttribute(label, "aria-label"), addAttribute(storageKey, "data-storage-key"));
}, "M:/Web/GitHub/Astro/pulsereader/src/components/ThemeToggle.astro", void 0);

const $$Astro$1 = createAstro("https://vadimchik.github.io");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "PulseReader",
    description = "PulseReader news and articles.",
    lang = "ru",
    showHeader = true,
    showFooter = true,
    containerSize = "lg",
    navLinks,
    footerLinks,
    image,
    noindex = false
  } = Astro2.props;
  const canonicalUrl = new URL(Astro2.url.pathname, Astro2.site);
  const baseUrl = "/pulsereader";
  const homeHref = baseUrl.replace(/\/$/, "");
  const defaultImagePath = `${baseUrl}images/og-default.svg`;
  const imageUrl = new URL(image ?? defaultImagePath, Astro2.site).toString();
  return renderTemplate`<html${addAttribute(lang, "lang")} data-astro-cid-37fxchfa> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="robots"${addAttribute(noindex ? "noindex, nofollow" : "index, follow", "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:image"${addAttribute(imageUrl, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(imageUrl, "content")}>${renderHead()}</head> <body data-astro-cid-37fxchfa> ${renderComponent($$result, "Container", $$Container, { "as": "div", "size": containerSize, "data-astro-cid-37fxchfa": true }, { "default": ($$result2) => renderTemplate`${showHeader && renderTemplate`${renderComponent($$result2, "Header", $$Header, { "links": navLinks, "homeHref": homeHref, "data-astro-cid-37fxchfa": true }, { "actions": ($$result3) => renderTemplate`${renderSlot($$result3, $$slots["header-actions"], renderTemplate` ${renderComponent($$result3, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-37fxchfa": true })} `)}` })}`}<main data-astro-cid-37fxchfa> ${renderSlot($$result2, $$slots["default"])} </main> ${showFooter && renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "links": footerLinks, "data-astro-cid-37fxchfa": true })}`}` })} </body></html>`;
}, "M:/Web/GitHub/Astro/pulsereader/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro("https://vadimchik.github.io");
const $$LanguageSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LanguageSwitcher;
  const { locale, path = "/" } = Astro2.props;
  const withoutBase = path.replace(new RegExp(`^${"/pulsereader".replace(/\/$/, "")}`), "") || "/";
  const withoutLocale = withoutBase.replace(/^\/(en|uk|ru)(?=\/|$)/, "") || "/";
  const makeHref = (target) => {
    const prefix = localePrefix(target);
    if (withoutLocale === "/") {
      return prefix;
    }
    return `${prefix}${withoutLocale}`;
  };
  return renderTemplate`${maybeRenderHead()}<nav class="lang-switcher" aria-label="Language switcher" data-astro-cid-a2mxz4y6> ${LOCALES.map((code) => renderTemplate`<a${addAttribute(["lang-link", { active: code === locale }], "class:list")}${addAttribute(makeHref(code), "href")} data-astro-cid-a2mxz4y6>${code.toUpperCase()}</a>`)} </nav> `;
}, "M:/Web/GitHub/Astro/pulsereader/src/components/LanguageSwitcher.astro", void 0);

export { $$BaseLayout as $, $$LanguageSwitcher as a, $$ThemeToggle as b };
