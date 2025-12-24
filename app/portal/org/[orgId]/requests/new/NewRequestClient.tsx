'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Upload,
  Info
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import Link from 'next/link';

export default function NewRequestClient() {
  const { orgId } = useParams();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the request would go here
    router.push(`/portal/org/${orgId}/requests/`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/portal/org/${orgId}/requests/`}
          className="p-2 border border-[var(--portal-border)] rounded-md hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--portal-text-primary)]">Create New Request</h1>
          <p className="text-sm text-[var(--portal-text-secondary)]">Fill in the details below to start a new task.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PortalCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PortalInput
                label="Request Title"
                placeholder="e.g. Update homepage hero section"
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--portal-text-secondary)]">Description</label>
                <textarea
                  className="portal-input min-h-[150px] py-3 resize-none"
                  placeholder="Provide detailed instructions or feedback..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--portal-text-secondary)]">Category</label>
                  <select className="portal-input h-10 appearance-none bg-white dark:bg-slate-900">
                    <option>Design</option>
                    <option>Development</option>
                    <option>Marketing</option>
                    <option>Copywriting</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--portal-text-secondary)]">Priority</label>
                  <select className="portal-input h-10 appearance-none bg-white dark:bg-slate-900">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--portal-border)]">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/portal/org/${orgId}/requests/`}>
                    <PortalButton variant="outline" type="button">Cancel</PortalButton>
                  </Link>
                  <PortalButton type="submit" className="flex items-center gap-2">
                    <Send size={18} />
                    Submit Request
                  </PortalButton>
                </div>
              </div>
            </form>
          </PortalCard>
        </div>

        <div className="space-y-6">
          <PortalCard>
            <h3 className="font-bold text-[var(--portal-text-primary)] mb-4 flex items-center gap-2">
              <Upload size={18} /> Attachments
            </h3>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--portal-border)] rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
              <Upload size={32} className="mb-2 opacity-20 group-hover:opacity-40 transition-opacity" />
              <p className="text-xs font-semibold text-[var(--portal-text-primary)]">Click to upload assets</p>
              <p className="text-[10px] mt-1">Images, PDFs, or ZIP files</p>
            </div>
            <p className="text-xs text-[var(--portal-text-secondary)] mt-4 leading-relaxed">
              Attaching relevant assets, brand guides, or screenshots helps our team deliver high-quality results faster.
            </p>
          </PortalCard>

          <PortalCard className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
            <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Info size={18} /> Tips
            </h3>
            <ul className="text-xs text-blue-800/80 dark:text-blue-300/80 space-y-2 list-disc pl-4">
              <li>Be specific about the goals of this request.</li>
              <li>Include links to references or inspiration.</li>
              <li>Break down complex tasks into smaller requests.</li>
            </ul>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
