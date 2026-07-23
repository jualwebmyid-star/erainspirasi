import React from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  User,
  Calendar, 
  Flame, 
  LogOut,
  Globe2
} from 'lucide-react';
import { UserProfile, HeaderMenuItem } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenPush: () => void;
  onOpenSearch: () => void;
  onLogout?: () => void;
  unreadNotificationsCount: number;
  categoriesList?: string[];
  headerMenuItems?: HeaderMenuItem[];
  onOpenStaticPage?: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedCategory,
  onSelectCategory,
  darkMode,
  setDarkMode,
  user,
  onOpenAuth,
  onOpenPush,
  onOpenSearch,
  onLogout,
  unreadNotificationsCount,
  categoriesList,
  headerMenuItems,
  onOpenStaticPage,
}) => {
  const defaultCategories = [
    'Beranda',
    'Tekno & Gadget',
    'Inspirasi',
    'Bisnis & UMKM',
    'Edukasi & Karir',
    'Gaya Hidup',
    'Nasional',
    'Otomotif'
  ];

  const categories = categoriesList && categoriesList.length > 0 ? categoriesList : defaultCategories;

  // IF LOGGED IN AS ADMIN: Render Clean Admin Top Info Bar (No top tabs; left sidebar handles navigation)
  if (user.role === 'admin') {
    return (
      <header className="sticky top-0 z-20 w-full shadow-md bg-slate-900 text-white border-b border-rose-900/60">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Panel Redaksi Digital Active
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              User: <strong className="text-white">{user.name}</strong> ({user.email})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
              title="Cari Berita"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cari</span>
            </button>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Ubah Mode Tampilan"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md transition active:scale-95 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // PUBLIC FRONTEND HEADER (For Readers & Non-Admins)
  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-900 transition-colors duration-200">
      
      {/* EraInspirasi Top Date & Breaking News Ticker Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Kamis, 23 Juli 2026</span>
            </span>

            <div className="hidden sm:block w-px h-3 bg-slate-700" />

            {/* Ticker marquee / headline highlight */}
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                HEADLINE
              </span>
              <span className="text-slate-200 hover:text-rose-400 cursor-pointer font-medium truncate">
                Inovasi Mobil Listrik Lokal: Industri Otomotif Nasional Siap Tembus Pasar Global
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">Portal Berita, Edukasi & Inspirasi</span>
            <div className="flex items-center gap-2">
              <a href="#instagram" className="hover:text-rose-400 transition">IG</a>
              <span>•</span>
              <a href="#youtube" className="hover:text-rose-400 transition">YT</a>
              <span>•</span>
              <a href="#x" className="hover:text-rose-400 transition">X</a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Header Bar: Logo + Header Banner Ad Spot (728x90) */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* EraInspirasi Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => {
                setCurrentTab('reader');
                onSelectCategory('Beranda');
              }}
            >
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white font-black text-xl px-3 py-1.5 rounded-xl shadow-md shadow-rose-600/30 tracking-wider">
                  ERA
                </span>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                    INSPIRASI
                    <span className="text-rose-600 dark:text-rose-500">.COM</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
                    Portal Berita & Inspirasi Digital
                  </span>
                </div>
              </div>
            </div>

            {/* Tempat Pasang Banner di Header Sebelah Logo (Leaderboard Ad 728x90) */}
            <div className="hidden lg:flex items-center justify-between border border-dashed border-rose-300 dark:border-rose-900/80 bg-gradient-to-r from-rose-50/90 via-amber-50/40 to-rose-50/90 dark:from-rose-950/30 dark:via-slate-900 dark:to-rose-950/30 rounded-2xl px-4 py-2 w-[520px] xl:w-[640px] h-[64px] text-xs transition hover:border-rose-500 group cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-rose-600 text-white font-black text-[10px] rounded-lg uppercase tracking-widest shrink-0 shadow-sm">
                  IKLAN 728x90
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition line-clamp-1">
                    Ruang Iklan Banner Header Sebelah Logo
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    Hubungi Redaksi EraInspirasi untuk Kerjasama Banner & Advertorial
                  </div>
                </div>
              </div>
              <span className="hidden xl:inline-block px-3 py-1.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-xl shrink-0 shadow-md group-hover:bg-rose-500 transition">
                Pasang Iklan →
              </span>
            </div>

            {/* Action Tools & User Profile */}
            <div className="flex items-center gap-2">
              
              {/* Quick Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition flex items-center gap-2 text-xs font-bold"
                title="Cari Berita"
              >
                <Search className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Cari Berita</span>
              </button>

              {/* Push Notification Toggle */}
              <button
                onClick={onOpenPush}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                title="Notifikasi Berita"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
                )}
              </button>

              {/* Dark Mode Switcher */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-transform active:scale-95"
                title={darkMode ? 'Switch Light Mode' : 'Switch Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Login / Auth Button */}
              <button
                onClick={onOpenAuth}
                className="ml-1 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all shrink-0 active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>{(user.role as string) === 'admin' ? 'Panel Redaksi' : 'Masuk'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* EraInspirasi Category Bar (Horizontal Nav Menu) */}
      <div className="w-full bg-slate-900 text-white border-b border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          
          <nav className="flex items-center space-x-1 py-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
            {/* If custom header menu items exist, render them */}
            {headerMenuItems && headerMenuItems.length > 0 ? (
              headerMenuItems.filter(m => m.isVisible).map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => {
                    if (menu.type === 'page' && menu.url.startsWith('/p/') && onOpenStaticPage) {
                      const slug = menu.url.replace('/p/', '');
                      onOpenStaticPage(slug);
                    } else {
                      setCurrentTab('reader');
                      onSelectCategory(menu.label === 'Beranda' ? 'Semua' : menu.label);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all uppercase tracking-wide text-slate-300 hover:text-white hover:bg-slate-800`}
                >
                  {menu.label}
                </button>
              ))
            ) : (
              categories.map((cat) => {
                const isActive = currentTab === 'reader' && (selectedCategory === cat || (cat === 'Beranda' && selectedCategory === 'Semua'));
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCurrentTab('reader');
                      onSelectCategory(cat === 'Beranda' ? 'Semua' : cat);
                    }}
                    className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all uppercase tracking-wide ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-extrabold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })
            )}
          </nav>

        </div>
      </div>
    </header>
  );
};
