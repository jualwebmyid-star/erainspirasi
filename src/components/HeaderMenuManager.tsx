import React, { useState } from 'react';
import { LayoutList, Plus, Trash2, Edit3, Save, X, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { HeaderMenuItem, CategoryItem, StaticPageItem } from '../types';

interface HeaderMenuManagerProps {
  menuItems: HeaderMenuItem[];
  categories: CategoryItem[];
  staticPages: StaticPageItem[];
  onAddMenuItem: (item: HeaderMenuItem) => void;
  onUpdateMenuItem: (item: HeaderMenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export const HeaderMenuManager: React.FC<HeaderMenuManagerProps> = ({
  menuItems,
  categories,
  staticPages,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'category' | 'page' | 'custom'>('custom');
  const [targetId, setTargetId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newItem: HeaderMenuItem = {
      id: `menu-${Date.now()}`,
      label: label.trim(),
      url: url.trim() || '#',
      type,
      targetId,
      order: menuItems.length + 1,
      isVisible: true,
    };

    onAddMenuItem(newItem);
    setLabel('');
    setUrl('');
    setType('custom');
    setTargetId('');
    setIsAdding(false);
  };

  const handleToggleVisibility = (item: HeaderMenuItem) => {
    onUpdateMenuItem({
      ...item,
      isVisible: !item.isVisible,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <LayoutList className="w-6 h-6 text-indigo-500" />
            <span>Kelola Menu Navigasi Header</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Atur link tautan menu horizontal publik, urutan tampil, serta tautan ke halaman statis & kategori.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setLabel('');
            setUrl('');
          }}
          className="px-4 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Tambah Menu Header Baru'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-slate-900 text-white border border-indigo-900/60 shadow-xl space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-indigo-400 uppercase tracking-wide">
              Form Tambah Menu Header Navigasi Baru
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tipe Menu</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                <option value="custom">Tautan Kustom / External URL</option>
                <option value="category">Kategori Artikel</option>
                <option value="page">Halaman Statis (About/Contact/Policy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Label Menu Tampil *</label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Tentang Kami / Tekno & Gadget"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tautan URL / Slug</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Contoh: /p/tentang-kami"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Menu Header</span>
            </button>
          </div>
        </form>
      )}

      {/* Menu Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
          Daftar Urutan Menu Header Publik ({menuItems.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Urutan</th>
                <th className="py-3 px-3">Label Menu</th>
                <th className="py-3 px-3">Tipe Tautan</th>
                <th className="py-3 px-3">URL / Target</th>
                <th className="py-3 px-3">Visibilitas</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {menuItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase text-[10px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 truncate max-w-xs">
                    {item.url}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleVisibility(item)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition ${
                        item.isVisible
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.isVisible ? 'Tampil' : 'Tersembunyi'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteMenuItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Hapus Menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
