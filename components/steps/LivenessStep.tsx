'use client';

import { CheckCircle2, Mic, Play, RefreshCcw, Video } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';

const sentences = [
  'امروز برای افتتاح حساب اقدام کرده‌ام.',
  'من با آگاهی کامل این فرآیند را انجام می‌دهم.',
  'لطفاً اطلاعات حساب من را بررسی کنید.',
  'این ویدیو برای احراز هویت من ضبط می‌شود.',
  'من آماده تکمیل فرآیند ثبت نام هستم.',
  'امروز یک روز خوب برای شروع یک کار جدید است.',
];

export function LivenessStep({ onContinue }: { onContinue: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [sentence, setSentence] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recording) return;

    if (seconds <= 0) {
      stopRecording();
      return;
    }

    const timer = window.setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [recording, seconds]);

  async function startLiveness() {
    setError('');
    setCompleted(false);
    setSeconds(5);

    const randomSentence =
      sentences[Math.floor(Math.random() * sentences.length)];

    setSentence(randomSentence);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('دوربین و میکروفون در این مرورگر در دسترس نیست.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;

      setStarted(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'دسترسی به دوربین و میکروفون ممکن نشد.',
      );
    }
  }

  function startRecording() {
    const stream = streamRef.current;

    if (!stream) return;

    try {
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        setRecording(false);
        setCompleted(true);

        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      };

      recorderRef.current = recorder;

      recorder.start();

      setSeconds(5);
      setRecording(true);
    } catch {
      setError('ضبط ویدیو در این مرورگر ممکن نشد.');
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  function reset() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    recorderRef.current = null;
    streamRef.current = null;

    setStarted(false);
    setRecording(false);
    setCompleted(false);
    setSeconds(5);
    setSentence('');
    setError('');
  }

  if (completed) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-green-500" size={42} />

        <h2 className="mt-4 text-xl font-black">ویدیو با موفقیت ضبط شد</h2>

        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          ویدیو آماده ارسال برای سرویس Liveness است.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="secondary-button flex items-center justify-center gap-2"
            onClick={reset}
          >
            <RefreshCcw size={16} />
            ضبط مجدد
          </button>

          <button type="button" className="primary-button" onClick={onContinue}>
            ارسال و ادامه
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-white/[0.025] p-5 text-sm leading-7">
          <p>• مطمئن شوید نور محیط کافی است.</p>

          <p>• صورت خود را داخل کادر قرار دهید.</p>

          <p>• پس از شروع، یک جمله به شما نمایش داده می‌شود.</p>

          <p>• جمله را با صدای بلند و واضح بخوانید.</p>

          <p>• هنگام خواندن جمله، صورت خود را مقابل دوربین نگه دارید.</p>
        </div>

        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>

        <div className="mt-6">
          <Button onClick={startLiveness}>
            <Play size={17} />
            شروع فرآیند
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Camera */}
      <div className="camera-ring mx-auto overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      {/* Sentence */}
      <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-6">
        <div className="mb-3 flex items-center justify-center gap-2 text-xs text-fuchsia-400">
          <Mic size={16} />

          <span>جمله زیر را با صدای بلند بخوانید</span>
        </div>

        <p className="text-lg font-black leading-9">«{sentence}»</p>
      </div>

      {/* Recording status */}
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
        <Video
          size={17}
          className={
            recording ? 'animate-pulse text-red-500' : 'text-fuchsia-400'
          }
        />

        {recording ? 'در حال ضبط صدا و تصویر' : 'آماده ضبط'}
      </div>

      {/* Timer */}
      {recording && (
        <div className="mt-4 text-4xl font-black tabular-nums">{seconds}</div>
      )}

      {/* Actions */}
      <div className="mt-6">
        {!recording ? (
          <Button onClick={startRecording}>
            <Mic size={17} />
            شروع ضبط
          </Button>
        ) : (
          <Button onClick={stopRecording}>پایان ضبط</Button>
        )}
      </div>

      <div className="mt-4">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
}
