import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Check, 
  Copy, 
  List, 
  Bookmark,
  ShieldAlert,
  UserCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { BlogPost, Comment, UserProfile, SiteSettings } from '../types';

interface ArticleDetailViewProps {
  post: BlogPost;
  comments: Comment[];
  onBack: () => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
  user: UserProfile;
  allPosts?: BlogPost[];
  onSelectPost?: (post: BlogPost) => void;
  siteSettings?: SiteSettings;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  post,
  comments,
  onBack,
  onAddComment,
  user,
  allPosts,
  onSelectPost,
  siteSettings
}) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTocMenu, setShowTocMenu] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Filter 3 Related Articles in the same category
  const relatedPosts = (allPosts || [])
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  if (relatedPosts.length < 3) {
    const existingIds = new Set([post.id, ...relatedPosts.map((p) => p.id)]);
    const additional = (allPosts || []).filter((p) => !existingIds.has(p.id)).slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  // Extract headings for Table of Contents
  const headings = post.content
    .split('\n')
    .filter((line) => line.startsWith('## ') || line.startsWith('### '))
    .map((line) => {
      const level = line.startsWith('## ') ? 2 : 3;
      const text = line.replace(/^###?\s+/, '');
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { level, text, id };
    });

  const handleLikeArticle = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?post=${post.slug || post.id}`
    : `https://erainspirasi.com/?post=${post.slug || post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Baca berita terbaru di EraInspirasi: "${post.title}"\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, commentText, replyingToId || undefined);
    setCommentText('');
    setReplyingToId(null);
  };

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      setAiSummary(
        `📌 Ringkasan Eksekutif EraInspirasi (AI Engine):\n` +
        `1. Menganalisis poin-poin utama dalam artikel "${post.title}".\n` +
        `2. Menyajikan strategi praktis dan wawasan mendalam untuk pembaca setia EraInspirasi.\n` +
        `3. Teroptimasi SEO dengan struktur poin terukur untuk efisiensi membaca.`
      );
      setIsGeneratingSummary(false);
    }, 1200);
  };

  // Top 5 Popular Posts sorted by viewCount
  const popularPosts = [...(allPosts || [])]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  // Extract unique trending tags
  const allTrendingTags = Array.from(
    new Set((allPosts || []).flatMap((p) => p.tags))
  ).slice(0, 10);

  const articleComments = comments.filter((c) => c.postId === post.id);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Breadcrumb Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <button onClick={onBack} className="hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-rose-600 dark:text-rose-400 font-bold">{post.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[180px] sm:max-w-[300px] text-slate-700 dark:text-slate-300">{post.title}</span>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white shadow hover:bg-rose-500 transition disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingSummary ? 'Membuat Ringkasan...' : 'Ringkasan AI 1-Klik'}</span>
        </button>
      </div>

      {/* Main 2-Column Grid Layout: Article Stream (8 Cols) + Right Sidebar (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ARTICLE CONTENT STREAM */}
        <div className="lg:col-span-8 space-y-6">

          {/* Article Header Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-rose-600 text-white shadow uppercase tracking-wider">
                {post.category}
              </span>

              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Adjusted Title Size for HP & Desktop */}
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug sm:leading-tight">
              {post.title}
            </h1>

            {/* Author Bio Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/50"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{post.author.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 capitalize">
                      {post.author.role}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-500" />
                      {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} mnt baca
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1 font-semibold mr-1 text-xs">
                  <Eye className="w-3.5 h-3.5 text-rose-500" />
                  {post.viewCount} Views
                </span>

                <button
                  onClick={handleLikeArticle}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border transition text-xs ${
                    hasLiked
                      ? 'bg-rose-600 border-rose-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-rose-400'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes} Suka</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WA</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 flex items-center gap-1"
                  title="Salin Tautan Artikel"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* AI Summary Banner (If Generated) */}
          {aiSummary && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-purple-900/10 border border-purple-500/30 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Ringkasan Eksekutif AI Studio</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{aiSummary}</p>
            </div>
          )}

          {/* Hero Cover Image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 dark:border-slate-800 shadow-sm">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Main Text Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 rounded-3xl shadow-xs space-y-4">
            <article className="prose dark:prose-invert max-w-none w-full space-y-4 text-slate-900 dark:text-slate-100 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
            </article>
          </div>

          {/* Share & Feedback Row with Permalink Box */}
          <div className="p-5 rounded-3xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Bagikan & Sukai Artikel Ini
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                  Bantu pembaca lain menemukan artikel berbobot ini melalui tautan langsung (permalink).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleLikeArticle}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    hasLiked ? 'bg-rose-600 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{hasLiked ? 'Disukai!' : 'Suka'}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Permalink Box */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Link Permalink Tautan Slug Artikel:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow transition flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RELATED ARTICLES SECTION (3 Columns) */}
          {relatedPosts.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
                    Rekomendasi Redaksi
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
                    <span>Artikel Terkait Kategori {post.category}</span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedPosts.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => {
                      if (onSelectPost) onSelectPost(related);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-rose-500 transition-all duration-300 shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-600 text-white uppercase shadow">
                          {related.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {related.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          {new Date(related.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                          <span>Baca</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: SIDEBAR KANAN (Paling Populer & Topik Trending) */}
        <div className="lg:col-span-4 space-y-6 shrink-0">
          
          {/* PALING POPULER BOX */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Paling Populer
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                Top Views
              </span>
            </div>

            <div className="space-y-3">
              {popularPosts.map((popPost, idx) => (
                <div
                  key={popPost.id}
                  onClick={() => {
                    if (onSelectPost) onSelectPost(popPost);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                >
                  {/* Ranking Number Badge */}
                  <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-900'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>

                  {/* Thumbnail Image */}
                  <img
                    src={popPost.coverImage}
                    alt={popPost.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                  />

                  {/* Title & Meta */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider">
                      {popPost.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                      {popPost.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-rose-500" />
                        {popPost.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOPIK TRENDING / TAGS BOX */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Topik Trending
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {allTrendingTags.map((tag) => (
                <span
                  key={tag}
                  onClick={onBack}
                  className="cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700 transition active:scale-95"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* BANNER IKLAN SIDEBAR (300x250) */}
          {siteSettings?.sidebarBanner?.isEnabled && siteSettings?.sidebarBanner?.imageUrl ? (
            <a
              href={siteSettings.sidebarBanner.targetUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:opacity-95 transition overflow-hidden"
            >
              <img
                src={siteSettings.sidebarBanner.imageUrl}
                alt={siteSettings.sidebarBanner.altText || 'Banner Sidebar'}
                className="w-full h-auto max-h-[300px] object-cover rounded-2xl mx-auto"
              />
            </a>
          ) : (
            <div className="p-4 rounded-3xl border border-dashed border-rose-300 dark:border-rose-900/80 bg-gradient-to-b from-rose-50/90 via-amber-50/40 to-rose-50/90 dark:from-rose-950/30 dark:via-slate-900 dark:to-rose-950/30 text-center space-y-3 shadow-xs">
              <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-[9px] rounded-md uppercase tracking-widest inline-block shadow-xs">
                RUANG IKLAN SIDEBAR 300x250
              </span>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                  Pasang Banner & Advertorial Artikel
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Jangkau ratusan ribu pembaca aktif portal EraInspirasi setiap hari.
                </p>
              </div>
              <button className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-md transition">
                Hubungi Tim Redaksi →
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Comments Section */}

      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <span>Komentar & Diskusi ({articleComments.length})</span>
          </h3>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Menulis sebagai: <strong className="text-slate-800 dark:text-slate-200">{user.name}</strong> ({user.role})
            </span>
            {replyingToId && (
              <button
                type="button"
                onClick={() => setReplyingToId(null)}
                className="text-rose-500 hover:underline"
              >
                Batal Balas
              </button>
            )}
          </div>

          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              replyingToId
                ? 'Tulis balasan untuk komentar ini...'
                : 'Tulis tanggapan atau pertanyaan Anda tentang artikel ini...'
            }
            className="w-full p-3 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{replyingToId ? 'Kirim Balasan' : 'Kirim Komentar'}</span>
            </button>
          </div>
        </form>

        {/* Render Comments List */}
        <div className="space-y-4">
          {articleComments.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
              Belum ada komentar. Jadilah yang pertama memberikan tanggapan!
            </p>
          ) : (
            articleComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{comment.authorName}</span>
                        {comment.userRole === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setReplyingToId(comment.id)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Balas
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comment.content}
                </p>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-3 pt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <span>{reply.authorName}</span>
                          <span className="text-[9px] text-indigo-500">(Admin)</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
