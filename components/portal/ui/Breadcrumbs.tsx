'use client';

import { useMemo } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  className?: string;
  homeLabel?: string;
  customLabels?: Record<string, string>;
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export function Breadcrumbs({
  className,
  homeLabel,
  customLabels = {},
  maxItems = 4,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === 'he';

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    if (!pathname) return [];

    // Remove locale prefix and split path
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const segments = pathWithoutLocale.split('/').filter(Boolean);

    // Don't show breadcrumbs for root paths
    if (segments.length <= 2) return [];

    const items: BreadcrumbItem[] = [];
    let currentPath = '';

    // Translation map for common path segments
    const segmentLabels: Record<string, string> = {
      portal: t('portal.breadcrumbs.portal' as any) || 'Portal',
      org: t('portal.breadcrumbs.organization' as any) || 'Organization',
      dashboard: t('portal.breadcrumbs.dashboard' as any) || 'Dashboard',
      requests: t('portal.breadcrumbs.requests' as any) || 'Requests',
      settings: t('portal.breadcrumbs.settings' as any) || 'Settings',
      team: t('portal.breadcrumbs.team' as any) || 'Team',
      files: t('portal.breadcrumbs.files' as any) || 'Files',
      pricing: t('portal.breadcrumbs.pricing' as any) || 'Pricing',
      consultations: t('portal.breadcrumbs.consultations' as any) || 'Consultations',
      agency: t('portal.breadcrumbs.agency' as any) || 'Agency',
      inbox: t('portal.breadcrumbs.inbox' as any) || 'Inbox',
      workboard: t('portal.breadcrumbs.workboard' as any) || 'Workboard',
      clients: t('portal.breadcrumbs.clients' as any) || 'Clients',
      new: t('portal.breadcrumbs.new' as any) || 'New',
      ...customLabels,
    };

    // Skip 'portal' from visible breadcrumbs, but keep them in path

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Skip 'portal' and 'org' segments, and org IDs from visible items
      if (segment === 'portal' || segment === 'org') continue;

      // Skip org ID (looks like a random ID)
      if (segments[i - 1] === 'org' && segment.length > 10) continue;

      const isLast = i === segments.length - 1;

      // Get label: custom > translation > formatted segment
      let label = customLabels[segment] || segmentLabels[segment];

      if (!label) {
        // Format segment: kebab-case to Title Case
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      items.push({
        label,
        href: currentPath,
        isLast,
      });
    }

    // Truncate if too many items
    if (items.length > maxItems) {
      const first = items.slice(0, 1);
      const last = items.slice(-maxItems + 2);
      return [...first, { label: '...', href: '', isLast: false }, ...last];
    }

    return items;
  }, [pathname, locale, t, customLabels, maxItems]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-hide', className)}
    >
      {/* Home link */}
      <Link
        href="/portal/"
        className="flex items-center gap-1.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors flex-shrink-0 group"
        aria-label={homeLabel || t('portal.breadcrumbs.home' as any) || 'Home'}
      >
        <Home size={14} className="group-hover:scale-110 transition-transform" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 flex-shrink-0">
          <ChevronRight
            size={14}
            className={cn(
              'text-surface-300 dark:text-surface-700 flex-shrink-0',
              isRTL && 'rotate-180'
            )}
          />
          {item.label === '...' ? (
            <span className="text-surface-400 px-1">...</span>
          ) : item.isLast ? (
            <span
              className="font-semibold text-surface-900 dark:text-white truncate max-w-[200px]"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors hover:underline underline-offset-4 decoration-2 decoration-surface-300 dark:decoration-surface-700 truncate max-w-[150px]"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
