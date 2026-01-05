'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Button } from './Button';
import { Icon } from './Icon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { trackExitIntentShown, trackExitIntentClosed, trackBookCallClick } from '@/lib/analytics';

interface ExitIntentModalProps {
  delay?: number;
  storageKey?: string;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  delay = 0,
  storageKey = 'exitIntentShown',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const content = {
    title: t('common.exitIntent.title'),
    subtitle: t('common.exitIntent.subtitle'),
    description: t('common.exitIntent.description'),
    cta: t('common.exitIntent.cta'),
    dismiss: t('common.exitIntent.dismiss'),
  };

  useEffect(() => {
    const wasShown = sessionStorage.getItem(storageKey);
    if (wasShown) {
      return;
    }

    let isTriggered = false;

    const handleExitIntent = (e: MouseEvent) => {
      // Only trigger when mouse leaves viewport from the top
      if (isTriggered || e.clientY > 0 || e.relatedTarget !== null) return;

      isTriggered = true;
      setIsOpen(true);
      sessionStorage.setItem(storageKey, 'true');
      trackExitIntentShown();

      // Remove listener immediately after triggering
      document.removeEventListener('mouseleave', handleExitIntent);
    };

    const timer = setTimeout(() => {
      // Use mouseleave on document instead of mouseout for better performance
      document.documentElement.addEventListener('mouseleave', handleExitIntent);
    }, delay);

    return () => {
      clearTimeout(timer);
      document.documentElement.removeEventListener('mouseleave', handleExitIntent);
    };
  }, [delay, storageKey]);

  const handleClose = useCallback((action: 'cta_clicked' | 'dismissed' = 'dismissed') => {
    trackExitIntentClosed(action);
    setIsOpen(false);
  }, []);

  const handleCTAClick = useCallback(() => {
    trackBookCallClick('exit_intent_modal');
    handleClose('cta_clicked');
  }, [handleClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleClose('dismissed');
    },
    [handleClose]
  );

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleClose('dismissed');
    },
    [handleClose]
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={handleBackdropClick}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-accent-600 to-accent-700 p-8 text-white">
                <button
                  onClick={handleCloseClick}
                  className="absolute top-4 end-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <Icon name="x" size={20} />
                </button>
                <div className="text-center">
                  <Icon name="message-circle" size={48} className="mx-auto mb-4 opacity-90" />
                  <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
                  <p className="text-white/90">{content.subtitle}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-surface-600 dark:text-surface-400 text-center mb-6">
                  {content.description}
                </p>
                <div className="space-y-3">
                  <Link href="/contact" className="block" onClick={handleCTAClick}>
                    <Button className="w-full" size="lg">
                      <Icon name="calendar" size={18} className="me-2" />
                      {content.cta}
                    </Button>
                  </Link>
                  <button
                    onClick={handleCloseClick}
                    className="w-full py-2 text-sm text-surface-500 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                  >
                    {content.dismiss}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
