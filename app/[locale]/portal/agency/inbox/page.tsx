'use client';

import { useState, useEffect } from 'react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { Search, Mail, Filter, MoreVertical, Star, Loader2 } from 'lucide-react';
import { getAllRequests } from '@/lib/services/portal-requests';
import { getAllOrganizations } from '@/lib/services/portal-organizations';
import { Request, Organization, STATUS_CONFIG } from '@/lib/types/portal';
import { formatDistanceToNow } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PortalAvatar } from '@/components/portal/ui/PortalAvatar';

export default function AgencyInboxPage() {
  const t = useTranslations('portal');
  const locale = useLocale();
  const [requests, setRequests] = useState<Request[]>([]);
  const [organizations, setOrganizations] = useState<Record<string, Organization>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [requestsData, orgsData] = await Promise.all([
          getAllRequests(),
          getAllOrganizations(),
        ]);

        setRequests(requestsData);

        const orgsMap: Record<string, Organization> = {};
        orgsData.forEach(org => {
          orgsMap[org.id] = org;
        });
        setOrganizations(orgsMap);
      } catch (err: any) {
        const errorMessage = err?.code === 'permission-denied'
          ? 'You do not have permission to access all requests. Agency permissions are required.'
          : 'Failed to load requests. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching agency inbox:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRequests = requests.filter(
    req =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            {t('agency.inbox.title')}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {t('agency.inbox.subtitle')}
          </p>
        </div>
      </div>

      <PortalCard className="p-0 overflow-hidden border-surface-200 dark:border-surface-800 shadow-sm">
        <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-white dark:bg-surface-950">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="text"
                placeholder={t('agency.inbox.searchPlaceholder')}
                className="portal-input pl-10 w-64 md:w-80 h-10 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <PortalButton
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 border-surface-200 dark:border-surface-700"
            >
              <Filter size={16} /> {t('common.filter')}
            </PortalButton>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest px-2">
            {filteredRequests.length} {t('agency.inbox.activeItems')}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-surface-400">{t('agency.inbox.loading')}</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <Mail className="w-16 h-16 text-red-100 dark:text-red-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                Permission Error
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">
                {error}
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map(req => {
              if (!req.orgId || !req.id) return null;
              return (
              <Link
                key={req.id}
                href={`/portal/org/${req.orgId}/requests/${req.id}/`}
                className="block"
              >
                <div className="flex items-center gap-4 p-5 hover:bg-surface-50/80 dark:hover:bg-surface-800/40 cursor-pointer transition-all group">
                  <div className="flex items-center gap-3 shrink-0">
                    <button className="p-1 text-surface-300 group-hover:text-amber-400 transition-colors">
                      <Star size={18} />
                    </button>
                    <PortalAvatar name={req.createdByName || 'User'} size="md" className="ring-2 ring-white dark:ring-surface-900 shadow-sm" />
                  </div>

                  <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-1">
                      <p className="text-sm font-bold text-surface-900 dark:text-white truncate">
                        {req.createdByName || 'User'}
                      </p>
                      <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter truncate">
                        {organizations[req.orgId]?.name || t('agency.inbox.clientOrg')}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-surface-900 dark:text-white truncate group-hover:text-blue-600 transition-colors font-outfit">
                          {req.title}
                        </p>
                        <PortalBadge
                          variant={STATUS_CONFIG[req.status]?.color as any || 'gray'}
                          className="text-[9px] h-4"
                        >
                          {req.status}
                        </PortalBadge>
                      </div>
                      <p className="text-xs text-surface-500 truncate mt-0.5">
                        {req.description?.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="md:col-span-1 text-right flex items-center justify-end gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-surface-500 whitespace-nowrap uppercase tracking-widest leading-none mb-1">
                          {req.createdAt?.toDate
                            ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true, locale: locale === 'he' ? he : enUS })
                            : t('common.recently' as any)}
                        </span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
              );
            }).filter(Boolean)
          ) : (
            <div className="py-20 text-center">
              <Mail className="w-16 h-16 text-surface-100 dark:text-surface-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                {t('agency.inbox.emptyTitle')}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">
                {t('agency.inbox.emptyDesc')}
              </p>
            </div>
          )}
        </div>
      </PortalCard>
    </div>
  );
}
