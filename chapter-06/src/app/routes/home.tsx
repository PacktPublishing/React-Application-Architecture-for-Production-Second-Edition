import { Lightbulb, Share, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title="AIdeas - Share and Discover AI Ideas"
        description="AIdeas - A community platform for sharing, reviewing, and discovering innovative AI application ideas"
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          AIdeas - Share and Discover AI Ideas
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AIdeas - A community platform for sharing, reviewing, and discovering
          innovative AI application ideas
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/ideas">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Discover Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Explore innovative AI application ideas from the community
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Share className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Share Your Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Submit your own AI ideas and get feedback from others
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Review & Discuss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Provide constructive feedback and help refine great ideas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
