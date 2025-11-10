import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
const allExams = [
  { id: '1', topic: 'Torts', score: 85, date: '2023-10-26' },
  { id: '2', topic: 'Criminal Law', score: 72, date: '2023-10-24' },
  { id: '3', topic: 'Contracts', score: 92, date: '2023-10-22' },
  { id: '4', topic: 'Real Property', score: 68, date: '2023-10-20' },
  { id: '5', topic: 'Constitutional Law', score: 78, date: '2023-10-18' },
  { id: '6', topic: 'Torts', score: 88, date: '2023-10-15' },
];

const getBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 85) return 'default';
  if (score >= 70) return 'secondary';
  return 'destructive';
};

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance History</h1>
        <p className="text-muted-foreground">Review your past exam results and track your improvement over time.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Exam Attempts</CardTitle>
          <CardDescription>Click on any exam to see a detailed breakdown and AI-powered feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Topic</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.topic}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(exam.score)}>{exam.score}%</Badge>
                  </TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/performance/${exam.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
