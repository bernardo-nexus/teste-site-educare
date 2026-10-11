import clsx from 'clsx';
import { Check } from 'lucide-react';

import type { SignupStep } from '../../types/onboarding';

const STEPS: SignupStep[] = ['school', 'admin', 'payment', 'confirm'];

const STEP_INDEX: Record<SignupStep, number> = {
  school: 0,
  school_otp: 0,
  admin: 1,
  admin_otp: 1,
  payment: 2,
  confirm: 3,
};

interface StepIndicatorProps {
  currentStep: SignupStep;
  labels: string[];
}

export function StepIndicator({ currentStep, labels }: StepIndicatorProps) {
  const currentIndex = STEP_INDEX[currentStep] ?? 0;

  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isCompleted && 'bg-primary-600 text-white',
                  isCurrent && 'bg-primary-600 text-white ring-4 ring-primary-100',
                  !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={clsx(
                  'text-xs font-medium',
                  isCurrent ? 'text-primary-700' : 'text-slate-500'
                )}
              >
                {labels[index]}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={clsx(
                  'mb-4 h-0.5 w-12 sm:w-20',
                  index < currentIndex ? 'bg-primary-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
