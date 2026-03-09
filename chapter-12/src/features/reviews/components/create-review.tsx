import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useCreateReviewMutation } from '@/features/reviews/api/create-review';
import { ReviewFormModal } from '@/features/reviews/components/review-form-modal';
import { useNotificationActions } from '@/stores/notifications';
import type { CreateReviewData } from '@/types/generated/types.gen';

export function CreateReview({ ideaId }: { ideaId: string }) {
  const { t } = useTranslation(['reviews']);
  const { showNotification } = useNotificationActions();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const createReviewMutation = useCreateReviewMutation({
    ideaId,
    onSuccess: () => {
      setIsReviewModalOpen(false);
      showNotification({
        type: 'success',
        title: t('reviews:reviewCreated'),
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: t('reviews:reviewCreateError'),
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
        {t('reviews:writeReview')}
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
