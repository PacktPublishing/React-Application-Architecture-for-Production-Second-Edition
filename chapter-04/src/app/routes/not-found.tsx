import { Home, Lightbulb, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Seo
        title="Page Not Found | AIdeas"
        description="The page you're looking for doesn't exist or has been moved."
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
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                size="lg"
                className="gap-2"
                render={
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Go Home
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
                    Explore Ideas
                  </Link>
                }
              />
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Or try these popular pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to="/dashboard/ideas">My Ideas</Link>}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to="/dashboard/ideas/new">Create Idea</Link>}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to="/dashboard/reviews">My Reviews</Link>}
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
                Go back to previous page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
