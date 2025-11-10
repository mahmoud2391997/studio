import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, Scale, Gavel, Shield } from 'lucide-react';
import Link from 'next/link';

const examTopics = [
  { name: 'Torts', icon: Gavel, description: 'Civil wrongs causing harm or loss.' },
  { name: 'Contracts', icon: Briefcase, description: 'Legally enforceable agreements.' },
  { name: 'Criminal Law', icon: Shield, description: 'Regulation of social conduct.' },
  { name: 'Constitutional Law', icon: Scale, description: 'Rights carved out in the constitution.' },
];

export default function ExamsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Start a New Exam</h1>
        <p className="text-muted-foreground">Select a legal topic to generate a new set of practice questions.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {examTopics.map((topic) => (
          <Link href={`/exams/${topic.name.toLowerCase().replace(/ /g, '-')}`} key={topic.name}>
            <Card className="group h-full transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <topic.icon className="h-12 w-12 text-muted-foreground transition-colors group-hover:text-primary" />
                  <ArrowRight className="h-6 w-6 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-semibold">{topic.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
