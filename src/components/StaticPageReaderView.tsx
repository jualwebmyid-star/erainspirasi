import React from 'react';
import { ArrowLeft, ShieldCheck, Clock, Share2, Globe2, BookOpen } from 'lucide-react';
import Markdown from 'react-markdown';
import { StaticPageItem } from '../types';

interface StaticPageReaderViewProps {
  page: StaticPageItem;
  onBackToHome: () => void;
}

export const StaticPageReaderView: React.FC<StaticPageReaderViewProps> = ({ page, onBackToHome }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={onBackToHome}
        className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-600 font-bold text-xs transition flex items-center gap-2 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-rose-600" />
        <span>Kembali ke Beranda Utama</span>
      </button>

      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dokumen Resmi Redaksi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {page.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>Diperbarui: {page.updatedAt}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>EraInspirasi.com Verified</span>
            </span>
          </div>
        </div>

        {/* Page Content Rendering */}
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
          <div className="markdown-body">
            <Markdown>{page.content}</Markdown>
          </div>
        </div>

        {/* Footer info box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span>PT Era Inspirasi Media Nusantara • Dewan Pers & Standardisasi Jurnalistik Digital</span>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: page.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link halaman telah disalin!');
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold flex items-center gap-1 hover:bg-rose-500 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
