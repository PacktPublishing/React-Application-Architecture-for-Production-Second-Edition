import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { useCreateIdeaMutation } from '@/features/ideas/api/create-idea';
import { IdeaForm } from '@/features/ideas/components/idea-form';
import { ideasQueryKeys } from '@/features/ideas/config/query-keys';
import { useNotificationActions } from '@/stores/notifications';

export default function NewIdeaPage() {
  const { t } = useTranslation(['ideas']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationActions();

  const createIdeaMutation = useCreateIdeaMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.current() });
        showNotification({ type: 'success', title: t('ideas:ideaCreated') });
        navigate('/dashboard/ideas');
      },
    },
  });

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('ideas:createNewIdea')}
          </h1>
          <p className="text-muted-foreground">{t('ideas:shareYourAI')}</p>
        </div>

        {createIdeaMutation.error && (
          <ErrorMessage error={createIdeaMutation.error} />
        )}
        <IdeaForm
          onSubmit={createIdeaMutation.mutate}
          onCancel={() => navigate('/dashboard/ideas')}
          isSubmitting={createIdeaMutation.isPending}
        />
      </div>
    </div>
  );
}
