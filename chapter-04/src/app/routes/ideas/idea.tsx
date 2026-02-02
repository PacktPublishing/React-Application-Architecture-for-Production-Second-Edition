import { Lightbulb } from 'lucide-react';
import { data as routerData, Link } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { getIdeaById } from '@/features/ideas/api/get-idea-by-id';
import { IdeaDetails } from '@/features/ideas/components/idea-details';
import { getReviewsByIdea } from '@/features/reviews/api/get-reviews-by-idea';
import { ReviewsList } from '@/features/reviews/components/reviews-list';

import type { Route } from './+types/idea';

export async function loader({ params }: Route.LoaderArgs) {
  const [idea, reviews] = await Promise.all([
    getIdeaById(params.id),
    getReviewsByIdea({ id: params.id }),
  ]);
  return routerData({
    idea,
    reviews,
  });
}

export default function IdeaDetailPage({ loaderData }: Route.ComponentProps) {
  const idea = loaderData?.idea;

  const reviews = loaderData?.reviews?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={`${idea.title} | AIdeas`}
        description={idea.shortDescription}
      />
      <div className="max-w-4xl mx-auto">
        <IdeaDetails idea={idea} currentUser={null} />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Reviews ({reviews?.length || 0})
            </h2>
          </div>

          <ReviewsList
            reviews={reviews}
            emptyMessage="No reviews yet. Be the first to review this idea!"
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
