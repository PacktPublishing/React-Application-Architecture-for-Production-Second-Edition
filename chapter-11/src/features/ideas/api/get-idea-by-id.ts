import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetIdeaByIdResponse } from '@/types/generated/types.gen';
import {
  zGetIdeaByIdData,
  zGetIdeaByIdResponse,
} from '@/types/generated/zod.gen';

import { ideasQueryKeys } from '../config/query-keys';

export async function getIdeaById(id: string): Promise<GetIdeaByIdResponse> {
  const validatedData = zGetIdeaByIdData.parse({ path: { id } });

  const response = await api.get<GetIdeaByIdResponse>(
    `/ideas/${validatedData.path.id}`,
  );

  return zGetIdeaByIdResponse.parse(response);
}

export function getIdeaByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ideasQueryKeys.detail(id),
    queryFn: () => getIdeaById(id),
  });
}

export function useIdeaByIdQuery({
  id,
  options,
}: {
  id: string;
  options?: Omit<
    ReturnType<typeof getIdeaByIdQueryOptions>,
    'queryKey' | 'queryFn'
  >;
}) {
  return useQuery({
    ...getIdeaByIdQueryOptions(id),
    ...options,
  });
}
