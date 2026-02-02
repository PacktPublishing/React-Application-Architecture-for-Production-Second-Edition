import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { useCurrentUserIdeasQuery } from '@/features/ideas/api/get-current-user-ideas';
import { IdeasList } from '@/features/ideas/components/ideas-list';

export default function MyIdeasPage() {
  const { t } = useTranslation(['ideas']);
  const ideasQuery = useCurrentUserIdeasQuery();
  const ideas = ideasQuery.data?.data;

  const { canCreateIdea } = useAuthorization();

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={t('ideas:meta.myIdeas.title')}
        description={t('ideas:meta.myIdeas.description')}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('ideas:myIdeasTitle')}
            </h1>
            <p className="text-muted-foreground">
              {t('ideas:myIdeasDescription')}
            </p>
          </div>
          {canCreateIdea() && (
            <Link to="/dashboard/ideas/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('ideas:newIdea')}
              </Button>
            </Link>
          )}
        </div>

        <IdeasList
          ideas={ideas}
          isLoading={ideasQuery.isLoading}
          emptyMessage={t('ideas:noIdeasYet')}
          error={ideasQuery.error}
        />
      </div>
    </div>
  );
}
