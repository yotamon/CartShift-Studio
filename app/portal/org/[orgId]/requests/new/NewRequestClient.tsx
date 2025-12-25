'use client';

import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Info
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { CreateRequestForm } from '@/components/portal/forms/CreateRequestForm';
import Link from 'next/link';

export default function NewRequestClient() {
  const { orgId } = useParams();

  if (!orgId || typeof orgId !== 'string') {
    return <div className="text-center py-20 text-slate-500">Invalid organization ID</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href={`/portal/org/${orgId}/requests/`}
          className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm bg-white dark:bg-slate-950"
        >
          <ArrowLeft size={20} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Request</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in the details below to start a new task with your team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CreateRequestForm orgId={orgId} />
          </PortalCard>
        </div>

        <div className="space-y-6">
          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload size={18} className="text-blue-500" /> Attachments
            </h3>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
              <Upload size={32} className="mb-2 opacity-20 group-hover:opacity-40 transition-opacity" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Click to upload assets</p>
              <p className="text-[10px] mt-1 text-slate-500">Images, PDFs, or ZIP files</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Attaching relevant assets, brand guides, or screenshots helps our team deliver high-quality results faster.
            </p>
          </PortalCard>

          <PortalCard className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 shadow-sm">
            <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Info size={18} /> Pro Tips
            </h3>
            <ul className="text-xs text-blue-800/80 dark:text-blue-300/80 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Be specific about the goals and expected outcomes of this request.</li>
              <li>Include links to any design references, examples, or inspiration.</li>
              <li>Break down complex tasks into smaller, focused requests for faster delivery.</li>
              <li>Mention any deadlines or time-sensitive requirements upfront.</li>
            </ul>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
