import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { data as routerData } from 'react-router';

import { Seo } from '@/components/seo';
import {
  getIdeasQueryOptions,
  useIdeasQuery,
} from '@/features/ideas/api/get-ideas';
import { IdeasList } from '@/features/ideas/components/ideas-list';
import { createQueryClient } from '@/lib/react-query';

import type { Route } from './+types/ideas';

export async function loader() {
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(getIdeasQueryOptions());

  return routerData({
    dehydratedState: dehydrate(queryClient),
  });
}

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <Ideas />
    </HydrationBoundary>
  );
}

function Ideas() {
  const ideasQuery = useIdeasQuery({});

  const allIdeas = ideasQuery.data?.data || [];

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

      <IdeasList
        ideas={allIdeas}
        isLoading={ideasQuery.isLoading && allIdeas.length === 0}
        emptyMessage={'No ideas available yet'}
        error={ideasQuery.isError ? ideasQuery.error : null}
      />
    </div>
  );
}
