import { data as routerData, Link } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { UserIdeas } from '@/features/ideas/components/user-ideas';
import { getProfileByUsername } from '@/features/profile/api/get-profile-by-username';
import { ProfileDetails } from '@/features/profile/components/profile-details';
import { UserReviews } from '@/features/reviews/components/user-reviews';

import type { Route } from './+types/profile';

export async function loader({ params }: Route.LoaderArgs) {
  const profile = await getProfileByUsername(params.username);

  return routerData({
    profile,
  });
}

export default function ProfilePage({
  params,
  loaderData,
}: Route.ComponentProps) {
  const profile = loaderData?.profile;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={`${profile.username} | AIdeas`}
        description={`View profile, ideas, and reviews for ${profile.username}`}
      />
      <div className="max-w-4xl mx-auto">
        <ProfileDetails profile={profile} />
        <div className="mb-8">
          <UserIdeas username={params.username} />
        </div>
        <UserReviews username={params.username} />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Seo
        title="Error loading profile | AIdeas"
        description="Error loading profile"
      />
      <div className="space-y-6">
        <ErrorMessage error={error} title="Error loading profile" />
        <div className="flex justify-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
