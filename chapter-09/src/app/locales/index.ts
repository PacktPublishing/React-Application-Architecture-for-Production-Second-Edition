import { type Language } from '@/config/i18n';

import en from './en';
import es from './es';

export type Resource = typeof en;

export const resources: Record<Language, Resource> = { en, es };
