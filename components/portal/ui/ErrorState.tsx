'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw, ArrowLeft, Headphones, Home } from 'lucide-react';
import { PortalButton } from './PortalButton';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  variant?: 'default' | 'inline' | 'fullPage';
  icon?: ReactNode;
  onRetry?: () => void;
  onGoBack?: () => void;
  showHomeLink?: boolean;
  showSupportLink?: boolean;
  className?: string;
}

export function ErrorState({
  title,
  message,
  errorCode,
  variant = 'default',
  icon,
  onRetry,
  onGoBack,
  showHomeLink = false,
  showSupportLink = true,
  className,
}: ErrorStateProps) {
  const t = useTranslations();

  const defaultTitle = t('portal.errorState.title' as any) || 'Something went wrong';
  const defaultMessage =
    t('portal.errorState.message' as any) ||
    'We encountered an error while processing your request. Please try again.';

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40',
          className
        )}
        role="alert"
      >
        <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-rose-900 dark:text-rose-200">
            {title || defaultTitle}
          </p>
          {message && <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{message}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:underline underline-offset-2"
          >
            {t('portal.errorState.retry' as any) || 'Try again'}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'fullPage') {
    return (
      <div
        className={cn(
          'min-h-[60vh] flex flex-col items-center justify-center p-8 text-center',
          className
        )}
        role="alert"
      >
        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/10">
          {icon || <AlertCircle size={44} className="text-rose-500" />}
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">
          {title || defaultTitle}
        </h1>
        <p className="text-surface-500 dark:text-surface-400 max-w-md mb-8 leading-relaxed">
          {message || defaultMessage}
        </p>
        {errorCode && (
          <div className="mb-8 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 text-xs font-mono">
            Error Code: {errorCode}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <PortalButton onClick={onRetry} className="shadow-lg shadow-blue-500/20">
              <RefreshCw size={16} className="me-2" />
              {t('portal.errorState.retry' as any) || 'Try Again'}
            </PortalButton>
          )}
          {onGoBack && (
            <PortalButton variant="outline" onClick={onGoBack}>
              <ArrowLeft size={16} className="me-2 rtl:rotate-180" />
              {t('portal.errorState.goBack' as any) || 'Go Back'}
            </PortalButton>
          )}
          {showHomeLink && (
            <Link href="/portal/">
              <PortalButton variant="outline">
                <Home size={16} className="me-2" />
                {t('portal.errorState.home' as any) || 'Go Home'}
              </PortalButton>
            </Link>
          )}
          {showSupportLink && (
            <PortalButton variant="ghost" className="text-surface-500">
              <Headphones size={16} className="me-2" />
              {t('portal.errorState.contactSupport' as any) || 'Contact Support'}
            </PortalButton>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn('py-16 flex flex-col items-center justify-center text-center', className)}
      role="alert"
    >
      <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-900/30">
        {icon || <AlertCircle size={28} className="text-rose-500" />}
      </div>
      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
        {title || defaultTitle}
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">
        {message || defaultMessage}
      </p>
      {errorCode && (
        <div className="mb-6 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-500 text-xs font-mono">
          {errorCode}
        </div>
      )}
      <div className="flex items-center gap-3">
        {onRetry && (
          <PortalButton size="sm" onClick={onRetry}>
            <RefreshCw size={14} className="me-2" />
            {t('portal.errorState.retry' as any) || 'Try Again'}
          </PortalButton>
        )}
        {onGoBack && (
          <PortalButton size="sm" variant="outline" onClick={onGoBack}>
            <ArrowLeft size={14} className="me-2 rtl:rotate-180" />
            {t('portal.errorState.goBack' as any) || 'Go Back'}
          </PortalButton>
        )}
      </div>
    </div>
  );
}
