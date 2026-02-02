import { useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Review } from '@/types/generated/types.gen';

import { useUpdateReviewMutation } from '../api/update-review';
import { reviewsQueryKeys } from '../config/query-keys';

import { DeleteReview } from './delete-review';
import { ReviewFormModal } from './review-form-modal';

export type ReviewActionsProps = {
  review: Review;
};

export function ReviewActions({ review }: ReviewActionsProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const updateReviewMutation = useUpdateReviewMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.byIdea(review.ideaId),
        });
        queryClient.invalidateQueries({
          queryKey: reviewsQueryKeys.current(),
        });
        setShowEditDialog(false);
      },
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Review
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReviewFormModal
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSubmit={(data) => {
          updateReviewMutation.mutate({ body: data, path: { id: review.id } });
        }}
        initialReview={review}
        isSubmitting={updateReviewMutation.isPending}
        ideaId={review.ideaId}
        error={updateReviewMutation.error}
      />

      <DeleteReview
        review={review}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
