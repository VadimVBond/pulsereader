const LOCALES = ["en", "uk", "ru"];
function isLocale(value) {
  return value === "en" || value === "uk" || value === "ru";
}
function withBasePath(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = "/pulsereader".replace(/\/$/, "");
  if (!baseUrl || baseUrl === "/") {
    return normalizedPath;
  }
  if (normalizedPath === "/") {
    return baseUrl;
  }
  return `${baseUrl}${normalizedPath}`;
}
function localePrefix(locale) {
  if (locale === "ru") {
    return withBasePath("/");
  }
  return withBasePath(`/${locale}`);
}
const UI_TEXT_BY_LOCALE = {
  en: {
    navHome: "Home",
    navCategories: "Categories",
    navAbout: "About",
    navContact: "Contact",
    searchPlaceholder: "Search articles...",
    allSources: "All sources",
    searchButton: "Search",
    articlesFound: "articles found",
    sourcesUsed: "sources used",
    duplicatesRemoved: "duplicates removed",
    showingFrom: "Showing news from",
    trending: "Trending Articles",
    moreStories: "More Stories",
    readArticle: "Read article",
    noNewsTitle: "No RSS articles available right now",
    noNewsText: "Try another source or refresh later.",
    backHome: "Back to home",
    readOriginal: "Read original article",
    articleKicker: "Article",
    aggregatedNote: "This article was aggregated from an external RSS source. Open the original page for full content and context.",
    langLabel: "Language",
    imageUnavailable: "Image unavailable from source",
    translateDescription: "Translate description",
    translating: "Translating..."
  },
  uk: {
    navHome: "Головна",
    navCategories: "Категорії",
    navAbout: "Про нас",
    navContact: "Контакти",
    searchPlaceholder: "Пошук статей...",
    allSources: "Усі джерела",
    searchButton: "Пошук",
    articlesFound: "статей знайдено",
    sourcesUsed: "джерел використано",
    duplicatesRemoved: "дублікатів видалено",
    showingFrom: "Показано новини з",
    trending: "Популярні статті",
    moreStories: "Більше новин",
    readArticle: "Читати статтю",
    noNewsTitle: "Зараз RSS-новини недоступні",
    noNewsText: "Спробуйте інше джерело або оновіть сторінку пізніше.",
    backHome: "Назад на головну",
    readOriginal: "Читати оригінал",
    articleKicker: "Стаття",
    aggregatedNote: "Цю статтю агреговано із зовнішнього RSS-джерела. Відкрийте оригінал для повного контексту.",
    langLabel: "Мова",
    imageUnavailable: "Зображення недоступне у джерелі",
    translateDescription: "Перекласти опис",
    translating: "Переклад..."
  },
  ru: {
    navHome: "Главная",
    navCategories: "Категории",
    navAbout: "О проекте",
    navContact: "Контакты",
    searchPlaceholder: "Поиск статей...",
    allSources: "Все источники",
    searchButton: "Поиск",
    articlesFound: "статей найдено",
    sourcesUsed: "источников использовано",
    duplicatesRemoved: "дубликатов удалено",
    showingFrom: "Показаны новости из",
    trending: "Популярные статьи",
    moreStories: "Больше новостей",
    readArticle: "Читать статью",
    noNewsTitle: "Сейчас RSS-новости недоступны",
    noNewsText: "Попробуйте другой источник или обновите страницу позже.",
    backHome: "Назад на главную",
    readOriginal: "Читать оригинал",
    articleKicker: "Статья",
    aggregatedNote: "Эта статья агрегирована из внешнего RSS-источника. Откройте оригинал для полного контекста.",
    langLabel: "Язык",
    imageUnavailable: "Изображение недоступно в источнике",
    translateDescription: "Перевести описание",
    translating: "Перевод..."
  }
};
function getUiText(locale) {
  return UI_TEXT_BY_LOCALE[locale];
}

export { LOCALES as L, getUiText as g, isLocale as i, localePrefix as l };
