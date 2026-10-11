import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, GraduationCap, Loader2, MessageCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { useI18n } from '../i18n';
import { useOnboarding } from '../hooks/useOnboarding';
import { usePlans } from '../hooks/usePlans';
import { StepIndicator } from '../components/signup/StepIndicator';
import { SchoolInfoStep } from '../components/signup/SchoolInfoStep';
import { AdminInfoStep } from '../components/signup/AdminInfoStep';
import { OtpStep } from '../components/signup/OtpStep';
import { PaymentStep } from '../components/signup/PaymentStep';
import { PlanConfirmStep } from '../components/signup/PlanConfirmStep';
import logo from '../assets/logo.png';

const FALLBACK_PLAN_SLUGS = ['basico', 'intermediario', 'completo'];
const RECOMMENDED_PLAN_SLUG = 'intermediario';

const BRAND_FEATURES = [
  { icon: Shield, labelKey: 0 },
  { icon: MessageCircle, labelKey: 1 },
  { icon: GraduationCap, labelKey: 2 },
];

const brandFeatureLabels: Record<string, string[]> = {
  br: [
    'Dados isolados e protegidos para cada escola',
    'Chat em tempo real entre pais e professores',
    'Gestão completa: turmas, alunos e relatórios',
  ],
  en: [
    'Isolated and protected data for each school',
    'Real-time chat between parents and teachers',
    'Full management: classes, students and reports',
  ],
  es: [
    'Datos aislados y protegidos para cada escuela',
    'Chat en tiempo real entre padres y profesores',
    'Gestión completa: clases, alumnos e informes',
  ],
};

export function Signup() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { plans, isLoading: plansLoading } = usePlans();
  const selfServicePlans = plans.filter((plan) => plan.isSelfService);
  const planSlugs = selfServicePlans.length > 0
    ? selfServicePlans.map((plan) => plan.slug)
    : FALLBACK_PLAN_SLUGS;
  const locationState = location.state as { plan?: string; studentCount?: number } | null;
  const initialPlan = locationState?.plan || RECOMMENDED_PLAN_SLUG;
  const [planSlug, setPlanSlug] = useState(initialPlan);
  const [studentCount, setStudentCount] = useState(locationState?.studentCount ?? 30);
  const s = t.signup;

  const features = brandFeatureLabels[lang] || brandFeatureLabels.en;

  const {
    step,
    schoolData,
    adminData,
    isSubmitting,
    isSendingOtp,
    error,
    goToStep,
    goBack,
    advanceFromSchool,
    advanceFromAdmin,
    advanceFromPayment,
    submitOnboarding,
  } = useOnboarding();

  const handleSubmit = async (token: string) => {
    const onboardingId = await submitOnboarding(planSlug, studentCount, token);
    if (onboardingId) {
      navigate(`/onboarding?id=${onboardingId}`);
    }
  };

  const selectedPlan = selfServicePlans.find((plan) => plan.slug === planSlug);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top header bar ── */}
      <div className="flex w-full items-center justify-between bg-slate-900 px-6 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {s.backToSite}
        </a>
        <img
          src={logo}
          alt="Nexus EduCare"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* ── Split screen ── */}
      <div className="flex flex-1">
      {/* ── Left Brand Panel (hidden on mobile) ── */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14"
        style={{
          background:
            'radial-gradient(circle at 30% -10%, #66BB6A 0%, #43A047 30%, #2E7D32 65%, #1B5E20 100%)',
        }}
      >

        {/* Center — Value propositions */}
        <motion.div
          className="relative z-10 -mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl">
            {lang === 'br'
              ? 'Comece a transformar sua escola hoje'
              : lang === 'es'
                ? 'Comience a transformar su escuela hoy'
                : 'Start transforming your school today'}
          </h2>
          <p className="mb-10 max-w-sm text-base leading-relaxed text-white/80">
            {lang === 'br'
              ? 'Configure em minutos. Cartão salvo agora, cobrado após o trial.'
              : lang === 'es'
                ? 'Configure en minutos. Tarjeta guardada ahora, cobrada tras el trial.'
                : 'Set up in minutes. Card saved now, charged after the trial.'}
          </p>

          <div className="space-y-4">
            {BRAND_FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <feat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium leading-snug text-white/90">
                  {features[i]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Trial badge */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <CalendarCheck className="h-5 w-5 shrink-0 text-white/80" />
            <p className="text-sm font-medium text-white/85">
              {lang === 'br'
                ? '7 dias grátis — cobrado após o trial'
                : lang === 'es'
                  ? '7 días gratis — cobrado tras el trial'
                  : '7 days free — charged after trial'}
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex w-1/2 flex-1 flex-col bg-slate-50">
        {/* Form container */}
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:items-center lg:py-0">
          <div className="w-full max-w-lg">
            {/* ── Plan Selector ── */}
            <div className="mb-6">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.pricing.badge}
              </p>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${planSlugs.length}, minmax(0, 1fr))` }}
              >
                {planSlugs.map((slug) => {
                  const plan = selfServicePlans.find((entry) => entry.slug === slug);
                  const isSelected = planSlug === slug;
                  const isRecommended = plan?.isPopular ?? slug === RECOMMENDED_PLAN_SLUG;
                  const displayName = plan
                    ? lang === 'en'
                      ? plan.name.en || plan.name.pt
                      : lang === 'es'
                        ? plan.name.es || plan.name.pt
                        : plan.name.pt
                    : slug;
                  const displayPrice = plan
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.pricePerStudentCents / 100)
                    : '';
                  const displayPriceDetail = t.pricing.priceDetail;

                  return (
                    <div key={slug} className="relative pt-3">
                      {isRecommended && (
                        <span className="absolute top-0 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
                          ★ Popular
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPlanSlug(slug)}
                        className={clsx(
                          'w-full rounded-xl border-2 px-3 py-3 text-left transition-all duration-200',
                          isSelected
                            ? 'border-primary-500 bg-primary-50 shadow-sm shadow-primary-200/50'
                            : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50',
                        )}
                      >
                        <span className={clsx(
                          'block text-sm font-bold',
                          isSelected ? 'text-primary-700' : 'text-slate-700',
                        )}>
                          {displayName}
                        </span>
                        <span className={clsx(
                          'block text-xs',
                          isSelected ? 'text-primary-600' : 'text-slate-400',
                        )}>
                          {displayPrice}
                          <span className="text-[10px]">/{displayPriceDetail}</span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Student count selector */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">{s.studentCount}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentCount((c) => Math.max(30, c - 10))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
                    >
                      −
                    </button>
                    <span className="min-w-[4rem] text-center text-sm font-bold text-slate-800">
                      {studentCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStudentCount((c) => Math.min(1000, c + 10))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  {(() => {
                    const plan = selfServicePlans.find((p) => p.slug === planSlug);
                    if (!plan) return null;
                    const total = plan.pricePerStudentCents * studentCount;
                    return (
                      <span className="text-sm font-semibold text-primary-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 100)}/mês
                      </span>
                    );
                  })()}
                </div>
              </div>

              {plansLoading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando planos...
                </div>
              )}
            </div>

            {/* Step indicator */}
            <div className="mb-6">
              <StepIndicator
                currentStep={step}
                labels={[s.stepLabels.school, s.stepLabels.admin, s.stepLabels.payment, s.stepLabels.confirm]}
              />
            </div>

            {/* Step content */}
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              {step === 'school' && (
                <SchoolInfoStep
                  data={schoolData}
                  onSubmit={advanceFromSchool}
                  isLoading={isSendingOtp}
                />
              )}

              {step === 'school_otp' && (
                <OtpStep
                  email={schoolData.schoolEmail}
                  type="school_email"
                  onVerified={() => goToStep('admin')}
                  onBack={goBack}
                />
              )}

              {step === 'admin' && (
                <AdminInfoStep
                  data={adminData}
                  onSubmit={advanceFromAdmin}
                  onBack={goBack}
                  isLoading={isSendingOtp}
                />
              )}

              {step === 'admin_otp' && (
                <OtpStep
                  email={adminData.adminEmail}
                  type="admin_email"
                  onVerified={() => goToStep('payment')}
                  onBack={goBack}
                />
              )}

              {step === 'payment' && (
                <PaymentStep
                  schoolEmail={schoolData.schoolEmail}
                  schoolName={schoolData.schoolName}
                  onSuccess={advanceFromPayment}
                  onBack={goBack}
                />
              )}

              {step === 'confirm' && (
                <PlanConfirmStep
                  schoolData={schoolData}
                  adminData={adminData}
                  planSlug={planSlug}
                  plan={selectedPlan}
                  studentCount={studentCount}
                  isSubmitting={isSubmitting}
                  error={error}
                  onSubmit={handleSubmit}
                  onBack={goBack}
                />
              )}
            </motion.div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-slate-400">
              {lang === 'br'
                ? 'Seus dados estão seguros. Não compartilhamos com terceiros.'
                : lang === 'es'
                  ? 'Sus datos están seguros. No los compartimos con terceros.'
                  : 'Your data is safe. We never share it with third parties.'}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
