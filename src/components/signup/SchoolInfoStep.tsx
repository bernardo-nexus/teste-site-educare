import { useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';

import { useI18n } from '../../i18n';
import { maskCNPJ, maskDate, maskPhone } from '../../utils/masks';
import { schoolSchema } from '../../utils/schemas';
import type { SchoolFormData } from '../../types/onboarding';

interface SchoolInfoStepProps {
  data: SchoolFormData;
  onSubmit: (data: SchoolFormData) => void;
  isLoading?: boolean;
}

export function SchoolInfoStep({ data, onSubmit, isLoading }: SchoolInfoStepProps) {
  const { t } = useI18n();
  const s = t.signup;
  const [form, setForm] = useState<SchoolFormData>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof SchoolFormData, string>>>({});

  const validate = (): boolean => {
    const result = schoolSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Partial<Record<keyof SchoolFormData, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof SchoolFormData;
      newErrors[field] = s.validation[issue.message as keyof typeof s.validation];
    }
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <Building2 className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{s.steps.school.title}</h2>
          <p className="text-sm text-slate-500">{s.steps.school.subtitle}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolCnpj} *
        </label>
        <input
          type="text"
          value={form.schoolCnpj}
          onChange={(e) => setForm({ ...form, schoolCnpj: maskCNPJ(e.target.value) })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolCnpj}
        />
        {errors.schoolCnpj && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolCnpj}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolRazaoSocial} *
        </label>
        <input
          type="text"
          value={form.schoolRazaoSocial}
          onChange={(e) => setForm({ ...form, schoolRazaoSocial: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolRazaoSocial}
        />
        {errors.schoolRazaoSocial && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolRazaoSocial}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolName} *
        </label>
        <input
          type="text"
          value={form.schoolName}
          onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolName}
        />
        {errors.schoolName && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolEmail} *
        </label>
        <input
          type="email"
          value={form.schoolEmail}
          onChange={(e) => setForm({ ...form, schoolEmail: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolEmail}
        />
        {errors.schoolEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolEmail}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolPhone} *
        </label>
        <input
          type="tel"
          value={form.schoolPhone}
          onChange={(e) => setForm({ ...form, schoolPhone: maskPhone(e.target.value) })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolPhone}
        />
        {errors.schoolPhone && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolPhone}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {s.fields.schoolFoundationDate} *
        </label>
        <input
          type="text"
          value={form.schoolFoundationDate}
          onChange={(e) => setForm({ ...form, schoolFoundationDate: maskDate(e.target.value) })}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          placeholder={s.placeholders.schoolFoundationDate}
          maxLength={10}
        />
        {errors.schoolFoundationDate && (
          <p className="mt-1 text-sm text-red-500">{errors.schoolFoundationDate}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </span>
        ) : s.next}
      </button>
    </form>
  );
}
