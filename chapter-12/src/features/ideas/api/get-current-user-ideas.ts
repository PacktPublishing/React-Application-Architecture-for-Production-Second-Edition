import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetCurrentUserIdeasResponse } from '@/types/generated/types.gen';
import { zGetCurrentUserIdeasResponse } from '@/types/generated/zod.gen';

import { ideasQueryKeys } from '../config/query-keys';

export async function getCurrentUserIdeas(): Promise<GetCurrentUserIdeasResponse> {
  const response = await api.get<GetCurrentUserIdeasResponse>('/ideas/current');

  return zGetCurrentUserIdeasResponse.parse(response);
}

export function getCurrentUserIdeasQueryOptions() {
  return queryOptions({
    queryKey: ideasQueryKeys.current(),
    queryFn: () => getCurrentUserIdeas(),
  });
}

export function useCurrentUserIdeasQuery({
  options,
}: {
  options?: Omit<
    ReturnType<typeof getCurrentUserIdeasQueryOptions>,
    'queryKey' | 'queryFn'
  >;
} = {}) {
  return useQuery({
    ...getCurrentUserIdeasQueryOptions(),
    ...options,
  });
}
