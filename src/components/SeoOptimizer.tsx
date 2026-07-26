import React, { useState } from 'react';
import { 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Code2, 
  Search, 
  FileText, 
  RefreshCw 
} from 'lucide-react';
import { BlogPost } from '../types';

interface SeoOptimizerProps {
  article: BlogPost;
}

export const SeoOptimizer: React.FC<SeoOptimizerProps> = ({ article }) => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'opengraph' | 'schema' | 'sitemap'>('serp');
  const [isAuditing, setIsAuditing] = useState(false);

  // Calculate mock or real SEO Score based on title & meta length
  const titleLength = article.seoTitle?.length || article.title.length;
  const descLength = article.seoDescription?.length || article.excerpt.length;

  const isTitleOk = titleLength >= 40 && titleLength <= 65;
  const isDescOk = descLength >= 120 && descLength <= 165;
  const isAltOk = true;

  const seoScore = (isTitleOk ? 35 : 20) + (isDescOk ? 35 : 20) + (isAltOk ? 30 : 15);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://erainspirasi.com';

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${originUrl}/?post=${article.slug}`
    },
    headline: article.seoTitle || article.title,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'EraInspirasi',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'
      }
    },
    description: article.seoDescription || article.excerpt
  };

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${originUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${originUrl}/?post=${article.slug}</loc>
    <lastmod>${article.publishedAt.slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-indigo-500" />
            <span>SEO Optimizer & Schema Generator</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analisis peringkat mesin pencari, preview Google SERP & OpenGraph, serta generator Schema.org JSON-LD otomatis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <span>Skor SEO Artikel:</span>
            <span className="text-base text-indigo-600 dark:text-indigo-400 font-black">{seoScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Audit Checklist Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${isTitleOk ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <div className="flex items-center gap-2 font-bold text-xs">
            {isTitleOk ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
            <span>Panjang Meta Title ({titleLength} karakter)</span>
          </div>
          <p className="text-[11px] mt-1 opacity-80">
            {isTitleOk ? 'Sangat baik! Panjang ideal 40-65 karakter.' : 'Disarankan menyesuaikan ke 50-60 karakter.'}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDescOk ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <div className="flex items-center gap-2 font-bold text-xs">
            {isDescOk ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
            <span>Panjang Meta Description ({descLength} karakter)</span>
          </div>
          <p className="text-[11px] mt-1 opacity-80">
            {isDescOk ? 'Ideal! Terbaca sempurna di hasil pencarian Google.' : 'Disarankan 120-160 karakter.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Structured Data Schema.org</span>
          </div>
          <p className="text-[11px] mt-1 opacity-80">
            Schema BlogPosting terintegrasi otomatis untuk Google Rich Snippets.
          </p>
        </div>
      </div>

      {/* Interactive Previews Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        
        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <button
            onClick={() => setActiveTab('serp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'serp'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Google SERP Preview
          </button>
          <button
            onClick={() => setActiveTab('opengraph')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'opengraph'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            OpenGraph Social Card
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            JSON-LD Structured Data
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'sitemap'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Sitemap.xml Viewer
          </button>
        </div>

        {/* 1. Google SERP */}
        {activeTab === 'serp' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tampilan Simulasi Hasil Pencarian Google
            </h4>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 font-sans max-w-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">🌐</span>
                <span className="text-slate-700 truncate">{originUrl} › post › {article.slug}</span>
              </div>
              <h3 className="text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-tight">
                {article.seoTitle || article.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {article.seoDescription || article.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* 2. OpenGraph Card */}
        {activeTab === 'opengraph' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tampilan Card Media Sosial (OpenGraph / Twitter)
            </h4>
            <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md">
              <img src={article.coverImage} alt="Social Preview" className="w-full aspect-[1.91/1] object-cover" />
              <div className="p-4 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">ERAINSPIRASI.COM</div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {article.seoTitle || article.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">{article.seoDescription || article.excerpt}</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. JSON-LD Code */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kode Schema.org JSON-LD Auto-Generated
              </h4>
              <button
                onClick={handleCopySchema}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Disalin!' : 'Salin Kode JSON-LD'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {JSON.stringify(jsonLdSchema, null, 2)}
            </pre>
          </div>
        )}

        {/* 4. Sitemap.xml */}
        {activeTab === 'sitemap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peta Situs (sitemap.xml)</h4>
              <button
                onClick={handleCopySitemap}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
              >
                {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSitemap ? 'Disalin!' : 'Salin Sitemap XML'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {sitemapXml}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
