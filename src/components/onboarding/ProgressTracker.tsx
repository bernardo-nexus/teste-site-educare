import clsx from 'clsx';
import { Check } from 'lucide-react';

import { useI18n } from '../../i18n';

interface ProgressTrackerProps {
  completedSteps: string[];
  currentStatus: string;
}

interface StepConfig {
  key: string;
  labelKey: 'payment' | 'tenant_creation' | 'platform_setup';
}

const STEPS: StepConfig[] = [
  { key: 'payment_confirmed', labelKey: 'payment' },
  { key: 'provisioning_tenant', labelKey: 'tenant_creation' },
  { key: 'provisioning_platform', labelKey: 'platform_setup' },
];

const STATUS_TO_ACTIVE_STEP: Record<string, string> = {
  payment_confirmed: 'payment_confirmed',
  provisioning_tenant: 'provisioning_tenant',
  provisioning_platform: 'provisioning_platform',
};

export function ProgressTracker({ completedSteps, currentStatus }: ProgressTrackerProps) {
  const { t } = useI18n();
  const labels = t.onboarding.steps;
  const activeStep = STATUS_TO_ACTIVE_STEP[currentStatus];

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.key);
        const isActive = step.key === activeStep && !isCompleted;
        const isPending = !isCompleted && !isActive;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className="flex items-stretch gap-4">
            {/* Left: indicator + line */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={clsx(
                  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500',
                  isCompleted && 'border-primary-500 bg-primary-500',
                  isActive && 'border-primary-500 bg-white',
                  isPending && 'border-slate-200 bg-white'
                )}
              >
                {isCompleted && <Check className="h-4 w-4 text-white" strokeWidth={2.5} />}
                {isActive && (
                  <>
                    <span className="h-3 w-3 rounded-full bg-primary-500" />
                    <span className="absolute h-9 w-9 animate-ping rounded-full bg-primary-400 opacity-30" />
                  </>
                )}
                {isPending && (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={clsx(
                    'mt-1 w-0.5 flex-1 min-h-[28px] rounded-full transition-all duration-500',
                    isCompleted ? 'bg-primary-300' : 'bg-slate-200'
                  )}
                />
              )}
            </div>

            {/* Right: label */}
            <div className={clsx('pb-7', isLast && 'pb-0', 'flex items-start pt-1.5')}>
              <span
                className={clsx(
                  'text-sm font-semibold leading-tight transition-colors duration-300',
                  isCompleted && 'text-primary-700',
                  isActive && 'text-slate-900',
                  isPending && 'text-slate-400'
                )}
              >
                {labels[step.labelKey]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
