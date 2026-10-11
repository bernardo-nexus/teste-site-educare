import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import ptBR from "./locales/pt-BR.json";
import enUS from "./locales/en-US.json";
import esES from "./locales/es-ES.json";

export type Locale = typeof ptBR;
export type LangCode = "br" | "en" | "es";

const LANG_STORAGE_KEY = "nexus-lang";

const locales: Record<LangCode, Locale> = {
  br: ptBR,
  en: enUS,
  es: esES,
};

const langNames: Record<LangCode, string> = {
  br: "Português",
  en: "English",
  es: "Español",
};

const langFlags: Record<LangCode, string> = {
  br: "\u{1F1E7}\u{1F1F7}",
  en: "\u{1F1FA}\u{1F1F8}",
  es: "\u{1F1EA}\u{1F1F8}",
};

interface I18nContextType {
  t: Locale;
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  langNames: Record<LangCode, string>;
  langFlags: Record<LangCode, string>;
  allLangs: LangCode[];
}

const I18nContext = createContext<I18nContextType | null>(null);

/** Re-provides the current i18n value inside a separate React root (e.g. drei <Html> in a 3D canvas). */
export function I18nBridge({ value, children }: { value: I18nContextType; children: ReactNode }) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function detectBrowserLang(): LangCode {
  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("en")) return "en";
  return "br";
}

function isLangCode(value: string): value is LangCode {
  return value === "br" || value === "en" || value === "es";
}

function getStoredLang(): LangCode | null {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored && isLangCode(stored) ? stored : null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [lang, setLangState] = useState<LangCode>(() => {
    // Check for legacy /:lang prefix in URL before falling back to stored/browser preference
    const pathParts = window.location.pathname.replace(/^\//, "").split("/");
    const firstSegment = pathParts[0];
    if (isLangCode(firstSegment)) {
      localStorage.setItem(LANG_STORAGE_KEY, firstSegment);
      return firstSegment;
    }
    return getStoredLang() || detectBrowserLang();
  });

  // Strip legacy /:lang prefix from URL — redirect only, lang already set in initializer
  useEffect(() => {
    const pathParts = window.location.pathname.replace(/^\//, "").split("/");
    const firstSegment = pathParts[0];
    if (isLangCode(firstSegment)) {
      const restOfPath = pathParts.slice(1).join("/");
      const newPath = restOfPath ? `/${restOfPath}` : "/";
      navigate(
        `${newPath}${window.location.search}${window.location.hash}`,
        { replace: true },
      );
    }
  }, [navigate]);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  }, []);

  // Sync <html lang="..."> attribute
  useEffect(() => {
    const htmlLangs: Record<LangCode, string> = {
      br: "pt-BR",
      en: "en-US",
      es: "es-ES",
    };
    document.documentElement.lang = htmlLangs[lang];
  }, [lang]);

  const t = locales[lang];

  return (
    <I18nContext.Provider
      value={{
        t,
        lang,
        setLang,
        langNames,
        langFlags,
        allLangs: ["br", "en", "es"],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
