import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import type { CreateIdeaData, Idea } from '@/types/generated/types.gen';
import { zCreateIdeaData } from '@/types/generated/zod.gen';

import { useTagsQuery } from '../api/get-tags';

export type IdeaFormProps = {
  initialData?: Idea | null;
  onSubmit: (data: CreateIdeaData['body']) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
};

export function IdeaForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: IdeaFormProps) {
  const { t } = useTranslation(['ideas', 'common']);
  const tagsQuery = useTagsQuery();
  const availableTags = tagsQuery.data?.data || [];

  const form = useForm<CreateIdeaData['body']>({
    resolver: zodResolver(zCreateIdeaData.shape.body),
    defaultValues: {
      title: initialData?.title || '',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      tags: initialData?.tags || [],
    },
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common:title')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('ideas:ideaTitlePlaceholder')}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ideas:shortDescription')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('ideas:shortDescriptionPlaceholder')}
                  rows={2}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ideas:detailedDescription')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('ideas:detailedDescriptionPlaceholder')}
                  rows={8}
                  disabled={isSubmitting}
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ideas:tags')}</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {tagsQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">
                      {t('ideas:loadingTags')}
                    </p>
                  ) : availableTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('ideas:noTagsAvailable')}
                    </p>
                  ) : (
                    availableTags.map((tag) => {
                      const isSelected = field.value?.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            if (isSubmitting) return;
                            const currentTags = field.value || [];
                            const newTags = isSelected
                              ? currentTags.filter((t) => t !== tag)
                              : [...currentTags, tag];
                            field.onChange(newTags);
                          }}
                        >
                          {tag}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('common:saving')
              : initialData
                ? t('ideas:updateIdea')
                : t('ideas:createIdea')}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('common:cancel')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
