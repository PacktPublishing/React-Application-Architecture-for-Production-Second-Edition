export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Language = keyof typeof languages;

const supportedLanguages = Object.keys(languages) as Language[];

export const i18nConfig = {
  defaultNS: 'common' as const,
  fallbackLng: 'en' as const,
  supportedLanguages,
  backend: {
    loadPath: '/api/locales/{{lng}}/{{ns}}',
  },
  detection: {
    order: ['htmlTag'],
    caches: [],
  },
  cookieName: 'lng' as const,
};
