import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCreateReviewMutation } from '@/features/reviews/api/create-review';
import { ReviewFormModal } from '@/features/reviews/components/review-form-modal';
import { reviewsQueryKeys } from '@/features/reviews/config/query-keys';
import type { CreateReviewData } from '@/types/generated/types.gen';

export function CreateReview({ ideaId }: { ideaId: string }) {
  const queryClient = useQueryClient();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const createReviewMutation = useCreateReviewMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.byIdea(ideaId),
        });
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.current(),
        });
        setIsReviewModalOpen(false);
      },
    },
  });

  const handleOpenReviewModalForCreate = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (data: CreateReviewData['body']) => {
    return createReviewMutation.mutate(data);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    createReviewMutation.reset();
  };

  return (
    <>
      <Button
        onClick={handleOpenReviewModalForCreate}
        disabled={createReviewMutation.isPending}
      >
        Write Review
      </Button>
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
        isSubmitting={createReviewMutation.isPending}
        ideaId={ideaId}
        error={createReviewMutation.error}
      />
    </>
  );
}
