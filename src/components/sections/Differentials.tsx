import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  WifiOff,
  Zap,
  Smartphone,
  Palette,
  HeadphonesIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../../i18n';

const icons: LucideIcon[] = [Shield, WifiOff, Zap, Smartphone, Palette, HeadphonesIcon];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function Differentials() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const differentials = t.differentials.items.map((item, index) => ({
    icon: icons[index],
    title: item.title,
    description: item.description,
  }));

  return (
    <section
      id="diferenciais"
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
          className="mb-12 text-center lg:mb-14"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            {t.differentials.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.differentials.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t.differentials.subtitle}
          </p>
        </motion.div>

        {/* Differential cards */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {differentials.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                {/* Accent line — appears on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Number + Icon column */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-primary-400/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                    }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3 className="mb-1 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
