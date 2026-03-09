import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  DeleteReviewData,
  DeleteReviewResponse,
} from '@/types/generated/types.gen';
import type { GetReviewsByIdeaResponse } from '@/types/generated/types.gen';
import {
  zDeleteReviewData,
  zDeleteReviewResponse,
} from '@/types/generated/zod.gen';

import { reviewsQueryKeys } from '../config/query-keys';

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
  onSuccess,
  onError,
  ideaId,
}: {
  options?: Omit<
    UseMutationOptions<DeleteReviewResponse, Error, DeleteReviewData['path']>,
    'mutationFn'
  >;
  onSuccess: () => void;
  onError: () => void;
  ideaId: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...getDeleteReviewMutationOptions(),
    ...options,
    onMutate: async (path) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: reviewsQueryKeys.byIdea(ideaId),
      });
      await queryClient.cancelQueries({
        queryKey: reviewsQueryKeys.current(),
      });

      // Snapshot the previous values
      const previousReviewsByIdea =
        queryClient.getQueryData<GetReviewsByIdeaResponse>(
          reviewsQueryKeys.byIdea(ideaId),
        );
      const previousCurrentReviews =
        queryClient.getQueryData<GetReviewsByIdeaResponse>(
          reviewsQueryKeys.current(),
        );

      // Optimistically update the cache by filtering out the deleted review
      queryClient.setQueryData<GetReviewsByIdeaResponse>(
        reviewsQueryKeys.byIdea(ideaId),
        (old) => ({
          data: old?.data
            ? old.data.filter((review) => review.id !== path.id)
            : [],
        }),
      );

      // Update current user reviews
      queryClient.setQueryData<GetReviewsByIdeaResponse>(
        reviewsQueryKeys.current(),
        (old) => ({
          data: old?.data
            ? old.data.filter((review) => review.id !== path.id)
            : [],
        }),
      );

      // Return context with the previous values
      return { previousReviewsByIdea, previousCurrentReviews };
    },
    onError: (_err, _variables, context) => {
      // Rollback to the previous values on error
      if (context?.previousReviewsByIdea) {
        queryClient.setQueryData(
          reviewsQueryKeys.byIdea(ideaId),
          context.previousReviewsByIdea,
        );
      }
      if (context?.previousCurrentReviews) {
        queryClient.setQueryData(
          reviewsQueryKeys.current(),
          context.previousCurrentReviews,
        );
      }
      onError();
    },
    onSuccess: () => {
      // Refetch to ensure consistency with server
      queryClient.invalidateQueries({
        queryKey: reviewsQueryKeys.byIdea(ideaId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewsQueryKeys.current(),
      });
      onSuccess();
    },
  });
}
