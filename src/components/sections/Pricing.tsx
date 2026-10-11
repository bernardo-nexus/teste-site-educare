import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { motion, useInView } from 'framer-motion'
import { Check, Minus, Plus, Shield, Star } from 'lucide-react'

import clsx from 'clsx'

import { useI18n } from '../../i18n'
import { usePlans } from '../../hooks/usePlans'
import type { Plan } from '../../types/onboarding'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

function formatPriceCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type ComparisonRow = { name: string; type: string; key: string }
type ComparisonGroup = { name: string; rows: ComparisonRow[] }

function resolveRowValue(
  row: ComparisonRow,
  plan: Plan | undefined,
  tc: ReturnType<typeof useI18n>['t']['pricing']['comparison'],
): string {
  if (!plan) return '—'
  const features = plan.features as string[]
  const limits = plan.featureLimits as Record<string, unknown>

  switch (row.type) {
    case 'always':
      return '✓'

    case 'feature':
      return features.includes(row.key) ? '✓' : '—'

    case 'limit': {
      const val = limits[row.key] as number | undefined | null
      if (val === 0 || val === undefined || val === null) return tc.unlimited
      return val.toLocaleString('pt-BR')
    }

    case 'gallery': {
      if (!features.includes('gallery')) return '—'
      const gb = limits['galleryGb'] as number | undefined
      if (!gb || gb === 0) return tc.unlimitedF
      return `${gb}GB`
    }

    case 'chat': {
      if (features.includes('chat_media')) return tc.chatTextMedia
      if (features.includes('chat_text')) return tc.chatText
      return '—'
    }

    case 'support': {
      if (features.includes('support_24_7')) return tc.supportDedicated
      if (features.includes('priority_support')) return tc.supportPriority
      if (features.includes('email_support')) return tc.supportEmail
      return '—'
    }

    case 'onboarding': {
      if (features.includes('white_glove_onboarding')) return tc.onboardingWhiteGlove
      if (features.includes('dedicated_onboarding')) return tc.onboardingDedicated
      return '—'
    }

    default:
      return '—'
  }
}

export function Pricing() {
  const { t, lang } = useI18n()
  const { plans: apiPlans, isLoading } = usePlans()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [studentCount, setStudentCount] = useState(50)

  const plans = apiPlans.map((api) => {
    const name =
      lang === 'en' ? (api.name.en || api.name.pt)
      : lang === 'es' ? (api.name.es || api.name.pt)
      : api.name.pt

    const description =
      lang === 'en' ? (api.description.en || api.description.pt)
      : lang === 'es' ? (api.description.es || api.description.pt)
      : api.description.pt

    let cta: string
    if (!api.isSelfService) {
      cta = t.pricing.ctaCustom
    } else if (api.trialDays > 0) {
      cta = t.pricing.ctaTrial.replace('{days}', String(api.trialDays))
    } else {
      cta = t.pricing.ctaStart
    }

    const priceCents = api.pricePerStudentCents
    const priceFormatted = api.isSelfService ? formatPriceCents(priceCents) : null
    const maxStudentsLimit = (api.featureLimits as Record<string, unknown>)['maxStudents'] as number | undefined
    const featureLabels = t.pricing.featureLabels as Record<string, string>
    const features = (api.features as string[]).map((key) => featureLabels[key] ?? key).filter(Boolean)
    const minStudentsNote = t.pricing.minStudentsNote.replace('{min}', String(api.minStudents))

    return {
      ...api,
      name,
      description,
      cta,
      highlighted: api.isPopular,
      maxStudents: (!maxStudentsLimit || maxStudentsLimit === 0) ? Infinity : maxStudentsLimit,
      priceCents,
      priceFormatted,
      priceDetail: api.isSelfService ? t.pricing.priceDetail : '',
      features,
      minStudentsNote,
    }
  })

  // Show 4 skeleton cards while loading
  const skeletonCount = 4

  const comparisonGroups = (t.pricing.comparison.groups as ComparisonGroup[]).filter(
    (g) => g.rows.every((r) => r.type === 'limit'),
  )

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 lg:py-28"
    >
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            {t.pricing.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        {/* Annual badge */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-400/20 px-5 py-2 text-sm font-medium text-accent-600">
            <Star className="h-4 w-4" />
            {t.pricing.annualBadge}
          </div>
        </motion.div>

        {/* Student count selector */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <span className="text-sm font-medium text-slate-600">
              {t.pricing.studentSelector.label}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStudentCount((c) => Math.max(50, c - 10))}
                disabled={studentCount <= 50}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[5rem] text-center text-lg font-bold text-slate-900">
                {studentCount} <span className="text-sm font-normal text-slate-400">{t.pricing.studentSelector.students}</span>
              </span>
              <button
                type="button"
                onClick={() => setStudentCount((c) => Math.min(1000, c + 10))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── MOBILE: cards with feature lists (< lg) ── */}
        <motion.div
          className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <motion.div key={i} variants={cardVariants} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
              ))
            : plans.map((plan) => {
                const isUnavailable = studentCount > plan.maxStudents
                return (
                <div
                  key={plan.slug}
                  className={clsx(
                    'h-full transition-opacity duration-300',
                    isUnavailable ? 'opacity-40 pointer-events-none select-none' : 'opacity-100',
                  )}
                >
                <motion.div
                  variants={cardVariants}
                  whileHover={{ opacity: 0.95 }}
                  className={clsx(
                    'group relative flex h-full flex-col overflow-hidden rounded-2xl transition-shadow duration-300',
                    plan.highlighted
                      ? 'z-10 text-white shadow-2xl border-2 border-primary-600 bg-slate-900 hover:shadow-xl'
                      : 'border border-slate-200/80 bg-gradient-to-b from-slate-50/50 to-white shadow-sm hover:shadow-md',
                  )}
                >
                  {/* Most popular badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-0 right-0 left-0 flex justify-center">
                      <div className="rounded-b-xl bg-accent-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                        {t.pricing.mostPopular}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 pt-8">
                    {/* Plan name & description */}
                    <div className="mb-4">
                      <h3
                        className={clsx(
                          'mb-1 text-lg font-bold',
                          plan.highlighted ? 'text-white' : 'text-slate-900',
                        )}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={clsx(
                          'text-sm',
                          plan.highlighted ? 'text-white/80' : 'text-slate-500',
                        )}
                      >
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      {plan.priceFormatted != null ? (
                        <>
                          <span className={clsx('text-lg font-medium', plan.highlighted ? 'text-white/70' : 'text-slate-400')}>
                            R$&nbsp;
                          </span>
                          <span className={clsx('text-5xl font-extrabold tracking-tight', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                            {plan.priceFormatted}
                          </span>
                        </>
                      ) : (
                        <span className={clsx('text-3xl font-extrabold', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                          {t.pricing.priceCustom}
                        </span>
                      )}
                      {plan.priceDetail && plan.priceFormatted != null && (
                        <span className={clsx('ml-2 text-sm', plan.highlighted ? 'text-white/60' : 'text-slate-400')}>
                          /{plan.priceDetail}
                        </span>
                      )}
                    </div>

                    {/* Total estimado */}
                    {plan.priceFormatted != null ? (
                      <p className={clsx('mb-1 text-sm font-semibold', plan.highlighted ? 'text-white/90' : 'text-primary-600')}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          plan.priceCents * studentCount / 100
                        )}{t.pricing.studentSelector.perMonth}
                      </p>
                    ) : null}

                    {/* Min students note / Custom quote */}
                    {plan.priceFormatted != null ? (
                      <p className={clsx('mb-4 text-xs', plan.highlighted ? 'text-white/50' : 'text-slate-400')}>
                        {plan.minStudentsNote}
                      </p>
                    ) : (
                      <p className="mb-4 text-sm font-medium text-primary-600">
                        {t.pricing.customQuote.replace('{count}', String(studentCount))}
                      </p>
                    )}

                    {/* Divider */}
                    <div className={clsx('mb-4 h-px', plan.highlighted ? 'bg-white/20' : 'bg-slate-100')} />

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* CTA button */}
                    {!plan.isSelfService ? (
                      <motion.a
                        href="#contato"
                        whileHover={{ opacity: 0.85 }}
                        whileTap={{ opacity: 0.7 }}
                        className={clsx(
                          'block w-full rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-all duration-200',
                          'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30',
                        )}
                      >
                        {plan.cta}
                      </motion.a>
                    ) : (
                      <Link
                        to="/signup"
                        state={{ plan: plan.slug, studentCount }}
                        className={clsx(
                          'block w-full rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-all duration-200',
                          plan.highlighted
                            ? 'bg-white text-primary-600 shadow-lg shadow-black/10 hover:bg-primary-50'
                            : 'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30',
                        )}
                        style={plan.highlighted ? { textShadow: 'none' } : undefined}
                      >
                        {plan.cta}
                      </Link>
                    )}
                  </div>
                </motion.div>
                </div>
              )})}
        </motion.div>

        {/* ── DESKTOP: compact price cards + comparison table (lg+) ── */}
        <div className="hidden lg:block">
          {/* Compact price cards */}
          <motion.div
            className="mb-8 grid grid-cols-4 items-stretch gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <motion.div key={i} variants={cardVariants} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                ))
              : plans.map((plan) => {
                  const isUnavailable = studentCount > plan.maxStudents
                  return (
                  <div
                    key={plan.slug}
                    className={clsx(
                      'h-full transition-opacity duration-300',
                      isUnavailable ? 'opacity-40 pointer-events-none select-none' : 'opacity-100',
                    )}
                  >
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ opacity: 0.95 }}
                    className={clsx(
                      'group relative flex h-full flex-col overflow-hidden rounded-2xl transition-shadow duration-300',
                      plan.highlighted
                        ? 'z-10 text-white shadow-2xl border-2 border-primary-600 bg-slate-900 hover:shadow-xl'
                        : 'border border-slate-200/80 bg-white shadow-sm hover:shadow-md',
                    )}
                  >
                    {/* Most popular badge */}
                    {plan.highlighted && (
                      <div className="absolute -top-0 right-0 left-0 flex justify-center">
                        <div className="rounded-b-xl bg-accent-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                          {t.pricing.mostPopular}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5 pt-8">
                      {/* Plan name & description */}
                      <div className="mb-3">
                        <h3
                          className={clsx(
                            'mb-0.5 text-base font-bold',
                            plan.highlighted ? 'text-white' : 'text-slate-900',
                          )}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={clsx(
                            'text-xs',
                            plan.highlighted ? 'text-white/80' : 'text-slate-500',
                          )}
                        >
                          {plan.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-1">
                        {plan.priceFormatted != null ? (
                          <>
                            <span className={clsx('text-base font-medium', plan.highlighted ? 'text-white/70' : 'text-slate-400')}>
                              R$&nbsp;
                            </span>
                            <span className={clsx('text-4xl font-extrabold tracking-tight', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                              {plan.priceFormatted}
                            </span>
                          </>
                        ) : (
                          <span className={clsx('text-2xl font-extrabold', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                            {t.pricing.priceCustom}
                          </span>
                        )}
                        {plan.priceDetail && plan.priceFormatted != null && (
                          <span className={clsx('ml-1.5 text-xs', plan.highlighted ? 'text-white/60' : 'text-slate-400')}>
                            /{plan.priceDetail}
                          </span>
                        )}
                      </div>

                      {/* Total estimado */}
                      {plan.priceFormatted != null ? (
                        <p className={clsx('mb-1 text-sm font-semibold', plan.highlighted ? 'text-white/90' : 'text-primary-600')}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            plan.priceCents * studentCount / 100
                          )}{t.pricing.studentSelector.perMonth}
                        </p>
                      ) : null}

                      {/* Min students note / Custom quote */}
                      {plan.priceFormatted != null ? (
                        <p className={clsx('mb-4 text-xs', plan.highlighted ? 'text-white/50' : 'text-slate-400')}>
                          {plan.minStudentsNote}
                        </p>
                      ) : (
                        <p className="mb-4 text-xs font-medium text-primary-600">
                          {t.pricing.customQuote.replace('{count}', String(studentCount))}
                        </p>
                      )}

                      {/* CTA button */}
                      <div className="mt-auto">
                        {!plan.isSelfService ? (
                          <motion.a
                            href="#contato"
                            whileHover={{ opacity: 0.85 }}
                            whileTap={{ opacity: 0.7 }}
                            className={clsx(
                              'block w-full rounded-xl px-6 py-3 text-center text-sm font-bold transition-all duration-200',
                              'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30',
                            )}
                          >
                            {plan.cta}
                          </motion.a>
                        ) : (
                          <Link
                            to="/signup"
                            state={{ plan: plan.slug, studentCount }}
                            className={clsx(
                              'block w-full rounded-xl px-6 py-3 text-center text-sm font-bold transition-all duration-200',
                              plan.highlighted
                                ? 'bg-white text-primary-600 shadow-lg shadow-black/10 hover:bg-primary-50'
                                : 'bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30',
                            )}
                            style={plan.highlighted ? { textShadow: 'none' } : undefined}
                          >
                            {plan.cta}
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  </div>
                )
              })
            }
          </motion.div>

          {/* Comparison table */}
          {!isLoading && plans.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="w-44 py-4 pl-6 pr-4 text-left text-sm font-semibold text-slate-500">
                      {t.pricing.comparison.title}
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.slug}
                        className={clsx(
                          'px-3 py-4 text-center text-sm font-bold',
                          plan.highlighted ? 'text-primary-600' : 'text-slate-700',
                        )}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonGroups.map((group, gi) => (
                    <Fragment key={`group-${gi}`}>
                      <tr className="border-t border-slate-100 bg-slate-50/70">
                        <td
                          colSpan={plans.length + 1}
                          className="py-2 pl-6 text-xs font-semibold tracking-wider text-slate-400 uppercase"
                        >
                          {group.name}
                        </td>
                      </tr>
                      {group.rows.map((row, ri) => (
                        <tr key={`${gi}-${ri}`} className="border-t border-slate-50">
                          <td className="py-3 pl-6 pr-4 text-sm text-slate-600">
                            {row.name}
                          </td>
                          {apiPlans.map((api, vi) => {
                            const val = resolveRowValue(row, api, t.pricing.comparison)
                            return (
                              <td
                                key={vi}
                                className={clsx(
                                  'px-3 py-3 text-center',
                                  plans[vi]?.highlighted ? 'bg-primary-50/40' : '',
                                )}
                              >
                                {val === '✓' ? (
                                  <Check className="mx-auto h-4 w-4 text-primary-500" />
                                ) : val === '—' ? (
                                  <span className="text-base leading-none text-slate-300">—</span>
                                ) : (
                                  <span className="text-xs font-medium text-slate-700">{val}</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>

        {/* Reassurance line */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-500" />
            <span>{t.pricing.reassurance.noContract}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary-500" />
            <span>{t.pricing.reassurance.cancel}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary-500" />
            <span>{t.pricing.reassurance.support}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
