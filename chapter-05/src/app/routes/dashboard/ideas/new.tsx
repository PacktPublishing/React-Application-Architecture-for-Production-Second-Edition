import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { useCreateIdeaMutation } from '@/features/ideas/api/create-idea';
import { IdeaForm } from '@/features/ideas/components/idea-form';
import { ideasQueryKeys } from '@/features/ideas/config/query-keys';

export default function NewIdeaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createIdeaMutation = useCreateIdeaMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: ideasQueryKeys.current() });
        navigate('/dashboard/ideas');
      },
    },
  });

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Idea</h1>
          <p className="text-muted-foreground">
            Share your AI idea with the community
          </p>
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
