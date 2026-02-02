import { data } from 'react-router';

import { localeCookie } from '@/app/middleware/i18next';
import { i18nConfig } from '@/config/i18n';

import type { Route } from './+types/set-language';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const language = formData.get(i18nConfig.cookieName);

  if (
    typeof language !== 'string' ||
    !i18nConfig.supportedLanguages.includes(language as never)
  ) {
    return data({ success: false }, { status: 400 });
  }

  return data(
    { success: true },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(language),
      },
    },
  );
}
