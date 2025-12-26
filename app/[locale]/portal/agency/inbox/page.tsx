'use client';

import { useState, useEffect } from 'react';
import { PortalShell } from '@/components/portal/PortalShell';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { Search, Mail, Filter, MoreVertical, Star, Loader2 } from 'lucide-react';
import { getAllRequests } from '@/lib/services/portal-requests';
import { Request } from '@/lib/types/portal';
import { format } from 'date-fns';

export default function AgencyInboxPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching agency inbox:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRequests = requests.filter(req =>
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalShell isAgency>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white">Agency Inbox</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">Global view of all client requests and communications.</p>
          </div>
        </div>

        <PortalCard className="p-0 overflow-hidden border-surface-200 dark:border-surface-800 shadow-sm">
          <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-white dark:bg-surface-950">
             <div className="flex items-center gap-4">
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                 <input
                   type="text"
                   placeholder="Search requests..."
                   className="portal-input pl-10 w-64 md:w-80 h-10 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <PortalButton variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-surface-200 dark:border-surface-700">
                 <Filter size={16} /> Filters
               </PortalButton>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest px-2">
                {filteredRequests.length} Active Items
             </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
               <div className="py-20 flex flex-col items-center justify-center space-y-3">
                 <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                 <p className="text-sm font-medium text-surface-400">Loading agency inbox...</p>
               </div>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-4 p-5 hover:bg-surface-50/80 dark:hover:bg-surface-800/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <button className="p-1 text-surface-300 group-hover:text-amber-400 transition-colors">
                      <Star size={18} />
                    </button>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                      {req.createdByName ? req.createdByName[0] : 'U'}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                     <div className="md:col-span-1">
                        <p className="text-sm font-bold text-surface-900 dark:text-white truncate">
                          {req.createdByName || 'User'}
                        </p>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter truncate">Client Org</p>
                     </div>
                     <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-surface-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                            {req.title}
                           </p>
                           <PortalBadge variant={req.status === 'IN_PROGRESS' ? 'blue' : 'yellow'} className="text-[9px] h-4">
                             {req.status}
                           </PortalBadge>
                        </div>
                        <p className="text-xs text-surface-500 truncate mt-0.5">{req.description?.slice(0, 100)}...</p>
                     </div>
                     <div className="md:col-span-1 text-right flex items-center justify-end gap-4">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-surface-500 whitespace-nowrap uppercase tracking-widest leading-none mb-1">
                             {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'h:mm a') : 'Now'}
                           </span>
                           <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest leading-none">
                             {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'MMM d') : 'Today'}
                           </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                          <MoreVertical size={16} />
                        </button>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                 <Mail className="w-16 h-16 text-surface-100 dark:text-surface-800 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-surface-900 dark:text-white">Your inbox is clear</h3>
                 <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">All client requests have been processed or sorted.</p>
              </div>
            )}
          </div>
        </PortalCard>
      </div>
    </PortalShell>
  );
}
