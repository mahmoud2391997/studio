import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, BarChart, BrainCircuit } from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Question Bank',
    description: 'Leverage our cutting-edge AI to generate limitless, high-quality bar exam questions tailored to your needs.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-1'),
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Realistic Exam Simulation',
    description: 'Experience the pressure and format of the real bar exam with our timed and structured simulations.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-2'),
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: 'Performance Analytics',
    description: 'Receive detailed feedback and track your progress to identify strengths and pinpoint areas for improvement.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-3'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-background py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              The Future of Bar Exam Preparation is Here
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Harness the power of AI to conquer the bar exam. BarExamAI offers personalized, realistic simulations and in-depth analytics to guide you to success.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="absolute inset-0 -z-10 opacity-5">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary/50 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">Why Choose BarExamAI?</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to pass the bar, powered by AI.</p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105">
                  {feature.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <CardTitle className="text-center text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-center text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold">Ready to Ace the Bar?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join hundreds of trainees who are preparing smarter, not just harder.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/auth/signup">Start Your Free Trial Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
