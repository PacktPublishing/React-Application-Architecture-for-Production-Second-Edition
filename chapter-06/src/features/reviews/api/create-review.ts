import {
  mutationOptions,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  CreateReviewData,
  CreateReviewResponse,
} from '@/types/generated/types.gen';
import {
  zCreateReviewData,
  zCreateReviewResponse,
} from '@/types/generated/zod.gen';

export async function createReview(
  data: CreateReviewData['body'],
): Promise<CreateReviewResponse> {
  const validatedData = zCreateReviewData.parse({ body: data });

  const response = await api.post<CreateReviewResponse>(
    '/reviews',
    validatedData.body,
  );

  return zCreateReviewResponse.parse(response);
}

export function getCreateReviewMutationOptions() {
  return mutationOptions({
    mutationFn: createReview,
  });
}

export function useCreateReviewMutation({
  options,
}: {
  options?: Omit<
    UseMutationOptions<CreateReviewResponse, Error, CreateReviewData['body']>,
    'mutationFn'
  >;
}) {
  return useMutation({
    ...getCreateReviewMutationOptions(),
    ...options,
  });
}
