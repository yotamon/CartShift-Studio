"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

const USFlag = () => (
  <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover">
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 202.6h640M0 276.3h640M0 350h640M0 423.7h640" />
    <path fill="#192f5d" d="M0 0h296v258H0" />
    <marker id="us-a" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
    </marker>
    <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" transform="scale(.65)" />
    <use href="#us-a" x="38" />
    <use href="#us-a" x="76" />
    <use href="#us-a" x="114" />
    <use href="#us-a" x="152" />
    <use href="#us-a" x="190" />
    <use href="#us-a" x="228" />
    <use href="#us-a" y="42" />
    <use href="#us-a" x="38" y="42" />
    <use href="#us-a" x="76" y="42" />
    <use href="#us-a" x="114" y="42" />
    <use href="#us-a" x="152" y="42" />
    <use href="#us-a" x="190" y="42" />
    <use href="#us-a" x="228" y="42" />
    <use href="#us-a" y="84" />
    <use href="#us-a" x="38" y="84" />
    <use href="#us-a" x="76" y="84" />
    <use href="#us-a" x="114" y="84" />
    <use href="#us-a" x="152" y="84" />
    <use href="#us-a" x="190" y="84" />
    <use href="#us-a" x="228" y="84" />
    <use href="#us-a" y="126" />
    <use href="#us-a" x="38" y="126" />
    <use href="#us-a" x="76" y="126" />
    <use href="#us-a" x="114" y="126" />
    <use href="#us-a" x="152" y="126" />
    <use href="#us-a" x="190" y="126" />
    <use href="#us-a" x="228" y="126" />
  </svg>
);

const ILFlag = () => (
    <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover border border-slate-100 dark:border-slate-700">
      <g fillRule="evenodd">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#0038b8" d="M0 55h640v80H0zM0 345h640v80H0z"/>
        <path fill="none" stroke="#0038b8" strokeWidth="35" d="m320 148 95 165H225z"/>
        <path fill="none" stroke="#0038b8" strokeWidth="35" d="m320 443 95-165H225z"/>
      </g>
    </svg>
);

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (lang: 'en' | 'he') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/30 transition-colors"
        aria-label="Select Language"
      >
        {language === 'en' ? <USFlag /> : <ILFlag />}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {language === 'en' ? 'EN' : 'עב'}
        </span>
        <svg
            className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-36 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden z-50 end-0"
          >
            <div className="p-1">
                <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        language === 'en'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                    <USFlag />
                    English
                </button>
                <button
                    onClick={() => handleLanguageChange('he')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        language === 'he'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                    <ILFlag />
                    עברית
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
