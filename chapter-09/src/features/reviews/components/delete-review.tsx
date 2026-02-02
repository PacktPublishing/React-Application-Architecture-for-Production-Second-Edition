import { useTranslation } from 'react-i18next';

import { ErrorMessage } from '@/components/error-message';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNotificationActions } from '@/stores/notifications';
import type { Review } from '@/types/generated/types.gen';

import { useDeleteReviewMutation } from '../api/delete-review';

export type DeleteReviewProps = {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function DeleteReview({
  review,
  isOpen,
  onClose,
  onSuccess,
}: DeleteReviewProps) {
  const { t } = useTranslation(['reviews', 'common']);
  const { showNotification } = useNotificationActions();

  const deleteReviewMutation = useDeleteReviewMutation({
    ideaId: review.ideaId,
    onSuccess: () => {
      showNotification({
        type: 'success',
        title: t('reviews:reviewDeleted'),
      });
      onClose();
      onSuccess?.();
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: t('reviews:reviewDeleteError'),
      });
    },
  });

  const handleDelete = () => {
    deleteReviewMutation.mutate({ id: review.id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('reviews:deleteReview')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('reviews:deleteReviewConfirm')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteReviewMutation.error && (
          <ErrorMessage error={deleteReviewMutation.error} />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteReviewMutation.isPending}
          >
            {deleteReviewMutation.isPending
              ? t('common:deleting')
              : t('common:delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
