import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Check, Mail } from "lucide-react";

import { useI18n } from "../../i18n";
import { revealInitialCredential } from "../../lib/api";
import badgeGooglePlay from "../../assets/download-google.png";
import badgeAppStore from "../../assets/download-ios.png";
import {
  clearOnboardingAccessToken,
  getOnboardingAccessToken,
} from "../../lib/onboarding-access-token";

interface SuccessScreenProps {
  onboardingId: string;
  schoolName: string;
  adminEmail: string;
  planSlug?: string;
}

export function SuccessScreen({
  onboardingId,
  schoolName,
  adminEmail,
}: SuccessScreenProps) {
  const { t } = useI18n();
  const s = t.onboarding.success;
  const [copied, setCopied] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  const handleRevealPassword = async () => {
    setRevealError(null);
    const onboardingAccessToken = getOnboardingAccessToken(onboardingId);

    if (!onboardingAccessToken) {
      setRevealError(s.revealUnavailable);
      return;
    }

    try {
      setIsRevealing(true);
      const result = await revealInitialCredential({
        onboardingId,
        onboardingAccessToken,
      });
      setTempPassword(result.tempPassword);
      setRevealDone(true);
      clearOnboardingAccessToken(onboardingId);
    } catch {
      setRevealError(s.revealUnavailable);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleCopy = async () => {
    if (!tempPassword) return;
    await navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100"
      >
        <CheckCircle className="h-10 w-10 text-primary-600" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-extrabold text-slate-900">{s.title}</h2>
      <p className="mb-8 text-balance text-slate-600">{s.subtitle}</p>

      {/* School info */}
      <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-5">
        <p className="mb-1 text-sm font-medium text-slate-500">{s.schoolLabel}</p>
        <p className="text-lg font-bold text-slate-900">{schoolName}</p>
      </div>

      {/* Email sent notice */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 text-left">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
            <Mail className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{s.credentialsLabel}</p>
        </div>

        <div className="mb-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            {s.emailLabel}
          </p>
          <p className="break-words text-sm font-medium text-slate-900">{adminEmail}</p>
        </div>

        <p className="text-xs text-slate-500">{s.emailSentNote}</p>

        {/* Pending approval notice */}
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs text-amber-700">{s.pendingNote}</p>
        </div>

        {/* Fallback: reveal password */}
        {!showFallback && !tempPassword && !revealDone && (
          <button
            type="button"
            onClick={() => setShowFallback(true)}
            className="mt-4 text-xs text-slate-400 underline underline-offset-2 transition hover:text-slate-600"
          >
            {s.noEmailFallback}
          </button>
        )}

        {showFallback && !tempPassword && !revealDone && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleRevealPassword}
              disabled={isRevealing}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRevealing ? s.loadingPassword : s.revealPasswordCta}
            </button>
            <p className="mt-2 text-xs text-amber-600">{s.revealOneTimeWarning}</p>
            {revealError && (
              <p className="mt-2 text-xs text-red-600">{revealError}</p>
            )}
          </div>
        )}

        {revealDone && !tempPassword && (
          <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2">
            <p className="text-xs text-primary-700">{s.existingUserNote}</p>
          </div>
        )}

        {tempPassword && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              {s.passwordLabel}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-900">
                {tempPassword}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-amber-600">{s.changePasswordNote}</p>
          </div>
        )}
      </div>

      {/* Download links */}
      <div className="mb-6 space-y-3">
        <p className="text-sm font-semibold text-slate-700">{s.downloadApp}</p>
        <div className="flex justify-center gap-3">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-90 active:opacity-75"
          >
            <img src={badgeGooglePlay} alt="Get it on Google Play" className="h-12 w-auto" />
          </a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-90 active:opacity-75"
          >
            <img src={badgeAppStore} alt="Download on the App Store" className="h-12 w-auto" />
          </a>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-left">
        <p className="mb-3 text-sm font-semibold text-slate-700">{s.nextSteps}</p>
        <ol className="space-y-2 text-sm text-slate-600">
          {[s.step1, s.step2, s.step3].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700"
      >
        {s.backToHome}
      </a>
    </motion.div>
  );
}
