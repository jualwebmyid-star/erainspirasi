import React, { useState } from 'react';
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
  Sparkles,
  Download,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BlogPost, Comment } from '../types';
import { WordPressImporter } from './WordPressImporter';

interface CmsDashboardProps {
  posts: BlogPost[];
  comments: Comment[];
  onSelectPostToEdit: (post: BlogPost) => void;
  onSelectPostToRead?: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onRestorePost?: (id: string) => void;
  onPermanentDeletePost?: (id: string) => void;
  onNavigateTab: (tab: 'editor' | 'social' | 'analytics' | 'seo') => void;
  onImportWpPosts?: (posts: BlogPost[]) => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  posts,
  comments,
  onSelectPostToEdit,
  onSelectPostToRead,
  onDeletePost,
  onRestorePost,
  onPermanentDeletePost,
  onNavigateTab,
  onImportWpPosts,
}) => {
  const [showWpImporterModal, setShowWpImporterModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'trash'>('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const trashCount = posts.filter((p) => p.status === 'trash').length;
  const totalViews = posts.reduce((sum, p) => sum + (p.status !== 'trash' ? p.viewCount : 0), 0);

  const handleFilterChange = (filter: 'all' | 'published' | 'draft' | 'scheduled' | 'trash') => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const displayedPosts = posts.filter((p) => {
    if (statusFilter === 'all') return p.status !== 'trash';
    return p.status === statusFilter;
  });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(displayedPosts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = displayedPosts.slice(startIndex, startIndex + itemsPerPage);

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
            Pusat kontrol manajemen artikel, draf AI, jadwal rilis, moderasi komentar, dan kotak sampah.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowWpImporterModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Import dari WordPress</span>
          </button>

          <button
            onClick={() => onNavigateTab('editor')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tulis Artikel / Draf AI Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div 
          onClick={() => setStatusFilter('published')}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 hover:border-emerald-500 transition"
        >
          <div className="text-[10px] font-extrabold text-emerald-600 uppercase">Dipublikasikan</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{publishedCount} Artikel</div>
        </div>

        <div 
          onClick={() => setStatusFilter('draft')}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 hover:border-amber-500 transition"
        >
          <div className="text-[10px] font-extrabold text-amber-500 uppercase">Draf Penulisan</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{draftCount} Draf</div>
        </div>

        <div 
          onClick={() => setStatusFilter('scheduled')}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 hover:border-indigo-500 transition"
        >
          <div className="text-[10px] font-extrabold text-indigo-500 uppercase">Rilis Terjadwal</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{scheduledCount} Artikel</div>
        </div>

        <div 
          onClick={() => setStatusFilter('trash')}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 hover:border-rose-500 transition"
        >
          <div className="text-[10px] font-extrabold text-rose-500 uppercase">🗑️ Sampah (Trash)</div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400">{trashCount} Artikel</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase">Total Dibaca</div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{totalViews.toLocaleString('id-ID')}</div>
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

      {/* Main Articles Table with Status Tabs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Daftar Artikel Portal ({displayedPosts.length})
          </h3>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua Artikel ({posts.filter((p) => p.status !== 'trash').length})
            </button>
            <button
              onClick={() => handleFilterChange('published')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'published'
                  ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dipublikasikan ({publishedCount})
            </button>
            <button
              onClick={() => handleFilterChange('draft')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'draft'
                  ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Draf ({draftCount})
            </button>
            <button
              onClick={() => handleFilterChange('scheduled')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'scheduled'
                  ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Terjadwal ({scheduledCount})
            </button>
            <button
              onClick={() => handleFilterChange('trash')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'trash'
                  ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🗑️ Sampah ({trashCount})
            </button>
          </div>
        </div>

        {displayedPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Tidak ada artikel dengan status "{statusFilter}".
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-3">Judul Artikel</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Status & Tanggal</th>
                    <th className="py-3 px-3">Pembaca</th>
                    <th className="py-3 px-3 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedPosts.map((post, index) => {
                    const rowNumber = startIndex + index + 1;
                    return (
                      <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-400 text-center">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 max-w-xs">
                          <div className="truncate" title={post.title}>{post.title}</div>
                          {post.scheduledAt && post.status === 'scheduled' && (
                            <div className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>Jadwal: {new Date(post.scheduledAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-semibold">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`w-fit px-2.5 py-0.5 rounded-full font-bold capitalize ${
                                post.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : post.status === 'draft'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : post.status === 'trash'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              }`}
                            >
                              {post.status === 'trash' ? '🗑️ Sampah' : post.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID') : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {post.viewCount} Dibaca
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.status === 'trash' ? (
                              <>
                                {/* Tombol Pulihkan (Restore) */}
                                <button
                                  onClick={() => onRestorePost && onRestorePost(post.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 transition"
                                  title="Pulihkan Artikel dari Sampah"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Pulihkan</span>
                                </button>

                                {/* Tombol Hapus Permanen */}
                                <button
                                  onClick={() => onPermanentDeletePost && onPermanentDeletePost(post.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 transition"
                                  title="Hapus Artikel Secara Permanen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus Permanen</span>
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Tombol Lihat Artikel */}
                                <button
                                  onClick={() => onSelectPostToRead && onSelectPostToRead(post)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-emerald-600 dark:text-slate-200 font-extrabold text-xs flex items-center gap-1 transition active:scale-95"
                                  title="Lihat Artikel di Reader Portal"
                                >
                                  <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span className="hidden sm:inline">Lihat</span>
                                </button>

                                {/* Tombol Edit */}
                                <button
                                  onClick={() => onSelectPostToEdit(post)}
                                  className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                  title="Edit Artikel"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Tombol Trash */}
                                <button
                                  onClick={() => onDeletePost(post.id)}
                                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                  title="Pindahkan ke Sampah (Trash)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>
                  Menampilkan <strong>{displayedPosts.length > 0 ? startIndex + 1 : 0}</strong> - <strong>{Math.min(startIndex + itemsPerPage, displayedPosts.length)}</strong> dari <strong>{displayedPosts.length}</strong> artikel
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value={5}>5 / hal</option>
                  <option value={10}>10 / hal</option>
                  <option value={20}>20 / hal</option>
                  <option value={50}>50 / hal</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl font-bold transition text-xs ${
                      currentPage === page
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WordPress Importer Modal */}
      {showWpImporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl my-8">
            <WordPressImporter
              onClose={() => setShowWpImporterModal(false)}
              onImportPosts={(importedPosts) => {
                if (onImportWpPosts) {
                  onImportWpPosts(importedPosts);
                }
                setShowWpImporterModal(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
