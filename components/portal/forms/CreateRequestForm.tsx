'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from '@/i18n/navigation';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { CreateRequestData, PRIORITY_CONFIG } from '@/lib/types/portal';
import { createRequest } from '@/lib/services/portal-requests';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { trackPortalRequestCreate } from '@/lib/analytics';
import { AlertCircle, CheckCircle2, Layout, Zap, Bug, Sparkles, FileText, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';


type RequestFormData = {
  title: string;
  description: string;
  type: 'feature' | 'bug' | 'optimization' | 'content' | 'design' | 'other';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
};

interface CreateRequestFormProps {
  orgId: string;
}

export const CreateRequestForm = ({ orgId }: CreateRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user, userData } = usePortalAuth();
  const t = useTranslations();

  const requestSchema = useMemo(() => z.object({
    title: z.string().min(5, t('portal.requests.form.errors.titleShort')).max(200, t('portal.requests.form.errors.titleLong')),
    description: z.string().min(20, t('portal.requests.form.errors.descShort')),
    type: z.enum(['feature', 'bug', 'optimization', 'content', 'design', 'other'], {
      message: t('portal.requests.form.errors.typeRequired'),
    }),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  }), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      priority: 'NORMAL',
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    if (!user) {
      setError(t('portal.requests.form.errors.auth'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userName = userData?.name || user.displayName || user.email?.split('@')[0] || 'Unknown';

      const request = await createRequest(orgId, user.uid, userName, {
        title: data.title,
        description: data.description,
        type: data.type as CreateRequestData['type'],
        priority: data.priority as CreateRequestData['priority'],
      });

      // Track analytics
      trackPortalRequestCreate(data.type);

      setSuccess(true);

      // Short delay before redirecting for better UX
      setTimeout(() => {
        router.push(`/portal/org/${orgId}/requests/${request.id}`);
      }, 1500);

    } catch (err: any) {
      console.error('Create request error:', err);
      setError(err.message || t('portal.requests.form.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'design', label: (t('portal.requests.status.design' as any) as string) || 'Design', icon: <Layout size={14} /> },
    { value: 'feature', label: (t('portal.requests.status.new' as any) as string) || 'New Feature', icon: <Sparkles size={14} /> },
    { value: 'bug', label: (t('portal.requests.status.bug' as any) as string) || 'Bug Fix', icon: <Bug size={14} /> },
    { value: 'optimization', label: (t('portal.requests.status.optimization' as any) as string) || 'Optimization', icon: <Zap size={14} /> },
    { value: 'content', label: (t('portal.requests.status.content' as any) as string) || 'Content Update', icon: <FileText size={14} /> },
    { value: 'other', label: (t('portal.requests.status.other' as any) as string) || 'Other', icon: <Send size={14} /> },
  ];

  if (success) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white font-outfit">{t('portal.requests.form.successTitle')}</h2>
        <p className="text-surface-500 dark:text-surface-400 font-medium max-w-xs">{t('portal.requests.form.successDesc')}</p>
        <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-widest animate-pulse">
           <Loader2 size={12} className="animate-spin" />
           {t('portal.requests.form.redirecting')}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <PortalInput
          label={t('portal.requests.form.titleLabel')}
          placeholder={t('portal.requests.form.titlePlaceholder')}
          error={errors.title?.message}
          {...register('title')}
          className="text-lg font-bold font-outfit"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest px-1">
              {t('portal.requests.form.categoryLabel')}
            </label>
            <select
              {...register('type')}
              className={cn(
                "w-full px-4 py-3 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 transition-all text-surface-900 dark:text-white text-sm font-bold font-outfit focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                errors.type && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              )}
            >
              <option value="" disabled>{t('portal.requests.form.categorySelect')}</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label as string}
                </option>
              ))}
            </select>
            {errors.type && <p className="px-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest px-1">
              {t('portal.requests.form.priorityLabel')}
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 transition-all text-surface-900 dark:text-white text-sm font-bold font-outfit focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <option key={p} value={p}>
                  {t(`portal.requests.priority.${p.toLowerCase()}` as any)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest px-1">
            {t('portal.requests.form.detailsLabel')}
          </label>
          <textarea
            {...register('description')}
            rows={6}
            className={cn(
              "w-full px-5 py-4 rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 transition-all resize-none text-surface-900 dark:text-white text-sm font-medium leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              errors.description && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            )}
            placeholder={t('portal.requests.form.detailsPlaceholder')}
          />
          {errors.description && (
             <p className="px-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.description.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-start gap-3">
          <AlertCircle size={18} className="text-rose-500 mt-0.5 shrink-0" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-outfit">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800 pt-6">
        <p className="hidden md:block text-[10px] font-bold text-surface-400 uppercase tracking-widest max-w-[200px]">
          {t('portal.requests.form.footerNote')}
        </p>
        <div className="flex gap-3 w-full md:w-auto">
          <PortalButton
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 md:flex-none font-outfit"
          >
            {t('portal.requests.form.cancel')}
          </PortalButton>
          <PortalButton
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="flex-1 md:flex-none font-outfit px-10 shadow-xl shadow-blue-500/20"
          >
            {loading ? t('portal.requests.form.submitting') : t('portal.requests.form.submit')}
          </PortalButton>
        </div>
      </div>
    </form>
  );
};


