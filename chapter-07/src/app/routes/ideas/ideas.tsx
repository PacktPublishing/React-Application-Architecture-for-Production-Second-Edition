import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { data as routerData } from 'react-router';

import { Seo } from '@/components/seo';
import {
  getIdeasQueryOptions,
  useIdeasQuery,
} from '@/features/ideas/api/get-ideas';
import { getTagsQueryOptions } from '@/features/ideas/api/get-tags';
import { IdeaSearchAndFilters } from '@/features/ideas/components/idea-search-and-filters';
import { IdeasList } from '@/features/ideas/components/ideas-list';
import { useSearchAndFilters } from '@/features/ideas/hooks/use-search-and-filters';
import { createQueryClient } from '@/lib/react-query';
import type { GetAllIdeasData } from '@/types/generated/types.gen';

import type { Route } from './+types/ideas';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const ideasParams = {
    search: searchParams.get('search') || undefined,
    tags: searchParams.get('tags') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
  } as GetAllIdeasData['query'];
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getIdeasQueryOptions(ideasParams)),
    queryClient.prefetchQuery(getTagsQueryOptions()),
  ]);

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
  const { params } = useSearchAndFilters();

  const ideasQuery = useIdeasQuery({
    params: params as GetAllIdeasData['query'],
  });

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
        <IdeaSearchAndFilters />
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
