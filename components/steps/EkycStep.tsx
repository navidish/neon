'use client';

import { Camera, CheckCircle2, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';

export function EkycStep({ onContinue }: { onContinue: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [started, setStarted] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startCamera() {
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('دوربین در این مرورگر در دسترس نیست.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setStarted(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'دسترسی به دوربین ممکن نشد.',
      );
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg', 0.82));
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStarted(false);
  }

  function retake() {
    setPhoto(null);
    void startCamera();
  }

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />

      {!started && !photo && (
        <>
          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-white/[0.025] p-4 text-sm leading-6">
            <p>• روبه‌روی دوربین قرار بگیر.</p>
            <p>• عینک آفتابی و ماسک نداشته باش.</p>
            <p>• پس‌زمینه و نور مناسب باشد.</p>
          </div>

          <div className="mt-5">
            <ErrorMessage message={error} />
          </div>

          <div className="mt-6">
            <Button onClick={startCamera}>شروع فرآیند</Button>
          </div>
        </>
      )}

      {started && (
        <div className="flex flex-col items-center text-center">
          <div className="camera-ring bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="mt-6 text-lg font-black">
            صورتت را داخل کادر قرار بده
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            وقتی آماده‌ای، عکس را ثبت کن.
          </p>
          <div className="mt-6 w-full">
            <Button onClick={takePhoto}>گرفتن عکس</Button>
          </div>
        </div>
      )}

      {photo && (
        <div>
          <div className="mb-5 text-center">
            <CheckCircle2 className="mx-auto text-green-500" size={34} />
            <h2 className="mt-3 text-xl font-black">عکس ثبت شد</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              اگر مناسب نیست، می‌توانی دوباره عکس بگیری.
            </p>
          </div>
          <div className="mx-auto aspect-square max-w-xs overflow-hidden rounded-3xl border border-[var(--border)] bg-black">
            <img
              src={photo}
              alt="تصویر ثبت شده"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="secondary-button flex items-center justify-center gap-2"
              onClick={retake}
            >
              <RefreshCcw size={16} /> گرفتن مجدد
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={onContinue}
            >
              تأیید و ادامه
            </button>
          </div>
        </div>
      )}

      {error && started && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}
      <Camera className="sr-only" />
    </div>
  );
}
