import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';

import { useI18n } from '../../i18n';
import { sendOtp, verifyOtp } from '../../lib/api';

interface OtpStepProps {
  email: string;
  type: 'school_email' | 'admin_email';
  onVerified: () => void;
  onBack: () => void;
}

const RESEND_COOLDOWN = 30;
const MAX_RESENDS = 3;

export function OtpStep({ email, type, onVerified, onBack }: OtpStepProps) {
  const { t } = useI18n();
  const s = t.signup.otp;

  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resendCount, setResendCount] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessing = isVerifying || isSending;

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCooldown();
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleResend = async () => {
    if (cooldown > 0 || isSending || resendCount >= MAX_RESENDS) return;
    setError(null);
    setIsSending(true);
    try {
      await sendOtp({ email, type });
      setResendCount((n) => n + 1);
      startCooldown();
    } catch {
      setError(s.sendError);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || isProcessing) return;

    setError(null);
    setIsVerifying(true);
    try {
      const result = await verifyOtp({ email, code, type });
      if (result.verified) {
        onVerified();
      } else if (result.error) {
        setError(result.error);
        setCode('');
      } else {
        const attempts = result.remainingAttempts ?? 0;
        setRemainingAttempts(attempts);
        setError(attempts > 0 ? s.wrongCode.replace('{n}', String(attempts)) : s.maxAttempts);
        setCode('');
      }
    } catch {
      setError(s.verifyError);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (value: string) => {
    if (isProcessing) return;
    const clean = value.replace(/\D/g, '').slice(0, 6);
    setCode(clean);
    setError(null);
  };

  const resendExhausted = resendCount >= MAX_RESENDS;
  const resendDisabled = cooldown > 0 || isSending || resendExhausted;

  return (
    <div className="space-y-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <Mail className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
          <p className="text-sm text-slate-500">{s.subtitle}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-500">{s.sentTo}</p>
        <p className="text-sm font-semibold text-slate-800 break-all">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {s.codeLabel}
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="000000"
            maxLength={6}
            autoFocus
            disabled={isProcessing}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:bg-slate-100 disabled:opacity-60"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          {remainingAttempts !== null && !error && (
            <p className="mt-1 text-xs text-amber-600">
              {s.attemptsLeft.replace('{n}', String(remainingAttempts))}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.signup.back}
          </button>
          <button
            type="submit"
            disabled={code.length !== 6 || isProcessing}
            className="flex-1 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none bg-primary-600 hover:bg-primary-700 hover:shadow-lg"
          >
            {isVerifying ? s.verifying : s.verify}
          </button>
        </div>
      </form>

      <div className="text-center">
        {resendExhausted ? (
          <p className="text-sm text-slate-400">{s.resendMaxReached}</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 transition hover:text-primary-700 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSending ? 'animate-spin' : ''}`} />
            {cooldown > 0
              ? s.resendIn.replace('{s}', String(cooldown))
              : isSending
                ? s.resendIn.replace('{s}', '…')
                : s.resend}
          </button>
        )}
      </div>
    </div>
  );
}
