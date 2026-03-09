import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetReviewsByUserResponse } from '@/types/generated/types.gen';
import {
  zGetReviewsByUserData,
  zGetReviewsByUserResponse,
} from '@/types/generated/zod.gen';

import { reviewsQueryKeys } from '../config/query-keys';

export async function getReviewsByUser({
  username,
}: {
  username: string;
}): Promise<GetReviewsByUserResponse> {
  const validatedData = zGetReviewsByUserData.parse({
    path: { username },
  });

  const response = await api.get<GetReviewsByUserResponse>(
    `/reviews/user/${validatedData.path.username}`,
  );

  return zGetReviewsByUserResponse.parse(response);
}

export function getReviewsByUserQueryOptions({
  username = '',
}: {
  username: string | undefined;
}) {
  return queryOptions({
    queryKey: reviewsQueryKeys.byUser(username),
    queryFn: () => getReviewsByUser({ username }),
    enabled: !!username,
  });
}

export function useReviewsByUserQuery({
  username,
  options,
}: {
  username: string | undefined;
  options?: Omit<
    ReturnType<typeof getReviewsByUserQueryOptions>,
    'queryKey' | 'queryFn' | 'enabled'
  >;
}) {
  return useQuery({
    ...getReviewsByUserQueryOptions({ username }),
    ...options,
  });
}
