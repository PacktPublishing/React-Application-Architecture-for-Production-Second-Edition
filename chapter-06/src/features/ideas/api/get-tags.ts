import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetAllTagsResponse } from '@/types/generated/types.gen';
import { zGetAllTagsResponse } from '@/types/generated/zod.gen';

import { ideasQueryKeys } from '../config/query-keys';

export async function getTags(): Promise<GetAllTagsResponse> {
  const response = await api.get<GetAllTagsResponse>('/ideas/tags');

  return zGetAllTagsResponse.parse(response);
}

export function getTagsQueryOptions() {
  return queryOptions({
    queryKey: ideasQueryKeys.tags(),
    queryFn: () => getTags(),
  });
}

export function useTagsQuery({
  options,
}: {
  options?: Omit<
    ReturnType<typeof getTagsQueryOptions>,
    'queryKey' | 'queryFn'
  >;
} = {}) {
  return useQuery({
    ...getTagsQueryOptions(),
    ...options,
  });
}
