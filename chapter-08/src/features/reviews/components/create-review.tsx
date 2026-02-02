import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCreateReviewMutation } from '@/features/reviews/api/create-review';
import { ReviewFormModal } from '@/features/reviews/components/review-form-modal';
import { useNotificationActions } from '@/stores/notifications';
import type { CreateReviewData } from '@/types/generated/types.gen';

export function CreateReview({ ideaId }: { ideaId: string }) {
  const { showNotification } = useNotificationActions();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const createReviewMutation = useCreateReviewMutation({
    ideaId,
    onSuccess: () => {
      setIsReviewModalOpen(false);
      showNotification({
        type: 'success',
        title: 'Review created',
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: 'Failed to create review',
      });
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
