import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { useIdeaByIdQuery } from '@/features/ideas/api/get-idea-by-id';
import { useUpdateIdeaMutation } from '@/features/ideas/api/update-idea';
import { IdeaForm } from '@/features/ideas/components/idea-form';
import { ideasQueryKeys } from '@/features/ideas/config/query-keys';
import { useNotificationActions } from '@/stores/notifications';

export default function EditIdeaPage() {
  const { t } = useTranslation(['ideas']);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { canEditIdea } = useAuthorization();

  const { showNotification } = useNotificationActions();

  const ideaQuery = useIdeaByIdQuery({ id });
  const idea = ideaQuery.data;

  const updateIdeaMutation = useUpdateIdeaMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.current() });
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.detail(id) });
        showNotification({ type: 'success', title: t('ideas:ideaUpdated') });
        navigate(`/ideas/${id}`);
      },
    },
  });

  if (ideaQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (ideaQuery.isError) {
    return <ErrorMessage error={ideaQuery.error} />;
  }

  if (!idea) {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('ideas:ideaNotFound')}</h1>
        </div>
      </div>
    );
  }

  if (!canEditIdea(idea)) {
    return <Navigate to={`/ideas/${id}`} />;
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('ideas:editIdeaTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('ideas:editIdeaDescription')}
          </p>
        </div>

        {updateIdeaMutation.error && (
          <ErrorMessage error={updateIdeaMutation.error} />
        )}
        <IdeaForm
          initialData={idea}
          onSubmit={(data) => {
            updateIdeaMutation.mutate({
              body: data,
              path: { id },
            });
          }}
          onCancel={() => navigate(`/dashboard/ideas/${id}`)}
          isSubmitting={updateIdeaMutation.isPending}
        />
      </div>
    </div>
  );
}
