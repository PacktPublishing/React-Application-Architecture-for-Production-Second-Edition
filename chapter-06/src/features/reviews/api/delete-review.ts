import {
  mutationOptions,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  DeleteReviewData,
  DeleteReviewResponse,
} from '@/types/generated/types.gen';
import {
  zDeleteReviewData,
  zDeleteReviewResponse,
} from '@/types/generated/zod.gen';

export async function deleteReview(
  path: DeleteReviewData['path'],
): Promise<DeleteReviewResponse> {
  const validatedData = zDeleteReviewData.parse({ path });

  const response = await api.delete<DeleteReviewResponse>(
    `/reviews/${validatedData.path.id}`,
  );

  return zDeleteReviewResponse.parse(response);
}

export function getDeleteReviewMutationOptions() {
  return mutationOptions({
    mutationFn: deleteReview,
  });
}

export function useDeleteReviewMutation({
  options,
}: {
  options?: Omit<
    UseMutationOptions<DeleteReviewResponse, Error, DeleteReviewData['path']>,
    'mutationFn'
  >;
}) {
  return useMutation({
    ...getDeleteReviewMutationOptions(),
    ...options,
  });
}
