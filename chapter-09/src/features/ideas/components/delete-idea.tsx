import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['ideas', 'common']);
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
        showNotification({ type: 'success', title: t('ideas:ideaDeleted') });
        onClose();
        onSuccess?.();
        navigate('/dashboard/ideas');
      },
      onError: () => {
        showNotification({
          type: 'error',
          title: t('ideas:ideaDeleteError'),
        });
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
          <AlertDialogTitle>{t('ideas:deleteIdea')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('ideas:deleteIdeaConfirm', { title: idea?.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteIdeaMutation.error && (
          <ErrorMessage error={deleteIdeaMutation.error} />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteIdeaMutation.isPending}
          >
            {deleteIdeaMutation.isPending
              ? t('common:deleting')
              : t('common:delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
