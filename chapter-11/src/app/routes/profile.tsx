import { useTranslation } from 'react-i18next';
import { data as routerData, Link } from 'react-router';

import { ErrorMessage } from '@/components/error-message';
import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { UserIdeas } from '@/features/ideas/components/user-ideas';
import {
  getProfileByUsername,
  useProfileByUsernameQuery,
} from '@/features/profile/api/get-profile-by-username';
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
  const { t } = useTranslation(['profile', 'common']);
  const profileQuery = useProfileByUsernameQuery({
    username: params.username,
    options: {
      initialData: loaderData?.profile ?? undefined,
    },
  });

  const profile = profileQuery.data ?? loaderData?.profile;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={t('profile:meta.title', { username: profile.username })}
        description={t('profile:meta.description')}
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
  const { t } = useTranslation(['profile', 'common']);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Seo
        title={t('profile:userNotFound')}
        description={t('profile:userNotFound')}
      />
      <div className="space-y-6">
        <ErrorMessage error={error} title={t('profile:userNotFound')} />
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            render={<Link to="/">{t('common:goHome')}</Link>}
          />
        </div>
      </div>
    </div>
  );
}
