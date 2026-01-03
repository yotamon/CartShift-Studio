'use client';

import { useState, useRef } from 'react';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { X, Upload as UploadIcon, File, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/services/portal-files';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useTranslations } from 'next-intl';

interface UploadFileFormProps {
  orgId: string;
  requestId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UploadFileForm = ({ orgId, requestId, onSuccess, onCancel }: UploadFileFormProps) => {
  const { user, userData } = usePortalAuth();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(t('portal.files.uploadForm.errorSize'));
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const userName = userData?.name || user.displayName || t('portal.common.unknownUser');

      // Note: Progress tracking simulation since uploadFile doesn't support callbacks
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await uploadFile(orgId, user.uid, userName, selectedFile, {
        requestId,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      onSuccess();
    } catch (error: unknown) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : t('portal.files.uploadForm.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl max-w-lg w-full border border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-800">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">
            {t('portal.files.uploadForm.title')}
          </h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-surface-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
            >
              <UploadIcon className="w-12 h-12 text-surface-300 dark:text-surface-700 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1">
                {t('portal.files.uploadForm.browse')}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {t('portal.files.uploadForm.maxSize')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.zip,.rar"
              />
            </div>
          ) : (
            <div className="border border-surface-200 dark:border-surface-800 rounded-xl p-4 bg-surface-50 dark:bg-surface-900/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <File className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-surface-900 dark:text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!loading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-surface-500" />
                  </button>
                )}
              </div>

              {loading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-surface-600 dark:text-surface-400 mb-2">
                    <span>{t('portal.files.uploadForm.uploading')}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
              {t('portal.files.uploadForm.cancel')}
            </PortalButton>
            <PortalButton
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              isLoading={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('portal.files.uploadForm.uploading')}
                </>
              ) : (
                t('portal.files.uploadForm.submit')
              )}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};
