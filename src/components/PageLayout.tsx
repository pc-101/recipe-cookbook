import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

export type PageLink = { to: string; label: string };

export default function PageLayout({
  title,
  links,
  children,
}: {
  title: React.ReactNode;
  links: PageLink[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="font-semibold">{title}</div>
          <nav className="flex items-center gap-2 text-sm">
            {links.map((link) => (
              <Link key={link.to} className="btn" to={link.to}>
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">{children}</main>
    </div>
  );
}
