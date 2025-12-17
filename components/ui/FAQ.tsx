"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  className?: string;
}

export const FAQ: React.FC<FAQProps> = ({ items, className = "" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="border border-slate-200 dark:border-surface-700 rounded-xl overflow-hidden bg-white dark:bg-surface-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 md:px-6 py-4 md:py-5 text-start flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors touch-manipulation"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white pe-4 md:pe-8">
              {item.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-accent-500 dark:text-accent-400 flex-shrink-0" strokeWidth={2.5} />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 pt-0 text-slate-600 dark:text-surface-300 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

