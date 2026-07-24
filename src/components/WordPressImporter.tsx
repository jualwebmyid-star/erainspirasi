import React, { useState } from 'react';
import { 
  Globe, 
  FileCode, 
  Download, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  ListCheck, 
  ArrowRight,
  Database
} from 'lucide-react';
import { BlogPost } from '../types';

interface WordPressImporterProps {
  onImportPosts: (posts: BlogPost[]) => void;
  onClose?: () => void;
}

interface ParsedWpPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  selected: boolean;
}

export const WordPressImporter: React.FC<WordPressImporterProps> = ({
  onImportPosts,
  onClose,
}) => {
  const [importMode, setImportMode] = useState<'url' | 'xml'>('url');
  const [wpUrl, setWpUrl] = useState('https://demo.wp-api.org');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [parsedPosts, setParsedPosts] = useState<ParsedWpPost[]>([]);

  // 1. Fetch posts via WordPress REST API
  const handleFetchWpApi = async () => {
    if (!wpUrl.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let cleanUrl = wpUrl.trim().replace(/\/+$/, '');
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const endpoint = `${cleanUrl}/wp-json/wp/v2/posts?per_page=12&_embed=1`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Gagal terhubung ke WordPress REST API (HTTP status ${res.status}). Pastikan REST API di situs tersebut aktif.`);
      }

      const wpPosts = await res.json();
      if (!Array.isArray(wpPosts) || wpPosts.length === 0) {
        throw new Error('Tidak ada artikel publik ditemukan di situs WordPress tersebut.');
      }

      const formatted: ParsedWpPost[] = wpPosts.map((item: any, idx: number) => {
        const titleStr = item.title?.rendered ? item.title.rendered.replace(/<[^>]+>/g, '') : 'Artikel WordPress';
        const rawContent = item.content?.rendered || '';
        const rawExcerpt = item.excerpt?.rendered ? item.excerpt.rendered.replace(/<[^>]+>/g, '') : '';
        
        let featImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
        if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]) {
          featImg = item._embedded['wp:featuredmedia'][0].source_url || featImg;
        }

        return {
          id: `wp-${item.id || Date.now()}-${idx}`,
          title: titleStr,
          slug: item.slug || `wp-post-${idx}`,
          content: rawContent,
          excerpt: rawExcerpt.slice(0, 160) || titleStr,
          coverImage: featImg,
          category: 'Teknologi',
          publishedAt: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
          selected: true,
        };
      });

      setParsedPosts(formatted);
      setSuccessMsg(`✓ Berhasil mengambil ${formatted.length} artikel dari situs WordPress! Silakan pilih artikel untuk dimasukkan ke database.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat meng-import dari WordPress API.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Parse WordPress XML (WXR Export) File
  const handleXmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const xmlText = event.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const items = xmlDoc.querySelectorAll('item');
        if (items.length === 0) {
          throw new Error('Format file XML tidak valid atau tidak memuat item artikel WordPress (<item>).');
        }

        const list: ParsedWpPost[] = [];
        items.forEach((item, idx) => {
          const postTypeNode = item.querySelector('wp\\:post_type, post_type');
          const postType = postTypeNode ? postTypeNode.textContent : 'post';

          // Only import standard posts
          if (postType === 'post' || !postTypeNode) {
            const title = item.querySelector('title')?.textContent || `Artikel Import WP ${idx + 1}`;
            const contentEncoded = item.querySelector('content\\:encoded, encoded')?.textContent || item.querySelector('description')?.textContent || '';
            const pubDate = item.querySelector('pubDate, wp\\:post_date')?.textContent || new Date().toISOString();
            
            list.push({
              id: `wp-xml-${Date.now()}-${idx}`,
              title,
              slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
              content: contentEncoded,
              excerpt: title,
              coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
              category: 'Teknologi',
              publishedAt: new Date(pubDate).toISOString(),
              selected: true,
            });
          }
        });

        if (list.length === 0) {
          throw new Error('Tidak ada artikel bertipe "post" yang valid di dalam file XML tersebut.');
        }

        setParsedPosts(list);
        setSuccessMsg(`✓ Berhasil memuat ${list.length} artikel dari file XML WordPress Export!`);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal membaca file XML WordPress.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const toggleSelectPost = (id: string) => {
    setParsedPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const toggleSelectAll = (selectAll: boolean) => {
    setParsedPosts((prev) => prev.map((p) => ({ ...p, selected: selectAll })));
  };

  const handleExecuteImport = () => {
    const selectedList = parsedPosts.filter((p) => p.selected);
    if (selectedList.length === 0) return;

    const formattedBlogPosts: BlogPost[] = selectedList.map((p) => ({
      id: p.id,
      title: p.title,
      seoTitle: p.title,
      slug: p.slug,
      category: p.category,
      tags: ['WordPress', 'Imported', 'Portal'],
      excerpt: p.excerpt,
      seoDescription: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      author: {
        name: 'Redaktur WordPress',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'admin',
      },
      publishedAt: p.publishedAt,
      viewCount: Math.floor(Math.random() * 200) + 50,
      likesCount: Math.floor(Math.random() * 30) + 10,
      commentsCount: 0,
      readingTime: Math.max(1, Math.ceil(p.content.split(/\s+/).length / 200)),
      aiScore: 0,
      humanized: true,
      status: 'published',
    }));

    onImportPosts(formattedBlogPosts);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header Importer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
            Fitur Importer Otomatis
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mt-1">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Import Artikel dari WordPress ke Database Portal</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Migrasikan artikel dari WordPress lama Anda via REST API URL atau File XML Export (WXR).
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start sm:self-auto text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Tutup [×]
          </button>
        )}
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md">
        <button
          onClick={() => setImportMode('url')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            importMode === 'url'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Via WP REST API URL</span>
        </button>

        <button
          onClick={() => setImportMode('xml')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            importMode === 'xml'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-500" />
          <span>Upload File XML Export</span>
        </button>
      </div>

      {/* Input Section */}
      {importMode === 'url' ? (
        <div className="space-y-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
          <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
            Alamat Domain Website WordPress (REST API)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={wpUrl}
              onChange={(e) => setWpUrl(e.target.value)}
              placeholder="Contoh: https://demo.wp-api.org atau https://namasitus.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFetchWpApi}
              disabled={isLoading || !wpUrl.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Ambil Artikel</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Sistem akan secara otomatis mengambil artikel publik beserta gambar sampul dan tanggal rilis melalui endpoint <code>/wp-json/wp/v2/posts</code>.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <FileCode className="w-8 h-8 text-amber-500 mx-auto" />
          <div>
            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
              Pilih File WordPress Export (.xml / .wxr)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Didapatkan dari dashboard WP lama Anda: Tools &gt; Export &gt; Posts.
            </span>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow cursor-pointer transition">
            <Upload className="w-4 h-4" />
            <span>Pilih File XML Dari Komputer</span>
            <input
              type="file"
              accept=".xml"
              onChange={handleXmlFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Error & Success Messages */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Parsed Articles Selection List */}
      {parsedPosts.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListCheck className="w-4 h-4 text-blue-600" />
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Daftar Artikel Siap Di-Import ({parsedPosts.filter((p) => p.selected).length} Dari {parsedPosts.length} Terpilih)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSelectAll(true)}
                className="text-[11px] font-extrabold text-blue-600 hover:underline"
              >
                Pilih Semua
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => toggleSelectAll(false)}
                className="text-[11px] font-extrabold text-slate-500 hover:underline"
              >
                Hapus Semua
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {parsedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => toggleSelectPost(post.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  post.selected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={post.selected}
                    onChange={() => toggleSelectPost(post.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      /wp/v2/posts/{post.slug}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase shrink-0">
                  Ready to Import
                </span>
              </div>
            ))}
          </div>

          {/* Final Execute Import Button */}
          <div className="flex justify-end pt-3">
            <button
              onClick={handleExecuteImport}
              disabled={parsedPosts.filter((p) => p.selected).length === 0}
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>
                Masukan ({parsedPosts.filter((p) => p.selected).length}) Artikel Ke Database Firebase Now
              </span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
