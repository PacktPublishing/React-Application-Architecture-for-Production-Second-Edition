import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
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
import type { Review, CreateReviewData } from '@/types/generated/types.gen';
import { zCreateReviewData } from '@/types/generated/zod.gen';

export type ReviewFormProps = {
  onSubmit: (data: CreateReviewData['body']) => void;
  onModalClose: () => void;
  ideaId?: string;
  isSubmitting: boolean;
  initialReview?: Review | null;
  error?: Error | null;
};

export function ReviewForm({
  onSubmit,
  isSubmitting,
  onModalClose,
  initialReview,
  error,
  ideaId,
}: ReviewFormProps) {
  const { t } = useTranslation(['reviews', 'common']);
  const form = useForm<CreateReviewData['body']>({
    resolver: zodResolver(zCreateReviewData.shape.body),
    defaultValues: {
      content: initialReview?.content || '',
      rating: initialReview?.rating || 5,
      ideaId: initialReview?.ideaId || ideaId || '',
    },
  });

  const handleClose = () => {
    form.reset();
    onModalClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4 py-4"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('reviews:rating')}</FormLabel>
              <FormControl>
                <div className="flex space-x-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 cursor-pointer ${
                        i < field.value
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => field.onChange(i + 1)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('reviews:review')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('reviews:reviewPlaceholder')}
                  rows={4}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <ErrorMessage error={error} />}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('common:cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common:submitting') : t('reviews:submitReview')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
