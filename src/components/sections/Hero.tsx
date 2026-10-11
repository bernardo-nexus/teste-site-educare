import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, HeadphonesIcon, Shield, WifiOff } from 'lucide-react';
import { type MouseEvent, useEffect, useRef } from 'react';

import { useI18n } from '../../i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/** Promo video (9:16) — already contains its own phone, captions, intro and outro. */
function AppVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // Only play while visible — saves battery and data on mobile
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      poster="/video/promo-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/video/promo.webm" type="video/webm" />
      <source src="/video/promo.mp4" type="video/mp4" />
    </video>
  );
}

export function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Device tilts gently toward the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 120, damping: 18 });

  function onMove(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  const trustBadges = [
    { icon: Shield, label: t.hero.badges.secure },
    { icon: WifiOff, label: t.hero.badges.offline },
    { icon: HeadphonesIcon, label: t.hero.badges.support },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7] text-ink"
    >

      <div className="container-site relative grid items-center gap-14 pt-32 pb-0 lg:min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-28">
        {/* Copy */}
        <div className="pb-6 lg:pb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[13px] font-semibold text-ink-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            {t.hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.9, ease }}
            className="max-w-xl text-[2.9rem] leading-[1.02] font-bold text-ink sm:text-6xl lg:text-[4.5rem]"
          >
            {t.hero.title} <span className="text-brand">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.9, ease }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted lg:text-[1.2rem]"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.9, ease }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <a href="#contato" className="btn-primary glass-button">
              {t.hero.ctaPrimary}
            </a>
            <a href="#pricing" className="link-arrow">
              {t.hero.ctaSecondary}
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6"
          >
            {trustBadges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                <badge.icon className="h-4 w-4 text-emerald" />
                {badge.label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Device with real app video */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1.1, ease }}
          style={{ y: deviceY }}
          className="relative mx-auto mb-16 w-[17rem] [perspective:1400px] sm:w-[20rem] lg:mb-0 lg:w-[23rem]"
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="relative [transform-style:preserve-3d]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-[#eef4e6] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.35),0_20px_40px_-20px_rgb(0_0_0/0.2)] ring-1 ring-black/5">
              <AppVideo />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
