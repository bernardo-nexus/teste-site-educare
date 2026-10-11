import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

import { useI18n } from '../../i18n';

interface ErrorScreenProps {
  errorMessage: string | null;
  onRetry: () => void;
}

export function ErrorScreen({ errorMessage, onRetry }: ErrorScreenProps) {
  const { t } = useI18n();
  const s = t.onboarding.error;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>

      <h2 className="mb-2 text-2xl font-extrabold text-slate-900">{s.title}</h2>
      <p className="mb-4 text-slate-600">{s.subtitle}</p>

      {errorMessage && (
        <div className="mx-auto mb-6 max-w-sm rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg"
        >
          <RefreshCw className="h-4 w-4" />
          {s.retry}
        </button>
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {s.backToHome}
        </a>
      </div>
    </motion.div>
  );
}
