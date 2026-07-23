import React, { useState } from 'react';
import { Bell, CheckCircle, Send, Sparkles, ShieldCheck } from 'lucide-react';

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
  const [broadcastTitle, setBroadcastTitle] = useState('⚡ Artikel Baru Dirilis!');
  const [broadcastBody, setBroadcastBody] = useState(
    'Simak panduan lengkap membangun arsitektur Next.js 15 dengan AI Content Studio di Lumina Blog!'
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleSendPushBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Integrasi Notifikasi Push
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold">
            ×
          </button>
        </div>

        {/* Browser Push Permission Switcher */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Notifikasi Web Browser
            </div>
            <div className="text-[10px] text-slate-500">
              Dapatkan pembaruan konten & artikel baru secara otomatis.
            </div>
          </div>

          <button
            onClick={handleToggleSubscription}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              isSubscribed
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isSubscribed ? 'Aktif (Subscribed)' : 'Nonaktifkan'}
          </button>
        </div>

        {/* Broadcast Push Campaign Form */}
        <form onSubmit={handleSendPushBroadcast} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Kirim Broadcast Notifikasi Push Ke Pembaca
          </label>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Judul Notifikasi</label>
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Pesan / Teaser Artikel</label>
            <textarea
              rows={2}
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Notifikasi Push berhasil disiarkan ke pembaca!</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Siarkan Notifikasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
