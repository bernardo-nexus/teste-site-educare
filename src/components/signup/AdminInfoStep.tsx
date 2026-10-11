import { useState } from 'react';
import { ArrowLeft, Loader2, UserCircle } from 'lucide-react';

import { useI18n } from '../../i18n';
import { maskPhone } from '../../utils/masks';
import { adminSchema } from '../../utils/schemas';
import type { AdminFormData } from '../../types/onboarding';

interface AdminInfoStepProps {
  data: AdminFormData;
  onSubmit: (data: AdminFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const GENDERS = ['male', 'female'] as const;

export function AdminInfoStep({ data, onSubmit, onBack, isLoading }: AdminInfoStepProps) {
  const { t } = useI18n();
  const s = t.signup;
  const [form, setForm] = useState<AdminFormData>(data);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = (): boolean => {
    const result = adminSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Partial<Record<string, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      newErrors[field] = s.validation[issue.message as keyof typeof s.validation];
    }
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const genderLabels = s.genders;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <UserCircle className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{s.steps.admin.title}</h2>
          <p className="text-sm text-slate-500">{s.steps.admin.subtitle}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.adminName} *
        </label>
        <input
          type="text"
          value={form.adminName}
          onChange={(e) => setForm({ ...form, adminName: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.adminName}
        />
        {errors.adminName && (
          <p className="mt-1 text-sm text-red-500">{errors.adminName}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.adminEmail} *
        </label>
        <input
          type="email"
          value={form.adminEmail}
          onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.adminEmail}
        />
        {errors.adminEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.adminEmail}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.adminPhone} *
        </label>
        <input
          type="tel"
          value={form.adminPhone}
          onChange={(e) => setForm({ ...form, adminPhone: maskPhone(e.target.value) })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.adminPhone}
        />
        {errors.adminPhone && (
          <p className="mt-1 text-sm text-red-500">{errors.adminPhone}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {s.fields.adminGender} *
        </label>
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setForm({ ...form, adminGender: g })}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                form.adminGender === g
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {genderLabels[g]}
            </button>
          ))}
        </div>
        {errors.adminGender && (
          <p className="mt-1 text-sm text-red-500">{errors.adminGender}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {s.back}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </span>
          ) : s.next}
        </button>
      </div>
    </form>
  );
}
