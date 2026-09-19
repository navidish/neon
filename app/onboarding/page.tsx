'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, LogOut, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { Stepper } from '@/components/Stepper';
import { ErrorMessage } from '@/components/ErrorMessage';
import { BirthDateStep } from '@/components/steps/BirthDateStep';
import { EkycStep } from '@/components/steps/EkycStep';
import { LivenessStep } from '@/components/steps/LivenessStep';
import { SignatureStep } from '@/components/steps/SignatureStep';
import { submitStep } from '@/lib/mockApi';
import { clearAuth, getAuth } from '@/lib/storage';
import { track } from '@/lib/tracking';
import { useSession } from '@/hooks/useSession';

const TOTAL_STEPS = 4;
const STEP_NAMES = ['تاریخ تولد', 'احراز هویت', 'تشخیص زنده بودن', 'امضا'];

export default function OnboardingPage() {
  const router = useRouter();
  const { session, ready, updateSession } = useSession();
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processActive, setProcessActive] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    setAuthChecked(true);
    if (!auth) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!ready || !authChecked) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    setBirthDate(session.birthDate ?? '');
  }, [ready, authChecked, session, router]);

  async function completeBirthDate() {
    if (!birthDate) {
      setError('تاریخ تولد را وارد کن.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await submitStep('birth_date_completed');
      updateSession({ currentStep: 1, birthDate });
      track('birth_date_completed');
      setProcessActive(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ثبت تاریخ تولد با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function completeStep(nextStep: number, eventName: string) {
    setError('');
    setLoading(true);

    try {
      await submitStep(eventName);
      updateSession({ currentStep: nextStep });
      track(eventName);
      if (nextStep === TOTAL_STEPS) track('registration_completed');
      setProcessActive(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ذخیره اطلاعات با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  }

  function startProcess() {
    setError('');
    setProcessActive(true);
    track('step_process_started', { step: String(session?.currentStep ?? 0) });
  }

  function exitProcess() {
    setProcessActive(false);
    setError('');
    track('step_process_exited', { step: String(session?.currentStep ?? 0) });
  }

  function logout() {
    // Do NOT delete the onboarding draft. Only remove authentication.
    clearAuth();
    track('logout');
    router.replace('/login');
  }

  if (!authChecked || !ready || !session) {
    return (
      <PageShell>
        <div className="grid min-h-[calc(100vh-112px)] place-items-center px-5">
          <p className="text-sm text-[var(--muted)]">
            در حال آماده‌سازی فرآیند...
          </p>
        </div>
      </PageShell>
    );
  }

  const currentStep = Math.min(Math.max(session.currentStep, 0), TOTAL_STEPS);
  const stepNumber = Math.min(currentStep + 1, TOTAL_STEPS);
  const completed = currentStep >= TOTAL_STEPS;

  return (
    <PageShell>
      <section className="px-4 pb-8 pt-5 md:px-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted)]">خوش آمدی</p>
            <p className="mt-1 text-sm font-bold">تکمیل افتتاح حساب</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-red-400"
          >
            <LogOut size={15} /> خروج
          </button>
        </div>

        {!processActive ? (
          <Stepper currentStep={currentStep} onStart={startProcess} />
        ) : (
          <div className="rounded-3xl border border-[var(--border)] bg-black/[0.015] p-5 dark:bg-white/[0.015] md:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-fuchsia-500/10 text-sm font-black text-fuchsia-400">
                  {stepNumber}
                </span>
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    مرحله {stepNumber} از {TOTAL_STEPS}
                  </p>
                  <p className="mt-0.5 text-sm font-black">
                    {STEP_NAMES[currentStep]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={exitProcess}
                className="rounded-xl p-2 text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-5">
                <ErrorMessage message={error} />
              </div>
            )}

            {currentStep === 0 && (
              <BirthDateStep
                value={birthDate}
                error=""
                loading={loading}
                onChange={setBirthDate}
                onContinue={completeBirthDate}
              />
            )}
            {currentStep === 1 && (
              <EkycStep onContinue={() => completeStep(2, 'ekyc_completed')} />
            )}
            {currentStep === 2 && (
              <LivenessStep
                onContinue={() => completeStep(3, 'liveness_completed')}
              />
            )}
            {currentStep === 3 && (
              <SignatureStep
                onComplete={() => completeStep(4, 'signature_completed')}
              />
            )}

            <button
              type="button"
              onClick={exitProcess}
              className="mt-6 flex w-full items-center justify-center gap-2 text-xs text-[var(--muted)]"
            >
              <ArrowRight size={15} /> خروج از این مرحله و ادامه بعداً
            </button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
