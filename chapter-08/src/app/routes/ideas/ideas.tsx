import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { data as routerData } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import {
  getIdeasInfiniteQueryOptions,
  useIdeasInfiniteQuery,
} from '@/features/ideas/api/get-ideas';
import { getTagsQueryOptions } from '@/features/ideas/api/get-tags';
import { IdeaSearchAndFilters } from '@/features/ideas/components/idea-search-and-filters';
import { IdeasList } from '@/features/ideas/components/ideas-list';
import { VirtualizedIdeasList } from '@/features/ideas/components/virtualized-ideas-list';
import { useSearchAndFilters } from '@/features/ideas/hooks/use-search-and-filters';
import { useIsClient } from '@/hooks/use-is-client';
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
    queryClient.prefetchInfiniteQuery(
      getIdeasInfiniteQueryOptions(ideasParams),
    ),
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
  const isClient = useIsClient();

  const ideasInfiniteQuery = useIdeasInfiniteQuery({
    params: params as GetAllIdeasData['query'],
  });

  const allIdeas =
    ideasInfiniteQuery.data?.pages.flatMap((page) => page.data) || [];

  const ListComponent = isClient ? VirtualizedIdeasList : IdeasList;

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

      <ListComponent
        ideas={allIdeas}
        isLoading={ideasInfiniteQuery.isLoading && allIdeas.length === 0}
        emptyMessage="No ideas available yet"
        error={ideasInfiniteQuery.isError ? ideasInfiniteQuery.error : null}
      />

      {allIdeas.length > 0 && ideasInfiniteQuery.hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => ideasInfiniteQuery.fetchNextPage()}
            disabled={ideasInfiniteQuery.isFetchingNextPage}
          >
            {ideasInfiniteQuery.isFetchingNextPage
              ? 'Loading more ideas...'
              : 'Load more ideas'}
          </Button>
        </div>
      )}
    </div>
  );
}
