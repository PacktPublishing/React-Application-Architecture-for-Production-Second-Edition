import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetReviewsByIdeaResponse } from '@/types/generated/types.gen';
import {
  zGetReviewsByIdeaData,
  zGetReviewsByIdeaResponse,
} from '@/types/generated/zod.gen';

import { reviewsQueryKeys } from '../config/query-keys';

export async function getReviewsByIdea(
  id: string,
): Promise<GetReviewsByIdeaResponse> {
  const validatedData = zGetReviewsByIdeaData.parse({
    path: { id },
  });

  const response = await api.get<GetReviewsByIdeaResponse>(
    `/reviews/idea/${validatedData.path.id}`,
  );

  return zGetReviewsByIdeaResponse.parse(response);
}

export function getReviewsByIdeaQueryOptions(id: string) {
  return queryOptions({
    queryKey: reviewsQueryKeys.byIdea(id),
    queryFn: () => getReviewsByIdea(id),
  });
}

export function useReviewsByIdeaQuery({
  id,
  options,
}: {
  id: string;
  options?: Omit<
    ReturnType<typeof getReviewsByIdeaQueryOptions>,
    'queryKey' | 'queryFn'
  >;
}) {
  return useQuery({
    ...getReviewsByIdeaQueryOptions(id),
    ...options,
  });
}
