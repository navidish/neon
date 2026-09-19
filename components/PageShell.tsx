import { Support } from '@/components/Support';
import { ThemeToggle } from '@/components/ThemeToggle';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell" dir="rtl">
      <div className="phone-frame">
        <header className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Support />
            <div>
              <p className="text-sm font-bold">افتتاح حساب</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <div className="gradient-line" />
        {children}
      </div>
    </main>
  );
}
