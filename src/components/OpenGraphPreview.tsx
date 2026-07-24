import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Code, 
  ExternalLink, 
  Globe, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  Sparkles,
  Eye
} from 'lucide-react';
import { BlogPost } from '../types';

interface OpenGraphPreviewProps {
  post: Partial<BlogPost>;
  customUrl?: string;
}

export const OpenGraphPreview: React.FC<OpenGraphPreviewProps> = ({
  post,
  customUrl,
}) => {
  const [platform, setPlatform] = useState<'whatsapp' | 'facebook' | 'twitter' | 'linkedin'>('whatsapp');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHtmlCode, setShowHtmlCode] = useState(false);

  const title = post.seoTitle || post.title || 'Judul Artikel Belum Diisi';
  const description = post.seoDescription || post.excerpt || 'Deskripsi ringkas artikel untuk tampilan share sosial media...';
  const image = post.coverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
  
  const shareSlug = post.slug || 'judul-artikel';
  const fullUrl = customUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?post=${shareSlug}`
    : `https://erainspirasi.com/?post=${shareSlug}`);

  const rawOgMetaHtml = `<!-- Open Graph / Social Media Meta Tags -->
<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${fullUrl}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="EraInspirasi" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
<meta name="twitter:image" content="${image}" />`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawOgMetaHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Preview Open Graph (OG) Social Media Card
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tampilan otomatis saat artikel dibagikan ke WhatsApp, Facebook, X/Twitter, dan LinkedIn.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHtmlCode(!showHtmlCode)}
          className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{showHtmlCode ? 'Sembunyikan Kode Tag Meta' : 'Lihat Tag Kode Meta OG'}</span>
        </button>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setPlatform('whatsapp')}
          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1.5 ${
            platform === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('facebook')}
          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1.5 ${
            platform === 'facebook'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('twitter')}
          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1.5 ${
            platform === 'twitter'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>X / Twitter</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('linkedin')}
          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1.5 ${
            platform === 'linkedin'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>LinkedIn</span>
        </button>
      </div>

      {/* Simulated Social Card Rendering */}
      <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
        
        {/* WhatsApp Style */}
        {platform === 'whatsapp' && (
          <div className="bg-[#e2f4ea] dark:bg-[#0c2419] p-2.5 rounded-2xl border border-[#b2e2ca] dark:border-[#184a34] space-y-2 text-left">
            <div className="relative rounded-xl overflow-hidden border border-emerald-300/40 aspect-video bg-slate-100 dark:bg-slate-800">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[9px] font-mono font-bold backdrop-blur-xs">
                og:image
              </div>
            </div>
            <div className="px-1 space-y-0.5">
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-emerald-100 line-clamp-1">
                {title}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-emerald-300/80 line-clamp-2 leading-tight">
                {description}
              </p>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400/90 font-mono pt-0.5 truncate">
                erainspirasi.com
              </div>
            </div>
          </div>
        )}

        {/* Facebook Style */}
        {platform === 'facebook' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-left bg-slate-50 dark:bg-slate-900">
            <div className="aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                ERAINSPIRASI.COM
              </span>
              <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2">
                {title}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        )}

        {/* Twitter Style */}
        {platform === 'twitter' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-left bg-white dark:bg-slate-900">
            <div className="aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
              <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                {title}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {description}
              </p>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-1">
                <Globe className="w-3 h-3 text-sky-500" />
                <span>erainspirasi.com</span>
              </span>
            </div>
          </div>
        )}

        {/* LinkedIn Style */}
        {platform === 'linkedin' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-left bg-white dark:bg-slate-900">
            <div className="aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
              <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2">
                {title}
              </h5>
              <span className="text-[10px] text-slate-400 font-mono block">
                erainspirasi.com • 3 min read
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Raw HTML Meta Snippet Code */}
      {showHtmlCode && (
        <div className="space-y-2 p-3 bg-slate-950 text-slate-100 rounded-2xl font-mono text-[11px] text-left border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-bold">Tag HTML &lt;head&gt; Open Graph Meta:</span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition flex items-center gap-1"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3 h-3 text-emerald-300" />
                  <span>Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin Tag HTML</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-1 leading-relaxed text-blue-300 whitespace-pre-wrap break-all">
            {rawOgMetaHtml}
          </pre>
        </div>
      )}

    </div>
  );
};
