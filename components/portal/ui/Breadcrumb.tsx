'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { isRTLLocale } from '@/lib/locale-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const locale = useLocale();
  const isRTL = isRTLLocale(locale);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {/* Home icon */}
        <li className="flex items-center">
          <Link
            href="/portal/"
            className="p-1 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Portal home"
          >
            <Home size={14} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight
                size={12}
                className={cn(
                  'text-surface-300 dark:text-surface-600 flex-shrink-0',
                  isRTL && 'rotate-180'
                )}
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'font-medium truncate max-w-[200px]',
                    isLast
                      ? 'text-surface-900 dark:text-white'
                      : 'text-surface-500 dark:text-surface-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
