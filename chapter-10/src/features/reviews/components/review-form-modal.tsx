import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Review, CreateReviewData } from '@/types/generated/types.gen';

import { ReviewForm } from './review-form';

export type ReviewFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewData['body']) => void;
  initialReview?: Review | null;
  isSubmitting: boolean;
  ideaId?: string;
  error?: Error | null;
};

export function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialReview,
  isSubmitting,
  ideaId,
  error,
}: ReviewFormModalProps) {
  const { t } = useTranslation(['reviews']);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialReview ? t('reviews:editReview') : t('reviews:writeReview')}
          </DialogTitle>
          <DialogDescription>
            {initialReview
              ? t('reviews:editReviewDescription')
              : t('reviews:writeReviewDescription')}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onModalClose={onClose}
          initialReview={initialReview}
          error={error}
          ideaId={ideaId}
        />
      </DialogContent>
    </Dialog>
  );
}
