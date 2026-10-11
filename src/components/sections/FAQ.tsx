import { useRef, useState } from 'react'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import clsx from 'clsx'

import { useI18n } from '../../i18n'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  number,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  number: string
}) {
  return (
    <motion.div
      variants={cardVariants}
      className={clsx(
        'overflow-hidden rounded-xl border bg-white transition-all duration-300',
        isOpen
          ? 'border-primary-300 shadow-md shadow-primary-100/50'
          : 'border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow-md',
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-200 sm:px-6"
      >
        {/* Number badge */}
        <span
          className={clsx(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-200',
            isOpen
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-400',
          )}
        >
          {number}
        </span>

        <span
          className={clsx(
            'flex-1 pr-2 text-[15px] font-semibold transition-colors duration-200',
            isOpen ? 'text-primary-700' : 'text-slate-800',
          )}
        >
          {question}
        </span>

        <div
          className={clsx(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200',
            isOpen
              ? 'bg-primary-100 text-primary-600'
              : 'bg-slate-100 text-slate-400',
          )}
        >
          <ChevronDown
            className={clsx(
              'h-4 w-4 transition-transform duration-300',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
              <p className="pl-12 text-sm leading-relaxed text-slate-600">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const items = t.faq.items
  const midpoint = Math.ceil(items.length / 2)
  const leftColumn = items.slice(0, midpoint)
  const rightColumn = items.slice(midpoint)

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative flex min-h-[calc(100vh-70px)] flex-col justify-center overflow-hidden bg-slate-50 py-20 lg:py-28"
    >
      {/* Subtle background pattern */}
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

      {/* Background blurs removed to match corporate aesthetic */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center lg:mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            {t.faq.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.faq.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t.faq.subtitle}
          </p>
        </motion.div>

        {/* Two-column FAQ grid on desktop */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Left column */}
          <motion.div
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {leftColumn.map((item, index) => (
              <FAQAccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                number={String(index + 1).padStart(2, '0')}
              />
            ))}
          </motion.div>

          {/* Right column */}
          <motion.div
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {rightColumn.map((item, index) => {
              const globalIndex = midpoint + index
              return (
                <FAQAccordionItem
                  key={globalIndex}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === globalIndex}
                  onToggle={() => handleToggle(globalIndex)}
                  number={String(globalIndex + 1).padStart(2, '0')}
                />
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
