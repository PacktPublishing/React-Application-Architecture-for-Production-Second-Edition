import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ErrorMessage } from '@/components/error-message';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useNotificationActions } from '@/stores/notifications';
import type { User, UpdateProfileData } from '@/types/generated/types.gen';
import { zUpdateProfileData } from '@/types/generated/zod.gen';

import { useUpdateProfileMutation } from '../api/update-profile';
import { profileQueryKeys } from '../config/query-keys';

export type ProfileEditFormProps = {
  profile: User;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProfileEditForm({
  profile,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const { t } = useTranslation(['profile', 'common']);
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationActions();
  const form = useForm<UpdateProfileData['body']>({
    resolver: zodResolver(zUpdateProfileData.shape.body),
    defaultValues: {
      bio: profile.bio || '',
    },
  });

  const updateProfileMutation = useUpdateProfileMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.byUsername(profile.username),
        });
        showNotification({
          type: 'success',
          title: t('profile:profileUpdated'),
        });
        onSuccess?.();
      },
    },
  });

  const onSubmit = (data: UpdateProfileData['body']) => {
    updateProfileMutation.mutate(data);
  };

  const isPending = updateProfileMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile:bio')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder={t('profile:bioPlaceholder')}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {updateProfileMutation.error && (
          <ErrorMessage error={updateProfileMutation.error} />
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {t('common:cancel')}
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? t('common:saving') : t('common:saveChanges')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
