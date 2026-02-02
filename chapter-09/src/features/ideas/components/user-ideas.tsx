import { useTranslation } from 'react-i18next';

import { IdeasList } from '@/features/ideas/components/ideas-list';

import { useIdeasByUserQuery } from '../api/get-ideas-by-user';

export type UserIdeasProps = {
  username: string;
};

export function UserIdeas({ username }: UserIdeasProps) {
  const { t } = useTranslation(['ideas']);
  const ideasQuery = useIdeasByUserQuery({ username });
  const ideas = ideasQuery.data?.data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        {t('ideas:ideasBy', { username, count: ideas?.length || 0 })}
      </h2>
      <IdeasList
        ideas={ideas}
        isLoading={ideasQuery.isLoading}
        emptyMessage={t('ideas:noIdeasShared', { username })}
        error={ideasQuery.error}
      />
    </div>
  );
}
