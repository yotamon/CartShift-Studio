'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Send,
  Loader2,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import Link from 'next/link';
import { getRequest, updateRequestStatus } from '@/lib/services/portal-requests';
import { createComment, subscribeToRequestComments } from '@/lib/services/portal-comments';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { Request, Comment } from '@/lib/types/portal';
import { format } from 'date-fns';

export default function RequestDetailClient() {
  const { orgId, requestId } = useParams();
  const { userData } = usePortalAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRequest() {
      if (!requestId || typeof requestId !== 'string') return;

      try {
        const data = await getRequest(requestId);
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();

    const unsubscribe = requestId && typeof requestId === 'string'
      ? subscribeToRequestComments(requestId, (data) => {
          setComments(data);
        }, userData?.isAgency)
      : undefined;

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [requestId, userData?.isAgency]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !requestId || !orgId || !userData) return;

    setIsSubmitting(true);
    try {
      await createComment(
        requestId as string,
        orgId as string,
        userData.id,
        userData.name || userData.email,
        undefined,
        { content: newComment.trim() }
      );
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!requestId || typeof requestId !== 'string') return;
    try {
      await updateRequestStatus(requestId, newStatus as any);
      // Refresh local state
      const updated = await getRequest(requestId);
      setRequest(updated);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Opening your request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request not found</h2>
        <p className="text-slate-500 mt-2">The request you are looking for might have been deleted or moved.</p>
        <Link href={`/portal/org/${orgId}/requests/`} className="mt-8 inline-block">
          <PortalButton variant="outline">Back to Requests</PortalButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Link href={`/portal/org/${orgId}/requests/`} className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm bg-white dark:bg-slate-950">
          <ArrowLeft size={20} className="text-slate-500" />
        </Link>
        <div className="flex-1">
           <div className="flex flex-wrap items-center gap-3">
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{request.title}</h1>
             <PortalBadge variant={
               request.status === 'DELIVERED' || request.status === 'CLOSED' ? 'green' :
               request.status === 'IN_PROGRESS' || request.status === 'NEW' ? 'blue' : 'yellow'
             }>
               {request.status?.replace('_', ' ')}
             </PortalBadge>
           </div>
           <div className="flex items-center gap-3 mt-1 underline-offset-4">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.id.slice(0, 8)}</p>
             <span className="w-1 h-1 rounded-full bg-slate-300" />
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.type || 'Design Request'}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Request Description</h3>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </div>
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <Calendar size={16} className="text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{request.createdAt?.toDate ? format(request.createdAt.toDate(), 'MMMM d, yyyy') : 'Recently'}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <Clock size={16} className="text-amber-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Status</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{request.priority || 'Medium Priority'}</p>
                 </div>
               </div>
            </div>
          </PortalCard>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 px-1">
              <MessageSquare size={16} className="text-blue-500" /> Discussion History
            </h3>
            <PortalCard noPadding className="flex flex-col border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/30 dark:bg-slate-900/10 min-h-[500px]">
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[600px] scrollbar-hide"
              >
                 {comments.length > 0 ? (
                   comments.map(msg => (
                     <div key={msg.id} className={cn(
                       "flex flex-col max-w-[85%]",
                       msg.userId === userData?.id ? "items-end ml-auto" : "items-start"
                     )}>
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.userName}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'h:mm a') : 'Now'}</span>
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm shadow-sm",
                          msg.userId === userData?.id
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <MessageSquare size={48} className="text-slate-300 mb-4" />
                      <p className="text-sm font-bold text-slate-400">No messages yet</p>
                      <p className="text-xs text-slate-500">Send a message to start the conversation.</p>
                   </div>
                 )}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                 <form onSubmit={handleSendComment} className="relative group">
                   <textarea
                     placeholder="Share feedback or ask a question..."
                     className="portal-input pr-14 min-h-[80px] py-4 resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium"
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     disabled={isSubmitting}
                   />
                   <button
                     type="submit"
                     disabled={isSubmitting || !newComment.trim()}
                     className="absolute right-3 bottom-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                   >
                     {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                   </button>
                 </form>
              </div>
            </PortalCard>
          </div>
        </div>

        <div className="space-y-6">
          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">Workflow Actions</h4>
             <div className="space-y-2">
               {request.status !== 'CLOSED' && (
                 <PortalButton
                  variant="outline"
                  className="w-full justify-start h-11 border-slate-200 dark:border-slate-700 text-sm font-bold"
                  onClick={() => handleStatusChange('CLOSED')}
                 >
                   <CheckCircle2 size={16} className="mr-3 text-emerald-500" /> Close Request
                 </PortalButton>
               )}
               <PortalButton variant="outline" className="w-full justify-start h-11 border-slate-200 dark:border-slate-700 text-sm font-bold">
                 <Paperclip size={16} className="mr-3 text-blue-500" /> Add Attachment
               </PortalButton>
               <button className="w-full flex items-center justify-start h-11 px-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <MoreVertical size={16} className="mr-3" /> Request Revision
               </button>
             </div>
          </PortalCard>

          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">Assigned Specialist</h4>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 shadow-sm">
                  <UserIcon size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">{request.assignedToName || 'Product Team'}</p>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Design Lead</p>
                </div>
             </div>
          </PortalCard>

          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">Linked Assets</h4>
             <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                <Paperclip size={32} className="mb-2 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">No assets yet</p>
             </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
