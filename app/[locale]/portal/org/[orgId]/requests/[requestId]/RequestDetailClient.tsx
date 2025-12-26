'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Send,
  Loader2,
  Calendar,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { updateRequestStatus, subscribeToRequest } from '@/lib/services/portal-requests';
import { createComment, subscribeToRequestComments } from '@/lib/services/portal-comments';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import {
  Request,
  Comment,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  RequestStatus,
} from '@/lib/types/portal';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const mapStatusColor = (color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  if (color === 'purple') return 'blue';
  if (color === 'emerald') return 'green';
  if (['blue', 'green', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
};
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function RequestDetailClient() {
  const { orgId, requestId } = useParams();
  const { userData } = usePortalAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!requestId || typeof requestId !== 'string') return undefined;

    setLoading(true);
    setError(null);

    try {
      // Subscribe to request data
      const unsubscribeRequest = subscribeToRequest(requestId, data => {
        if (!data) {
          setError(t('portal.requests.detail.notFound'));
          setLoading(false);
          return;
        }
        setRequest(data);
        setLoading(false);
      });

      // Subscribe to comments
      const unsubscribeComments = subscribeToRequestComments(
        requestId,
        data => {
          setComments(data);
        },
        userData?.isAgency
      );

      return () => {
        unsubscribeRequest();
        unsubscribeComments();
      };
    } catch (err) {
      console.error('Failed to subscribe to request details:', err);
      setError(t('portal.common.error'));
      setLoading(false);
      return undefined;
    }
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

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!requestId || typeof requestId !== 'string') return;
    try {
      await updateRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-surface-500 font-bold font-outfit uppercase tracking-widest text-xs">
          {t('portal.requests.detail.loading')}
        </p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-20 px-4">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white font-outfit">
          {error || t('portal.requests.detail.notFound')}
        </h2>
        <p className="text-surface-500 mt-2 max-w-sm mx-auto font-medium">
          {t('portal.requests.detail.notFoundDesc')}
        </p>
        <Link href={`/portal/org/${orgId}/requests/`} className="mt-8 inline-block">
          <PortalButton variant="outline" className="font-outfit">
            {t('portal.requests.detail.backToRequests')}
          </PortalButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Link
          href={`/portal/org/${orgId}/requests/`}
          className="p-2.5 border border-surface-200 dark:border-surface-800 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors shadow-sm bg-white dark:bg-surface-950"
        >
          <ArrowLeft size={20} className="text-surface-500" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white leading-tight font-outfit">
              {request.title}
            </h1>
            <PortalBadge variant={mapStatusColor(STATUS_CONFIG[request.status]?.color || 'gray')}>
              {STATUS_CONFIG[request.status]?.label || request.status?.replace('_', ' ')}
            </PortalBadge>
          </div>
          <div className="flex items-center gap-3 mt-1 underline-offset-4">
            <p className="text-xs font-black text-surface-400 uppercase tracking-widest">
              {request.id.slice(0, 8)}
            </p>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <p className="text-xs font-black text-surface-400 uppercase tracking-widest">
              {request.type || t('portal.requests.detail.designRequest')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h3 className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-4">
              {t('portal.requests.detail.details')}
            </h3>
            <div className="text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-wrap font-medium">
              {request.description}
            </div>
            <div className="mt-10 pt-6 border-t border-surface-100 dark:border-surface-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm">
                  <Calendar size={16} className="text-surface-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                    {t('portal.requests.detail.submissionDate')}
                  </p>
                  <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                    {request.createdAt?.toDate
                      ? format(request.createdAt.toDate(), 'MMMM d, yyyy')
                      : t('portal.common.recently')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm">
                  <Zap
                    size={16}
                    className={cn(
                      request.priority === 'HIGH' || request.priority === 'URGENT'
                        ? 'text-rose-500'
                        : 'text-amber-500'
                    )}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                    {t('portal.requests.detail.priorityStatus')}
                  </p>
                  <p className="text-sm font-bold text-surface-900 dark:text-white capitalize font-outfit">
                    {PRIORITY_CONFIG[request.priority]?.label ||
                      request.priority ||
                      t('portal.requests.priority.normal')}
                  </p>
                </div>
              </div>
            </div>
          </PortalCard>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <MessageSquare size={14} className="text-blue-500" />{' '}
              {t('portal.requests.detail.discussion')}
            </h3>
            <PortalCard
              noPadding
              className="flex flex-col border-surface-200 dark:border-surface-800 shadow-sm bg-surface-50/50 dark:bg-surface-900/10 min-h-[500px] overflow-hidden"
            >
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[600px] scrollbar-hide"
              >
                {comments.length > 0 ? (
                  comments.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col max-w-[85%]',
                        msg.userId === userData?.id ? 'items-end ml-auto' : 'items-start'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                          {msg.userName}
                        </span>
                        <span className="text-[9px] font-bold text-surface-300 dark:text-surface-600 uppercase tracking-tighter">
                          {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'h:mm a') : 'Now'}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'p-4 rounded-2xl text-sm shadow-sm font-medium leading-relaxed',
                          msg.userId === userData?.id
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 border border-surface-100 dark:border-surface-700 rounded-tl-none'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40 space-y-2">
                    <MessageSquare size={48} className="text-surface-300" />
                    <div>
                      <p className="text-sm font-bold text-surface-400 font-outfit uppercase tracking-widest">
                        {t('portal.requests.detail.emptyMessages')}
                      </p>
                      <p className="text-xs text-surface-500">
                        {t('portal.requests.detail.emptyMessagesDesc')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-950">
                <form onSubmit={handleSendComment} className="relative group">
                  <textarea
                    placeholder={t('portal.requests.detail.placeholder')}
                    className="portal-input pr-14 min-h-[80px] py-4 resize-none bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-800 focus:bg-white dark:focus:bg-surface-950 transition-all font-medium"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-3 bottom-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
              </div>
            </PortalCard>
          </div>
        </div>

        <div className="space-y-6">
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest">
              {t('portal.requests.detail.workflowActions')}
            </h4>
            <div className="space-y-2">
              {request.status !== 'CLOSED' && (
                <PortalButton
                  variant="outline"
                  className="w-full justify-start h-12 border-surface-200 dark:border-surface-800 text-sm font-bold font-outfit"
                  onClick={() => handleStatusChange('CLOSED')}
                >
                  <CheckCircle2 size={16} className="mr-3 text-emerald-500" />{' '}
                  {t('portal.requests.detail.closeRequest')}
                </PortalButton>
              )}
              <PortalButton
                variant="outline"
                className="w-full justify-start h-12 border-surface-200 dark:border-surface-800 text-sm font-bold font-outfit"
              >
                <Paperclip size={16} className="mr-3 text-blue-500" />{' '}
                {t('portal.requests.detail.addAttachment')}
              </PortalButton>
              <button className="w-full flex items-center justify-start h-12 px-4 text-sm font-bold text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 font-outfit">
                <MoreVertical size={16} className="mr-3" />{' '}
                {t('portal.requests.detail.requestRevision')}
              </button>
            </div>
          </PortalCard>

          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest">
              Assigned Specialist
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center text-blue-600 shadow-sm">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                  {request.assignedToName || 'Product Team'}
                </p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  Specialist
                </p>
              </div>
            </div>
          </PortalCard>

          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest">
              {t('portal.requests.detail.linkedAssets')}
            </h4>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-surface-100 dark:border-surface-900 rounded-3xl text-surface-400 bg-surface-50/50 dark:bg-surface-900/50">
              <Paperclip size={32} className="mb-2 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {t('portal.requests.detail.noAssets')}
              </p>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
