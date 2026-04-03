import { data } from 'react-router';
import z from 'zod';

import { localeCookie } from '@/app/middleware/i18next';
import { i18nConfig, languages, type Language } from '@/config/i18n';

import type { Route } from './+types/set-language';

const languageSchema = z.enum(
  Object.keys(languages) as [Language, ...Language[]],
);

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const language = languageSchema.safeParse(
    formData.get(i18nConfig.cookieName),
  );

  if (!language.success) {
    return data({ success: false }, { status: 400 });
  }

  return data(
    { success: true },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(language.data),
      },
    },
  );
}
