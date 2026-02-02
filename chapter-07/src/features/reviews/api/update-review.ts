import {
  mutationOptions,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  UpdateReviewData,
  UpdateReviewResponse,
} from '@/types/generated/types.gen';
import {
  zUpdateReviewData,
  zUpdateReviewResponse,
} from '@/types/generated/zod.gen';

export async function updateReview({
  body,
  path,
}: {
  body: UpdateReviewData['body'];
  path: UpdateReviewData['path'];
}): Promise<UpdateReviewResponse> {
  const validatedData = zUpdateReviewData.parse({
    path,
    body,
  });

  const response = await api.patch<UpdateReviewResponse>(
    `/reviews/${validatedData.path.id}`,
    validatedData.body,
  );

  return zUpdateReviewResponse.parse(response);
}

export function getUpdateReviewMutationOptions() {
  return mutationOptions({
    mutationFn: updateReview,
  });
}

export function useUpdateReviewMutation({
  options,
}: {
  options?: Omit<
    UseMutationOptions<
      UpdateReviewResponse,
      Error,
      { body: UpdateReviewData['body']; path: UpdateReviewData['path'] }
    >,
    'mutationFn'
  >;
}) {
  return useMutation({
    ...getUpdateReviewMutationOptions(),
    ...options,
  });
}
