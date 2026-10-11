import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  Loader2,
  Smartphone,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { useI18n } from "../i18n";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";
import { ApprovalWaitingScreen } from "../components/onboarding/ApprovalWaitingScreen";
import { ProgressTracker } from "../components/onboarding/ProgressTracker";
import { SuccessScreen } from "../components/onboarding/SuccessScreen";
import { ErrorScreen } from "../components/onboarding/ErrorScreen";
import logo from "../assets/logo.png";

const BRAND_FEATURES = [
  { icon: Smartphone, labelKey: 0 },
  { icon: Bell, labelKey: 1 },
  { icon: Users, labelKey: 2 },
];

const brandFeatureLabels: Record<string, string[]> = {
  br: [
    "App disponível para iOS e Android — acesso imediato após aprovação",
    "Comunicados e avisos chegam instantaneamente aos pais",
    "Gerencie turmas, presenças e relatórios em um só lugar",
  ],
  en: [
    "App available on iOS and Android — instant access after approval",
    "Announcements reach parents instantly",
    "Manage classes, attendance and reports in one place",
  ],
  es: [
    "App disponible en iOS y Android — acceso inmediato tras aprobación",
    "Los avisos llegan instantáneamente a los padres",
    "Gestiona clases, asistencia e informes en un solo lugar",
  ],
};

export function OnboardingProgress() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const onboardingId = searchParams.get("id");
  const s = t.onboarding;

  const features = brandFeatureLabels[lang] || brandFeatureLabels.en;

  const { data, isLoading, error, retry } = useOnboardingStatus(onboardingId);

  const renderContent = () => {
    if (!onboardingId) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-600">{s.noId}</p>
            <a
              href="/"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700"
            >
              {s.success.backToHome}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:items-center lg:py-0">
        <div className="w-full max-w-md">
          {isLoading && !data && (
            <div className="flex flex-col items-center gap-4 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="text-sm text-slate-500">{s.loading}</p>
            </div>
          )}

          {error && !data && (
            <ErrorScreen errorMessage={error} onRetry={retry} />
          )}

          {data && data.isComplete && (
            <SuccessScreen
              onboardingId={data.id}
              schoolName={data.schoolName ?? ''}
              adminEmail={data.adminEmail ?? ''}
              planSlug={data.planSlug}
            />
          )}

          {data && data.isFailed && (
            <ErrorScreen errorMessage={data.errorMessage} onRetry={retry} />
          )}

          {data && data.isPendingApproval && !data.isComplete && !data.isFailed && (
            <ApprovalWaitingScreen
              schoolName={data.schoolName ?? ''}
              adminEmail={data.adminEmail ?? ''}
            />
          )}

          {data && !data.isPendingApproval && !data.isComplete && !data.isFailed && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
                  {s.title}
                </h2>
                <p className="text-slate-600">
                  {data.statusMessage[lang === "br" ? "pt" : lang] ||
                    data.statusMessage.pt}
                </p>
              </div>

              <ProgressTracker
                completedSteps={data.completedSteps}
                currentStatus={data.status}
              />

              <p className="mt-6 text-center text-xs text-slate-400">
                {s.doNotClose}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top header bar ── */}
      <div className="flex w-full items-center justify-between bg-slate-900 px-6 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.signup.backToSite}
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
            {lang === "br"
              ? "Tudo pronto para começar"
              : lang === "es"
                ? "Todo listo para comenzar"
                : "Ready to get started"}
          </h2>
          <p className="mb-10 max-w-sm text-base leading-relaxed text-white/75">
            {lang === "br"
              ? "Em instantes você terá acesso a todas as ferramentas para gerir sua escola com mais eficiência."
              : lang === "es"
                ? "En instantes tendrá acceso a todas las herramientas para gestionar su escuela."
                : "In moments you'll have access to all the tools to manage your school more efficiently."}
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <feat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium leading-snug text-white/90">
                  {features[i]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Trust badge */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <CalendarCheck className="h-5 w-5 shrink-0 text-white/80" />
            <p className="text-sm font-medium text-white/85">
              {lang === "br"
                ? "7 dias grátis — cobrado após o trial"
                : lang === "es"
                  ? "7 días gratis — cobrado tras el trial"
                  : "7 days free — charged after trial"}
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Right Content Panel ── */}
      <div className="flex w-1/2 flex-1 flex-col bg-slate-50">
        {renderContent()}
      </div>
      </div>
    </div>
  );
}
