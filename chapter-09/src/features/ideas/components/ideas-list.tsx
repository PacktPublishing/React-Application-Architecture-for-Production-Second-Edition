import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/empty-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Idea } from '@/types/generated/types.gen';

import { IdeaListItem } from './idea-list-item';

export type IdeasListProps = {
  ideas: Idea[] | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
  error?: Error | null;
};

export function IdeasList({
  ideas,
  isLoading,
  emptyMessage,
  error,
}: IdeasListProps) {
  const { t } = useTranslation(['ideas', 'common']);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title={t('common:error')} />;
  }

  if (!ideas || ideas.length === 0) {
    return (
      <EmptyState
        icon={<Lightbulb />}
        title={emptyMessage || t('ideas:noIdeasAvailable')}
        description={t('ideas:noIdeasEmptyDescription')}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {ideas.map((idea) => (
            <div key={idea.id} className="px-6">
              <IdeaListItem idea={idea} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
