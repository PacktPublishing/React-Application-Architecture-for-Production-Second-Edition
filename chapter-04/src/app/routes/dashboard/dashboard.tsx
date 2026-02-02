import { Home, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';
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

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="Dashboard | AIdeas"
        description="Manage your AI application ideas and reviews in one place"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your ideas and reviews</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>My Ideas</CardTitle>
              </div>
              <CardDescription>
                View and manage your submitted ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Link to="/dashboard/ideas">
                <Button className="w-full" variant="default">
                  View All Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>My Reviews</CardTitle>
              </div>
              <CardDescription>
                See all reviews you&apos;ve written
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/reviews">
                <Button className="w-full" variant="default">
                  View All Reviews
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
              <CardTitle>Explore Ideas</CardTitle>
            </div>
            <CardDescription>
              Discover and review ideas from the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/ideas">
              <Button variant="outline" className="w-full bg-transparent">
                Browse All Ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
