'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { translations, Language, getNestedTranslation } from '@/lib/translations';
import { trackLanguageSwitch } from '@/lib/analytics';

type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string | string[] | Record<string, unknown> | unknown;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'he')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    trackLanguageSwitch(lang);
  }, []);

  const direction: Direction = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = direction;
      if (language === 'he') {
        document.body.classList.add('lang-he');
      } else {
        document.body.classList.remove('lang-he');
      }
    }
  }, [language, direction, mounted]);

  const t = useCallback(
    (path: string) => {
      const langData = translations[language];
      const value = getNestedTranslation(langData, path);
      return value;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({ language, direction, setLanguage, t, mounted }),
    [language, direction, setLanguage, t, mounted]
  );

  // We render the provider always to ensure useLanguage hook works in children
  // (Header requires it immediately).
  // Hydration mismatch is handled by initial 'en' state.
  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
