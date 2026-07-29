import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Send, Sparkles, ShieldCheck, HelpCircle, Smartphone, Laptop, Radio, Volume2 } from 'lucide-react';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  setIsSubscribed: (val: boolean) => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  isSubscribed,
  setIsSubscribed,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('⚡ Berita Utama: EraInspirasi Release Update!');
  const [broadcastBody, setBroadcastBody] = useState(
    'Inovasi AI dan Otomatisasi Redaksi Berita Terkini kini telah aktif di EraInspirasi Portal.'
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [permissionState, setPermissionState] = useState<string>('default');
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  if (!isOpen) return null;

  const handleRequestNativePermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setTestNotificationStatus('Browser Anda tidak mendukung Web Push Notification API.');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermissionState(res);
      if (res === 'granted') {
        setIsSubscribed(true);
        new Notification('🔔 Notifikasi Push EraInspirasi Berhasil Aktif!', {
          body: 'Anda sekarang akan menerima siaran berita terbaru langsung di layar HP/Laptop Anda.',
          icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        });
        setTestNotificationStatus('✅ Izin diberikan! Notifikasi uji coba telah dikirim ke layar Anda.');
      } else if (res === 'denied') {
        setIsSubscribed(false);
        setTestNotificationStatus('❌ Izin ditolak di browser. Mohon izinkan notifikasi di pengaturan ikon gembok URL browser Anda.');
      }
    } catch (err) {
      console.error(err);
      setTestNotificationStatus('Terjadi kesalahan saat meminta izin notifikasi browser.');
    }
  };

  const handleToggleSubscription = () => {
    if (!isSubscribed) {
      handleRequestNativePermission();
    } else {
      setIsSubscribed(false);
      setTestNotificationStatus('Notifikasi Push dinonaktifkan.');
    }
  };

  const handleSendPushBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(broadcastTitle, {
          body: broadcastBody,
          icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        });
      } catch (e) {
        console.warn(e);
      }
    }

    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Integrasi Web Push Notification
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cara kerja siaran berita otomatis ke HP & PC Pembaca
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-lg flex items-center justify-center transition"
          >
            ×
          </button>
        </div>

        {/* EDUKASI CARA KERJA PUSH NOTIFICATION */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Bagaimana Cara Kerja Push Notification?</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold pt-1">
            <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 flex flex-col items-center gap-1">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">1. Izin Pembaca</span>
              <span className="text-slate-500 leading-tight">Pembaca izinkan notifikasi di browser HP/PC.</span>
            </div>

            <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 flex flex-col items-center gap-1">
              <Radio className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">2. Auto Broadcast</span>
              <span className="text-slate-500 leading-tight">Redaksi terbit berita baru / Auto-Batch AI.</span>
            </div>

            <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 flex flex-col items-center gap-1">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">3. Pop-up Layar</span>
              <span className="text-slate-500 leading-tight">Notifikasi berita muncul instan di layar.</span>
            </div>
          </div>
        </div>

        {/* Status Browser & Live Test Trigger */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Status Izin Browser Anda</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  permissionState === 'granted' || isSubscribed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {permissionState === 'granted' || isSubscribed ? 'AKTIF (GRANTED)' : 'BELUM AKTIF'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Uji langsung pengiriman sinyal notifikasi di perangkat ini.
              </div>
            </div>

            <button
              onClick={handleToggleSubscription}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1.5 shadow ${
                isSubscribed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubscribed ? 'Notifikasi Aktif' : 'Aktifkan & Tes'}</span>
            </button>
          </div>

          {testNotificationStatus && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {testNotificationStatus}
            </div>
          )}
        </div>

        {/* Broadcast Push Campaign Form */}
        <form onSubmit={handleSendPushBroadcast} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Kirim Broadcast Notifikasi Manual ke Seluruh Pembaca
          </label>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Judul Notifikasi Berita</label>
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pesan / Ringkasan Teaser</label>
            <textarea
              rows={2}
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Broadcast Web Push berhasil disiarkan ke pembaca!</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Siarkan Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

