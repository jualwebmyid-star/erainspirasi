import React, { useState } from 'react';
import { 
  Home, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  FileText, 
  Trash2, 
  Eye, 
  Settings, 
  Share2, 
  BarChart3, 
  Globe2, 
  Bot, 
  Zap, 
  TrendingUp, 
  Users, 
  Radio, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BlogPost, AnalyticsData, SiteSettings } from '../types';
import { WordPressImporter } from './WordPressImporter';

interface AdminHomeDashboardProps {
  posts: BlogPost[];
  analytics: AnalyticsData;
  siteSettings: SiteSettings;
  onNavigateTab: (tab: any) => void;
  onImportWpPosts?: (posts: BlogPost[]) => void;
  onTriggerAutoPostNow?: () => void;
  onForcePublishAllScheduled?: () => void;
  autoPilotEnabled?: boolean;
}

export const AdminHomeDashboard: React.FC<AdminHomeDashboardProps> = ({
  posts,
  analytics,
  siteSettings,
  onNavigateTab,
  onImportWpPosts,
  onTriggerAutoPostNow,
  onForcePublishAllScheduled,
  autoPilotEnabled = true,
}) => {
  const [showWpImporterModal, setShowWpImporterModal] = useState(false);

  // Metric counts
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const trashCount = posts.filter((p) => p.status === 'trash').length;
  const totalViews = posts.reduce((sum, p) => {
    if (p.status === 'trash') return sum;
    const views = Number(p.viewCount);
    return sum + (isNaN(views) ? 0 : views);
  }, 0);

  // Traffic history data for Chart
  const trafficData = analytics?.trafficHistory || [
    { date: 'Senin', pageviews: 12500, visitors: 4200, socialClicks: 890 },
    { date: 'Selasa', pageviews: 18400, visitors: 6100, socialClicks: 1200 },
    { date: 'Rabu', pageviews: 24200, visitors: 8300, socialClicks: 1650 },
    { date: 'Kamis', pageviews: 21000, visitors: 7400, socialClicks: 1420 },
    { date: 'Jumat', pageviews: 29800, visitors: 9800, socialClicks: 2100 },
    { date: 'Sabtu', pageviews: 35400, visitors: 11200, socialClicks: 2800 },
    { date: 'Minggu', pageviews: 42100, visitors: 14500, socialClicks: 3400 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      
      {/* 1. Header Title & Quick Shortcut Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Beranda Redaksi & Portal Control Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pusat navigasi utama, ringkasan statistik pembaca, otomatisasi posting AI, dan kontrol cepat portal.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Menu Shortcuts Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWpImporterModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center gap-1.5 active:scale-95"
            title="Import konten dari WordPress REST API"
          >
            <Download className="w-4 h-4" />
            <span>Import WP</span>
          </button>

          <button
            onClick={() => onNavigateTab('editor')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition flex items-center gap-1.5 active:scale-95"
            title="Buka Editor AI untuk menulis artikel baru"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tulis Artikel</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
            title="Setting Portal & API Gemini/OpenAI"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Setting Portal & API</span>
          </button>

          <button
            onClick={() => onNavigateTab('social')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
            title="Syndication & Otomatisasi Medsos"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Syndication</span>
          </button>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
            title="Analitik Trafik Portal"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Analitik</span>
          </button>

          <button
            onClick={() => onNavigateTab('seo')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
            title="Optimasi SEO & Google Indexing"
          >
            <Globe2 className="w-4 h-4 text-rose-400" />
            <span>SEO</span>
          </button>
        </div>
      </div>

      {/* 2. Auto-Pilot AI Auto-Poster Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/30 text-amber-300 border border-indigo-500/40 shrink-0">
            <Bot className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                🤖 Auto-Pilot AI Auto-Poster System:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                autoPilotEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}>
                {autoPilotEnabled ? '🟢 AKTIF OTOMATIS' : '🔴 NONAKTIF'}
              </span>
              {scheduledCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{scheduledCount} Terjadwal Menunggu</span>
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-indigo-200 mt-0.5">
              Sistem AI berjalan otomatis menghasilkan artikel berita berkala tanpa klik manual. Artikel terjadwal otomatis dipublikasikan secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto flex-wrap">
          {scheduledCount > 0 && onForcePublishAllScheduled && (
            <button
              onClick={onForcePublishAllScheduled}
              className="px-3.5 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-600 transition active:scale-95"
              title="Rilis semua artikel terjadwal detik ini juga"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Rilis Semua Terjadwal ({scheduledCount})</span>
            </button>
          )}

          {onTriggerAutoPostNow && (
            <button
              onClick={onTriggerAutoPostNow}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
              title="Generate & Terbitkan 1 Artikel AI otomatis detik ini juga tanpa klik di editor"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>⚡ Auto-Post AI Now (1-Click)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Semua Card Metric: Publikasi, Draft, Terjadwal, Sampah, Total Baca */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Artikel Dipublikasikan */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Publikasi</span>
            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{publishedCount} Artikel</div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <span>Live di Halaman Depan</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Draft Artikel */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Draft</span>
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{draftCount} Artikel</div>
          <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <span>Siap Edite & Revisi</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Artikel Terjadwal */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Jadwal Rilis</span>
            <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{scheduledCount} Artikel</div>
          <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
            <span>Auto-Publish Timed</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Sampah Artikel */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sampah</span>
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{trashCount} Artikel</div>
          <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
            <span>Arsip / Hapus Dihapus</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 5: Total Baca / Total Views */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-700 shadow-md hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-300 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Baca</span>
            <Eye className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            {totalViews >= 1000000 
              ? `${(totalViews / 1000000).toFixed(1)}M` 
              : totalViews >= 1000 
              ? `${(totalViews / 1000).toFixed(1)}K` 
              : totalViews}
          </div>
          <div className="text-[10px] font-semibold text-indigo-200 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Akumulasi Pembaca Portal</span>
          </div>
        </div>

      </div>

      {/* 4. GRAFIK PENGUNJUNG DAN PEMBACA (Visitor & Reader Traffic Chart) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Grafik Tren Pengunjung & Pembaca Artikel</span>
              </h3>
              
              {/* Real-time Indicator */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>{analytics?.realTimeVisitors || 382} Aktif</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualisasi tren pembaca (pageviews) dan pengunjung unik portal dalam 7 hari terakhir.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-extrabold">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span>Pembaca (Pageviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span>Pengunjung Unik</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="pageviews" 
                name="Pembaca (Pageviews)" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPageviews)" 
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                name="Pengunjung Unik" 
                stroke="#f59e0b" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorVisitors)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Direct Quick Link Cards Grid to Portal Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Module 1: Setting Portal & API */}
        <div 
          onClick={() => onNavigateTab('settings')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/60 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Setting Portal & API</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Atur API key Gemini/OpenAI, warna menu, slogan, serta backup Google Drive.
            </p>
          </div>
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
            <span>Buka Setting Portal</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Module 2: Syndication & Medsos */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/60 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Syndication & Medsos</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Jadwalkan postingan ke Facebook, Twitter/X, Telegram, & WhatsApp Channel.
            </p>
          </div>
          <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 pt-1">
            <span>Buka Otomatisasi Medsos</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Module 3: Analitik Portal */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Analitik Portal</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Laporan lengkap pembaca, perangkat (mobile/desktop), dan rujukan lalu lintas.
            </p>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
            <span>Buka Dashboard Analitik</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Module 4: Optimasi SEO */}
        <div 
          onClick={() => onNavigateTab('seo')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500/60 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Optimasi SEO</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Audit skor SEO, Google News Indexing, Meta Tag OpenGraph, dan XML Sitemap.
            </p>
          </div>
          <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 pt-1">
            <span>Buka Optimasi SEO</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

      </div>

      {/* WordPress REST API Importer Modal */}
      {showWpImporterModal && onImportWpPosts && (
        <WordPressImporter
          onClose={() => setShowWpImporterModal(false)}
          onImportPosts={(importedPosts) => {
            onImportWpPosts(importedPosts);
            setShowWpImporterModal(false);
          }}
        />
      )}

    </div>
  );
};
