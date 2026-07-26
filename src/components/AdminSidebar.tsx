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
  ChevronDown,
  ChevronLeft,
  ShieldCheck,
  Flame,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
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

  const isSettingsSubmenuActive = ['settings', 'social', 'seo', 'header-menu', 'users'].includes(currentTab);
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsSubmenuActive);

  // Sync collapse state when switching to editor view
  useEffect(() => {
    if (currentTab === 'editor') {
      setIsCollapsed(true);
    }
  }, [currentTab]);

  useEffect(() => {
    if (isSettingsSubmenuActive) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsSubmenuActive]);

  const mainNavItems = [
    { id: 'dashboard', label: 'CMS Redaksi', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor AI', icon: PenTool },
    { id: 'categories', label: 'Kelola Kategori', icon: Tag },
    { id: 'static-pages', label: 'Halaman Statis', icon: FileText },
    { id: 'analytics', label: 'Analitik Portal', icon: BarChart3 },
  ];

  const settingsSubmenuItems = [
    { id: 'settings', label: 'Setting Portal dan API', icon: Settings },
    { id: 'social', label: 'Otomatisasi Medsos', icon: Share2 },
    { id: 'seo', label: 'Optimasi SEO', icon: Globe2 },
    { id: 'header-menu', label: 'Kelola Menu Header', icon: LayoutList },
    { id: 'users', label: 'Kelola User dan Role', icon: Users },
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

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={item.label}
                className={`w-full ${isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-between'} rounded-2xl text-xs font-extrabold transition-all flex items-center group active:scale-95 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} truncate`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-rose-600'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
              </button>
            );
          })}

          {/* GROUP MENU: PENGATURAN PORTAL */}
          <div className="pt-2">
            {!isCollapsed ? (
              <div className="space-y-1">
                <button
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  className={`w-full px-3 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between group ${
                    isSettingsSubmenuActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Settings className={`w-4 h-4 shrink-0 ${isSettingsSubmenuActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate uppercase tracking-wide text-[11px]">Pengaturan Portal</span>
                  </div>
                  {isSettingsOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  )}
                </button>

                {/* Submenus List */}
                {isSettingsOpen && (
                  <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3.5 my-1">
                    {settingsSubmenuItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => setCurrentTab(sub.id)}
                          title={sub.label}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group active:scale-95 ${
                            isSubActive
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-600'}`} />
                            <span className="truncate text-[11px]">{sub.label}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 shrink-0 ${isSubActive ? 'text-white' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Collapsed Sidebar View for Settings Submenus */
              <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                {settingsSubmenuItems.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = currentTab === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCurrentTab(sub.id)}
                      title={sub.label}
                      className={`w-full p-2.5 justify-center rounded-2xl text-xs font-extrabold transition-all flex items-center active:scale-95 ${
                        isSubActive
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PUBLIC READER LINK */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentTab('reader')}
              title="Lihat Portal Publik"
              className={`w-full ${isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-between'} rounded-2xl text-xs font-extrabold transition-all flex items-center group active:scale-95 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-900/40`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} truncate`}>
                <Newspaper className="w-4 h-4 shrink-0 text-rose-600" />
                {!isCollapsed && <span className="truncate">Lihat Portal Publik</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 text-rose-400" />
              )}
            </button>
          </div>

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

