import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Send, 
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  MousePointerClick
} from 'lucide-react';
import { SocialPost, SocialPlatform, BlogPost } from '../types';

interface SocialSchedulerProps {
  socialPosts: SocialPost[];
  articles: BlogPost[];
  onAddSocialPost: (post: SocialPost) => void;
}

export const SocialScheduler: React.FC<SocialSchedulerProps> = ({
  socialPosts,
  articles,
  onAddSocialPost,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['x', 'linkedin']);
  const [caption, setCaption] = useState('');
  const [scheduledTime, setScheduledTime] = useState(
    new Date(Date.now() + 3600000 * 4).toISOString().slice(0, 16)
  );
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  const platformsList: { id: SocialPlatform; name: string; icon: string; color: string }[] = [
    { id: 'x', name: 'X (Twitter)', icon: '𝕏', color: 'bg-black text-white' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'bg-blue-600 text-white' },
    { id: 'facebook', name: 'Facebook', icon: 'fb', color: 'bg-blue-700 text-white' },
    { id: 'threads', name: 'Threads', icon: '@', color: 'bg-slate-900 text-white' },
    { id: 'instagram', name: 'Instagram', icon: 'ig', color: 'bg-pink-600 text-white' },
  ];

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateCaptionWithAi = () => {
    const article = articles.find((a) => a.id === selectedArticleId);
    if (!article) return;

    setIsGeneratingCaption(true);
    setTimeout(() => {
      setCaption(
        `🚀 [Artikel Terbaru] ${article.title}\n\n` +
        `${article.excerpt.slice(0, 140)}...\n\n` +
        `💡 Baca pembahasan selengkapnya di Lumina Blog Studio!\n` +
        `👇 Tautan langsung:\n` +
        `https://lumina-blog.id/post/${article.slug}\n\n` +
        `#${article.tags.join(' #')}`
      );
      setIsGeneratingCaption(false);
    }, 800);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || selectedPlatforms.length === 0) return;

    const article = articles.find((a) => a.id === selectedArticleId);

    const newPost: SocialPost = {
      id: `soc-${Date.now()}`,
      articleId: selectedArticleId,
      articleTitle: article?.title || 'Artikel Terkait',
      platforms: selectedPlatforms,
      caption,
      scheduledTime,
      status: 'queued',
      engagementStats: { clicks: 0, shares: 0, likes: 0 },
    };

    onAddSocialPost(newPost);
    setShowAddModal(false);
    setCaption('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-500" />
            <span>Posting Terjadwal Media Sosial Terpadu</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Otomatisasi syndication postingan autokonten ke X, LinkedIn, Facebook, Instagram & Threads dalam satu dashboard.
          </p>
        </div>

        <button
          onClick={() => {
            handleGenerateCaptionWithAi();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Post Baru</span>
        </button>
      </div>

      {/* Connected Channels Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {platformsList.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs ${p.color}`}>
                {p.icon}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Terkoneksi API</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Queue List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
          Antrean Posting Terjadwal ({socialPosts.length})
        </h3>

        <div className="space-y-4">
          {socialPosts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Belum ada postingan media sosial dalam antrean.</p>
          ) : (
            socialPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      📄 {post.articleTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(post.scheduledTime).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        post.status === 'posted'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {post.status === 'posted' ? 'Terpublikasi' : 'Terjadwal'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    {post.platforms.map((plat) => {
                      const found = platformsList.find((p) => p.id === plat);
                      return (
                        <span
                          key={plat}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${found?.color || 'bg-slate-700 text-white'}`}
                        >
                          {found?.name || plat}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-[11px] font-semibold">
                    <span className="flex items-center gap-1" title="Klik">
                      <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                      {post.engagementStats.clicks}
                    </span>
                    <span className="flex items-center gap-1" title="Suka">
                      <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                      {post.engagementStats.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form
            onSubmit={handleScheduleSubmit}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                <span>Jadwalkan Post Multi-Platform</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">
                ×
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Artikel Blog</label>
              <select
                value={selectedArticleId}
                onChange={(e) => {
                  setSelectedArticleId(e.target.value);
                  setTimeout(handleGenerateCaptionWithAi, 100);
                }}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Saluran Saluran Target</label>
              <div className="flex flex-wrap gap-2">
                {platformsList.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      selectedPlatforms.includes(p.id)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Caption / Pesan Medsos</label>
                <button
                  type="button"
                  onClick={handleGenerateCaptionWithAi}
                  className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingCaption ? 'Menyusun...' : 'Auto-Format Caption AI'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Waktu Posting Terjadwal</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow"
              >
                Masukan Ke Antrean Jadwal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
