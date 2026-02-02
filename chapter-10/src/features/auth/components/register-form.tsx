import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import type { RegisterUserData } from '@/types/generated/types.gen';
import { zRegisterUserData } from '@/types/generated/zod.gen';

export type RegisterFormProps = {
  onSubmit: (data: RegisterUserData['body']) => void;
  error: Error | null;
  isPending: boolean;
};

export function RegisterForm({
  onSubmit,
  error,
  isPending,
}: RegisterFormProps) {
  const { t } = useTranslation(['auth', 'navigation']);
  const form = useForm<RegisterUserData['body']>({
    resolver: zodResolver(zRegisterUserData.shape.body),
  });

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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth:username')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth:email')}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth:password')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ErrorMessage error={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('auth:creatingAccount') : t('navigation:register')}
        </Button>
      </form>
    </Form>
  );
}
