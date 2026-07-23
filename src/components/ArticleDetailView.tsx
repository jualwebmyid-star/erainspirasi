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
  ChevronRight
} from 'lucide-react';
import { BlogPost, Comment, UserProfile } from '../types';

interface ArticleDetailViewProps {
  post: BlogPost;
  comments: Comment[];
  onBack: () => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
  user: UserProfile;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  post,
  comments,
  onBack,
  onAddComment,
  user
}) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTocMenu, setShowTocMenu] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Baca berita terbaru di EraInspirasi: "${post.title}" - ${window.location.href}`);
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

  const articleComments = comments.filter((c) => c.postId === post.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
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
          <span className="truncate max-w-[200px] sm:max-w-[300px] text-slate-700 dark:text-slate-300">{post.title}</span>
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

      {/* Article Header Metadata */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white shadow uppercase tracking-wider">
            {post.category}
          </span>

          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-sm">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50"
            />
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{post.author.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 capitalize">
                  {post.author.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} mnt baca
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 font-semibold mr-2">
              <Eye className="w-4 h-4 text-rose-500" />
              {post.viewCount} Views
            </span>

            <button
              onClick={handleLikeArticle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                hasLiked
                  ? 'bg-rose-600 border-rose-600 text-white font-bold shadow'
                  : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-rose-400'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes} Suka</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow"
              title="Bagikan ke WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5"
              title="Salin Tautan Artikel"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Compact Table of Contents (TOC) Trigger Next to Copy Button */}
            {headings.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowTocMenu(!showTocMenu)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                  title="Daftar Isi Artikel"
                >
                  <List className="w-3.5 h-3.5 text-rose-600" />
                  <span>Daftar Isi</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-rose-600 text-white rounded-full">
                    {headings.length}
                  </span>
                </button>

                {/* Compact Dropdown Card */}
                {showTocMenu && (
                  <div className="absolute right-0 sm:right-auto sm:left-0 top-full mt-2 w-72 max-h-72 overflow-y-auto p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-30 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                        <List className="w-3.5 h-3.5" />
                        <span>Daftar Isi Artikel</span>
                      </span>
                      <button
                        onClick={() => setShowTocMenu(false)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-1 text-xs">
                      {headings.map((h, i) => (
                        <a
                          key={i}
                          href={`#${h.id}`}
                          onClick={() => setShowTocMenu(false)}
                          className="block p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-semibold transition truncate"
                        >
                          • {h.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary Banner (If Generated) */}
      {aiSummary && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-purple-900/10 border border-purple-500/30 text-slate-800 dark:text-slate-200 text-sm space-y-2">
          <div className="font-bold flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Studio Summary</span>
          </div>
          <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* Hero Cover Image */}
      <div className="rounded-2xl overflow-hidden aspect-[21/9] border border-slate-200 dark:border-slate-800 shadow-md">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Full-Width Article Content Wrapper Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 rounded-3xl shadow-sm space-y-6">
        <article className="prose dark:prose-invert max-w-none w-full space-y-4 text-slate-900 dark:text-slate-100 leading-relaxed text-base sm:text-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
        </article>
      </div>

      {/* Share & Feedback Row */}
      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Sukai atau Bagikan Artikel Ini</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Bantu pembaca lain menemukan artikel berbobot ini di saluran media sosial Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLikeArticle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              hasLiked ? 'bg-rose-600 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{hasLiked ? 'Disukai!' : 'Suka'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan'}</span>
          </button>
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
