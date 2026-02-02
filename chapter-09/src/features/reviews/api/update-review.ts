import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  UpdateReviewData,
  UpdateReviewResponse,
} from '@/types/generated/types.gen';
import type { GetReviewsByIdeaResponse } from '@/types/generated/types.gen';
import {
  zUpdateReviewData,
  zUpdateReviewResponse,
} from '@/types/generated/zod.gen';

import { reviewsQueryKeys } from '../config/query-keys';

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
  onSuccess,
  onError,
  ideaId,
}: {
  options?: Omit<
    UseMutationOptions<
      UpdateReviewResponse,
      Error,
      { body: UpdateReviewData['body']; path: UpdateReviewData['path'] }
    >,
    'mutationFn'
  >;
  onSuccess: () => void;
  onError: () => void;
  ideaId: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...getUpdateReviewMutationOptions(),
    ...options,
    onMutate: async ({ body, path }) => {
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

      // Optimistically update the cache by replacing the matching review
      queryClient.setQueryData<GetReviewsByIdeaResponse>(
        reviewsQueryKeys.byIdea(ideaId),
        (old) => ({
          data: old?.data
            ? old.data.map((review) =>
                review.id === path.id
                  ? {
                      ...review,
                      content: body.content ?? review.content,
                      rating: body.rating ?? review.rating,
                      updatedAt: new Date().toISOString(),
                    }
                  : review,
              )
            : [],
        }),
      );

      // Update current user reviews
      queryClient.setQueryData<GetReviewsByIdeaResponse>(
        reviewsQueryKeys.current(),
        (old) => ({
          data: old?.data
            ? old.data.map((review) =>
                review.id === path.id
                  ? {
                      ...review,
                      content: body.content ?? review.content,
                      rating: body.rating ?? review.rating,
                      updatedAt: new Date().toISOString(),
                    }
                  : review,
              )
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
      // Refetch to get the server data
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
