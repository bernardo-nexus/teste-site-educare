import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { BrandMark } from "../ui/BrandMark";
import { useI18n } from "../../i18n";

export function Header() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: t.nav.desafios, href: "#desafios" },
      { label: t.nav.solucao, href: "#solucao" },
      { label: t.nav.comoFunciona, href: "#como-funciona" },
      { label: t.nav.funcionalidades, href: "#features" },
      { label: t.nav.diferenciais, href: "#diferenciais" },
      { label: t.nav.planos, href: "#pricing" },
      // { label: t.nav.depoimentos, href: "#testimonials" },
      { label: t.nav.faq, href: "#faq" },
    ],
    [t],
  );

  useEffect(() => {
    const sectionIds = [...navLinks.map((l) => l.href.slice(1)), "contato"];
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-50% 0px -50% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [navLinks]);

  // Sync URL hash with active section
  useEffect(() => {
    const hash = activeSection ? `#${activeSection}` : "";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash || "/");
    }
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
      if (window.scrollY < window.innerHeight / 2) {
        setActiveSection("");
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sections with a black stage — the glass turns dark over them, like apple.com
  const onDark = activeSection === "diferenciais" && !mobileMenuOpen;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 lg:pt-4">
      <div
        className={clsx(
          "liquid-glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-4 lg:pl-5",
          onDark && "liquid-glass-dark",
          scrolled ? "lg:h-14" : "lg:h-[3.75rem]",
        )}
      >
        <a href="#" aria-label="Nexus EduCare" onClick={() => setMobileMenuOpen(false)}>
          <BrandMark tone={onDark ? "light" : "dark"} />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                  onDark
                    ? isActive
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                    : isActive
                      ? "bg-white/70 text-ink shadow-[inset_0_1px_0_rgb(255_255_255),0_1px_3px_rgb(0_0_0/0.08)]"
                      : "text-ink/75 hover:bg-white/50 hover:text-ink",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="#contato"
            className="glass-button hidden h-10 items-center rounded-full px-4 text-[13.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-px sm:inline-flex"
          >
            {t.nav.cta}
          </a>

          <button
            type="button"
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden",
              onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-white/50",
            )}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — a second glass sheet under the bar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass mx-auto mt-2 max-w-6xl origin-top overflow-hidden rounded-[1.75rem] xl:hidden"
          >
            <nav className="flex flex-col p-3">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.2 }}
                    className={clsx(
                      "rounded-2xl px-4 py-3 text-[1.05rem] font-semibold text-ink",
                      isActive ? "bg-white/70" : "hover:bg-white/50",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              <a
                href="#contato"
                className="glass-button mt-2 flex h-12 items-center justify-center rounded-full text-[15px] font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.cta}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
