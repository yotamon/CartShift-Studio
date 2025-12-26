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
  File,
  AlertCircle
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { getFilesByOrg, formatFileSize, deleteFile } from '@/lib/services/portal-files';
import { FileAttachment } from '@/lib/types/portal';
import { format } from 'date-fns';
import { UploadFileForm } from '@/components/portal/forms/UploadFileForm';
import { cn } from '@/lib/utils';

export default function FilesClient() {
  const { orgId } = useParams();
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      if (!orgId || typeof orgId !== 'string') return;

      setLoading(true);
      setError(null);
      try {
        const data = await getFilesByOrg(orgId);
        setFiles(data);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to retrieve project assets.');
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

  const handleUploadSuccess = async () => {
    setShowUploadModal(false);
    if (orgId && typeof orgId === 'string') {
      const data = await getFilesByOrg(orgId);
      setFiles(data);
    }
  };

  const handleDeleteFile = async (fileId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

    setDeletingFile(fileId);
    try {
      await deleteFile(fileId, storagePath);
      if (orgId && typeof orgId === 'string') {
        const data = await getFilesByOrg(orgId);
        setFiles(data);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">Syncing your assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Asset Sync Error</h2>
        <p className="text-slate-500 max-w-sm font-medium">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>Retry Sync</PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">Files & Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Unified storage for all your project documents and resources.</p>
        </div>
        <PortalButton
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit"
        >
          <Upload size={18} />
          Upload Asset
        </PortalButton>
      </div>

      <PortalCard className="p-0 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30">
           <div className="relative w-full md:w-96">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               placeholder="Search by filename..."
               className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-3">
             <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
               {files.length} Total Files
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          {filteredFiles.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Asset Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Metadata</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Format</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Transmission</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFiles.map(file => (
                  <tr key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-all shadow-sm">
                          {getIcon(file.mimeType)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[200px] md:max-w-xs font-outfit leading-tight">
                            {file.originalName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                            Added by {file.uploadedByName || 'System'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-outfit">{formatFileSize(file.size)}</span>
                    </td>
                    <td className="px-6 py-5">
                       <PortalBadge variant="gray" className="text-[9px] font-black border-slate-200 dark:border-slate-800">
                         {file.mimeType.split('/').pop()?.toUpperCase() || 'FILE'}
                       </PortalBadge>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                         {file.uploadedAt?.toDate ? format(file.uploadedAt.toDate(), 'MMM d, yyyy') : 'Recently Added'}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30"
                          title="Share"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id, file.storagePath)}
                          disabled={deletingFile === file.id}
                          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingFile === file.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 shadow-sm relative group">
                <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] scale-90 group-hover:scale-110 transition-transform duration-500" />
                <FileText className="text-slate-200 dark:text-slate-800 relative z-10" size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">No assets syncronized</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto font-medium">
                {searchQuery ? "We couldn't find any files matching your search." : "This organization workspace is currently empty."}
              </p>
              {!searchQuery && (
                <PortalButton
                  onClick={() => setShowUploadModal(true)}
                  variant="outline"
                  size="sm"
                  className="mt-6 font-outfit border-slate-200 dark:border-slate-800"
                >
                  Upload First Asset
                </PortalButton>
              )}
            </div>
          )}
        </div>
      </PortalCard>

      {showUploadModal && orgId && typeof orgId === 'string' && (
        <UploadFileForm
          orgId={orgId}
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

