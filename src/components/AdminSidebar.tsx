import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Share2, 
  BarChart3, 
  Globe2, 
  Tag, 
  LayoutList, 
  FileText, 
  Newspaper, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Flame,
  Users,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { UserProfile } from '../types';

interface AdminSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  darkMode,
  setDarkMode,
  onLogout,
}) => {
  // Auto-collapse sidebar if in 'editor' view for maximum writing space
  const [isCollapsed, setIsCollapsed] = useState(currentTab === 'editor');

  // Sync collapse state when switching to editor view
  useEffect(() => {
    if (currentTab === 'editor') {
      setIsCollapsed(true);
    }
  }, [currentTab]);

  const adminNavItems = [
    { id: 'dashboard', label: 'CMS Redaksi', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor AI', icon: PenTool },
    { id: 'users', label: 'Kelola User & Role', icon: Users },
    { id: 'categories', label: 'Kelola Kategori', icon: Tag },
    { id: 'header-menu', label: 'Kelola Menu Header', icon: LayoutList },
    { id: 'static-pages', label: 'Halaman Statis', icon: FileText },
    { id: 'social', label: 'Otomasi Medsos', icon: Share2 },
    { id: 'analytics', label: 'Analitik Portal', icon: BarChart3 },
    { id: 'seo', label: 'Optimasi SEO', icon: Globe2 },
    { id: 'reader', label: 'Lihat Portal Publik', icon: Newspaper },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex flex-col justify-between p-3 shadow-sm select-none z-30 overflow-y-auto overflow-x-hidden`}>
      
      <div className="space-y-4">
        
        {/* Top Header & Collapse Toggle Button */}
        <div className="flex items-center justify-between gap-1">
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="ERA INSPIRASI CMS"
          >
            <span className="bg-rose-600 text-white font-black text-sm px-2 py-1 rounded-xl shadow-md shadow-rose-600/30 tracking-wider shrink-0">
              ERA
            </span>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  INSPIRASI<span className="text-rose-600">.CMS</span>
                </span>
                <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase mt-0.5">
                  Panel Redaksi
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              title="Kecilkan Sidebar (Hanya Icon)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand Toggle Button when collapsed */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center transition"
            title="Buka Sidebar Penuh"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* Admin Profile Card */}
        <div className={`bg-rose-50/60 dark:bg-slate-800 p-2 rounded-2xl border border-rose-100 dark:border-slate-700 flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500 shrink-0"
            title={user.name}
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-rose-700 dark:text-rose-300 font-extrabold uppercase tracking-wide">Chief Editor</span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Navigation Menu Links */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              MENU KONTROL REDAKSI
            </div>
          )}

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isPublicLink = item.id === 'reader';

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={item.label}
                className={`w-full ${isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-between'} rounded-2xl text-xs font-extrabold transition-all flex items-center group active:scale-95 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : isPublicLink
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-900/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} truncate`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isPublicLink ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400 group-hover:text-rose-600'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        
        {/* Dark Mode Switcher */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? 'Switch ke Mode Terang' : 'Switch ke Mode Gelap'}
          className={`w-full ${isCollapsed ? 'p-2 justify-center' : 'px-3 py-2 justify-between'} rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center border border-slate-200 dark:border-slate-700`}
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            {!isCollapsed && <span className="text-[11px]">{darkMode ? 'Mode Gelap' : 'Mode Terang'}</span>}
          </span>
          {!isCollapsed && <span className="text-[9px] text-slate-400 uppercase font-black">Ubah</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Logout Admin"
          className={`w-full ${isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-center gap-2'} rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md shadow-rose-950/60 transition flex items-center active:scale-95`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {!isCollapsed && (
          <div className="text-center text-[9px] text-slate-500 font-bold tracking-tight">
            EraInspirasi CMS v2.5
          </div>
        )}

      </div>

    </aside>
  );
};

