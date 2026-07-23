import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Share2, 
  Download, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Radio, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  CheckCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('pdf');
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const handleExportData = () => {
    if (exportFormat === 'csv') {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Tanggal,Pageviews,Pengunjung,KlikMedsos\n' +
        analytics.trafficHistory.map((e) => `${e.date},${e.pageviews},${e.visitors},${e.socialClicks}`).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `lumina-analytics-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `lumina-analytics-report-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.removeChild(downloadAnchor);
    } else {
      // PDF Print simulation
      window.print();
    }

    setExportSuccessMsg(`Laporan trafik berformat ${exportFormat.toUpperCase()} berhasil diekspor!`);
    setTimeout(() => {
      setExportSuccessMsg(null);
      setShowExportModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header & Real-time Live Visitors Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              <span>Dashboard Analitik Trafik Real-Time</span>
            </h2>

            {/* Live Pulse Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{analytics.realTimeVisitors} Pengunjung Aktif Saat Ini</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau performa pembaca, perbandingan saluran lalu lintas, serta statistik konversi artikel.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan Klien</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Pageviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Halaman Dibaca</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {analytics.totalPageviews.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% dari minggu lalu</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pengunjung Unik</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {analytics.uniqueVisitors.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.1% pertumbuhan organik</span>
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Bounce Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {analytics.bounceRate}%
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <span>Rendah (Sangat Baik)</span>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Durasi Baca</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {analytics.avgDuration}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Tingkat enggagement pembaca tinggi
          </div>
        </div>
      </div>

      {/* Traffic Recharts Graph */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Grafik Tren Trafik Harian (7 Hari Terakhir)
            </h3>
            <p className="text-xs text-slate-500">Perbandingan antara pembaca halaman & klik media sosial</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.trafficHistory}>
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="pageviews"
                name="Pageviews"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
              <Area
                type="monotone"
                dataKey="socialClicks"
                name="Klik Medsos"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSoc)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Top Articles & Devices / Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Articles Leaderboard */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Artikel Paling Banyak Dibaca (Top Performing)
          </h3>

          <div className="space-y-3">
            {analytics.topArticles.map((article, index) => (
              <div
                key={article.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{article.title}</span>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    {article.views} Dibaca
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                    {article.shares} Dibagikan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown & Referral */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Devices */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Distribusi Perangkat Pengunjung
            </h3>

            <div className="space-y-2 text-xs">
              {analytics.deviceBreakdown.map((dev) => (
                <div key={dev.device} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      {dev.device.includes('Mobile') ? (
                        <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                      ) : dev.device.includes('Desktop') ? (
                        <Monitor className="w-3.5 h-3.5 text-purple-500" />
                      ) : (
                        <Tablet className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {dev.device}
                    </span>
                    <span>{dev.percentage}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${dev.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Sources */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Sumber Trafik (Referrals)</h3>
            <div className="space-y-2 text-xs">
              {analytics.referralSources.map((ref) => (
                <div
                  key={ref.source}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40"
                >
                  <span className="text-slate-700 dark:text-slate-300">{ref.source}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{ref.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
                <Download className="w-5 h-5 text-indigo-500" />
                <span>Ekspor Laporan Trafik Klien</span>
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 font-bold">
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pilih format berkas untuk mengekspor laporan analitik performa blog secara otomatis.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-2xl border text-center transition ${
                  exportFormat === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <Printer className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                <div className="text-xs">Cetak PDF</div>
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-2xl border text-center transition ${
                  exportFormat === 'csv'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <div className="text-xs">Excel / CSV</div>
              </button>

              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-2xl border text-center transition ${
                  exportFormat === 'json'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <FileCode className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-xs">Data JSON</div>
              </button>
            </div>

            {exportSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{exportSuccessMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                onClick={handleExportData}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow transition"
              >
                Unduh Berkas Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
