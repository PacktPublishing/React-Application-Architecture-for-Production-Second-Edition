import { data as routerData } from 'react-router';

import { Seo } from '@/components/seo';
import { getIdeas } from '@/features/ideas/api/get-ideas';
import { IdeasList } from '@/features/ideas/components/ideas-list';

import type { Route } from './+types/ideas';

export async function loader() {
  const ideas = await getIdeas();

  return routerData({
    ideas,
  });
}

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  const allIdeas = loaderData.ideas.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="Discover AI Ideas | AIdeas"
        description="Browse and explore innovative AI application ideas from the community"
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover AI Ideas</h1>
        <p className="text-muted-foreground mb-6">
          Browse and explore innovative AI application ideas from the community
        </p>
      </div>

      <IdeasList ideas={allIdeas} emptyMessage={'No ideas available yet'} />
    </div>
  );
}
