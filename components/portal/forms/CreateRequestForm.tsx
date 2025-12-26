'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { CreateRequestData, PRIORITY_CONFIG } from '@/lib/types/portal';
import { createRequest } from '@/lib/services/portal-requests';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { trackPortalRequestCreate } from '@/lib/analytics';
import { AlertCircle, CheckCircle2, Layout, Zap, Bug, Sparkles, FileText, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const requestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  description: z.string().min(20, 'Please provide more details (at least 20 characters)'),
  type: z.enum(['feature', 'bug', 'optimization', 'content', 'design', 'other'], {
    required_error: 'Please select a request type',
  }),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface CreateRequestFormProps {
  orgId: string;
}

export const CreateRequestForm = ({ orgId }: CreateRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user, userData } = usePortalAuth();

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
      setError('You must be logged in to create a request');
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
      setError(err.message || 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'design', label: 'Design', icon: <Layout size={14} /> },
    { value: 'feature', label: 'New Feature', icon: <Sparkles size={14} /> },
    { value: 'bug', label: 'Bug Fix', icon: <Bug size={14} /> },
    { value: 'optimization', label: 'Optimization', icon: <Zap size={14} /> },
    { value: 'content', label: 'Content Update', icon: <FileText size={14} /> },
    { value: 'other', label: 'Other', icon: <Send size={14} /> },
  ];

  if (success) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">Request Received!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">Your request has been filed. Project managers will review it shortly.</p>
        <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
           <Loader2 size={12} className="animate-spin" />
           Moving to request view...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <PortalInput
          label="What needs to be done?"
          placeholder="Summarize your request in a few words..."
          error={errors.title?.message}
          {...register('title')}
          className="text-lg font-bold font-outfit"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Work Category
            </label>
            <select
              {...register('type')}
              className={cn(
                "w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all text-slate-900 dark:text-white text-sm font-bold font-outfit focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                errors.type && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              )}
            >
              <option value="" disabled>Select category...</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="px-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Importance Level
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all text-slate-900 dark:text-white text-sm font-bold font-outfit focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <option key={p} value={p}>
                  {(PRIORITY_CONFIG as any)[p].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Execution Details
          </label>
          <textarea
            {...register('description')}
            rows={6}
            className={cn(
              "w-full px-5 py-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all resize-none text-slate-900 dark:text-white text-sm font-medium leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              errors.description && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            )}
            placeholder="Help our specialists understand the objective. Include:&#10;• Desired outcome&#10;• Examples or references&#10;• Technical constraints"
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

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 pt-6">
        <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">
          Request will be added to the queue immediately.
        </p>
        <div className="flex gap-3 w-full md:w-auto">
          <PortalButton
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 md:flex-none font-outfit"
          >
            Cancel
          </PortalButton>
          <PortalButton
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="flex-1 md:flex-none font-outfit px-10 shadow-xl shadow-blue-500/20"
          >
            {loading ? 'Initializing...' : 'Dispatch Request'}
          </PortalButton>
        </div>
      </div>
    </form>
  );
};

