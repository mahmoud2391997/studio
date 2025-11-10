import { Scale } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-bold", className)}>
      <Scale className="h-6 w-6 text-primary" />
      <span className="font-headline">BarExamAI</span>
    </Link>
  );
}
