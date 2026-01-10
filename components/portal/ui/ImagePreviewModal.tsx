'use client';

import { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { createPortal } from 'react-dom';
import { useState } from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  imageName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({
  imageUrl,
  imageName,
  isOpen,
  onClose,
}: ImagePreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl max-h-[90vh] w-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg font-outfit truncate">
                    {imageName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Zoom Controls */}
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title="Zoom Out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="text-white text-sm font-bold px-2">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title="Zoom In"
                  >
                    <ZoomIn size={18} />
                  </button>

                  {/* Download Button */}
                  <a
                    href={imageUrl}
                    download={imageName}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title="Download"
                  >
                    <Download size={18} />
                  </a>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title="Close (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center overflow-auto rounded-2xl bg-surface-950/50 border border-white/10">
                <motion.img
                  src={imageUrl}
                  alt={imageName}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: 'transform 0.2s ease-out'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
