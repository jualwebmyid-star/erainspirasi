import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit3, Save, X, FolderPlus, CheckCircle, LayoutGrid, Copy, Check, ExternalLink } from 'lucide-react';
import { CategoryItem } from '../types';

interface CategoryManagerProps {
  categories: CategoryItem[];
  onAddCategory: (cat: CategoryItem) => void;
  onUpdateCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
  onSelectCategoryToView?: (categoryName: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSelectCategoryToView,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('bg-rose-600 text-white');
  const [formLocation, setFormLocation] = useState<'header' | 'footer' | 'both'>('both');

  const colorOptions = [
    { label: 'Rose Red', value: 'bg-rose-600 text-white' },
    { label: 'Indigo Blue', value: 'bg-indigo-600 text-white' },
    { label: 'Emerald Green', value: 'bg-emerald-600 text-white' },
    { label: 'Amber Yellow', value: 'bg-amber-500 text-slate-900' },
    { label: 'Purple Violet', value: 'bg-purple-600 text-white' },
    { label: 'Cyan Teal', value: 'bg-cyan-600 text-white' },
    { label: 'Slate Dark', value: 'bg-slate-800 text-white' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: formName.trim(),
      slug: formSlug.trim() || formName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: formDesc.trim() || 'Kategori artikel berita dan inspirasi',
      articleCount: 0,
      color: formColor,
      location: formLocation,
    };

    onAddCategory(newCat);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormLocation('both');
    setIsAdding(false);
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description);
    setFormColor(cat.color);
    setFormLocation(cat.location || 'both');
  };

  const handleSaveEdit = (catId: string) => {
    const existing = categories.find((c) => c.id === catId);
    if (!existing) return;

    onUpdateCategory({
      ...existing,
      name: formName.trim(),
      slug: formSlug.trim() || formName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: formDesc.trim(),
      color: formColor,
      location: formLocation,
    });

    setEditingId(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormLocation('both');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-6 h-6 text-rose-600" />
            <span>Kelola Kategori & Penempatan Tampilan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Atur nama kategori berita dan tentukan di mana kategori akan ditampilkan (Header Navigasi, Footer, atau Keduanya).
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormName('');
            setFormSlug('');
            setFormDesc('');
            setFormLocation('both');
          }}
          className="px-4 py-2.5 rounded-2xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Tambah Kategori Baru'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal Box */}
      {(isAdding || editingId) && (
        <form
          onSubmit={(e) => {
            if (editingId) {
              e.preventDefault();
              handleSaveEdit(editingId);
            } else {
              handleCreate(e);
            }
          }}
          className="p-6 rounded-3xl bg-slate-900 text-white border border-rose-900/60 shadow-xl space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-rose-400 flex items-center gap-2 uppercase tracking-wide">
              <FolderPlus className="w-4 h-4" />
              <span>{editingId ? 'Edit Kategori & Penempatan' : 'Form Tambah Kategori Baru'}</span>
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
              <label className="block text-xs font-bold text-slate-300 mb-1">Nama Kategori *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editingId) {
                    setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="Contoh: Otomotif & Wisata"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Slug URL</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="otomotif-wisata"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Deskripsi Singkat</label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Penjelasan ringkas liputan berita di kategori ini"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Penempatan Menu (Header vs Footer vs Both) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4" />
              <span>Lokasi Penempatan Kategori Di Website:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFormLocation('header')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  formLocation === 'header'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                 Header Navigasi
              </button>
              <button
                type="button"
                onClick={() => setFormLocation('footer')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  formLocation === 'footer'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                 Footer Saja
              </button>
              <button
                type="button"
                onClick={() => setFormLocation('both')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  formLocation === 'both'
                    ? 'border-rose-500 bg-rose-950 text-white font-extrabold shadow'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Keduanya (Header & Footer)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Warna Badge Kategori</label>
            <div className="flex flex-wrap items-center gap-2">
              {colorOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setFormColor(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${opt.value} ${
                    formColor === opt.value ? 'ring-2 ring-white scale-105 shadow' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {formColor === opt.value && <CheckCircle className="w-3 h-3" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
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
              <span>{editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Compact Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const permalinkUrl = `${window.location.origin}/?category=${encodeURIComponent(cat.name)}`;
          const isCopied = copiedSlug === cat.id;

          const handleCopyPermalink = () => {
            navigator.clipboard.writeText(permalinkUrl);
            setCopiedSlug(cat.id);
            setTimeout(() => setCopiedSlug(null), 2500);
          };

          return (
            <div
              key={cat.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-2 hover:border-rose-400 dark:hover:border-rose-600 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${cat.color}`}>
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                    {cat.articleCount} Artikel
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {cat.location === 'header' ? '📌 Header Nav' : cat.location === 'footer' ? '🦶 Footer' : '⚡ Header & Footer'}
                  </span>
                  <span className="font-mono text-slate-400 truncate max-w-[120px]">
                    /?cat={cat.slug}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                  "{cat.description || 'Kategori Berita'}"
                </p>
              </div>

              {/* Action Bar & Permalink Copy */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyPermalink}
                    className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600'
                    }`}
                    title="Salin Permalink Kategori"
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>

                  {onSelectCategoryToView && (
                    <button
                      type="button"
                      onClick={() => onSelectCategoryToView(cat.name)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition"
                      title="Lihat Tampilan Kategori"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Kategori"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
