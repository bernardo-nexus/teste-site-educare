import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronLeft, GraduationCap, RotateCcw, Users } from 'lucide-react';
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { BACK, DEMO_ROLE_START, DEMO_SCREENS, SHOT_H, SHOT_W, type DemoHotspot } from '../../data/appDemo';
import { useI18n } from '../../i18n';

const roleIcons = [Users, GraduationCap, Building2];
const roleTints = ['bg-peach text-peach-ink', 'bg-sky text-sky-ink', 'bg-meadow text-meadow-ink'];

const iosEase = [0.32, 0.72, 0, 1] as const; // UINavigationController-like curve
const IDLE_HINT_MS = 800;

/** 1 = push (enter from right), -1 = pop (back), 0 = swap in place (tabs) */
type Nav = 1 | -1 | 0;

const screenVariants = {
  enter: (d: Nav) =>
    d === 1 ? { x: '100%', filter: 'brightness(1)' } : d === -1 ? { x: '-28%', filter: 'brightness(0.82)' } : { opacity: 0 },
  center: { x: '0%', opacity: 1, filter: 'brightness(1)' },
  exit: (d: Nav) =>
    d === 1 ? { x: '-28%', filter: 'brightness(0.82)' } : d === -1 ? { x: '100%', filter: 'brightness(1)' } : { opacity: 0 },
};

/** Front-facing iPhone 17 Pro: aluminium rim, black bezel, screenshot inside. */
function Device({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[18.5rem] sm:w-[20rem]">
      <span className="absolute top-[17%] -left-[3px] h-[4%] w-[3px] rounded-l bg-[#b9bcc1]" />
      <span className="absolute top-[24%] -left-[3px] h-[7%] w-[3px] rounded-l bg-[#b9bcc1]" />
      <span className="absolute top-[32.5%] -left-[3px] h-[7%] w-[3px] rounded-l bg-[#b9bcc1]" />
      <span className="absolute top-[26%] -right-[3px] h-[10%] w-[3px] rounded-r bg-[#b9bcc1]" />
      <div className="rounded-[3.1rem] bg-gradient-to-br from-[#f1f2f4] via-[#b8bbc0] to-[#e6e8eb] p-[3px] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.45),0_20px_40px_-20px_rgb(0_0_0/0.25)]">
        <div className="rounded-[2.95rem] bg-black p-[0.6rem]">
          <div className="relative aspect-[1206/2622] overflow-hidden rounded-[2.35rem] bg-black">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Translucent "finger" that taps the suggested target, like iOS screen-recording touches. */
function GhostTap({ target }: { target: DemoHotspot }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute z-30"
      style={{ left: `${target.x + target.w / 2}%`, top: `${target.y + target.h / 2}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* the finger */}
      <motion.span
        className="absolute -top-[9px] -left-[9px] block h-[18px] w-[18px] rounded-full border-[1.5px] border-white bg-white/45 shadow-[0_1px_6px_rgb(0_0_0/0.22)]"
        animate={{ scale: [1, 1, 0.8, 1, 1], opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 1.3, times: [0, 0.15, 0.38, 0.58, 1], repeat: Infinity, repeatDelay: 0.35 }}
      />
      {/* the ripple at the moment of the tap */}
      <motion.span
        className="absolute -top-[9px] -left-[9px] block h-[18px] w-[18px] rounded-full border border-white"
        animate={{ scale: [0.8, 0.8, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.3, times: [0, 0.38, 0.8], repeat: Infinity, repeatDelay: 0.35 }}
      />
    </motion.span>
  );
}

export function TryApp() {
  const { t } = useI18n();
  const firstRole = Math.max(0, DEMO_ROLE_START.findIndex((s) => s !== null));
  const [role, setRole] = useState(firstRole);
  const [stack, setStack] = useState<string[]>([DEMO_ROLE_START[firstRole] ?? 'g-inicio']);
  const [nav, setNav] = useState<Nav>(1);
  // The ghost tap shows once the current screen has sat idle for IDLE_HINT_MS
  const [idleKey, setIdleKey] = useState<string | null>(null);
  const [revealTargets, setRevealTargets] = useState(0); // bump to flash tap targets
  const [touches, setTouches] = useState<{ id: number; x: number; y: number }[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);
  const touchId = useRef(0);

  const current = DEMO_SCREENS[stack[stack.length - 1]];
  // Ghost-tap target: the screen's marked hint, else the first forward target (never "back")
  // Tall screens: map their targets to viewport % (scroll position 0) so the ghost tap can point at them
  const tallInView: DemoHotspot[] = current.tall
    ? current.tall.hotspots
        .map((h) => {
          const k = current.tall!.height / SHOT_H;
          return { ...h, y: h.y * k, h: h.h * k };
        })
        .filter((h) => h.y + h.h < 96)
    : [];
  const candidates = [...current.hotspots, ...tallInView];
  const suggestion =
    candidates.find((h) => h.hint) ?? candidates.find((h) => h.to !== BACK) ?? candidates[0];

  // Preload every screenshot once, so transitions slide real content instead of a blank frame
  useEffect(() => {
    Object.values(DEMO_SCREENS).forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  const viewKey = `${stack.join('/')}|${role}|${revealTargets}`;
  const idle = idleKey === viewKey;
  useEffect(() => {
    const id = window.setTimeout(() => setIdleKey(viewKey), IDLE_HINT_MS);
    return () => window.clearTimeout(id);
  }, [viewKey]);

  function ripple(e: MouseEvent) {
    const box = screenRef.current?.getBoundingClientRect();
    if (!box) return;
    const id = ++touchId.current;
    setTouches((ts) => [...ts, { id, x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100 }]);
    window.setTimeout(() => setTouches((ts) => ts.filter((x) => x.id !== id)), 550);
  }

  function back() {
    if (stack.length < 2) return;
    setNav(-1);
    setStack((s) => s.slice(0, -1));
  }

  function open(h: DemoHotspot) {
    if (h.to === BACK) return back();
    if (stack.length > 1 && stack[stack.length - 2] === h.to) return back();
    setNav(h.replace ? 0 : 1);
    setStack((s) => (h.replace ? [...s.slice(0, -1), h.to] : [...s, h.to]));
  }

  function pickRole(i: number) {
    const start = DEMO_ROLE_START[i];
    if (!start) return;
    setRole(i);
    setNav(0);
    setStack([start]);
  }

  function renderHotspot(h: DemoHotspot) {
    return (
      <button
        key={`${h.to}-${h.x}-${h.y}`}
        type="button"
        data-hotspot
        aria-label={h.label}
        onClick={() => open(h)}
        className="absolute z-10 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-emerald"
        style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
      >
        {/* Flashes only after a missed tap */}
        <motion.span
          key={revealTargets}
          className="pointer-events-none absolute inset-0 rounded-xl bg-black/[0.07] ring-1 ring-black/10"
          initial={{ opacity: revealTargets ? 1 : 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        />
      </button>
    );
  }

  return (
    <section id="como-funciona" className="section overflow-hidden bg-sage">
      <div className="container-site grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        {/* Copy + controls */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-4">{t.tryApp.badge}</p>
          <h2 className="text-[2.4rem] sm:text-6xl lg:text-[4.25rem]">
            {t.tryApp.title} <span className="text-brand">{t.tryApp.titleHighlight}</span>
          </h2>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink-muted">{t.tryApp.subtitle}</p>

          <p className="mt-10 mb-3 text-sm font-semibold text-ink-soft">{t.tryApp.choose}</p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.tryApp.choose}>
            {t.solution.roles.map((r, i) => {
              const Icon = roleIcons[i];
              const active = i === role;
              const available = DEMO_ROLE_START[i] !== null;
              return (
                <button
                  key={r.title}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  disabled={!available}
                  onClick={() => pickRole(i)}
                  className={clsx(
                    'flex items-center gap-2.5 rounded-full border py-2 pr-4 pl-2 text-[15px] font-semibold transition-all duration-200',
                    active
                      ? 'border-ink bg-ink text-white shadow-[var(--shadow-soft)]'
                      : available
                        ? 'border-line bg-white text-ink hover:border-ink/40'
                        : 'cursor-not-allowed border-line bg-white/60 text-ink-muted',
                  )}
                >
                  <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full', roleTints[i])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {r.title}
                  {!available && (
                    <span className="rounded-full bg-sage-deep px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                      {t.tryApp.soon}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-5 text-[15px]">
            <span className="text-ink-muted">{t.tryApp.hint}</span>
            <button
              type="button"
              onClick={() => pickRole(role)}
              className="flex items-center gap-1.5 font-medium text-emerald hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              {t.tryApp.restart}
            </button>
          </div>
        </motion.div>

        {/* Interactive device */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute inset-x-[-20%] top-[10%] bottom-[10%] rounded-full bg-lime/35 blur-[90px]" />
          <Device>
            <div
              ref={screenRef}
              className="absolute inset-0"
              onPointerDown={() => setIdleKey(null)}
              onClick={(e) => {
                ripple(e);
                // Tap that missed every target: briefly show where the app can be tapped
                if (!(e.target as HTMLElement).closest('[data-hotspot]')) setRevealTargets((n) => n + 1);
              }}
            >
              <AnimatePresence initial={false} custom={nav}>
                <motion.div
                  key={stack.join('/')}
                  custom={nav}
                  variants={screenVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={nav === 0 ? { duration: 0.22, ease: 'easeOut' } : { duration: 0.48, ease: iosEase }}
                  className={clsx(
                    'absolute inset-0 bg-white',
                    // the incoming screen casts a soft shadow on the one underneath
                    nav !== 0 && 'shadow-[-12px_0_28px_-10px_rgb(0_0_0/0.35)]',
                  )}
                  style={{ zIndex: nav === -1 ? 0 : 1 }}
                >
                  {current.tall ? (
                    <>
                      <div className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain">
                        <div className="relative w-full" style={{ aspectRatio: `${SHOT_W} / ${current.tall.height}` }}>
                          <img src={current.src} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
                          {current.tall.hotspots.map(renderHotspot)}
                        </div>
                      </div>
                      {/* Fixed app header: the top slice of the same image, pinned over the scroller */}
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
                        style={{ height: `${(current.tall.header / SHOT_H) * 100}%` }}
                      >
                        <img src={current.src} alt="" draggable={false} className="block w-full select-none" />
                      </div>
                      {current.hotspots.map(renderHotspot)}
                    </>
                  ) : (
                    <>
                      <img src={current.src} alt="" draggable={false} className="h-full w-full object-cover select-none" />
                      {current.hotspots.map(renderHotspot)}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Touch feedback where the visitor tapped */}
              {touches.map((tp) => (
                <motion.span
                  key={tp.id}
                  aria-hidden="true"
                  className="pointer-events-none absolute z-40 block h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/15"
                  style={{ left: `${tp.x}%`, top: `${tp.y}%` }}
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              ))}

              <AnimatePresence>{idle && suggestion && <GhostTap key={current.id} target={suggestion} />}</AnimatePresence>
            </div>
          </Device>

          {/* Back control outside the device, for anyone who misses the in-app arrow */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={back}
              disabled={stack.length < 2}
              className="liquid-glass flex items-center gap-1 rounded-full py-2 pr-4 pl-3 text-sm font-semibold text-ink transition-opacity disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4" />
              {t.tryApp.back}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
