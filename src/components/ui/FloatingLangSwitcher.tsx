import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { useI18n } from '../../i18n'
import type { LangCode } from '../../i18n'

const langAriaLabels: Record<LangCode, string> = {
  br: 'Português',
  en: 'English',
  es: 'Español',
}

export function FloatingLangSwitcher() {
  const { lang, setLang, langFlags, allLangs } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const otherLangs = allLangs.filter((code) => code !== lang)

  return (
    <div ref={ref} className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-2 sm:right-8">
      {/* Other language options — appear above the main button */}
      <AnimatePresence>
        {open &&
          otherLangs.map((code, i) => (
            <motion.button
              key={code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15,
                delay: i * 0.06,
                ease: 'easeOut',
              }}
              onClick={() => {
                setLang(code as LangCode)
                setOpen(false)
              }}
              aria-label={langAriaLabels[code as LangCode]}
              className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-xl transition-transform duration-150 hover:scale-110"
            >
              {langFlags[code as LangCode]}
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Main flag button — current language */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ opacity: 0.8 }}
        aria-label="Change language"
        className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-200 hover:scale-105"
      >
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
          style={{ display: 'inline-flex' }}
        >
          {langFlags[lang]}
        </motion.span>
      </motion.button>
    </div>
  )
}
