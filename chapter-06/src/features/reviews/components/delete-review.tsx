import { useQueryClient } from '@tanstack/react-query';

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
import { reviewsQueryKeys } from '../config/query-keys';

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
  const queryClient = useQueryClient();

  const { showNotification } = useNotificationActions();

  const deleteReviewMutation = useDeleteReviewMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.byIdea(review.ideaId),
        });
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.current(),
        });
        showNotification({
          type: 'success',
          title: 'Review deleted',
        });
        onClose();
        onSuccess?.();
      },
      onError: () => {
        showNotification({
          type: 'error',
          title: 'Failed to delete review',
        });
      },
    },
  });

  const handleDelete = () => {
    deleteReviewMutation.mutate({ id: review.id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteReviewMutation.error && (
          <ErrorMessage error={deleteReviewMutation.error} />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteReviewMutation.isPending}
          >
            {deleteReviewMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
