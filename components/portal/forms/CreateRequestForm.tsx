'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { CreateRequestData } from '@/lib/types/portal';
import { createRequest } from '@/lib/services/portal-requests';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { trackPortalRequestCreate } from '@/lib/analytics';

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

      // Redirect to the new request
      router.push(`/portal/org/${orgId}/requests/${request.id}`);
    } catch (err: any) {
      console.error('Create request error:', err);
      setError(err.message || 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: '', label: 'Select type...' },
    { value: 'feature', label: 'New Feature' },
    { value: 'bug', label: 'Bug Fix' },
    { value: 'optimization', label: 'Optimization' },
    { value: 'content', label: 'Content Update' },
    { value: 'design', label: 'Design' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low - No rush' },
    { value: 'NORMAL', label: 'Normal - Standard timeline' },
    { value: 'HIGH', label: 'High - Prioritize this' },
    { value: 'URGENT', label: 'Urgent - Needs immediate attention' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        <PortalInput
          label="Request Title"
          placeholder="e.g., Update product page layout"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Request Type
            </label>
            <select
              {...register('type')}
              className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900 dark:text-white"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1.5 text-xs text-red-500">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900 dark:text-white"
            >
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
            Description & Details
          </label>
          <textarea
            {...register('description')}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-surface-900 dark:text-white"
            placeholder="Describe what you need in detail. Include:&#10;• What you want to achieve&#10;• Any relevant links or references&#10;• Specific requirements or constraints"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <PortalButton type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </PortalButton>
        <PortalButton type="submit" isLoading={loading}>
          {loading ? 'Creating...' : 'Submit Request'}
        </PortalButton>
      </div>
    </form>
  );
};
