import { Home, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard']);
  const { canCreateIdea } = useAuthorization();

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={t('dashboard:meta.title')}
        description={t('dashboard:meta.description')}
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard:title')}</h1>
          <p className="text-muted-foreground">{t('dashboard:subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('dashboard:myIdeas.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('dashboard:myIdeas.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Link to="/dashboard/ideas">
                <Button className="w-full" variant="default">
                  {t('dashboard:myIdeas.viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {canCreateIdea() && (
                <Link to="/dashboard/ideas/new">
                  <Button className="w-full bg-transparent" variant="outline">
                    {t('dashboard:myIdeas.create')}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('dashboard:myReviews.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('dashboard:myReviews.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/reviews">
                <Button className="w-full" variant="default">
                  {t('dashboard:myReviews.viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>{t('dashboard:explore.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('dashboard:explore.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/ideas">
              <Button variant="outline" className="w-full bg-transparent">
                {t('dashboard:explore.browse')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
