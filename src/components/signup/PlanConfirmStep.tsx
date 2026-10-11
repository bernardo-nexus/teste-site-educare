import { useState } from 'react';
import { ArrowLeft, Check, Loader2, Shield } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { useI18n } from '../../i18n';
import type { SchoolFormData, AdminFormData, Plan } from '../../types/onboarding';

interface PlanConfirmStepProps {
  schoolData: SchoolFormData;
  adminData: AdminFormData;
  planSlug: string;
  plan?: Plan;
  studentCount: number;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (token: string) => void;
  onBack: () => void;
}

export function PlanConfirmStep({
  schoolData,
  adminData,
  planSlug,
  plan,
  studentCount,
  isSubmitting,
  error,
  onSubmit,
  onBack,
}: PlanConfirmStepProps) {
  const { t, lang } = useI18n();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const s = t.signup;
  const [acceptTerms, setAcceptTerms] = useState(false);

  const localizedPlanName = (() => {
    if (!plan) return planSlug;
    if (lang === 'es') return plan.name.es || plan.name.pt;
    if (lang === 'en') return plan.name.en || plan.name.pt;
    return plan.name.pt;
  })();

  const localizedPrice = plan
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.pricePerStudentCents / 100)
    : null;

  const totalCents = plan ? plan.pricePerStudentCents * studentCount : null;
  const totalFormatted = totalCents
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCents / 100)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms || isSubmitting) return;
    let token = '';
    try {
      token = (await executeRecaptcha?.('signup')) ?? '';
    } catch {
      // reCAPTCHA not configured — proceed without token
    }
    onSubmit(token);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">{s.steps.confirm.title}</h2>
        <p className="text-sm text-slate-500">{s.steps.confirm.subtitle}</p>
      </div>

      {/* Summary cards */}
      <div className="space-y-3">
        {/* Plan */}
        <div className="rounded-lg border border-primary-200 bg-primary-50/50 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
            {s.confirm.plan}
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">
              {localizedPlanName}
            </span>
            <span className="text-lg font-bold text-primary-600">
              {localizedPrice ?? planSlug}{' '}
              <span className="text-sm font-normal text-slate-500">/{t.pricing.priceDetail}</span>
            </span>
          </div>
          {totalFormatted && (
            <p className="mt-0.5 text-sm text-slate-500">
              {studentCount} alunos × {localizedPrice} = <span className="font-semibold text-slate-700">{totalFormatted}/mês</span>
            </p>
          )}
        </div>

        {/* School info */}
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {s.confirm.schoolInfo}
          </div>
          <div className="space-y-1 break-words text-sm text-slate-700">
            <p><span className="font-medium">{s.fields.schoolCnpj}:</span> {schoolData.schoolCnpj}</p>
            {schoolData.schoolRazaoSocial && (
              <p><span className="font-medium">{s.fields.schoolRazaoSocial}:</span> {schoolData.schoolRazaoSocial}</p>
            )}
            <p><span className="font-medium">{s.fields.schoolName}:</span> {schoolData.schoolName}</p>
            <p><span className="font-medium">{s.fields.schoolEmail}:</span> {schoolData.schoolEmail}</p>
            <p><span className="font-medium">{s.fields.schoolPhone}:</span> {schoolData.schoolPhone}</p>
            {schoolData.schoolFoundationDate && (
              <p><span className="font-medium">{s.fields.schoolFoundationDate}:</span> {schoolData.schoolFoundationDate}</p>
            )}
          </div>
        </div>

        {/* Admin info */}
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {s.confirm.adminInfo}
          </div>
          <div className="space-y-1 break-words text-sm text-slate-700">
            <p><span className="font-medium">{s.fields.adminName}:</span> {adminData.adminName}</p>
            <p><span className="font-medium">{s.fields.adminEmail}:</span> {adminData.adminEmail}</p>
            {adminData.adminPhone && (
              <p><span className="font-medium">{s.fields.adminPhone}:</span> {adminData.adminPhone}</p>
            )}
            {adminData.adminGender && (
              <p><span className="font-medium">{s.fields.adminGender}:</span> {s.genders[adminData.adminGender as 'male' | 'female']}</p>
            )}
          </div>
        </div>

        {/* Trial badge */}
        <div className="flex items-center gap-2 rounded-lg bg-accent-50 p-3 text-sm text-accent-700">
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span>{s.confirm.trialInfo}</span>
        </div>
      </div>

      {/* Terms checkbox */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-sm text-slate-600">{s.confirm.acceptTerms}</span>
      </label>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {s.back}
        </button>
        <button
          type="submit"
          disabled={!acceptTerms || isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {s.confirm.submitting}
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {s.confirm.submit}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
