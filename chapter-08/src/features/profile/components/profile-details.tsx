import { User as UserIcon, Calendar } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { formatDate } from '@/lib/date';
import type { User } from '@/types/generated/types.gen';

import { EditProfile } from './edit-profile';

export type ProfileDetailsProps = {
  profile: User | undefined;
};

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  const { canEditProfile } = useAuthorization();

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl">@{profile.username}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.createdAt, 'en')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        {profile.bio && (
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <MarkdownRenderer content={profile.bio} />
            </div>
          </CardContent>
        )}
      </Card>
      {canEditProfile(profile) && (
        <div className="flex justify-end mb-6">
          <EditProfile profile={profile} />
        </div>
      )}
    </>
  );
}
