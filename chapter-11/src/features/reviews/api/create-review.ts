import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { useUser } from '@/features/auth/hooks/use-user';
import { api } from '@/lib/api';
import type {
  CreateReviewData,
  CreateReviewResponse,
  Review,
} from '@/types/generated/types.gen';
import type { GetReviewsByIdeaResponse } from '@/types/generated/types.gen';
import {
  zCreateReviewData,
  zCreateReviewResponse,
} from '@/types/generated/zod.gen';

import { reviewsQueryKeys } from '../config/query-keys';

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
  onSuccess,
  onError,
  ideaId,
}: {
  options?: Omit<
    UseMutationOptions<CreateReviewResponse, Error, CreateReviewData['body']>,
    'mutationFn'
  >;
  onSuccess: () => void;
  onError: () => void;
  ideaId: string;
}) {
  const queryClient = useQueryClient();
  const user = useUser();
  return useMutation({
    ...getCreateReviewMutationOptions(),
    ...options,
    onMutate: async (newReview) => {
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

      // Optimistically update the cache with the new review
      if (user) {
        const optimisticReview: Review = {
          id: `temp-${Date.now()}`, // Temporary ID
          content: newReview.content,
          rating: newReview.rating,
          authorId: user.id,
          author: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
          ideaId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Update reviews by idea
        queryClient.setQueryData<GetReviewsByIdeaResponse>(
          reviewsQueryKeys.byIdea(ideaId),
          (old) => ({
            data: old?.data
              ? [optimisticReview, ...old.data]
              : [optimisticReview],
          }),
        );

        // Update current user reviews
        queryClient.setQueryData<GetReviewsByIdeaResponse>(
          reviewsQueryKeys.current(),
          (old) => ({
            data: old?.data
              ? [optimisticReview, ...old.data]
              : [optimisticReview],
          }),
        );
      }

      // Return context with the previous values
      return { previousReviewsByIdea, previousCurrentReviews };
    },
    onError: (_err, _newReview, context) => {
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
      // Refetch to get the server data with the real ID
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
