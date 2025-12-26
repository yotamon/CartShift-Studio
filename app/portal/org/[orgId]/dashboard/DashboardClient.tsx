'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import Link from 'next/link';
import { subscribeToOrgRequests } from '@/lib/services/portal-requests';
import { Request, STATUS_CONFIG, PRIORITY_CONFIG, REQUEST_STATUS } from '@/lib/types/portal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DashboardClient() {
  const { orgId } = useParams();
  const [stats, setStats] = useState({ total: 0, active: 0, inReview: 0, completed: 0 });
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string') return;

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToOrgRequests(orgId, (data) => {
        setRecentRequests(data.slice(0, 5));

        // Calculate stats locally from the full list
        setStats({
          total: data.length,
          active: data.filter(r => [REQUEST_STATUS.NEW, REQUEST_STATUS.QUEUED, REQUEST_STATUS.IN_PROGRESS].includes(r.status)).length,
          inReview: data.filter(r => r.status === REQUEST_STATUS.IN_REVIEW).length,
          completed: data.filter(r => [REQUEST_STATUS.DELIVERED, REQUEST_STATUS.CLOSED].includes(r.status)).length,
        });

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to dashboard data:', err);
      setError('Failed to load dashboard data.');
      setLoading(false);
    }
  }, [orgId]);

  const statCards = [
    { label: 'Total Requests', value: stats.total, icon: ClipboardList, color: 'blue' },
    { label: 'Active Tasks', value: stats.active, icon: Clock, color: 'yellow' },
    { label: 'In Review', value: stats.inReview, icon: MessageSquare, color: 'blue' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'green' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">Crunching your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Dashboard Error</h2>
        <p className="text-slate-500 max-w-sm">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>Retry</PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Overview of your active projects and recent activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/portal/org/${orgId}/requests/new/`}>
            <PortalButton className="flex items-center gap-2 font-outfit shadow-lg shadow-blue-500/20">
              <Plus size={18} />
              New Request
            </PortalButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <PortalCard key={i} className="portal-stat-card border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm",
                stat.color === 'blue' && "border-blue-100 dark:border-blue-900/30",
                stat.color === 'yellow' && "border-amber-100 dark:border-amber-900/30",
                stat.color === 'green' && "border-emerald-100 dark:border-emerald-900/30",
              )}>
                <stat.icon size={20} className={
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'yellow' ? 'text-amber-500' :
                  stat.color === 'green' ? 'text-emerald-500' : 'text-rose-500'
                } />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 font-outfit">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </PortalCard>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Recent Requests</h2>
            <Link href={`/portal/org/${orgId}/requests/`} className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors font-outfit">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <PortalCard noPadding className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
            {recentRequests.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentRequests.map((req) => (
                  <Link
                    key={req.id}
                    href={`/portal/org/${orgId}/requests/${req.id}/`}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full shadow-sm",
                        req.priority === 'HIGH' || req.priority === 'URGENT' ? "bg-rose-500" :
                        req.priority === 'NORMAL' ? "bg-amber-500" : "bg-blue-500"
                      )} />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-outfit">
                          {req.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 underline-offset-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Calendar size={12} className="text-slate-300" />
                             {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                           </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <PortalBadge variant={STATUS_CONFIG[req.status]?.color || 'gray'}>
                        {STATUS_CONFIG[req.status]?.label || req.status?.replace('_', ' ')}
                      </PortalBadge>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-slate-100 dark:border-slate-800 shadow-inner">
                   <ClipboardList className="text-slate-200 dark:text-slate-800" size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">No requests yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto font-medium">
                    Start by creating your first request to get the ball rolling.
                  </p>
                </div>
                <Link href={`/portal/org/${orgId}/requests/new/`} className="pt-2 inline-block">
                   <PortalButton size="sm" className="font-outfit">Create First Request</PortalButton>
                </Link>
              </div>
            )}
          </PortalCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 font-outfit">Insight</h2>
          <PortalCard className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2 font-outfit">Premium Partner</h4>
              <p className="text-sm text-blue-100/90 mb-6 leading-relaxed font-medium">
                You're currently on the Pro plan. Enjoy priority design support and 24-hour turnaround.
              </p>
              <PortalButton className="bg-white text-blue-600 hover:bg-blue-50 w-full border-none font-bold font-outfit">
                View Plan Benefits
              </PortalButton>
            </div>
          </PortalCard>

          <PortalCard className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Clock size={14} className="text-blue-500" />
              Service Status
            </h4>
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">Design Pipeline</span>
                <span className="text-emerald-500 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">Dev Capacity</span>
                <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Peak Load</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">Avg. Response</span>
                <span className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest">&lt; 2 hours</span>
              </div>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

