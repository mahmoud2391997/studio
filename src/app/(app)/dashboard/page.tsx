'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, BookOpen, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock data, to be replaced with data from Firestore
const user = {
  name: 'Alex Doe',
};

const stats = [
  { title: 'Exams Taken', value: '12', icon: BookOpen, change: '+2 this week' },
  { title: 'Average Score', value: '78%', icon: Target, change: '+5% this week' },
  { title: 'Best Topic', value: 'Contracts', icon: CheckCircle, change: '92% score' },
];

const chartData = [
  { date: 'Jan', score: 65 },
  { date: 'Feb', score: 72 },
  { date: 'Mar', score: 70 },
  { date: 'Apr', score: 78 },
  { date: 'May', score: 82 },
  { date: 'Jun', score: 75 },
];

const recentExams = [
  { id: '1', topic: 'Torts', score: '85%', date: '2023-10-26' },
  { id: '2', topic: 'Criminal Law', score: '72%', date: '2023-10-24' },
  { id: '3', topic: 'Contracts', score: '92%', date: '2023-10-22' },
  { id: '4', topic: 'Real Property', score: '68%', date: '2023-10-20' },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Here's a summary of your progress. Keep up the great work!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Your average monthly scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}%`}
                />
                 <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>Your last few practice sessions.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
               <Link href="/performance">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.topic}</TableCell>
                    <TableCell>{exam.score}</TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell className="text-right">
                       <Button asChild variant="ghost" size="sm">
                         <Link href={`/performance/${exam.id}`}>View</Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}