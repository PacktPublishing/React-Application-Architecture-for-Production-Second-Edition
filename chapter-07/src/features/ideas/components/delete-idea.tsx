import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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
import type { Idea } from '@/types/generated/types.gen';

import { useDeleteIdeaMutation } from '../api/delete-idea';
import { ideasQueryKeys } from '../config/query-keys';

export type DeleteIdeaProps = {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function DeleteIdea({
  idea,
  isOpen,
  onClose,
  onSuccess,
}: DeleteIdeaProps) {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationActions();
  const navigate = useNavigate();

  const deleteIdeaMutation = useDeleteIdeaMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.current() });
        queryClient.invalidateQueries({
          queryKey: ideasQueryKeys.detail(idea.id),
        });
        showNotification({ type: 'success', title: 'Idea deleted' });
        onClose();
        onSuccess?.();
        navigate('/dashboard/ideas');
      },
      onError: () => {
        showNotification({ type: 'error', title: 'Failed to delete idea' });
      },
    },
  });

  const handleDelete = () => {
    deleteIdeaMutation.mutate({ id: idea.id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Idea</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{idea?.title}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteIdeaMutation.error && (
          <ErrorMessage error={deleteIdeaMutation.error} />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteIdeaMutation.isPending}
          >
            {deleteIdeaMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
