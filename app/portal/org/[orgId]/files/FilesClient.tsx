'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Image as ImageIcon,
  Search,
  Upload,
  Download,
  Share2,
  Trash2,
  Loader2,
  FileArchive,
  FileCode,
  File
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { getFilesByOrg, formatFileSize } from '@/lib/services/portal-files';
import { FileAttachment } from '@/lib/types/portal';
import { format } from 'date-fns';

export default function FilesClient() {
  const { orgId } = useParams();
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchFiles() {
      if (!orgId || typeof orgId !== 'string') return;

      setLoading(true);
      try {
        const data = await getFilesByOrg(orgId);
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, [orgId]);

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon size={20} />;
    if (mimeType.includes('pdf')) return <FileText size={20} />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <FileArchive size={20} />;
    if (mimeType.includes('javascript') || mimeType.includes('html') || mimeType.includes('css')) return <FileCode size={20} />;
    return <File size={20} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Files & Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Unified storage for all your project documents and resources.</p>
        </div>
        <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Upload size={18} />
          Upload Asset
        </PortalButton>
      </div>

      <PortalCard className="p-0 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
           <div className="relative w-full md:w-80">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               placeholder="Search file name..."
               className="portal-input pl-10 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
             {files.length} Total Files
           </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-3">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
               <p className="text-sm font-medium text-slate-400">Syncing your assets...</p>
             </div>
          ) : filteredFiles.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-slate-900/30">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploaded</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFiles.map(file => (
                  <tr key={file.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-blue-500 transition-colors">
                          {getIcon(file.mimeType)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-xs md:max-w-md">
                            {file.originalName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            Added by {file.uploadedByName || 'System'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{formatFileSize(file.size)}</span>
                    </td>
                    <td className="px-6 py-4">
                       <PortalBadge variant="gray" className="text-[10px] font-black">
                         {file.mimeType.split('/').pop()?.toUpperCase() || 'FILE'}
                       </PortalBadge>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                         {file.uploadedAt?.toDate ? format(file.uploadedAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Download size={16} />
                        </a>
                        <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                          <Share2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                <FileText className="text-slate-200" size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No assets found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                {searchQuery ? "We couldn't find any files matching your search." : "This organization hasn't uploaded any assets yet."}
              </p>
            </div>
          )}
        </div>
      </PortalCard>
    </div>
  );
}
