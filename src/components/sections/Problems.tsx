import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarX2,
  Check,
  ChevronDown,
  Clock,
  FileWarning,
  Smartphone,
  ShieldAlert,
  TrendingDown,
  UserX,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useI18n } from '../../i18n';

const problemIcons = [FileWarning, Clock, TrendingDown, CalendarX2, UserX, ShieldAlert];
const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 5000;

/** Full-screen iPhone preview of a real app screenshot */
function ShotModal({ src, onClose, closeLabel }: { src: string; onClose: () => void; closeLabel: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.45, ease }}
        className="relative h-[min(82vh,46rem)] aspect-[9/19.5] rounded-[3rem] bg-gradient-to-br from-[#f1f2f4] via-[#b8bbc0] to-[#e6e8eb] p-[3px] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full w-full rounded-[2.85rem] bg-black p-[0.6rem]">
          <img src={src} alt="" className="h-full w-full rounded-[2.3rem] object-cover object-top" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="liquid-glass absolute -top-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Problems() {
  const { t } = useI18n();
  const f = t.features;
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [shot, setShot] = useState<string | null>(null);

  // Each everyday problem paired with the app feature that solves it (copy from the locale files)
  const solutions: { title: string; description: string; shot?: string }[] = [
    { ...f.management[2], shot: '/prints/gestao/comunicado.webp?v=3' },
    { ...f.teacher[5], shot: '/prints/professores/agenda-turma.webp' },
    { ...f.management[4], shot: '/prints/gestao/financeiro.webp?v=3' },
    { ...f.parent[0], shot: '/prints/professores/agenda-aluno.webp' },
    { ...f.parent[1], shot: '/prints/pais/inicio.webp' },
    { ...t.differentials.items[0] },
  ];

  // Gently cycle through the challenges until the visitor picks one
  useEffect(() => {
    if (touched || shot) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % solutions.length), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [touched, shot, solutions.length]);

  function pick(i: number) {
    setTouched(true);
    setActive((cur) => (cur === i && window.innerWidth < 1024 ? -1 : i));
  }

  const problem = t.problems.items[active] ?? t.problems.items[0];
  const sol = solutions[active] ?? solutions[0];

  const seeButton = (src?: string) =>
    src && (
      <button
        type="button"
        onClick={() => setShot(src)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
      >
        <Smartphone className="h-4 w-4 text-emerald" />
        {t.problems.seeInApp}
      </button>
    );

  return (
    <section id="desafios" className="section bg-white">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl"
        >
          <p className="eyebrow mb-4">{t.problems.badge}</p>
          <h2 className="text-[2.4rem] sm:text-6xl lg:text-[4rem]">
            {t.problems.title} <span className="text-brand">{t.problems.titleHighlight}</span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">{t.problems.subtitle}</p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Challenge list */}
          <ul className="divide-y divide-line border-y border-line">
            {t.problems.items.map((item, i) => {
              const Icon = problemIcons[i];
              const isActive = i === active;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-expanded={isActive}
                    className="group flex w-full items-center gap-4 py-5 text-left"
                  >
                    <Icon
                      className={clsx('h-5 w-5 shrink-0 transition-colors', isActive ? 'text-[#c2410c]' : 'text-ink-muted')}
                      strokeWidth={1.9}
                    />
                    <span
                      className={clsx(
                        'flex-1 text-[1.2rem] font-semibold tracking-tight transition-colors',
                        isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink',
                      )}
                    >
                      {item.title}
                    </span>
                    {/* progress bar for the auto-advance (desktop) */}
                    <span className="relative hidden h-[3px] w-10 overflow-hidden rounded-full bg-line lg:block">
                      {isActive && !touched && !shot && (
                        <motion.span
                          key={active}
                          className="absolute inset-y-0 left-0 bg-emerald"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                        />
                      )}
                      {isActive && (touched || shot) && <span className="absolute inset-0 bg-emerald" />}
                    </span>
                    <ChevronDown
                      className={clsx('h-5 w-5 text-ink-muted transition-transform lg:hidden', isActive && 'rotate-180')}
                    />
                  </button>

                  {/* Mobile: answer opens inline */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="pb-6 pl-9">
                          <p className="text-[0.98rem] leading-relaxed text-ink-muted">{item.description}</p>
                          <p className="mt-4 flex items-center gap-2 text-[1.05rem] font-semibold text-ink">
                            <Check className="h-4 w-4 text-emerald" strokeWidth={3} />
                            {solutions[i].title}
                          </p>
                          <p className="mt-1 text-[0.98rem] leading-relaxed text-ink-muted">{solutions[i].description}</p>
                          <div className="mt-4">{seeButton(solutions[i].shot)}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Desktop: answer panel */}
          <div className="hidden lg:block">
            <div className="sticky top-28 rounded-[2rem] bg-sage p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <p className="text-xs font-semibold tracking-wide text-[#c2410c] uppercase">{t.problems.before}</p>
                  <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-muted">{problem.description}</p>

                  <div className="my-8 h-px bg-line" />

                  <p className="text-xs font-semibold tracking-wide text-emerald uppercase">{t.problems.after}</p>
                  <h3 className="mt-2 text-[2rem] leading-tight">{sol.title}</h3>
                  <p className="mt-3 text-[1.15rem] leading-relaxed text-ink-soft">{sol.description}</p>

                  <div className="mt-8">{seeButton(sol.shot)}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="mt-14 max-w-2xl text-lg text-ink-muted">
          <span className="font-semibold text-ink">{t.problems.stat.value}</span> {t.problems.stat.text}
        </p>
      </div>

      <AnimatePresence>
        {shot && <ShotModal src={shot} onClose={() => setShot(null)} closeLabel={t.problems.close} />}
      </AnimatePresence>
    </section>
  );
}
