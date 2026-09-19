'use client';

import { CheckCircle2, Eraser, PenLine } from 'lucide-react';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';

export function SignatureStep({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(ratio, ratio);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#111111';
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    drawingRef.current = true;
    canvas?.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
  }

  function draw(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
    setHasSignature(true);
  }

  function end() {
    drawingRef.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setError('');
  }

  function submit() {
    if (!hasSignature) {
      setError('لطفاً ابتدا امضای خود را وارد کن.');
      return;
    }
    setDone(true);
    onComplete();
  }

  if (done) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto text-green-500" size={46} />
        <h2 className="mt-4 text-xl font-black">فرآیند با موفقیت تکمیل شد</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          اطلاعات ثبت شد و فرآیند افتتاح حساب آماده ارسال است.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] p-2">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>

      <div className="mt-4">
        <ErrorMessage message={error} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="secondary-button flex items-center justify-center gap-2"
          onClick={clear}
        >
          <Eraser size={16} /> پاک کردن
        </button>
        <button type="button" className="primary-button" onClick={submit}>
          ثبت امضا
        </button>
      </div>
    </div>
  );
}
