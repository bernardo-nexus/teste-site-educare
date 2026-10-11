import clsx from 'clsx';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { Building2, Check, GraduationCap, Users } from 'lucide-react';
import { lazy, Suspense, useRef, useState, type ComponentType } from 'react';

import { useI18n } from '../../i18n';
import { ManagementScreen, ParentAgendaScreen, TeacherScreen } from '../ui/AppScreens';
import { PhoneFrame } from '../ui/PhoneFrame';

// three.js is heavy — load it only when this section mounts
const GLBPhone = lazy(() => import('../three/GLBPhone'));

// Real app screenshots, one per role (temporary set until the final prints are chosen)
const ROLE_SCREENS = ['/prints/pais/inicio.webp', '/prints/professores/inicio.webp', '/prints/gestao/inicio.webp?v=3'];

const roleMeta: { icon: ComponentType<{ className?: string }>; screen: ComponentType; tint: string; ink: string }[] = [
  { icon: Users, screen: ParentAgendaScreen, tint: 'bg-peach', ink: 'text-peach-ink' },
  { icon: GraduationCap, screen: TeacherScreen, tint: 'bg-sky', ink: 'text-sky-ink' },
  { icon: Building2, screen: ManagementScreen, tint: 'bg-meadow', ink: 'text-meadow-ink' },
];

function RoleBlock({ index, active }: { index: number; active: boolean }) {
  const { t } = useI18n();
  const role = t.solution.roles[index];
  const meta = roleMeta[index];

  return (
    <div className="flex flex-col justify-center py-14 lg:min-h-screen lg:py-0">
      <div className={clsx('transition-opacity duration-500', active ? 'lg:opacity-100' : 'lg:opacity-30')}>
        <span className={clsx('mb-5 flex h-12 w-12 items-center justify-center rounded-2xl', meta.tint)}>
          <meta.icon className={clsx('h-6 w-6', meta.ink)} />
        </span>
        <h3 className="mb-4 text-4xl lg:text-5xl">{role.title}</h3>
        <p className="mb-7 max-w-md text-[1.15rem] leading-relaxed text-ink-muted">{role.description}</p>
        <ul className="grid max-w-md gap-3">
          {role.highlights.map((h) => (
            <li key={h} className="flex items-center gap-3 text-[1.0625rem] font-medium text-ink">
              <Check className="h-4 w-4 shrink-0 text-emerald" strokeWidth={3} />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: static phone under each role */}
      <div className="mt-12 lg:hidden">
        <PhoneFrame className="mx-auto w-[15.5rem]" src={ROLE_SCREENS[index]} />
      </div>
    </div>
  );
}

export function Solution() {
  const { t } = useI18n();
  const rolesRef = useRef<HTMLDivElement>(null);
  const [screenIndex, setScreenIndex] = useState(0);

  /*
   * One full turn between roles. The device rests face-on while each role is read
   * and spins in the gap between them. Screens swap at 180°, while the back is showing.
   */
  const { scrollYProgress } = useScroll({ target: rolesRef, offset: ['start start', 'end end'] });
  const rawAngle = useTransform(
    scrollYProgress,
    [0, 0.22, 0.44, 0.56, 0.78, 1],
    [0, 0, 360, 360, 720, 720],
  );
  const angle = useSpring(rawAngle, { stiffness: 120, damping: 24, mass: 0.6 });

  useMotionValueEvent(angle, 'change', (v) => {
    const next = Math.min(roleMeta.length - 1, Math.max(0, Math.floor((v + 180) / 360)));
    setScreenIndex((prev) => (prev === next ? prev : next));
  });


  return (
    <section id="solucao" className="bg-white pt-24 lg:pt-36">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="eyebrow mb-4">{t.solution.badge}</p>
          <h2 className="text-[2.4rem] sm:text-6xl lg:text-[4.5rem]">
            {t.solution.title} <span className="text-brand">{t.solution.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">{t.solution.subtitle}</p>
        </motion.div>

        <div ref={rolesRef} className="relative mt-6 grid pb-16 lg:mt-0 lg:grid-cols-2 lg:gap-16 lg:pb-0">
          <div>
            {t.solution.roles.map((_, i) => (
              <RoleBlock key={i} index={i} active={i === screenIndex} />
            ))}
          </div>

          {/* Desktop: sticky iPhone 17 Pro Max that turns once per role */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    'absolute top-1/2 left-1/2 h-[120%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px] transition-colors duration-700',
                    roleMeta[screenIndex].tint,
                  )}
                />
                <Suspense fallback={<div className="h-[min(86vh,52rem)] w-[30rem]" />}>
                  <GLBPhone angle={angle} screens={ROLE_SCREENS} screenIndex={screenIndex} className="relative h-[min(86vh,52rem)] w-[30rem]" />
                </Suspense>
                <div className="-mt-4 flex justify-center gap-2">
                  {roleMeta.map((_, i) => (
                    <span
                      key={i}
                      className={clsx(
                        'h-2 rounded-full transition-all duration-500',
                        i === screenIndex ? 'w-6 bg-ink' : 'w-2 bg-line',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
