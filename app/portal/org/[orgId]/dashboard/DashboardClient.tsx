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
  Calendar
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import Link from 'next/link';
import { getRequestStats, getRecentRequestsByOrg } from '@/lib/services/portal-requests';
import { Request } from '@/lib/types/portal';
import { format } from 'date-fns';

export default function DashboardClient() {
  const { orgId } = useParams();
  const [stats, setStats] = useState({ total: 0, active: 0, inReview: 0, completed: 0 });
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!orgId || typeof orgId !== 'string') return;

      setLoading(true);
      try {
        const [statsData, requestsData] = await Promise.all([
          getRequestStats(orgId),
          getRecentRequestsByOrg(orgId, 5)
        ]);

        setStats(statsData);
        setRecentRequests(requestsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orgId]);

  const statCards = [
    { label: 'Total Requests', value: stats.total, icon: ClipboardList, color: 'blue' },
    { label: 'Active Tasks', value: stats.active, icon: Clock, color: 'yellow' },
    { label: 'In Review', value: stats.inReview, icon: MessageSquare, color: 'blue' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'green' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Crunching your data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview of your active projects and recent activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/portal/org/${orgId}/requests/new/`}>
            <PortalButton className="flex items-center gap-2">
              <Plus size={18} />
              New Request
            </PortalButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <PortalCard key={i} className="portal-stat-card border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm`}>
                <stat.icon size={20} className={
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'yellow' ? 'text-amber-500' :
                  stat.color === 'green' ? 'text-emerald-500' : 'text-rose-500'
                } />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </PortalCard>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Requests</h2>
            <Link href={`/portal/org/${orgId}/requests/`} className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <PortalCard noPadding className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {recentRequests.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentRequests.map((req) => (
                  <Link
                    key={req.id}
                    href={`/portal/org/${orgId}/requests/${req.id}/`}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full shadow-sm",
                        req.priority === 'HIGH' || req.priority === 'URGENT' ? "bg-rose-500" :
                        req.priority === 'NORMAL' ? "bg-amber-500" : "bg-blue-500"
                      )} />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {req.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 underline-offset-4">
                           <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                             <Calendar size={12} />
                             {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                           </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <PortalBadge variant={
                        req.status === 'DELIVERED' || req.status === 'CLOSED' ? 'green' :
                        req.status === 'IN_PROGRESS' || req.status === 'NEW' ? 'blue' : 'yellow'
                      }>
                        {req.status?.replace('_', ' ')}
                      </PortalBadge>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                   <ClipboardList className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No requests yet</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                  Start by creating your first request to get the ball rolling.
                </p>
                <Link href={`/portal/org/${orgId}/requests/new/`} className="mt-6 inline-block">
                   <PortalButton size="sm">Create First Request</PortalButton>
                </Link>
              </div>
            )}
          </PortalCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2">Workspace Insight</h2>
          <PortalCard className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white shadow-lg shadow-blue-500/20">
            <h4 className="font-bold text-lg mb-2">Pro Plan Perks</h4>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">
              You're currently on the Pro plan. Enjoy unlimited design requests and 24-hour turnaround on small tasks.
            </p>
            <PortalButton className="bg-white text-blue-600 hover:bg-blue-50 w-full border-none font-bold">
              View Benefits
            </PortalButton>
          </PortalCard>

          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Service Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Design Pipeline</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Dev Capacity</span>
                <span className="text-amber-500 font-bold">Limited</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Support Response</span>
                <span className="text-slate-900 dark:text-white font-bold">&lt; 2 hours</span>
              </div>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
