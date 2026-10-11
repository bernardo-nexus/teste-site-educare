import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Building2,
  CalendarDays,
  MessageCircle,
  CreditCard,
  Camera,
  UtensilsCrossed,
  Pill,
  FileText,
  Calendar,
  Vote,
  ClipboardList,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Zap,
  LayoutDashboard,
  Settings,
  Megaphone,
  BarChart3,
  DollarSign,
  CalendarRange,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '../../i18n';

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  MessageCircle,
  CreditCard,
  Camera,
  UtensilsCrossed,
  Pill,
  FileText,
  Calendar,
  Vote,
  ClipboardList,
  ClipboardCheck,
  Users,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Zap,
  LayoutDashboard,
  Settings,
  Megaphone,
  BarChart3,
  DollarSign,
  CalendarRange,
};

const parentIcons = [
  'CalendarDays',
  'MessageCircle',
  'CreditCard',
  'Camera',
  'UtensilsCrossed',
  'Pill',
  'FileText',
  'Calendar',
  'Vote',
  'ClipboardList',
];
const teacherIcons = [
  'ClipboardCheck',
  'Users',
  'MessageSquare',
  'TrendingUp',
  'UserCheck',
  'Zap',
];
const managementIcons = [
  'LayoutDashboard',
  'Settings',
  'Megaphone',
  'BarChart3',
  'DollarSign',
  'CalendarRange',
];

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  features: Feature[];
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = iconMap[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Top accent line — appears on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Number + Icon row */}
      <div className="mb-4 flex items-start gap-3">
        {/* Icon with gradient background */}
        <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
          }}
        >
          {Icon && <Icon className="h-5 w-5 text-white" />}
        </div>

        {/* Number indicator */}
        <span className="mt-0.5 text-xs font-bold tracking-wider text-primary-400/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-1.5 text-base font-bold text-slate-900">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">
        {feature.description}
      </p>

    </motion.div>
  );
}

export function Features() {
  const [activeTab, setActiveTab] = useState('parents');
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const parentFeatures: Feature[] = t.features.parent.map((item, i) => ({
    icon: parentIcons[i],
    title: item.title,
    description: item.description,
  }));

  const teacherFeatures: Feature[] = t.features.teacher.map((item, i) => ({
    icon: teacherIcons[i],
    title: item.title,
    description: item.description,
  }));

  const managementFeatures: Feature[] = t.features.management.map(
    (item, i) => ({
      icon: managementIcons[i],
      title: item.title,
      description: item.description,
    }),
  );

  const tabs: Tab[] = [
    {
      id: 'parents',
      label: t.features.tabs.parents,
      icon: Users,
      features: parentFeatures,
    },
    {
      id: 'teachers',
      label: t.features.tabs.teachers,
      icon: GraduationCap,
      features: teacherFeatures,
    },
    {
      id: 'management',
      label: t.features.tabs.management,
      icon: Building2,
      features: managementFeatures,
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative flex min-h-[calc(100vh-70px)] flex-col justify-center overflow-hidden bg-slate-50 py-16 lg:py-20"
    >
      {/* Subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-10 text-center lg:mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.features.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t.features.subtitle}
          </p>
        </motion.div>

        {/* Pill-style tabs */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="inline-flex gap-2 rounded-2xl border border-slate-200/60 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700',
                  )}
                >
                  {/* Animated background for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="features-tab-bg"
                      className="absolute inset-0 rounded-xl bg-primary-600"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <TabIcon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Feature cards grid */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={gridRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
            {currentTab.features.map((feature, index) => (
              <FeatureCard
                key={`${activeTab}-${index}`}
                feature={feature}
                index={index}
              />
            ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
