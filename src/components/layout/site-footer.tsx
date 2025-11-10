import { Logo } from '@/components/logo';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} BarExamAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
