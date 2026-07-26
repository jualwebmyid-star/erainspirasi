import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit3, Save, X, Eye, ShieldCheck, LayoutGrid, Copy, Check, ExternalLink } from 'lucide-react';
import { StaticPageItem } from '../types';

interface StaticPageManagerProps {
  staticPages: StaticPageItem[];
  onAddPage: (page: StaticPageItem) => void;
  onUpdatePage: (page: StaticPageItem) => void;
  onDeletePage: (id: string) => void;
  onViewPagePublic?: (slug: string) => void;
}

export const StaticPageManager: React.FC<StaticPageManagerProps> = ({
  staticPages,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onViewPagePublic,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [location, setLocation] = useState<'header' | 'footer' | 'both'>('footer');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPage: StaticPageItem = {
      id: `page-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || title.trim().toLowerCase().replace(/\s+/g, '-'),
      content: content.trim() || '# ' + title + '\n\nIsi konten halaman statis belum diisi.',
      metaDescription: metaDescription.trim() || `Halaman resmi ${title} portal EraInspirasi.com`,
      updatedAt: '23 Juli 2026',
      isPublished: true,
      location: location,
    };

    onAddPage(newPage);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaDescription('');
    setLocation('footer');
    setIsAdding(false);
  };

  const handleStartEdit = (page: StaticPageItem) => {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setMetaDescription(page.metaDescription);
    setLocation(page.location || 'footer');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    const existing = staticPages.find((p) => p.id === editingId);
    if (!existing) return;

    onUpdatePage({
      ...existing,
      title: title.trim(),
      slug: slug.trim() || title.trim().toLowerCase().replace(/\s+/g, '-'),
      content: content.trim(),
      metaDescription: metaDescription.trim(),
      updatedAt: '23 Juli 2026',
      location: location,
    });

    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaDescription('');
    setLocation('footer');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-600" />
            <span>Kelola Halaman Statis & Penempatan Tampilan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buat & sunting halaman legalitas, Tentang Kami, Kebijakan Privasi, serta atur penempatan di Header atau Footer.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setTitle('');
            setSlug('');
            setContent('');
            setMetaDescription('');
            setLocation('footer');
          }}
          className="px-4 py-2.5 rounded-2xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Buat Halaman Statis Baru'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal Box */}
      {(isAdding || editingId) && (
        <form
          onSubmit={editingId ? handleSaveEdit : handleCreate}
          className="p-6 rounded-3xl bg-slate-900 text-white border border-rose-900/60 shadow-xl space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-rose-400 uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{editingId ? 'Edit Halaman Statis' : 'Form Buat Halaman Statis Baru'}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Judul Halaman *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="Contoh: Tentang Kami / Kebijakan Privasi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="tentang-kami"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none font-mono"
              />
            </div>
          </div>

          {/* Penempatan Menu Halaman Statis (Header / Footer / Both) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4" />
              <span>Lokasi Penempatan Halaman Statis:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLocation('header')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  location === 'header'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📌 Header Navigasi
              </button>
              <button
                type="button"
                onClick={() => setLocation('footer')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  location === 'footer'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🦶 Footer Saja
              </button>
              <button
                type="button"
                onClick={() => setLocation('both')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  location === 'both'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Keduanya (Header & Footer)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Meta Deskripsi SEO</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Deskripsi singkat halaman untuk hasil pencarian Google"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Konten Halaman (Format Markdown/Teks)</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis detail syarat ketentuan, kebijakan privasi, atau profil redaksi..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Halaman'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Pages Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {staticPages.map((page) => {
          const permalinkUrl = `${window.location.origin}/?page=${page.slug}`;
          const isCopied = copiedSlug === page.id;

          const handleCopyPermalink = () => {
            navigator.clipboard.writeText(permalinkUrl);
            setCopiedSlug(page.id);
            setTimeout(() => setCopiedSlug(null), 2500);
          };

          return (
            <div
              key={page.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-400 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    /?page={page.slug}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {page.updatedAt}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                  {page.title}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {page.location === 'header' ? '📌 Header Nav' : page.location === 'both' ? '⚡ Header & Footer' : '🦶 Footer Saja'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {page.metaDescription}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyPermalink}
                    className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600'
                    }`}
                    title="Salin Permalink Halaman Statis"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin!' : 'Salin Permalink'}</span>
                  </button>

                  {onViewPagePublic && (
                    <button
                      onClick={() => onViewPagePublic(page.slug)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1"
                      title="Lihat Tampilan Publik"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-500" />
                      <span className="hidden sm:inline">Lihat</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(page)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Halaman"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeletePage(page.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Hapus Halaman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
