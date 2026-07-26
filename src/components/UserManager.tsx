import React, { useState } from 'react';
import { Users, ShieldCheck, User, PenTool, Search, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserManagerProps {
  usersList: UserProfile[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ usersList, onUpdateUserRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, role: UserRole) => {
    onUpdateUserRole(userId, role);
    setSaveSuccessMsg(`Peran pengguna berhasil diperbarui ke ${role.toUpperCase()}!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            <span>Manajemen User & Hak Akses Peran</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola pengguna terdaftar dari Google Auth & Akun Email, dan atur peran sebagai Admin, Kontributor/Jurnalis, atau Pembaca.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
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
              {r === 'all' ? 'Semua' : r}
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
                <th className="py-3 px-3 text-right">Aksi Pengaturan Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {u.email}
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {u.provider === 'google' ? '🌐 Google Auth' : u.provider === 'email' ? '📧 Email & Password' : u.provider}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : u.role === 'contributor'
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {u.role === 'admin' ? 'Redaktur / Admin' : u.role === 'contributor' ? 'Jurnalis / Kontributor' : 'Pengunjung / Reader'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                    >
                      <option value="admin">Ubah ke Admin / Redaktur</option>
                      <option value="contributor">Ubah ke Kontributor / Jurnalis</option>
                      <option value="reader">Ubah ke Pengunjung / Reader</option>
                    </select>
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
