import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { useRef } from 'react'

import { useI18n } from '../../i18n'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export function Testimonials() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative flex min-h-[calc(100vh-70px)] flex-col justify-center overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-white py-20 lg:py-28"
    >
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Background blurs removed to match corporate aesthetic */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center lg:mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t.testimonials.items.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg lg:p-10"
            >
              {/* Decorative large quote mark */}
              <div className="pointer-events-none absolute -top-2 -right-2 select-none text-[140px] leading-none font-serif text-primary-100/50 transition-colors duration-300 group-hover:text-primary-200/60">
                &ldquo;
              </div>

              {/* Accent line on hover */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Stars row */}
              <div className="relative mb-5 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="relative mb-8 text-base leading-relaxed text-slate-600 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author info */}
              <div className="relative flex items-center gap-4">
                {/* Avatar with gradient ring */}
                <div className="rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 p-[2.5px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
                    {testimonial.avatar}
                  </div>
                </div>

                <div>
                  <p className="text-base font-bold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-primary-600">
                    {testimonial.role}{' '}
                    <span className="text-slate-400">&mdash;</span>{' '}
                    <span className="text-slate-500">{testimonial.school}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
