import { Lightbulb } from 'lucide-react';
import { Suspense, use } from 'react';
import { useTranslation } from 'react-i18next';
import { data as routerData, Link } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import {
  getIdeaById,
  useIdeaByIdQuery,
} from '@/features/ideas/api/get-idea-by-id';
import { IdeaDetails } from '@/features/ideas/components/idea-details';
import {
  getReviewsByIdea,
  useReviewsByIdeaQuery,
} from '@/features/reviews/api/get-reviews-by-idea';
import { CreateReview } from '@/features/reviews/components/create-review';
import { ReviewsList } from '@/features/reviews/components/reviews-list';
import { ReviewsSkeleton } from '@/features/reviews/components/reviews-skeleton';
import type { ReviewListResponse, Idea } from '@/types/generated/types.gen';

import type { Route } from './+types/idea';

export async function loader({ params }: Route.LoaderArgs) {
  const idea = await getIdeaById(params.id);
  const reviewsPromise = getReviewsByIdea(params.id);
  return routerData({
    idea,
    reviewsPromise,
  });
}

export default function IdeaDetailPage({
  params,
  loaderData,
}: Route.ComponentProps) {
  const { t } = useTranslation(['ideas', 'common']);
  const ideaId = params.id as string;

  const ideaQuery = useIdeaByIdQuery({
    id: ideaId,
    options: {
      ...(loaderData?.idea && { initialData: loaderData.idea }),
    },
  });
  const idea = ideaQuery?.data ?? loaderData?.idea;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={`${idea?.title || t('ideas:newIdea')} | AIdeas`}
        description={idea?.shortDescription || t('common:title')}
      />
      <div className="max-w-4xl mx-auto">
        <IdeaDetails idea={idea} />
        <Suspense fallback={<ReviewsSkeleton />}>
          <IdeaReviews idea={idea} reviewsPromise={loaderData.reviewsPromise} />
        </Suspense>
      </div>
    </div>
  );
}

function IdeaReviews({
  idea,
  reviewsPromise,
}: {
  idea: Idea;
  reviewsPromise: Promise<ReviewListResponse>;
}) {
  const { t } = useTranslation(['reviews', 'ideas']);
  const reviewsData = use(reviewsPromise);
  const { canCreateReview } = useAuthorization();

  const reviewsQuery = useReviewsByIdeaQuery({
    id: idea.id,
    options: {
      ...(reviewsData && { initialData: reviewsData }),
    },
  });
  const reviews = reviewsQuery?.data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('reviews:reviews', { count: reviews?.length || 0 })}
        </h2>
        {canCreateReview(idea, reviews) && <CreateReview ideaId={idea.id} />}
      </div>

      <ReviewsList
        reviews={reviews}
        isLoading={reviewsQuery?.isLoading}
        showIdeaTitle={false}
        emptyMessage={t('reviews:noReviewsYet')}
        error={reviewsQuery?.error}
      />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { t } = useTranslation(['ideas', 'common']);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Seo
        title={t('ideas:errorLoadingIdea')}
        description={t('ideas:errorLoadingIdea')}
      />
      <div className="space-y-6">
        <ErrorMessage error={error} title={t('ideas:errorLoadingIdea')} />
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            render={
              <Link to="/ideas" className="gap-2">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {t('ideas:backToIdeas')}
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
