import { Home, Lightbulb, Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const { t } = useTranslation(['notFound', 'ideas', 'dashboard', 'common']);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Seo
        title={`${t('notFound:title')} | AIdeas`}
        description={t('notFound:description')}
      />
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-12 pb-12 px-6 sm:px-12">
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-9xl font-bold text-muted-foreground/20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lightbulb className="h-24 w-24 text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {t('notFound:title')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('notFound:description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                to="/"
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
              >
                <Home className="h-4 w-4" />
                {t('notFound:goHome')}
              </Link>
              <Link
                to="/ideas"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'gap-2 bg-transparent',
                )}
              >
                <Search className="h-4 w-4" />
                {t('notFound:exploreIdeas')}
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                {t('notFound:quickLinksTitle')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  to="/dashboard/ideas"
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {t('notFound:myIdeas')}
                </Link>
                <Link
                  to="/dashboard/ideas/new"
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {t('notFound:createIdea')}
                </Link>
                <Link
                  to="/dashboard/reviews"
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {t('notFound:myReviews')}
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="link"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                {t('notFound:goBack')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
