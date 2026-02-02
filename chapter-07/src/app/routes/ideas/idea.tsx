import { Lightbulb } from 'lucide-react';
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

import type { Route } from './+types/idea';

export async function loader({ params }: Route.LoaderArgs) {
  const [idea, reviews] = await Promise.all([
    getIdeaById(params.id),
    getReviewsByIdea(params.id),
  ]);
  return routerData({
    idea,
    reviews,
  });
}

export default function IdeaDetailPage({
  params,
  loaderData,
}: Route.ComponentProps) {
  const ideaId = params.id as string;
  const { canCreateReview } = useAuthorization();

  const ideaQuery = useIdeaByIdQuery({
    id: ideaId,
    options: {
      ...(loaderData?.idea && { initialData: loaderData.idea }),
    },
  });
  const idea = ideaQuery?.data ?? loaderData?.idea;

  const reviewsQuery = useReviewsByIdeaQuery({
    id: ideaId,
    options: {
      ...(loaderData?.reviews && { initialData: loaderData.reviews }),
    },
  });
  const reviews = reviewsQuery?.data?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={`${idea?.title || 'Idea'} | AIdeas`}
        description={idea?.shortDescription || 'View idea details'}
      />
      <div className="max-w-4xl mx-auto">
        <IdeaDetails idea={idea} />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Reviews ({reviews?.length || 0})
            </h2>
            {canCreateReview(idea, reviews) && <CreateReview ideaId={ideaId} />}
          </div>

          <ReviewsList
            reviews={reviews}
            isLoading={reviewsQuery?.isLoading}
            showIdeaTitle={false}
            emptyMessage="No reviews yet. Be the first to review this idea!"
            error={reviewsQuery?.error}
          />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Seo
        title="Error Loading Idea | AIdeas"
        description="Error Loading Idea"
      />
      <div className="space-y-6">
        <ErrorMessage error={error} title="Error Loading Idea" />
        <div className="flex justify-center">
          <Link to="/ideas">
            <Button variant="outline" size="lg">
              <Lightbulb className="h-4 w-4 mr-2" />
              Back to Ideas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
