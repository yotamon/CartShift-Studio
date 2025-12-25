'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Plus,
  Search,
  MoreVertical,
  MessageSquare,
  Loader2,
  Filter,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import Link from 'next/link';
import { subscribeToOrgRequests } from '@/lib/services/portal-requests';
import { Request } from '@/lib/types/portal';
import { format } from 'date-fns';

export default function RequestsClient() {
  const { orgId } = useParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'NEW', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CLOSED'];

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string') return;

    setLoading(true);
    const unsubscribe = subscribeToOrgRequests(orgId, (data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orgId]);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your project requirements in real-time.</p>
        </div>
        <Link href={`/portal/org/${orgId}/requests/new/`}>
          <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            Create Request
          </PortalButton>
        </Link>
      </div>

      <PortalCard className="p-0 overflow-visible border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by title or ID..."
              className="portal-input pl-10 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">
               <Filter size={12} /> Filter:
            </div>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all",
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-3">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
               <p className="text-sm font-medium text-slate-400">Loading your requests...</p>
             </div>
          ) : filteredRequests.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-default">Request Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/portal/org/${orgId}/requests/${req.id}/`} className="flex flex-col max-w-md">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {req.title}
                        </span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-1">
                          ID: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{req.id.slice(0, 8)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {req.type || 'General'}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <PortalBadge variant={
                        req.status === 'DELIVERED' || req.status === 'CLOSED' ? 'green' :
                        req.status === 'IN_PROGRESS' || req.status === 'NEW' ? 'blue' : 'yellow'
                      }>
                        {req.status?.replace('_', ' ')}
                      </PortalBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          req.priority === 'HIGH' || req.priority === 'URGENT' ? "bg-rose-500 shadow-sm shadow-rose-500/50" :
                          req.priority === 'NORMAL' ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-blue-500 shadow-sm shadow-blue-500/50"
                        )} />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{req.priority || 'NORMAL'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                          {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Created At</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/portal/org/${orgId}/requests/${req.id}/`}>
                          <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <MessageSquare size={16} />
                          </button>
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                <Search className="text-slate-300" size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No requests found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm">
                {searchQuery || activeFilter !== 'All'
                  ? "We couldn't find any requests matching your current filters. Try adjusting your search."
                  : "Your work list is currently empty. Create your first request to get started."}
              </p>
              {!searchQuery && activeFilter === 'All' && (
                <Link href={`/portal/org/${orgId}/requests/new/`} className="mt-8">
                  <PortalButton className="h-11 px-8">Create Your First Request</PortalButton>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        {!loading && filteredRequests.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 px-6">
            <span className="uppercase tracking-widest">Showing {filteredRequests.length} of {requests.length} total results</span>
            <div className="flex items-center gap-3">
               <button className="hover:text-slate-900 transition-colors uppercase tracking-widest p-1" disabled>Previous</button>
               <span className="w-1 h-1 rounded-full bg-slate-300" />
               <button className="hover:text-slate-900 transition-colors uppercase tracking-widest p-1">Next</button>
            </div>
          </div>
        )}
      </PortalCard>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
