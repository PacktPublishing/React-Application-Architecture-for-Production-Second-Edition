import { i18nConfig } from '@/config/i18n';

import en from './en';
import es from './es';

export type Language = (typeof i18nConfig.supportedLanguages)[number];

export type Resource = typeof en;

export const resources: Record<Language, Resource> = { en, es };
