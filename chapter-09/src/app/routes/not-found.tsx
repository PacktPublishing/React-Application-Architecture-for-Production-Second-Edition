import { Home, Lightbulb, Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
              <Button
                size="lg"
                className="gap-2"
                render={
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    {t('notFound:goHome')}
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent"
                render={
                  <Link to="/ideas">
                    <Search className="h-4 w-4" />
                    {t('notFound:exploreIdeas')}
                  </Link>
                }
              />
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                {t('notFound:quickLinksTitle')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link to="/dashboard/ideas">{t('notFound:myIdeas')}</Link>
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link to="/dashboard/ideas/new">
                      {t('notFound:createIdea')}
                    </Link>
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link to="/dashboard/reviews">
                      {t('notFound:myReviews')}
                    </Link>
                  }
                />
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
