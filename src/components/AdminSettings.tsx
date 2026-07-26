import React, { useState, useEffect } from 'react';
import { testGeminiKeyDirect } from '../services/geminiClient';
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
  Building,
  Database,
  Radio,
  ExternalLink,
  Layers,
  LayoutGrid,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SiteSettings, BannerConfig } from '../types';

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

  // Banners State
  const [headerBanner, setHeaderBanner] = useState<BannerConfig>(
    settings.headerBanner || {
      imageUrl: '',
      targetUrl: 'https://erainspirasi.com/iklan',
      altText: 'Banner Header Iklan Utama',
      isEnabled: true,
    }
  );

  const [sidebarBanner, setSidebarBanner] = useState<BannerConfig>(
    settings.sidebarBanner || {
      imageUrl: '',
      targetUrl: 'https://erainspirasi.com/iklan',
      altText: 'Banner Sidebar Artikel 300x250',
      isEnabled: true,
    }
  );

  const [feedRow3Banner, setFeedRow3Banner] = useState<BannerConfig>(
    settings.feedRow3Banner || {
      imageUrl: '',
      targetUrl: 'https://erainspirasi.com/iklan',
      altText: 'Banner Sponsor Baris Ke-3 Artikel In-Feed',
      isEnabled: true,
    }
  );

  // Social API Keys
  const [facebookAppId, setFacebookAppId] = useState(settings.facebookAppId || '');
  const [facebookPageAccessToken, setFacebookPageAccessToken] = useState(settings.facebookPageAccessToken || '');
  const [twitterApiKey, setTwitterApiKey] = useState(settings.twitterApiKey || '');
  const [twitterApiSecret, setTwitterApiSecret] = useState(settings.twitterApiSecret || '');
  const [instagramAccessToken, setInstagramAccessToken] = useState(settings.instagramAccessToken || '');

  // SEO & Google Indexing States
  const [googleSiteVerification, setGoogleSiteVerification] = useState(settings.googleSiteVerification || '');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(settings.googleAnalyticsId || '');
  const [canonicalDomain, setCanonicalDomain] = useState(settings.canonicalDomain || 'https://erainspirasi.com');

  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  
  // Test Gemini Key state
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [testGeminiResult, setTestGeminiResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.siteName) setSiteName(settings.siteName);
      if (settings.siteTagline) setSiteTagline(settings.siteTagline);
      if (settings.logoUrl !== undefined) setLogoUrl(settings.logoUrl);
      if (settings.geminiApiKey !== undefined) setGeminiApiKey(settings.geminiApiKey);
      if (settings.openaiApiKey !== undefined) setOpenaiApiKey(settings.openaiApiKey);
      if (settings.facebookUrl) setFacebookUrl(settings.facebookUrl);
      if (settings.instagramUrl) setInstagramUrl(settings.instagramUrl);
      if (settings.twitterUrl) setTwitterUrl(settings.twitterUrl);
      if (settings.youtubeUrl) setYoutubeUrl(settings.youtubeUrl);
      if (settings.whatsappContact) setWhatsappContact(settings.whatsappContact);
      if (settings.headerBanner) setHeaderBanner(settings.headerBanner);
      if (settings.sidebarBanner) setSidebarBanner(settings.sidebarBanner);
      if (settings.feedRow3Banner) setFeedRow3Banner(settings.feedRow3Banner);
      if (settings.facebookAppId !== undefined) setFacebookAppId(settings.facebookAppId);
      if (settings.facebookPageAccessToken !== undefined) setFacebookPageAccessToken(settings.facebookPageAccessToken);
      if (settings.twitterApiKey !== undefined) setTwitterApiKey(settings.twitterApiKey);
      if (settings.twitterApiSecret !== undefined) setTwitterApiSecret(settings.twitterApiSecret);
      if (settings.instagramAccessToken !== undefined) setInstagramAccessToken(settings.instagramAccessToken);
      if (settings.googleSiteVerification !== undefined) setGoogleSiteVerification(settings.googleSiteVerification);
      if (settings.googleAnalyticsId !== undefined) setGoogleAnalyticsId(settings.googleAnalyticsId);
      if (settings.canonicalDomain) setCanonicalDomain(settings.canonicalDomain);
    }
  }, [settings]);

  const handleTestGeminiKey = async () => {
    const keyToTest = geminiApiKey.trim();
    if (!keyToTest) {
      setTestGeminiResult({
        success: false,
        message: 'Mohon masukkan API Key Gemini terlebih dahulu di kolom di atas.',
      });
      return;
    }

    setIsTestingGemini(true);
    setTestGeminiResult(null);

    try {
      const res = await fetch('/api/gemini/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest,
        },
        body: JSON.stringify({ geminiApiKey: keyToTest }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON server response:', text);
      }

      if (res.ok && json.success) {
        setTestGeminiResult({
          success: true,
          message: `✅ ${json.message} (Respon Gemini: "${json.sample || 'OK'}")`,
        });
      } else {
        // Fallback to direct client-side test if backend API route is 404/unavailable (e.g. Vercel static)
        try {
          const directRes = await testGeminiKeyDirect(keyToTest);
          setTestGeminiResult({
            success: true,
            message: `✅ ${directRes.message} (Respon Gemini: "${directRes.sample || 'OK'}")`,
          });
        } catch (directErr: any) {
          setTestGeminiResult({
            success: false,
            message: `❌ ${json.error || directErr?.message || 'Gagal terhubung ke Google Gemini API.'}`,
          });
        }
      }
    } catch (e: any) {
      // Fallback on network error (e.g. static site)
      try {
        const directRes = await testGeminiKeyDirect(keyToTest);
        setTestGeminiResult({
          success: true,
          message: `✅ ${directRes.message} (Respon Gemini: "${directRes.sample || 'OK'}")`,
        });
      } catch (directErr: any) {
        setTestGeminiResult({
          success: false,
          message: `❌ Kesalahan: ${directErr?.message || e?.message || 'Gagal terhubung ke server.'}`,
        });
      }
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      siteName,
      siteTagline,
      logoUrl,
      geminiApiKey: geminiApiKey.trim(),
      openaiApiKey: openaiApiKey.trim(),
      facebookUrl,
      instagramUrl,
      twitterUrl,
      youtubeUrl,
      whatsappContact,
      headerBanner,
      sidebarBanner,
      feedRow3Banner,
      facebookAppId,
      facebookPageAccessToken,
      twitterApiKey,
      twitterApiSecret,
      instagramAccessToken,
      googleSiteVerification: googleSiteVerification.trim(),
      googleAnalyticsId: googleAnalyticsId.trim(),
      canonicalDomain: canonicalDomain.trim(),
    };

    onSaveSettings(updated);
    setSavedNotification('✓ Pengaturan Portal, Logo, Banner Iklan, API Key & Sosmed berhasil disimpan ke Database Cloud!');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleUploadLogoClick = () => {
    onOpenImageUploader((url) => {
      setLogoUrl(url);
    });
  };

  const handleUploadHeaderBannerClick = () => {
    onOpenImageUploader((url, alt) => {
      setHeaderBanner((prev) => ({ ...prev, imageUrl: url, altText: alt || prev.altText }));
    });
  };

  const handleUploadSidebarBannerClick = () => {
    onOpenImageUploader((url, alt) => {
      setSidebarBanner((prev) => ({ ...prev, imageUrl: url, altText: alt || prev.altText }));
    });
  };

  const handleUploadFeedRow3BannerClick = () => {
    onOpenImageUploader((url, alt) => {
      setFeedRow3Banner((prev) => ({ ...prev, imageUrl: url, altText: alt || prev.altText }));
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
            Sistem Kontrol Portal & Banner
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mt-1">
            <Settings className="w-6 h-6 text-rose-600" />
            <span>Pengaturan Portal, Banner Iklan & API Media Sosial</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola identitas logo, banner iklan 2 posisi (Header & Sidebar), API key AI, serta koneksi media sosial.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Ke Database</span>
        </button>
      </div>

      {/* Database Connection Info Status */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">Database Terhubung: Database Cloud Terpusat</span>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> Real-time Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Seluruh artikel, komentar, pengaturan banner, dan kategori tersimpan aman secara terpusat di cloud database.
            </p>
          </div>
        </div>
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

        {/* SECTION 2: MANAJEMEN UPLOAD BANNER IKLAN (2 POSISI) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                2. Manajemen Upload Banner Iklan (2 Posisi Utama)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase">
              Monetisasi Portal
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* POSISI 1: BANNER HEADER */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase">
                    Posisi 1: Banner Header Website (Leaderboard)
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={headerBanner.isEnabled}
                    onChange={(e) => setHeaderBanner((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Tampilkan</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Gambar Banner Header
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={headerBanner.imageUrl}
                    onChange={(e) => setHeaderBanner((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://domain.com/banner-header.jpg"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleUploadHeaderBannerClick}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tautan / Target Link Saat Banner Diklik
                </label>
                <input
                  type="url"
                  value={headerBanner.targetUrl}
                  onChange={(e) => setHeaderBanner((prev) => ({ ...prev, targetUrl: e.target.value }))}
                  placeholder="https://sponsor.com/promo"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Preview Box */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Preview Banner Header</span>
                {headerBanner.imageUrl ? (
                  <img src={headerBanner.imageUrl} alt={headerBanner.altText} className="max-h-20 w-full object-cover rounded-lg mx-auto" />
                ) : (
                  <div className="py-4 text-xs font-bold text-slate-400">Belum ada banner diunggah (Menampilkan Ruang Iklan Default)</div>
                )}
              </div>
            </div>

            {/* POSISI 2: BANNER SIDEBAR ARTIKEL (300x250) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase">
                    Posisi 2: Banner Sidebar Artikel (300x250 Medium Rectangle)
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={sidebarBanner.isEnabled}
                    onChange={(e) => setSidebarBanner((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Tampilkan</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Gambar Banner Sidebar
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sidebarBanner.imageUrl}
                    onChange={(e) => setSidebarBanner((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://domain.com/banner-sidebar.jpg"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleUploadSidebarBannerClick}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tautan / Target Link Saat Banner Diklik
                </label>
                <input
                  type="url"
                  value={sidebarBanner.targetUrl}
                  onChange={(e) => setSidebarBanner((prev) => ({ ...prev, targetUrl: e.target.value }))}
                  placeholder="https://sponsor.com/promo"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Preview Box */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Preview Banner Sidebar 300x250</span>
                {sidebarBanner.imageUrl ? (
                  <img src={sidebarBanner.imageUrl} alt={sidebarBanner.altText} className="max-h-28 max-w-[200px] object-cover rounded-lg mx-auto" />
                ) : (
                  <div className="py-4 text-xs font-bold text-slate-400">Belum ada banner diunggah (Menampilkan Ruang Iklan Default)</div>
                )}
              </div>
            </div>

            {/* POSISI 3: BANNER SPONSOR BARIS KE-3 ARTIKEL IN-FEED */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase">
                    Posisi 3: Banner Sponsor Baris Ke-3 Artikel (In-Feed Reader & Detail)
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={feedRow3Banner.isEnabled}
                    onChange={(e) => setFeedRow3Banner((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Tampilkan</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Gambar Banner In-Feed Baris Ke-3
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedRow3Banner.imageUrl}
                      onChange={(e) => setFeedRow3Banner((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://domain.com/banner-row3.jpg"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleUploadFeedRow3BannerClick}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Banner</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tautan / Target Link Saat Banner Diklik
                  </label>
                  <input
                    type="url"
                    value={feedRow3Banner.targetUrl}
                    onChange={(e) => setFeedRow3Banner((prev) => ({ ...prev, targetUrl: e.target.value }))}
                    placeholder="https://sponsor.com/promo"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Preview Banner In-Feed Baris Ke-3 Artikel</span>
                {feedRow3Banner.imageUrl ? (
                  <a href={feedRow3Banner.targetUrl} target="_blank" rel="noopener noreferrer" className="block max-w-xl mx-auto">
                    <img src={feedRow3Banner.imageUrl} alt={feedRow3Banner.altText} className="max-h-28 w-full object-cover rounded-lg mx-auto hover:opacity-90 transition" />
                  </a>
                ) : (
                  <div className="py-4 text-xs font-bold text-slate-400">Belum ada banner diunggah (Menampilkan Ruang Iklan Default Redaksi)</div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: KONFIGURASI API KEY AI (GEMINI & OPENAI) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                3. Pengaturan API Key Artificial Intelligence (AI Engine)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
              Auto-Scheduler Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemini API Key */}
            <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
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
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    setTestGeminiResult(null);
                  }}
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

              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Digunakan untuk Penulisan AI otomatis, Humanizer Anti-AI, dan Auto-Batch Generator.
                </p>
                <button
                  type="button"
                  onClick={handleTestGeminiKey}
                  disabled={isTestingGemini}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
                >
                  {isTestingGemini ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menguji...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tes Koneksi API</span>
                    </>
                  )}
                </button>
              </div>

              {testGeminiResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                    testGeminiResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testGeminiResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug">{testGeminiResult.message}</span>
                </div>
              )}
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

        {/* SECTION 4: KONEKSI API MEDIA SOSIAL & AUTOPILOT */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                4. Koneksi API Media Sosial & Tautan Portal
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
              Auto-Posting Ready
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              A. Tautan Akun Publik Media Sosial & WhatsApp
            </h4>
            
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

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-rose-600" />
                <span>B. Kunci API & Access Token Otomatisasi Posting Sosmed</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Facebook Page Access Token (Graph API)
                  </label>
                  <input
                    type="password"
                    value={facebookPageAccessToken}
                    onChange={(e) => setFacebookPageAccessToken(e.target.value)}
                    placeholder="EAAB..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instagram Graph Access Token
                  </label>
                  <input
                    type="password"
                    value={instagramAccessToken}
                    onChange={(e) => setInstagramAccessToken(e.target.value)}
                    placeholder="IGQV..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Twitter / X API Key (v2 OAuth)
                  </label>
                  <input
                    type="password"
                    value={twitterApiKey}
                    onChange={(e) => setTwitterApiKey(e.target.value)}
                    placeholder="API Key..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Twitter / X API Secret
                  </label>
                  <input
                    type="password"
                    value={twitterApiSecret}
                    onChange={(e) => setTwitterApiSecret(e.target.value)}
                    placeholder="API Secret..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: SEO ON-PAGE & GOOGLE SEARCH CONSOLE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    6. Pengaturan SEO On-Page, Google Indexing & Google Search Console
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Konfigurasi meta verifikasi Google, sitemap.xml otomatis, dan integrasi Google Search Console agar artikel cepat di-index Google.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Verifikasi Google Search Console (HTML Tag)
                  </label>
                  <input
                    type="text"
                    value={googleSiteVerification}
                    onChange={(e) => setGoogleSiteVerification(e.target.value)}
                    placeholder="Contoh: google-site-verification-1234567890"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Dapatkan dari Google Search Console &gt; Settings &gt; Ownership Verification &gt; HTML Tag.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Google Analytics 4 Measurement ID (GA4)
                  </label>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Melacak jumlah pengunjung portal secara real-time via Google Analytics 4.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Domain Utama (Canonical Root URL)
                  </label>
                  <input
                    type="text"
                    value={canonicalDomain}
                    onChange={(e) => setCanonicalDomain(e.target.value)}
                    placeholder="https://erainspirasi.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Box Panduan Google Indexing */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Panduan Cara Mendaftarkan Website ke Google Search Console</span>
                  </span>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <span>Buka Google Search Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ol className="list-decimal list-inside text-indigo-950 dark:text-indigo-300 space-y-1.5 text-[11px]">
                  <li>Buka <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="underline font-bold">Google Search Console</a> dan login dengan akun Google Anda.</li>
                  <li>Masukkan URL domain/website Anda (contoh: <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">https://erainspirasi.com</code>).</li>
                  <li>Pilih metode verifikasi <strong>HTML Tag</strong>, lalu salin kode uniknya ke kolom di atas.</li>
                  <li>Buka menu <strong>Sitemaps</strong> di Google Search Console, lalu masukkan link berikut:
                    <div className="mt-1.5 flex items-center gap-2">
                      <code className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] select-all">
                        {window.location.origin}/sitemap.xml
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/sitemap.xml`);
                          alert('✓ Link Sitemap.xml berhasil disalin ke clipboard!');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 transition"
                      >
                        Salin Link Sitemap
                      </button>
                    </div>
                  </li>
                  <li>Googlebot akan memindai dan mengindeks seluruh artikel portal Anda secara otomatis dalam beberapa jam!</li>
                </ol>
              </div>

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
            <span>Simpan Semua Pengaturan Redaksi & Database</span>
          </button>
        </div>

      </form>
    </div>
  );
};
