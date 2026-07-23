import React from 'react';
import { 
  PenTool, 
  FileText, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Eye, 
  Trash2, 
  Edit3, 
  Share2, 
  BarChart3, 
  Globe, 
  Sparkles 
} from 'lucide-react';
import { BlogPost, Comment } from '../types';

interface CmsDashboardProps {
  posts: BlogPost[];
  comments: Comment[];
  onSelectPostToEdit: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onNavigateTab: (tab: 'editor' | 'social' | 'analytics' | 'seo') => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  posts,
  comments,
  onSelectPostToEdit,
  onDeletePost,
  onNavigateTab,
}) => {
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Dashboard Top Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-indigo-500" />
            <span>Studio Manajemen Konten (CMS Dashboard)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pusat kontrol manajemen artikel, draf AI, jadwal rilis, dan moderasi komentar.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('editor')}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tulis Artikel / Draf AI Baru</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Dipublikasikan</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{publishedCount} Artikel</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-amber-500 uppercase">Draf Penulisan</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{draftCount} Draf</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-indigo-500 uppercase">Rilis Terjadwal</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{scheduledCount} Artikel</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-emerald-500 uppercase">Total Dibaca Pembaca</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalViews.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Quick Tool Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('social')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white space-y-2 hover:scale-[1.01] transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <Share2 className="w-5 h-5 text-indigo-300" />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20">Auto-Post</span>
          </div>
          <h4 className="font-bold text-base">Syndication Media Sosial</h4>
          <p className="text-xs text-indigo-200">Jadwalkan & kirim postingan autokonten langsung ke X, LinkedIn & Threads.</p>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-2 hover:scale-[1.01] transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Live Metrics</span>
          </div>
          <h4 className="font-bold text-base">Analitik Trafik Real-Time</h4>
          <p className="text-xs text-slate-300">Pantau statistik pembaca, tingkat retensi, dan ekspor laporan klien.</p>
        </div>

        <div
          onClick={() => onNavigateTab('seo')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white space-y-2 hover:scale-[1.01] transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <Globe className="w-5 h-5 text-purple-300" />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Schema.org</span>
          </div>
          <h4 className="font-bold text-base">SEO Optimizer & SERP</h4>
          <p className="text-xs text-purple-200">Audit meta tag, pratinjau hasil pencarian Google & generator JSON-LD.</p>
        </div>
      </div>

      {/* Main Articles Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
          Daftar Semua Artikel Blog ({posts.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Judul Artikel</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Pembaca</th>
                <th className="py-3 px-3">Gaya AI</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-semibold">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold capitalize ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : post.status === 'draft'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {post.viewCount} Dibaca
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
                      {post.aiScore !== undefined && post.aiScore < 20 ? 'Humanized (Natural)' : 'Standard AI'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectPostToEdit(post)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Artikel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
