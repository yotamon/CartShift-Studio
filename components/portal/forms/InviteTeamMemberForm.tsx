'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { X } from 'lucide-react';
import { inviteTeamMember } from '@/lib/services/portal-organizations';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer']),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteTeamMemberFormProps {
  orgId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const InviteTeamMemberForm = ({ orgId, onSuccess, onCancel }: InviteTeamMemberFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'member',
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true);
    setError(null);

    try {
      await inviteTeamMember(orgId, data.email, data.role);
      onSuccess();
    } catch (err: any) {
      console.error('Invite error:', err);
      setError(err.message || 'Failed to send invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin - Full access' },
    { value: 'member', label: 'Member - Standard access' },
    { value: 'viewer', label: 'Viewer - Read-only access' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Invite Team Member</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <PortalInput
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Role & Permissions
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900 dark:text-white"
            >
              {roleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1.5 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <PortalButton type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </PortalButton>
            <PortalButton type="submit" isLoading={loading} className="flex-1">
              {loading ? 'Sending...' : 'Send Invite'}
            </PortalButton>
          </div>
        </form>
      </div>
    </div>
  );
};
