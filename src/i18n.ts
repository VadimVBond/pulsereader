export type Locale = 'en' | 'uk' | 'ru';

export const LOCALES: Locale[] = ['en', 'uk', 'ru'];

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'uk' || value === 'ru';
}

export function localePrefix(locale: Locale): string {
  return locale === 'ru' ? '' : `/${locale}`;
}

export interface UiText {
  navHome: string;
  navCategories: string;
  navAbout: string;
  navContact: string;
  searchPlaceholder: string;
  allSources: string;
  searchButton: string;
  articlesFound: string;
  sourcesUsed: string;
  duplicatesRemoved: string;
  showingFrom: string;
  trending: string;
  moreStories: string;
  readArticle: string;
  noNewsTitle: string;
  noNewsText: string;
  backHome: string;
  readOriginal: string;
  articleKicker: string;
  aggregatedNote: string;
  langLabel: string;
  imageUnavailable: string;
  translateDescription: string;
  translating: string;
}

export const UI_TEXT_BY_LOCALE: Record<Locale, UiText> = {
  en: {
    navHome: 'Home',
    navCategories: 'Categories',
    navAbout: 'About',
    navContact: 'Contact',
    searchPlaceholder: 'Search articles...',
    allSources: 'All sources',
    searchButton: 'Search',
    articlesFound: 'articles found',
    sourcesUsed: 'sources used',
    duplicatesRemoved: 'duplicates removed',
    showingFrom: 'Showing news from',
    trending: 'Trending Articles',
    moreStories: 'More Stories',
    readArticle: 'Read article',
    noNewsTitle: 'No RSS articles available right now',
    noNewsText: 'Try another source or refresh later.',
    backHome: 'Back to home',
    readOriginal: 'Read original article',
    articleKicker: 'Article',
    aggregatedNote: 'This article was aggregated from an external RSS source. Open the original page for full content and context.',
    langLabel: 'Language',
    imageUnavailable: 'Image unavailable from source',
    translateDescription: 'Translate description',
    translating: 'Translating...'
  },
  uk: {
    navHome: 'Головна',
    navCategories: 'Категорії',
    navAbout: 'Про нас',
    navContact: 'Контакти',
    searchPlaceholder: 'Пошук статей...',
    allSources: 'Усі джерела',
    searchButton: 'Пошук',
    articlesFound: 'статей знайдено',
    sourcesUsed: 'джерел використано',
    duplicatesRemoved: 'дублікатів видалено',
    showingFrom: 'Показано новини з',
    trending: 'Популярні статті',
    moreStories: 'Більше новин',
    readArticle: 'Читати статтю',
    noNewsTitle: 'Зараз RSS-новини недоступні',
    noNewsText: 'Спробуйте інше джерело або оновіть сторінку пізніше.',
    backHome: 'Назад на головну',
    readOriginal: 'Читати оригінал',
    articleKicker: 'Стаття',
    aggregatedNote: 'Цю статтю агреговано із зовнішнього RSS-джерела. Відкрийте оригінал для повного контексту.',
    langLabel: 'Мова',
    imageUnavailable: 'Зображення недоступне у джерелі',
    translateDescription: 'Перекласти опис',
    translating: 'Переклад...'
  },
  ru: {
    navHome: 'Главная',
    navCategories: 'Категории',
    navAbout: 'О проекте',
    navContact: 'Контакты',
    searchPlaceholder: 'Поиск статей...',
    allSources: 'Все источники',
    searchButton: 'Поиск',
    articlesFound: 'статей найдено',
    sourcesUsed: 'источников использовано',
    duplicatesRemoved: 'дубликатов удалено',
    showingFrom: 'Показаны новости из',
    trending: 'Популярные статьи',
    moreStories: 'Больше новостей',
    readArticle: 'Читать статью',
    noNewsTitle: 'Сейчас RSS-новости недоступны',
    noNewsText: 'Попробуйте другой источник или обновите страницу позже.',
    backHome: 'Назад на главную',
    readOriginal: 'Читать оригинал',
    articleKicker: 'Статья',
    aggregatedNote: 'Эта статья агрегирована из внешнего RSS-источника. Откройте оригинал для полного контекста.',
    langLabel: 'Язык',
    imageUnavailable: 'Изображение недоступно в источнике',
    translateDescription: 'Перевести описание',
    translating: 'Перевод...'
  }
};

export function getUiText(locale: Locale): UiText {
  return UI_TEXT_BY_LOCALE[locale];
}


