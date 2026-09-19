import { CalendarDays, ScanFace, CircleUserRound, PenLine } from 'lucide-react';

const steps = [
  {
    title: 'تاریخ تولد',
    description: 'این اطلاعات برای تکمیل مشخصات هویتی استفاده می‌شود.',
    icon: CalendarDays,
  },
  {
    title: 'eKYC',
    description: 'احراز هویت تصویری و بررسی چهره شما.',
    icon: ScanFace,
  },
  {
    title: 'Liveness',
    description: 'برای اطمینان از زنده بودن تصویر، یک ویدیو کوتاه ضبط می‌شود.',
    icon: CircleUserRound,
  },
  {
    title: 'امضا دیجیتال',
    description: 'امضای دیجیتال خود را ثبت کنید.',
    icon: PenLine,
  },
];

type StepperProps = {
  currentStep: number;
  onStart: () => void;
};

export function Stepper({ currentStep, onStart }: StepperProps) {
  const completed = currentStep >= steps.length;

  return (
    <aside className="w-full">
      <div className="rounded-3xl border border-[var(--border)] bg-white/[0.025] p-5">
        <p className="mb-5 text-xs font-bold text-[var(--muted)]">
          مراحل افتتاح حساب
        </p>

        <div className="space-y-1">
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep && !completed;

            return (
              <div key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${
                      active
                        ? 'bg-fuchsia-500 text-white'
                        : done
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-fuchsia-500/10 text-fuchsia-400'
                    }`}
                  >
                    <step.icon size={23} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="my-1 h-8 w-px bg-[var(--border)]" />
                  )}
                </div>
                <div className="pt-1">
                  <p
                    className={`text-sm ${active || done ? 'font-bold' : 'text-[var(--muted)]'}`}
                  >
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {!completed ? (
          <button
            type="button"
            className="primary-button mt-7 w-full"
            onClick={onStart}
          >
            شروع فرآیند
          </button>
        ) : (
          <div className="success-box mt-7 text-center font-bold">
            فرآیند افتتاح حساب تکمیل شد 🎉
          </div>
        )}
      </div>
    </aside>
  );
}
