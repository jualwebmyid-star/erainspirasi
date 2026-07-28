import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  User, 
  Search, 
  CheckCircle2, 
  UserPlus, 
  Edit3, 
  Trash2, 
  X, 
  AlertTriangle,
  Globe,
  Mail,
  Lock
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserManagerProps {
  usersList: UserProfile[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onAddUser?: (user: UserProfile) => void;
  onEditUser?: (user: UserProfile) => void;
  onDeleteUser?: (userId: string) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ 
  usersList, 
  onUpdateUserRole,
  onAddUser,
  onEditUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [notificationMsg, setNotificationMsg] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  // Form States
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    provider: 'google' | 'email';
    avatar: string;
  }>({
    name: '',
    email: '',
    role: 'reader',
    provider: 'google',
    avatar: '',
  });

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, role: UserRole, userName: string) => {
    onUpdateUserRole(userId, role);
    const roleLabel = role === 'admin' ? 'Redaktur / Admin' : role === 'contributor' ? 'Jurnalis / Kontributor' : 'Pengunjung / Reader';
    showToast(`✅ Hak akses ${userName} berhasil diperbarui menjadi ${roleLabel}!`);
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'reader',
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    setShowAddModal(true);
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar: formData.avatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: formData.role,
      provider: formData.provider,
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    setShowAddModal(false);
    showToast(`🎉 User baru "${newUser.name}" berhasil ditambahkan sebagai ${newUser.role.toUpperCase()}!`);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      provider: u.provider === 'email' ? 'email' : 'google',
      avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !formData.name.trim() || !formData.email.trim()) return;

    const updated: UserProfile = {
      ...editingUser,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      provider: formData.provider,
      avatar: formData.avatar.trim() || editingUser.avatar,
    };

    if (onEditUser) {
      onEditUser(updated);
    }
    setEditingUser(null);
    showToast(`✅ Data pengguna "${updated.name}" berhasil diperbarui!`);
  };

  const handleConfirmDeleteUser = () => {
    if (!deletingUser) return;
    if (onDeleteUser) {
      onDeleteUser(deletingUser.id);
    }
    showToast(`🗑️ Pengguna "${deletingUser.name}" ([${deletingUser.email}]) telah berhasil dihapus.`);
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header & Toast Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            <span>Kelola User & Hak Akses Peran</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola pengguna terdaftar dari Google Auth & Akun Email, serta atur peran sebagai Admin, Kontributor/Jurnalis, atau Pengunjung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notificationMsg && (
            <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-2xl shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama / email user..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-bold">
          <span className="text-slate-400">Filter Peran:</span>
          {['all', 'admin', 'contributor', 'reader'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                selectedRoleFilter === r
                  ? 'bg-rose-600 text-white shadow-sm font-extrabold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'Semua' : r === 'admin' ? 'Admin' : r === 'contributor' ? 'Jurnalis' : 'Pengunjung'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Pengguna</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Metode Login</th>
                <th className="py-3 px-3">Peran (Role Akses)</th>
                <th className="py-3 px-3 text-right">Aksi & Pengaturan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 inline-flex items-center gap-1">
                        {u.provider === 'google' ? (
                          <>
                            <Globe className="w-3 h-3 text-indigo-600" />
                            <span>Google Auth</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-indigo-600" />
                            <span>Email System</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : u.role === 'contributor'
                            ? 'bg-amber-500 text-slate-900 shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {u.role === 'admin' ? 'Redaktur / Admin' : u.role === 'contributor' ? 'Jurnalis / Kontributor' : 'Pengunjung / Reader'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, u.name)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px] font-bold outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                        >
                          <option value="admin">Ke Admin / Redaktur</option>
                          <option value="contributor">Ke Jurnalis / Kontributor</option>
                          <option value="reader">Ke Pengunjung / Reader</option>
                        </select>

                        <button
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit Pengguna"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-600 dark:text-slate-300 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingUser(u)}
                          title="Hapus Pengguna"
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit User */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
                <span>{editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleSaveEditUser : handleSaveNewUser} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Email Pengguna</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="budisantoso@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Hak Akses Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="reader">Pengunjung / Reader</option>
                    <option value="contributor">Jurnalis / Kontributor</option>
                    <option value="admin">Redaktur / Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Metode Otentikasi</label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as 'google' | 'email' })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="google">Google Auth</option>
                    <option value="email">Email System</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">URL Avatar Foto Profil (Opsional)</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md transition"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus User */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Konfirmasi Hapus Pengguna
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus pengguna <strong className="text-slate-900 dark:text-white">{deletingUser.name}</strong> (<span className="font-mono">{deletingUser.email}</span>)?
              </p>
              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-1">
                ⚠️ Akun ini dan perannya akan dihapus permanen dari sistem portal.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md transition"
              >
                Ya, Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
