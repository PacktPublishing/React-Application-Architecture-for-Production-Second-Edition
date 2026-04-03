import { cacheHeader } from 'pretty-cache-header';
import { data } from 'react-router';
import { z } from 'zod';

import { resources } from '@/app/locales';
import type { Language } from '@/config/i18n';

import type { Route } from './+types/locales';

export async function loader({ params }: Route.LoaderArgs) {
  const lng = z
    .enum(Object.keys(resources) as Array<Language>)
    .safeParse(params.lng);

  if (lng.error) return data({ error: lng.error }, { status: 400 });

  const namespaces = resources[lng.data];

  const ns = z
    .enum(Object.keys(namespaces) as Array<keyof typeof namespaces>)
    .safeParse(
      params.ns === '' || params.ns === 'translation' ? 'common' : params.ns,
    );

  if (ns.error) return data({ error: ns.error }, { status: 400 });

  const headers = new Headers();

  // Translations rarely change, so cache aggressively
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Cache-Control',
      cacheHeader({
        maxAge: '5m',
        sMaxage: '1d',
        staleWhileRevalidate: '7d',
        staleIfError: '7d',
      }),
    );
  }

  return data(namespaces[ns.data], { headers });
}
