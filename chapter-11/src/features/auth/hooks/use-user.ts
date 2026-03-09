import { useRouteLoaderData } from 'react-router';

import type { RootLoaderData } from '@/types/app-context';

export function useUser() {
  const rootData = useRouteLoaderData<RootLoaderData>('root');
  return rootData?.user ?? null;
}
