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
  const postCategory = post.category ? post.category.toLowerCase().trim().replace(/&/g, 'dan').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'berita';
  const fullUrl = customUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}/${postCategory}/${shareSlug}`
    : `https://erainspirasi.com/${postCategory}/${shareSlug}`);

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
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Preview Open Graph (OG)
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Tampilan kartu artikel di medsos & WA.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHtmlCode(!showHtmlCode)}
          className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <Code className="w-3 h-3" />
          <span>{showHtmlCode ? 'Tutup Kode' : 'Lihat Meta'}</span>
        </button>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setPlatform('whatsapp')}
          className={`flex-1 min-w-[70px] py-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
            platform === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          <span>WA</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('facebook')}
          className={`flex-1 min-w-[70px] py-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
            platform === 'facebook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Facebook className="w-3 h-3" />
          <span>FB</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('twitter')}
          className={`flex-1 min-w-[70px] py-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
            platform === 'twitter'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Twitter className="w-3 h-3" />
          <span>X</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('linkedin')}
          className={`flex-1 min-w-[70px] py-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
            platform === 'linkedin'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Linkedin className="w-3 h-3" />
          <span>LinkedIn</span>
        </button>
      </div>

      {/* Simulated Social Card Rendering - Small Compact Size */}
      <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-sm mx-auto">
        
        {/* WhatsApp Style */}
        {platform === 'whatsapp' && (
          <div className="bg-[#e2f4ea] dark:bg-[#0c2419] p-2 rounded-xl border border-[#b2e2ca] dark:border-[#184a34] space-y-1.5 text-left">
            <div className="relative rounded-lg overflow-hidden border border-emerald-300/40 h-28 w-full bg-slate-100 dark:bg-slate-800">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-0.5 space-y-0.5">
              <h5 className="font-extrabold text-[11px] text-slate-900 dark:text-emerald-100 line-clamp-1">
                {title}
              </h5>
              <p className="text-[10px] text-slate-600 dark:text-emerald-300/80 line-clamp-1 leading-tight">
                {description}
              </p>
              <div className="text-[9px] text-emerald-700 dark:text-emerald-400/90 font-mono pt-0.5 truncate">
                erainspirasi.com
              </div>
            </div>
          </div>
        )}

        {/* Facebook Style */}
        {platform === 'facebook' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-left bg-slate-50 dark:bg-slate-900">
            <div className="h-28 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">
                ERAINSPIRASI.COM
              </span>
              <h5 className="font-bold text-[11px] text-slate-900 dark:text-slate-100 line-clamp-1">
                {title}
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {description}
              </p>
            </div>
          </div>
        )}

        {/* Twitter Style */}
        {platform === 'twitter' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-left bg-white dark:bg-slate-900">
            <div className="h-28 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 space-y-0.5">
              <h5 className="font-bold text-[11px] text-slate-900 dark:text-slate-100 line-clamp-1">
                {title}
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {description}
              </p>
              <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                <Globe className="w-2.5 h-2.5 text-sky-500" />
                <span>erainspirasi.com</span>
              </span>
            </div>
          </div>
        )}

        {/* LinkedIn Style */}
        {platform === 'linkedin' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-left bg-white dark:bg-slate-900">
            <div className="h-28 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 space-y-0.5">
              <h5 className="font-bold text-[11px] text-slate-900 dark:text-slate-100 line-clamp-1">
                {title}
              </h5>
              <span className="text-[9px] text-slate-400 font-mono block">
                erainspirasi.com • 3 mnt baca
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
