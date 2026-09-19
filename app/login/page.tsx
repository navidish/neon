'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PageShell } from '@/components/PageShell';
import { login } from '@/lib/mockApi';
import { getAuth, getSession, saveAuth } from '@/lib/storage';
import { track } from '@/lib/tracking';
import { Logo } from '@/components/steps/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setHasDraft(Boolean(getSession()));
    setRegistered(
      new URLSearchParams(window.location.search).get('registered') === '1',
    );

    if (getAuth()) {
      router.replace('/onboarding');
    }
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('نام کاربری و رمز عبور را وارد کن.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password);
      saveAuth({
        username: result.username,
        loggedInAt: new Date().toISOString(),
      });
      track('login_success');
      router.replace('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ورود با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="px-5 pb-8 pt-7">
        <div className="mx-auto max-w-md">
          <div className="mb-7">
            <div className="mb-4 grid place-items-center">
              <Logo />
            </div>
            <h1 className="text-2xl font-black text-center">ورود </h1>
          </div>

          {registered && (
            <div className="success-box mb-5 flex items-center gap-2">
              <CheckCircle2 size={17} /> حساب ساخته شد. حالا وارد شو.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold">نام کاربری</span>
              <input
                className="field"
                dir="ltr"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold">رمز عبور</span>
              <div className="relative">
                <input
                  className="field pl-10"
                  dir="ltr"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </label>

            <ErrorMessage message={error} />
            <Button type="submit" loading={loading}>
              ورود
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            هنوز ثبت‌نام نکردی؟{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="font-bold text-fuchsia-400"
            >
              ثبت‌نام کن
            </button>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
