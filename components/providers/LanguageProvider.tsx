"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getNestedTranslation } from '@/lib/translations';

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

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const direction = language === 'he' ? 'rtl' : 'ltr';

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

  const t = (path: string) => {
    const langData = translations[language];
    const value = getNestedTranslation(langData, path);
    return value;
  };

  // We render the provider always to ensure useLanguage hook works in children
  // (Header requires it immediately).
  // Hydration mismatch is handled by initial 'en' state.
  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
