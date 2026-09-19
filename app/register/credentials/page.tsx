'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PageShell } from '@/components/PageShell';
import { createAccount } from '@/lib/mockApi';
import {
  clearPendingRegistration,
  getPendingRegistration,
  saveAccount,
  saveSession,
} from '@/lib/storage';
import { track } from '@/lib/tracking';

export default function CredentialsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const pending = getPendingRegistration();
    if (!pending) {
      router.replace('/register');
      return;
    }
    setPhoneNumber(pending.phoneNumber);
    setReady(true);
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('تکرار رمز عبور با رمز عبور یکسان نیست.');
      return;
    }

    const pending = getPendingRegistration();
    if (!pending) {
      setError('اطلاعات ثبت‌نام پیدا نشد. دوباره ثبت‌نام را شروع کن.');
      return;
    }

    setLoading(true);
    try {
      await createAccount(username, password);
      saveAccount({
        username: username.trim(),
        password,
        nationalId: pending.nationalId,
        phoneNumber: pending.phoneNumber,
      });
      saveSession({
        id: crypto.randomUUID(),
        nationalId: pending.nationalId,
        phoneNumber: pending.phoneNumber,
        currentStep: 0,
        createdAt: new Date().toISOString(),
      });
      clearPendingRegistration();
      track('registration_completed', { username: username.trim() });
      router.replace('/login?registered=1');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ساخت حساب با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <PageShell>
        <div className="grid min-h-[calc(100vh-112px)] place-items-center px-5 text-sm text-[var(--muted)]">
          در حال آماده‌سازی...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-5 pb-8 pt-7">
        <button
          type="button"
          onClick={() => router.push('/register')}
          className="mb-7 flex items-center gap-2 text-xs text-[var(--muted)]"
        >
          <ArrowRight size={16} /> برگشت
        </button>

        <div className="mx-auto max-w-md">
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
              <input
                className="field"
                dir="ltr"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="حداقل ۶ کاراکتر"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold">
                تکرار رمز عبور
              </span>
              <input
                className="field"
                dir="ltr"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="رمز عبور را دوباره وارد کن"
              />
            </label>

            <ErrorMessage message={error} />
            <Button type="submit" loading={loading}>
              ساخت حساب و رفتن به ورود
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
