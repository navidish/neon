'use client';

import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';

export function BirthDateStep({
  value,
  error,
  loading,
  onChange,
  onContinue,
}: {
  value: string;
  error: string;
  loading: boolean;
  onChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-xs font-bold">تاریخ تولد</span>
        <input
          className="field"
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <div className="mt-5">
        <ErrorMessage message={error} />
      </div>

      <div className="mt-6">
        <Button loading={loading} disabled={!value} onClick={onContinue}>
          ذخیره و ادامه
        </Button>
      </div>
    </div>
  );
}
