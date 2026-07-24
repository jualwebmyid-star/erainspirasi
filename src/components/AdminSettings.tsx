import React, { useState } from 'react';
import { 
  Settings, 
  Upload, 
  Image as ImageIcon, 
  Key, 
  Sparkles, 
  Share2, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  Globe, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  ShieldCheck,
  Building
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => void;
  onOpenImageUploader: (onSelectUrl: (url: string, alt: string) => void) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onOpenImageUploader,
}) => {
  const [siteName, setSiteName] = useState(settings.siteName || 'EraInspirasi');
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline || 'Portal Berita, Edukasi & Inspirasi Digital');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || 'https://facebook.com/erainspirasi');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || 'https://instagram.com/erainspirasi');
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || 'https://x.com/erainspirasi');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || 'https://youtube.com/@erainspirasi');
  const [whatsappContact, setWhatsappContact] = useState(settings.whatsappContact || '6281234567890');

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      siteName,
      siteTagline,
      logoUrl,
      geminiApiKey,
      openaiApiKey,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      youtubeUrl,
      whatsappContact,
    };

    onSaveSettings(updated);
    setSavedNotification('✓ Pengaturan Portal, Logo, API Key AI, & Sosmed berhasil disimpan!');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleUploadLogoClick = () => {
    onOpenImageUploader((url) => {
      setLogoUrl(url);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
            Sistem Kontrol Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mt-1">
            <Settings className="w-6 h-6 text-rose-600" />
            <span>Pengaturan Portal, Logo Web & Integration API</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola identitas visual logo web, kunci API AI (Gemini/OpenAI), dan tautan media sosial portal EraInspirasi.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedNotification}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: IDENTITAS PORTAL & UPLOAD LOGO */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              1. Identitas Portal & Upload Logo Web
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Portal Website
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Contoh: EraInspirasi.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Slogan / Tagline Website
                </label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  placeholder="Contoh: Portal Berita, Edukasi & Inspirasi Digital"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  URL Gambar Logo Portal (Atau Upload dari Komputer)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://domain.com/logo.png"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleUploadLogoClick}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 font-bold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Logo Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                PREVIEW TAMPILAN LOGO WEB
              </span>

              {logoUrl ? (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-xs">
                  <img src={logoUrl} alt="Logo Web Preview" className="max-h-16 object-contain mx-auto" />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="bg-rose-600 text-white font-black text-xl px-3 py-1.5 rounded-xl shadow-md tracking-wider">
                    ERA
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-xl font-black text-slate-900 dark:text-white uppercase leading-none">
                      {siteName || 'INSPIRASI'}<span className="text-rose-600">.COM</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide mt-0.5">
                      {siteTagline}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gunakan gambar rasio horizontal dengan latar transparan PNG/SVG untuk hasil optimal di header.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: KONFIGURASI API KEY AI (GEMINI & OPENAI) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                2. Pengaturan API Key Artificial Intelligence (AI Engine)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
              Auto-Scheduler Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemini API Key */}
            <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Google Gemini AI API Key</span>
                </label>
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">Rekomendasi Utama</span>
              </div>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Digunakan untuk Penulisan AI otomatis, Humanizer Anti-AI Detector, dan Auto-Batch Generator.
              </p>
            </div>

            {/* OpenAI API Key */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-600" />
                  <span>OpenAI API Key (Opsional / Cadangan)</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Model cadangan jika batas kuota Gemini tercapai.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: API & AKUN MEDIA SOSIAL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              3. Tautan Media Sosial & Kontak WhatsApp Portal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook Page</span>
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/erainspirasi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Account</span>
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/erainspirasi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                <span>Twitter / X</span>
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/erainspirasi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Channel</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@erainspirasi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>No. WhatsApp Redaksi (62...)</span>
              </label>
              <input
                type="text"
                value={whatsappContact}
                onChange={(e) => setWhatsappContact(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-5 h-5" />
            <span>Simpan Semua Pengaturan Redaksi</span>
          </button>
        </div>

      </form>
    </div>
  );
};
