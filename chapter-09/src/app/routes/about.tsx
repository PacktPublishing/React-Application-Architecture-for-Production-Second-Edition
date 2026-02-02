import { Lightbulb, Users, MessageSquare, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useTranslation(['about']);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Seo
        title={t('about:meta.title')}
        description={t('about:meta.description')}
      />

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('about:header.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('about:header.subtitle')}
        </p>
      </div>

      <div className="space-y-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t('about:whatWeDo.title')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('about:whatWeDo.paragraph1')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('about:whatWeDo.paragraph2')}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {t('about:features.shareIdeas.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('about:features.shareIdeas.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {t('about:features.getReviews.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('about:features.getReviews.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {t('about:features.joinCommunity.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('about:features.joinCommunity.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t('about:howItWorks.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t('about:howItWorks.steps.createAccount.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('about:howItWorks.steps.createAccount.description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t('about:howItWorks.steps.submit.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('about:howItWorks.steps.submit.description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t('about:howItWorks.steps.engage.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('about:howItWorks.steps.engage.description')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="lg">
            {t('about:cta.backToHome')}
          </Button>
        </Link>
        <Link to="/ideas">
          <Button size="lg">{t('about:cta.exploreIdeas')}</Button>
        </Link>
      </div>
    </div>
  );
}
