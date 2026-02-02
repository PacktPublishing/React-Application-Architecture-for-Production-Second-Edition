import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { User } from '@/types/generated/types.gen';

import { ProfileEditForm } from './profile-edit-form';

export type EditProfileProps = {
  profile: User;
};

export function EditProfile({ profile }: EditProfileProps) {
  const { t } = useTranslation(['profile']);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowEditDialog(true)}>
        {t('profile:editProfile')}
      </Button>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('profile:editProfile')}</DialogTitle>
            <DialogDescription>
              {t('profile:editProfileDescription')}
            </DialogDescription>
          </DialogHeader>
          <ProfileEditForm
            profile={profile}
            onSuccess={() => setShowEditDialog(false)}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
