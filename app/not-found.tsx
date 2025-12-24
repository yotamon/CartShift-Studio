'use client';

import Link from 'next/link';
import { HomeIcon, ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  const isPortalRoute = pathname?.startsWith('/portal');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-slate-200 dark:text-slate-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center transform -rotate-12">
              <span className="text-white text-4xl">?</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link
            href={isPortalRoute ? '/portal/login/' : '/'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <HomeIcon size={18} />
            {isPortalRoute ? 'Portal Login' : 'Go Home'}
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 dark:text-slate-400 pt-4">
          Need help? {' '}
          <Link href="/contact/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
}
