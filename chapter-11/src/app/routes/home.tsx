import { Lightbulb, Share, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { t } = useTranslation(['home']);

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo title={t('meta.title')} description={t('meta.description')} />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/ideas"
            className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}
          >
            {t('getStarted')}
          </Link>
          <Link
            to="/about"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'w-full sm:w-auto bg-transparent',
            )}
          >
            {t('learnMore')}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <CardTitle>{t('features.discover.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('features.discover.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Share className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <CardTitle>{t('features.share.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('features.share.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />
            </div>
            <CardTitle>{t('features.review.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('features.review.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
