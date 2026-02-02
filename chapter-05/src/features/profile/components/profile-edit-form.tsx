import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

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
  const queryClient = useQueryClient();
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
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Tell us about yourself"
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
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
