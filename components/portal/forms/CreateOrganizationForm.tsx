'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { X } from 'lucide-react';
import { createOrganization } from '@/lib/services/portal-organizations';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

const orgSchema = z.object({
  name: z.string().min(3, 'Organization name must be at least 3 characters').max(100, 'Name is too long'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().min(2, 'Industry must be at least 2 characters').optional().or(z.literal('')),
});

type OrgFormData = z.infer<typeof orgSchema>;

interface CreateOrganizationFormProps {
  onSuccess: (orgId: string) => void;
  onCancel: () => void;
}

export const CreateOrganizationForm = ({ onSuccess, onCancel }: CreateOrganizationFormProps) => {
  const { user, userData } = usePortalAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
  });

  const onSubmit = async (data: OrgFormData) => {
    if (!user || !userData) {
      setError('You must be logged in to create an organization');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const org = await createOrganization(
        data.name,
        user.uid,
        user.email || userData.email,
        userData.name
      );

      // Update the org with additional fields if provided
      if (data.website || data.industry) {
        const { updateOrganization } = await import('@/lib/services/portal-organizations');
        await updateOrganization(org.id, {
          website: data.website || undefined,
          industry: data.industry || undefined,
        });
      }

      onSuccess(org.id);
      router.push(`/portal/org/${org.id}/dashboard`);
    } catch (err: any) {
      console.error('Create organization error:', err);
      setError(err.message || 'Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Organization</h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <PortalInput
            label="Organization Name *"
            placeholder="e.g. Acme Corporation"
            error={errors.name?.message}
            {...register('name')}
          />

          <PortalInput
            label="Website"
            type="url"
            placeholder="https://example.com"
            error={errors.website?.message}
            {...register('website')}
          />

          <PortalInput
            label="Industry"
            placeholder="e.g. E-commerce, SaaS, Marketing"
            error={errors.industry?.message}
            {...register('industry')}
          />

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl p-4">
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Note:</strong> You will be set as the owner of this organization and can invite team members later.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <PortalButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </PortalButton>
            <PortalButton type="submit" isLoading={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Organization'}
            </PortalButton>
          </div>
        </form>
      </div>
    </div>
  );
};
