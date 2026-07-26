import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Globe2,
  Menu,
  LayoutGrid,
  X,
  ChevronRight
} from 'lucide-react';
import { UserProfile, HeaderMenuItem, SiteSettings, BlogPost } from '../types';

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
  siteSettings?: SiteSettings;
  posts?: BlogPost[];
  onSelectPost?: (post: BlogPost) => void;
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
  siteSettings,
  posts,
  onSelectPost,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const headlinePosts = posts && posts.length > 0
    ? posts.filter((p) => p.status === 'published')
    : [];

  useEffect(() => {
    if (headlinePosts.length <= 1) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % headlinePosts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [headlinePosts.length]);

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

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('erainspirasi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('erainspirasi_theme', 'light');
    }
    setDarkMode(nextDark);
  };

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
              onClick={handleToggleDarkMode}
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
    <header className="contents">
      
      {/* 1. DESKTOP TOP BAR (Laptop/Desktop Only: hidden lg:block) - Positioned AT THE VERY TOP */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Kamis, 23 Juli 2026</span>
            </span>

            <div className="w-px h-3.5 bg-slate-700" />

            {/* Ticker marquee / headline highlight with vertical sliding Framer Motion animation */}
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap h-6">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1 shadow-xs z-10">
                <Flame className="w-3 h-3 fill-current animate-pulse" />
                HEADLINE
              </span>
              
              <div className="relative h-6 overflow-hidden flex-1">
                <AnimatePresence mode="wait">
                  {headlinePosts.length > 0 && headlinePosts[tickerIndex] ? (
                    <motion.span 
                      key={headlinePosts[tickerIndex].id}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      onClick={() => onSelectPost && onSelectPost(headlinePosts[tickerIndex])}
                      className="absolute inset-0 text-slate-200 hover:text-rose-400 cursor-pointer font-medium truncate h-6 flex items-center transition-colors"
                      title={headlinePosts[tickerIndex].title}
                    >
                      {headlinePosts[tickerIndex].title}
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="fallback-headline-desktop"
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 text-slate-200 font-medium h-6 flex items-center truncate"
                    >
                      Inovasi Mobil Listrik Lokal: Industri Otomotif Nasional Siap Tembus Pasar Global
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 shrink-0 text-xs">
            <span className="text-slate-400 font-medium">{siteSettings?.siteTagline || 'Portal Berita, Edukasi & Inspirasi'}</span>
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <a href={siteSettings?.instagramUrl || "#instagram"} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">IG</a>
              <span className="text-slate-600">•</span>
              <a href={siteSettings?.youtubeUrl || "#youtube"} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">YT</a>
              <span className="text-slate-600">•</span>
              <a href={siteSettings?.twitterUrl || "#x"} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">X</a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STICKY TOP NAVBAR FOR MOBILE & DESKTOP (Menu, Logo, Search, Actions) */}
      <nav className="sticky top-0 z-50 w-full shadow-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Modern Burger Button & Brand Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Sleek Modern Grid Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-600/30 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                title="Menu Utama Portal"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white animate-in spin-in-90 duration-200" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="w-5 h-5 text-white" />
                    <span className="text-[11px] font-black uppercase tracking-wider hidden xs:inline">MENU</span>
                  </div>
                )}
              </button>

              {/* EraInspirasi Brand Logo */}
              <div
                className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
                onClick={() => {
                  setCurrentTab('reader');
                  onSelectCategory('Semua');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', window.location.pathname);
                  }
                }}
              >
                {siteSettings?.logoUrl ? (
                  <img src={siteSettings.logoUrl} alt={siteSettings.siteName || "Logo"} className="h-8 sm:h-11 object-contain" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white font-black text-lg sm:text-xl px-2.5 sm:px-3 py-1 rounded-xl shadow-md shadow-rose-600/30 tracking-wider">
                      ERA
                    </span>
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                        {siteSettings?.siteName || 'INSPIRASI'}
                        <span className="text-rose-600 dark:text-rose-500">.COM</span>
                      </span>
                      <span className="hidden sm:block text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
                        {siteSettings?.siteTagline || 'Portal Berita & Inspirasi Digital'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Desktop Banner Header Sebelah Logo (Desktop Only: lg:flex) */}
            {siteSettings?.headerBanner?.isEnabled && siteSettings?.headerBanner?.imageUrl ? (
              <a
                href={siteSettings.headerBanner.targetUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center justify-center overflow-hidden rounded-2xl w-[580px] xl:w-[728px] h-[95px] xl:h-[115px] border border-slate-200 dark:border-slate-800 shadow-md hover:opacity-95 transition bg-slate-900/5 dark:bg-slate-950/40"
              >
                <img
                  src={siteSettings.headerBanner.imageUrl}
                  alt={siteSettings.headerBanner.altText || 'Banner Header'}
                  className="w-full h-full object-cover sm:object-fill"
                />
              </a>
            ) : (
              <div className="hidden lg:flex items-center justify-between border border-dashed border-rose-300 dark:border-rose-900/80 bg-gradient-to-r from-rose-50/90 via-amber-50/40 to-rose-50/90 dark:from-rose-950/30 dark:via-slate-900 dark:to-rose-950/30 rounded-2xl px-5 py-3 w-[580px] xl:w-[728px] h-[95px] xl:h-[115px] text-xs transition hover:border-rose-500 group cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 bg-rose-600 text-white font-black text-[10px] rounded-lg uppercase tracking-widest shrink-0 shadow-sm">
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
                <span className="hidden xl:inline-block px-3.5 py-2 bg-rose-600 text-white text-[11px] font-extrabold rounded-xl shrink-0 shadow-md group-hover:bg-rose-500 transition">
                  Pasang Iklan →
                </span>
              </div>
            )}

            {/* Right: Actions for Desktop & Mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick Search Trigger (Always Visible on Mobile & Desktop) */}
              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-800 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
                title="Cari Berita"
              >
                <Search className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-rose-600" />
                <span className="hidden sm:inline">Cari Berita</span>
              </button>

              {/* Push Notification Toggle (Desktop Only - Hidden on Mobile HP) */}
              <button
                onClick={onOpenPush}
                className="hidden lg:flex relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                title="Notifikasi Berita"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
                )}
              </button>

              {/* Dark Mode Switcher (Visible on Mobile HP & Desktop for Instant Access) */}
              <button
                onClick={handleToggleDarkMode}
                className="flex p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-transform active:scale-95 shrink-0"
                title={darkMode ? 'Switch Light Mode' : 'Switch Dark Mode'}
              >
                {darkMode ? <Sun className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-slate-700 dark:text-slate-200" />}
              </button>

              {/* Login / Auth Button (Desktop Only - Hidden on Mobile HP) */}
              <button
                onClick={onOpenAuth}
                className="hidden lg:flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all shrink-0 active:scale-95"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{(user.role as string) === 'admin' ? 'Panel Redaksi' : 'Masuk'}</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 3. NON-STICKY BANNER AD FOR MOBILE (Ditaruh dibawah logo/menu sticky) */}
      <div className="lg:hidden w-full bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
        {siteSettings?.headerBanner?.isEnabled && siteSettings?.headerBanner?.imageUrl ? (
          <a
            href={siteSettings.headerBanner.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center overflow-hidden rounded-xl h-[85px] sm:h-[100px] border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-900/5 dark:bg-slate-950/40"
          >
            <img
              src={siteSettings.headerBanner.imageUrl}
              alt={siteSettings.headerBanner.altText || 'Banner Header'}
              className="w-full h-full object-contain"
            />
          </a>
        ) : (
          <div className="w-full flex items-center justify-between border border-dashed border-rose-300 dark:border-rose-900/80 bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-rose-50/90 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/40 rounded-xl p-3 text-xs hover:border-rose-500 cursor-pointer shadow-xs min-h-[72px]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="px-1.5 py-0.5 bg-rose-600 text-white font-black text-[9px] rounded uppercase tracking-wider shrink-0">
                IKLAN UTAMA
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                  Ruang Banner Iklan Utama HP
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                  Pasang Banner Advertorial Full 1 Kolom
                </div>
              </div>
            </div>
            <span className="px-2 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded shrink-0">
              Pasang →
            </span>
          </div>
        )}
      </div>

      {/* 4. MOBILE HEADLINE TICKER BAR (Mobile HP Only: lg:hidden) - Positioned below Sticky Nav & Banner */}
      <div className="lg:hidden bg-slate-900 text-slate-300 text-[11px] py-1.5 px-3 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden h-6">
          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] tracking-wider uppercase shrink-0 flex items-center gap-1 shadow-xs z-10">
            <Flame className="w-3 h-3 fill-current animate-pulse" />
            HEADLINE
          </span>
          <div className="relative h-6 overflow-hidden flex-1">
            <AnimatePresence mode="wait">
              {headlinePosts.length > 0 && headlinePosts[tickerIndex] ? (
                <motion.span 
                  key={headlinePosts[tickerIndex].id}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  onClick={() => onSelectPost && onSelectPost(headlinePosts[tickerIndex])}
                  className="absolute inset-0 text-slate-200 hover:text-rose-400 cursor-pointer font-medium truncate h-6 flex items-center text-[11px] transition-colors"
                  title={headlinePosts[tickerIndex].title}
                >
                  {headlinePosts[tickerIndex].title}
                </motion.span>
              ) : (
                <motion.span 
                  key="fallback-headline-mobile"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 text-slate-200 font-medium h-6 flex items-center truncate text-[11px]"
                >
                  Inovasi Mobil Listrik Lokal: Industri Otomotif Nasional Siap Tembus Pasar Global
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* EraInspirasi Category Bar (Desktop Nav Menu) */}
      <div className="hidden lg:block w-full bg-slate-900 text-white border-b border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          
          <nav className="flex items-center space-x-1 py-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
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

      {/* MENU BURGER SLIDE KIRI (Drawer Overlay Mode HP) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide Left Content Container */}
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300 border-r border-slate-200 dark:border-slate-800">
            
            <div className="p-4 space-y-4 overflow-y-auto">
              
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-black text-sm px-2 py-1 rounded-lg">
                    ERA
                  </span>
                  <span className="font-black text-base tracking-tight uppercase">
                    INSPIRASI<span className="text-rose-600">.COM</span>
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-5 h-5 text-rose-600" />
                </button>
              </div>

              {/* Mobile Quick Controls Bar inside Drawer (Masuk, Mode Dark, Notifikasi) */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
                  PENGATURAN & AKUN
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleDarkMode}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs hover:border-rose-500 transition"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenPush();
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs hover:border-rose-500 transition"
                  >
                    <Bell className="w-4 h-4 text-rose-600" />
                    <span>Notifikasi</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>{(user.role as string) === 'admin' ? 'Masuk Panel Redaksi' : 'Masuk / Daftar Akun'}</span>
                </button>
              </div>

              {/* Menu Categories List */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  KATEGORI BERITA & INSPIRASI
                </div>

                {categories.map((cat) => {
                  const isActive = currentTab === 'reader' && (selectedCategory === cat || (cat === 'Beranda' && selectedCategory === 'Semua'));
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setCurrentTab('reader');
                        onSelectCategory(cat === 'Beranda' ? 'Semua' : cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between uppercase tracking-wide transition ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-md font-black'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Drawer Bottom Info */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-2">
              <button
                onClick={() => {
                  onOpenSearch();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Cari Berita Portal</span>
              </button>
              <div className="text-[10px] text-center text-slate-400 font-medium">
                © 2026 EraInspirasi.com • All Rights Reserved
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

