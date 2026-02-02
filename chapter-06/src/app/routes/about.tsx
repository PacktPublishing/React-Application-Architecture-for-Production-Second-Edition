import { Lightbulb, Users, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { Seo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Seo
        title="About AIdeas"
        description="Learn about AIdeas - a collaborative platform for sharing, reviewing, and refining AI-powered ideas with the community"
      />

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About AI Ideas</h1>
        <p className="text-xl text-muted-foreground">
          A platform for sharing and reviewing AI-powered ideas
        </p>
      </div>

      <div className="space-y-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AIdeas is a collaborative platform where innovators, developers,
              and AI enthusiasts come together to share their AI-powered ideas
              and receive constructive feedback from the community.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you&apos;re working on a machine learning project, an AI
              application, or just have a creative concept, our platform helps
              you refine your ideas through peer reviews and community
              engagement.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Share Ideas</h3>
              <p className="text-sm text-muted-foreground">
                Post your AI concepts and projects to get visibility and
                feedback from the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Get Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Receive detailed reviews with ratings and constructive feedback
                to improve your ideas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Join Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with like-minded innovators and contribute to the AI
                community.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create an Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign up to start sharing your ideas and reviewing
                    others&apos; projects.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Submit Your Ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    Post your AI concepts with descriptions, tags, and relevant
                    details.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Engage with the Community
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Review other ideas, provide feedback, and collaborate with
                    fellow innovators.
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
            Back to Home
          </Button>
        </Link>
        <Link to="/ideas">
          <Button size="lg">Explore Ideas</Button>
        </Link>
      </div>
    </div>
  );
}
