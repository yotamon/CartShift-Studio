'use client';

import { useState, useEffect } from 'react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  Plus,
  Search,
  Users,
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  TrendingUp,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { getOrganizationsWithStats } from '@/lib/services/portal-organizations';
import { Organization } from '@/lib/types/portal';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function AgencyClientsClient() {
  const t = useTranslations('portal');
  const [organizations, setOrganizations] = useState<(Organization & { memberCount: number; requestCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      try {
        const data = await getOrganizationsWithStats();
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
     return (
       <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
         <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">{t('agency.clients.loading')}</p>
       </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white leading-tight">{t('agency.clients.title')}</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">{t('agency.clients.subtitle')}</p>
          </div>
          <Link href="/portal/agency/clients/new/">
            <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <Plus size={18} />
              {t('agency.clients.onboard')}
            </PortalButton>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-surface-900/50 p-4 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              type="text"
              placeholder={t('agency.clients.searchPlaceholder')}
              className="portal-input pl-11 h-11 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xs font-bold text-surface-400 uppercase tracking-widest px-2">
                {filteredOrgs.length} {t('agency.clients.activeAccounts')}
             </div>
             <PortalButton variant="outline" className="h-11 border-surface-200 dark:border-surface-800">
                {t('agency.clients.export')}
             </PortalButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.length > 0 ? (
            filteredOrgs.map((org) => (
              <PortalCard key={org.id} className="p-0 border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <Briefcase size={28} className="text-blue-600 opacity-80" />
                    </div>
                    <div className="flex items-center gap-2">
                      <PortalBadge
                        variant={org.status === 'inactive' ? 'gray' : org.status === 'suspended' ? 'red' : 'green'}
                        className="text-[9px] font-black uppercase tracking-widest h-5"
                      >
                        {org.status ? t(`agency.clients.badge.${org.status}` as any) : t('agency.clients.badge.active')}
                      </PortalBadge>
                      <button className="text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors p-1">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2 leading-tight">
                    {org.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck size={14} className={cn(org.plan === 'enterprise' ? 'text-purple-500' : 'text-emerald-500')} />
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-widest">
                      {org.plan ? t(`agency.clients.plans.${org.plan}` as any) : t('agency.clients.enterprise')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-surface-50 dark:border-surface-800/50">
                    <div>
                      <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{t('agency.clients.tickets')}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-surface-900 dark:text-white">{org.requestCount}</span>
                        <TrendingUp size={14} className="text-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{t('agency.clients.members')}</p>
                      <div className="flex items-center gap-2 text-lg font-bold text-surface-900 dark:text-white">
                         <Users size={16} className="text-surface-400" />
                         <span>{org.memberCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-surface-50/50 dark:bg-surface-900/50 border-t border-surface-50 dark:border-surface-800 rounded-b-2xl group-hover:bg-blue-600 transition-colors">
                  <Link
                    href={`/portal/org/${org.id}/dashboard/`}
                    className="flex items-center justify-between group-hover:text-white text-blue-600 dark:text-blue-400 transition-colors"
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{t('agency.clients.dashboard')}</span>
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </PortalCard>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white dark:bg-surface-950 rounded-3xl border border-surface-200 dark:border-surface-800">
               <Users className="w-16 h-16 text-surface-100 dark:text-surface-800 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-surface-900 dark:text-white">{t('agency.clients.emptyTitle')}</h3>
               <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">{t('agency.clients.emptyDesc')}</p>
               <PortalButton className="mt-8 h-11 px-8">{t('agency.clients.onboard')}</PortalButton>
            </div>
          )}
        </div>
      </div>
  );
}
