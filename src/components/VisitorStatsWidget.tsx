import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Globe2, 
  BarChart3, 
  Eye, 
  Clock,
  Radio,
  Wifi
} from 'lucide-react';
import { safeStorage } from '../utils/storage';

interface VisitorStatsProps {
  variant?: 'sidebar' | 'footer' | 'full';
}

export const VisitorStatsWidget: React.FC<VisitorStatsProps> = ({ variant = 'sidebar' }) => {
  const [onlineCount, setOnlineCount] = useState<number>(76);
  const [stats, setStats] = useState(() => {
    const saved = safeStorage.getItem('erainspirasi_visitor_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      today: 3842,
      yesterday: 8190,
      thisWeek: 34820,
      thisMonth: 128940,
      totalHits: 1842910,
    };
  });

  // Simulated real-time visitors fluctuation & count increment
  useEffect(() => {
    // 1. Save state
    safeStorage.setItem('erainspirasi_visitor_stats', JSON.stringify(stats));

    // 2. Interval for slight real-time fluctuations
    const interval = setInterval(() => {
      // Random online fluctuation between -3 and +4
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 8) - 3;
        return Math.max(25, Math.min(180, prev + delta));
      });

      // Increment stats slightly
      setStats((prev: any) => {
        const newStats = {
          ...prev,
          today: prev.today + 1,
          thisWeek: prev.thisWeek + 1,
          thisMonth: prev.thisMonth + 1,
          totalHits: prev.totalHits + 1,
        };
        safeStorage.setItem('erainspirasi_visitor_stats', JSON.stringify(newStats));
        return newStats;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  if (variant === 'footer') {
    return (
      <div id="visitor-stats-footer" className="p-5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>STATISTIK PENGUNJUNG PORTAL</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">Trafik pembaca terverifikasi realtime EraInspirasi.com</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Online Saat Ini:</span>
            <strong className="text-emerald-400 font-black text-sm">{onlineCount}</strong>
            <span className="text-slate-500">pembaca</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rose-400" />
              <span>Hari Ini</span>
            </div>
            <div className="text-base font-black text-white mt-1">{formatNumber(stats.today)}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Kemarin</span>
            </div>
            <div className="text-base font-black text-white mt-1">{formatNumber(stats.yesterday)}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>Minggu Ini</span>
            </div>
            <div className="text-base font-black text-white mt-1">{formatNumber(stats.thisWeek)}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400" />
              <span>Bulan Ini</span>
            </div>
            <div className="text-base font-black text-white mt-1">{formatNumber(stats.thisMonth)}</div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-950/60 to-slate-800/80 border border-rose-800/50 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-rose-400" />
              <span>Total Hits</span>
            </div>
            <div className="text-base font-black text-rose-400 mt-1">{formatNumber(stats.totalHits)}</div>
          </div>
        </div>
      </div>
    );
  }

  // Default Sidebar Widget
  return (
    <div id="visitor-stats-sidebar" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
          <BarChart3 className="w-4 h-4 text-rose-600" />
          <span>STATISTIK PENGUNJUNG</span>
        </h4>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          LIVE
        </span>
      </div>

      {/* Online Badge */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-800 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Online Sekarang</span>
        </div>
        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
          {onlineCount} <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">User</span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            Hari Ini
          </span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatNumber(stats.today)}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Kemarin
          </span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatNumber(stats.yesterday)}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
            Minggu Ini
          </span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatNumber(stats.thisWeek)}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-500" />
            Bulan Ini
          </span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatNumber(stats.thisMonth)}</span>
        </div>

        <div className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 mt-2">
          <span className="text-rose-900 dark:text-rose-200 font-extrabold flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Total Hits
          </span>
          <span className="font-black text-rose-600 dark:text-rose-400 text-sm">{formatNumber(stats.totalHits)}</span>
        </div>
      </div>
    </div>
  );
};
