import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '../../i18n'

const sectionOrder = [
  '', // Hero (top)
  'desafios',
  'solucao',
  'como-funciona',
  'features',
  'diferenciais',
  'pricing',
  'testimonials',
  'faq',
  'contato',
]

export function FloatingScrollButton() {
  const { t } = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (let i = 0; i < sectionOrder.length; i++) {
      const id = sectionOrder[i]
      if (!id) continue

      const el = document.getElementById(id)
      if (!el) continue

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentIndex(i)
          }
        },
        { rootMargin: '-50% 0px -50% 0px' },
      )

      observer.observe(el)
      observers.push(observer)
    }

    function handleScroll() {
      if (window.scrollY < 200) {
        setCurrentIndex(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Hide on last section
  useEffect(() => {
    setVisible(currentIndex < sectionOrder.length - 1)
  }, [currentIndex])

  const handleClick = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= sectionOrder.length) return

    const nextId = sectionOrder[nextIndex]
    const el = document.getElementById(nextId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentIndex])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className="fixed bottom-8 left-1/2 z-50 flex h-12 w-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-900/90 text-white shadow-lg shadow-black/25 backdrop-blur-sm transition-colors duration-200 hover:bg-slate-800"
          aria-label={t.scroll.nextSection}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
