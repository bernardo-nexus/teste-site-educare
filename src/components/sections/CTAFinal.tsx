import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from 'lucide-react'

import { useI18n } from '../../i18n'
import { requestDemo } from '../../lib/api'

export function CTAFinal() {
  const { t } = useI18n()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current!
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      schoolName: (form.elements.namedItem('schoolName') as HTMLInputElement).value,
    }
    setLoading(true)
    try {
      await requestDemo(data)
    } catch {
      // best-effort — show success regardless
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <section
      id="contato"
      className="relative flex min-h-[calc(100vh-70px)] flex-col justify-center overflow-hidden py-20 lg:py-28"
      style={{
        background:
          'radial-gradient(circle at 50% -30%, #E0E947 0%, #A4D542 30%, #44B152 60%, #069450 100%)',
        scrollSnapAlign: 'none',
      }}
    >

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm"
            style={{ textShadow: 'none' }}
          >
            <Sparkles className="h-4 w-4" />
            {t.ctaFinal.badge}
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t.ctaFinal.title}
          </h2>
          <p className="mb-10 text-lg text-white/80">
            {t.ctaFinal.subtitle}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="rounded-2xl border border-white/10 bg-white/10 p-10 backdrop-blur-md"
            >
              {/* Animated checkmark */}
              <div className="mb-6 flex justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-primary-600" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Confetti-like dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2 flex justify-center gap-2"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="h-2 w-2 rounded-full bg-white/40"
                  />
                ))}
              </motion.div>

              <h3 className="mb-2 text-2xl font-bold text-white">
                {t.ctaFinal.success.title}
              </h3>
              <p className="text-white/80">
                {t.ctaFinal.success.message}
              </p>
            </motion.div>
          ) : (
            <motion.form
              ref={formRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="mb-6 flex flex-col gap-4">
                {/* School name input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="schoolName"
                    placeholder={t.ctaFinal.form.schoolName}
                    aria-label={t.ctaFinal.form.schoolName}
                    required
                    className="w-full rounded-xl border border-white/20 bg-white/95 py-3.5 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-white/40 focus:bg-white focus:ring-2 focus:ring-white/30"
                    style={{ textShadow: 'none' }}
                  />
                </div>

                {/* Name input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder={t.ctaFinal.form.name}
                    aria-label={t.ctaFinal.form.name}
                    required
                    className="w-full rounded-xl border border-white/20 bg-white/95 py-3.5 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-white/40 focus:bg-white focus:ring-2 focus:ring-white/30"
                    style={{ textShadow: 'none' }}
                  />
                </div>

                {/* Phone input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t.ctaFinal.form.phone}
                    aria-label={t.ctaFinal.form.phone}
                    className="w-full rounded-xl border border-white/20 bg-white/95 py-3.5 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-white/40 focus:bg-white focus:ring-2 focus:ring-white/30"
                    style={{ textShadow: 'none' }}
                  />
                </div>

                {/* Email input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.ctaFinal.form.email}
                    aria-label={t.ctaFinal.form.email}
                    required
                    className="w-full rounded-xl border border-white/20 bg-white/95 py-3.5 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-white/40 focus:bg-white focus:ring-2 focus:ring-white/30"
                    style={{ textShadow: 'none' }}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ opacity: loading ? 1 : 0.85 }}
                whileTap={{ opacity: loading ? 1 : 0.7 }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ textShadow: 'none' }}
              >
                {loading ? 'Enviando...' : t.ctaFinal.form.submit}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />}
              </motion.button>
            </motion.form>
          )}

          {/* WhatsApp section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
          >
            <span className="text-sm text-white/70" style={{ textShadow: 'none' }}>
              {t.ctaFinal.whatsapp.text}
            </span>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition-all duration-200 hover:bg-[#1EBE5D] hover:shadow-xl"
              style={{ textShadow: 'none' }}
            >
              <span className="relative flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t.ctaFinal.whatsapp.button}
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
