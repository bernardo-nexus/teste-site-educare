import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import { useI18n } from '../../i18n';

interface ApprovalWaitingScreenProps {
  schoolName: string;
  adminEmail: string;
}

export function ApprovalWaitingScreen({ schoolName, adminEmail }: ApprovalWaitingScreenProps) {
  const { t } = useI18n();
  const s = t.onboarding.approval;

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
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
      >
        <Clock className="h-10 w-10 text-amber-600" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-extrabold text-slate-900">{s.title}</h2>
      <p className="mb-8 text-slate-600">{s.subtitle}</p>

      {/* School info */}
      <div className="mx-auto mb-6 max-w-sm rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <p className="mb-1 text-sm font-medium text-slate-500">{s.schoolLabel}</p>
        <p className="text-lg font-bold text-slate-900">{schoolName}</p>
      </div>

      {/* What happens next */}
      <div className="mx-auto mb-8 max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-left">
        <p className="mb-4 text-center text-sm font-semibold text-slate-700">{s.nextSteps}</p>
        <ol className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <span>{s.step1}</span>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <span className="min-w-0 break-all">
              {s.step2.split('{email}')[0]}
              <strong>{adminEmail}</strong>
              {s.step2.split('{email}')[1]}
            </span>
          </li>
          <li className="flex gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
            <span className="text-slate-400">{s.step3}</span>
          </li>
        </ol>
      </div>

      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700"
      >
        {s.backToHome}
      </a>
    </motion.div>
  );
}
