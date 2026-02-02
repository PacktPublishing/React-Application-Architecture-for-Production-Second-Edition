export const languages = {
  en: 'English',
  es: 'Español',
} as const;

const supportedLanguages = Object.keys(languages) as (keyof typeof languages)[];

export const i18nConfig = {
  defaultNS: 'common' as const,
  fallbackLng: supportedLanguages[0],
  supportedLanguages,
  backend: {
    loadPath: '/api/locales/{{lng}}/{{ns}}',
  },
  detection: {
    order: ['htmlTag'],
    caches: [],
  },
  cookieName: 'lng',
};
