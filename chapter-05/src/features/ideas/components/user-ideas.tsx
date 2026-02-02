import { IdeasList } from '@/features/ideas/components/ideas-list';

import { useIdeasByUserQuery } from '../api/get-ideas-by-user';

export type UserIdeasProps = {
  username: string;
};

export function UserIdeas({ username }: UserIdeasProps) {
  const ideasQuery = useIdeasByUserQuery({ username });
  const ideas = ideasQuery.data?.data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Ideas by {username} ({ideas?.length || 0})
      </h2>
      <IdeasList
        ideas={ideas}
        isLoading={ideasQuery.isLoading}
        emptyMessage={`${username} hasn't shared any ideas yet.`}
        error={ideasQuery.error}
      />
    </div>
  );
}
