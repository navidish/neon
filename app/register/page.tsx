'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { PageShell } from '@/components/PageShell';
import { requestOtp, verifyOtp } from '@/lib/mockApi';
import {
  getAccount,
  getPendingRegistration,
  getSession,
  savePendingRegistration,
} from '@/lib/storage';
import { track } from '@/lib/tracking';
import { Logo } from '@/components/steps/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    setHasDraft(Boolean(getSession()));
    setHasAccount(Boolean(getAccount()));

    const pending = getPendingRegistration();
    if (pending) {
      setNationalId(pending.nationalId);
      setPhoneNumber(pending.phoneNumber);
    }
  }, []);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(nationalId)) {
      setError('کد ملی باید ۱۰ رقم باشد.');
      return;
    }

    if (!/^09\d{9}$/.test(phoneNumber)) {
      setError('شماره موبایل را به شکل 09xxxxxxxxx وارد کن.');
      return;
    }

    setLoading(true);
    try {
      await requestOtp(phoneNumber);
      savePendingRegistration({ nationalId, phoneNumber });
      setOtpSent(true);
      track('otp_requested');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ارسال کد با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(otp)) {
      setError('کد تأیید باید ۴ رقم باشد.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(otp);
      savePendingRegistration({ nationalId, phoneNumber });
      track('otp_verified');
      router.push('/register/credentials');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تأیید کد با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="px-5 pb-8 pt-7">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mb-7 flex items-center gap-2 text-xs text-[var(--muted)]"
        >
          <ArrowRight size={16} /> برگشت به ورود
        </button>

        <div className="mx-auto max-w-md">
          <div className="mb-7">
            <div className="mb-4 grid place-items-center">
              <Logo />
            </div>
            <h1 className="text-2xl font-black text-center">ثبت‌نام</h1>
          </div>

          {hasAccount && (
            <div className="mb-5 rounded-2xl border border-fuchsia-500/15 bg-fuchsia-500/5 p-4">
              <p className="text-sm font-bold">
                قبلاً در این مرورگر ثبت‌نام کرده‌ای.
              </p>
              <button
                type="button"
                className="mt-3 text-xs font-bold text-fuchsia-400"
                onClick={() => router.push('/login')}
              >
                رفتن به صفحه ورود
              </button>
            </div>
          )}

          {hasDraft && !otpSent && !hasAccount && (
            <div className="mb-6 rounded-2xl border border-fuchsia-500/15 bg-fuchsia-500/5 p-4">
              <p className="text-sm font-bold">
                یک فرآیند افتتاح حساب ناتمام داری.
              </p>
              <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                ثبت‌نام مجدد اطلاعات قبلی را پاک نمی‌کند.
              </p>
              <button
                type="button"
                className="secondary-button mt-4 w-full"
                onClick={() => router.push('/login')}
              >
                رفتن به ورود و ادامه فرآیند
              </button>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold">کد ملی</span>
                <input
                  className="field"
                  inputMode="numeric"
                  maxLength={10}
                  dir="ltr"
                  value={nationalId}
                  onChange={(event) =>
                    setNationalId(event.target.value.replace(/\D/g, ''))
                  }
                  placeholder="0012345678"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  شماره موبایل
                </span>
                <input
                  className="field"
                  dir="ltr"
                  inputMode="tel"
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value.replace(/\D/g, ''))
                  }
                  placeholder="09123456789"
                />
              </label>

              <ErrorMessage message={error} />
              <Button type="submit" loading={loading} disabled={hasAccount}>
                دریافت کد تأیید
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-5">
              <div className="rounded-2xl border border-fuchsia-500/15 bg-fuchsia-500/5 p-4 text-sm leading-6">
                کد تأیید به شماره{' '}
                <span dir="ltr" className="font-bold">
                  {phoneNumber}
                </span>{' '}
                ارسال شد.
                <div className="mt-1 text-xs text-[var(--muted)]">
                  برای تست پروژه: 1234
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">کد تأیید</span>
                <input
                  className="field text-center text-xl tracking-[0.5em]"
                  dir="ltr"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ''))
                  }
                  placeholder="••••"
                />
              </label>

              <ErrorMessage message={error} />
              <Button type="submit" loading={loading}>
                تأیید و ادامه
              </Button>
              <button
                type="button"
                className="w-full text-center text-xs text-fuchsia-400"
                onClick={() => setOtpSent(false)}
              >
                تغییر شماره موبایل
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
