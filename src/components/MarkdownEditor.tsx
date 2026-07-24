import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  ShieldCheck, 
  Globe, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Code, 
  List, 
  Link, 
  Eye, 
  Edit3, 
  Calendar, 
  Save, 
  Zap,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Upload,
  Quote,
  Send,
  Sliders,
  Layers,
  LayoutGrid,
  Clock,
  Copy,
  ExternalLink,
  Share2
} from 'lucide-react';
import { BlogPost } from '../types';

interface MarkdownEditorProps {
  initialPost?: BlogPost | null;
  onSavePost: (post: Partial<BlogPost>) => void;
  onBatchSavePosts?: (posts: BlogPost[]) => void;
  onOpenImageUploader: (onSelectUrl: (url: string, alt: string) => void) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialPost,
  onSavePost,
  onBatchSavePosts,
  onOpenImageUploader,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [category, setCategory] = useState(initialPost?.category || 'Teknologi');
  const [tagsInput, setTagsInput] = useState(initialPost?.tags.join(', ') || 'NextJS, AI, WebDev');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [seoDescription, setSeoDescription] = useState(
    initialPost?.seoDescription || initialPost?.excerpt || ''
  );
  const [content, setContent] = useState(
    initialPost?.content ||
      `# Judul Artikel Anda Di Sini\n\nTulis isi tulisan Anda secara visual atau menggunakan markdown di sini...\n\n## Subheading Pertama\n\n* Poin penting satu\n* Poin penting dua\n\n<img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" style="width: 75%; display: block; margin: 16px auto;" alt="Ilustrasi Teknologi" />\n\nTuliskan kelanjutan paragraf artikel Anda di bawah gambar ini dengan nyaman.`
  );
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage ||
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
  );
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(
    initialPost?.status || 'published'
  );
  const [scheduledAt, setScheduledAt] = useState(
    initialPost?.scheduledAt || new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );

  const [copiedSlugLink, setCopiedSlugLink] = useState(false);

  const currentCleanSlug = slug.trim() || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const fullShareablePermalink = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?post=${currentCleanSlug}`
    : `https://erainspirasi.com/?post=${currentCleanSlug}`;

  const handleCopySlugPermalink = () => {
    navigator.clipboard.writeText(fullShareablePermalink);
    setCopiedSlugLink(true);
    setTimeout(() => setCopiedSlugLink(false), 2000);
  };

  const handleGenerateAutoSlug = () => {
    const newSlug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    setSlug(newSlug);
  };

  // Editor Tabs: visual-wp (Mode Visual), write (Mode Teks / Markdown)
  const [activeTab, setActiveTab] = useState<'visual-wp' | 'write'>('visual-wp');

  // WordPress Image Sizing & Alignment
  const [selectedImageWidth, setSelectedImageWidth] = useState<'25%' | '50%' | '75%' | '100%'>('75%');
  const [selectedImageAlign, setSelectedImageAlign] = useState<'center' | 'left' | 'right'>('center');

  // Auto Batch AI Content Generator & Scheduler states
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchCount, setBatchCount] = useState<number>(5);
  const [batchIntervalHours, setBatchIntervalHours] = useState<number>(3);
  const [selectedBatchCategories, setSelectedBatchCategories] = useState<string[]>([
    'Teknologi', 'AI & Penulisan', 'Bisnis & UMKM', 'Inspirasi', 'Nasional', 'Otomotif'
  ]);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchNotification, setBatchNotification] = useState<string | null>(null);

  // AI Modal states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // AI Rewrite states
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [rewriteTone, setRewriteTone] = useState('Informatif & Engaging');
  const [isRewriting, setIsRewriting] = useState(false);

  // AI Detection & Humanize states
  const [aiScore, setAiScore] = useState<number | null>(initialPost?.aiScore ?? null);
  const [isDetectingHumanizing, setIsDetectingHumanizing] = useState(false);
  const [humanizeMessage, setHumanizeMessage] = useState<string | null>(null);

  // Calculate Reading Time & Word Count
  const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordsCount / 200));

  // Toolbar action helpers
  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'Teks';
    const replacement = `${prefix}${selected}${suffix}`;

    setContent(content.substring(0, start) + replacement + content.substring(end));
  };

  // 0. Auto Batch AI Content Generator & Scheduler
  const handleBatchGenerate = async () => {
    if (selectedBatchCategories.length === 0) return;
    setIsBatchGenerating(true);

    try {
      const res = await fetch('/api/gemini/batch-generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: batchCount,
          categories: selectedBatchCategories,
          intervalHours: batchIntervalHours,
        }),
      });

      const json = await res.json();
      if (json.success && json.posts && json.posts.length > 0) {
        if (onBatchSavePosts) {
          onBatchSavePosts(json.posts);
        }
        setBatchNotification(`⚡ Berhasil membuat & menjadwalkan ${json.posts.length} artikel AI otomatis!`);
        setShowBatchModal(false);
      }
    } catch (err) {
      console.error('Error generating batch AI articles:', err);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // 1. AI Generate Article
  const handleGenerateAiArticle = async () => {
    if (!aiTopic.trim()) return;
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/gemini/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          category,
          keywords: tagsInput.split(',').map((t) => t.trim()),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setTitle(json.data.title || title);
        setExcerpt(json.data.excerpt || excerpt);
        setContent(json.data.content || content);
        if (json.data.tags) setTagsInput(json.data.tags.join(', '));
        setShowAiModal(false);
        setAiTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 2. AI Rewrite / Spinning
  const handleRewriteSpin = async () => {
    setIsRewriting(true);
    try {
      const res = await fetch('/api/gemini/rewrite-spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          tone: rewriteTone,
          mode: 'rewrite',
        }),
      });

      const json = await res.json();
      if (json.success && json.rewrittenText) {
        setContent(json.rewrittenText);
        setShowRewriteModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  // 3. AI Detect & Humanize
  const handleDetectHumanize = async () => {
    setIsDetectingHumanizing(true);
    try {
      const res = await fetch('/api/gemini/detect-humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const json = await res.json();
      if (json.success) {
        setAiScore(json.aiScore);
        if (json.humanizedContent) {
          setContent(json.humanizedContent);
        }
        setHumanizeMessage(
          `✅ Berhasil meng-humanize artikel! Probabilitas AI turun menjadi ${json.aiScore}%. Gaya bahasa sekarang bernuansa alami & variatif.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetectingHumanizing(false);
    }
  };

  // SEO Score & Recommendations Calculator (Google 2026 Standards)
  const [showSeoAudit, setShowSeoAudit] = useState(true);

  const getSeoAnalysis = () => {
    let score = 0;
    const checks: { id: string; label: string; passed: boolean; tip: string; weight: number }[] = [];

    const mainTag = tagsInput.split(',')[0]?.trim().toLowerCase() || '';

    // 1. Judul Length (45-70 chars)
    const titleLength = title.trim().length;
    const isTitleIdeal = titleLength >= 45 && titleLength <= 70;
    checks.push({
      id: 'title-len',
      label: `Panjang Judul (${titleLength} Karakter)`,
      passed: isTitleIdeal,
      tip: isTitleIdeal
        ? 'Panjang judul ideal untuk hasil pencarian Google SERP (45-70 karakter).'
        : 'Panjang judul sebaiknya antara 45–70 karakter agar judul tidak terpotong di Google.',
      weight: 15,
    });
    if (isTitleIdeal) score += 15;
    else if (titleLength > 0) score += 7;

    // 2. Keyword in Title
    const hasKeywordInTitle = Boolean(mainTag && title.toLowerCase().includes(mainTag));
    checks.push({
      id: 'keyword-title',
      label: mainTag ? `Kata Kunci ("${mainTag}") di Judul` : 'Kata Kunci Utama di Judul',
      passed: hasKeywordInTitle,
      tip: hasKeywordInTitle
        ? `Kata kunci utama "${mainTag}" terdeteksi di judul artikel.`
        : mainTag
        ? `Masukkan kata kunci "${mainTag}" di dalam judul artikel.`
        : 'Isi Tag/Kata Kunci utama di kolom Tag.',
      weight: 15,
    });
    if (hasKeywordInTitle) score += 15;

    // 3. Meta Excerpt (110-170 chars)
    const excerptLen = excerpt.trim().length;
    const isExcerptIdeal = excerptLen >= 110 && excerptLen <= 170;
    checks.push({
      id: 'excerpt-len',
      label: `Rangkuman / Meta Description (${excerptLen} Karakter)`,
      passed: isExcerptIdeal,
      tip: isExcerptIdeal
        ? 'Panjang Rangkuman Meta ideal untuk snippet Google (110-170 karakter).'
        : 'Disarankan membuat rangkuman 110–170 karakter untuk mengoptimalkan click-through rate (CTR).',
      weight: 15,
    });
    if (isExcerptIdeal) score += 15;
    else if (excerptLen > 0) score += 8;

    // 4. Content Word Count
    const isWordCountGood = wordsCount >= 500;
    checks.push({
      id: 'word-count',
      label: `Kedalaman Artikel (${wordsCount} Kata)`,
      passed: isWordCountGood,
      tip: isWordCountGood
        ? `Artikel sangat mendalam dan berbobot (${wordsCount} kata).`
        : `Tulis minimal 500 kata untuk peluang masuk halaman 1 Google (saat ini ${wordsCount} kata).`,
      weight: 20,
    });
    if (wordsCount >= 600) score += 20;
    else if (wordsCount >= 300) score += 12;

    // 5. Headings H2/H3
    const h2Matches = (content.match(/^##\s+/gm) || []).length;
    const h3Matches = (content.match(/^###\s+/gm) || []).length;
    const hasHeadings = h2Matches >= 2 || h2Matches + h3Matches >= 2;
    checks.push({
      id: 'subheadings',
      label: `Struktur Subjudul H2/H3 (${h2Matches + h3Matches} Ditemukan)`,
      passed: hasHeadings,
      tip: hasHeadings
        ? 'Struktur dokumen terorganisir baik dengan Subheading.'
        : 'Gunakan minimal 2 Subheading (## Subjudul) agar pembaca & Google bot mudah memindai topik.',
      weight: 15,
    });
    if (hasHeadings) score += 15;

    // 6. Cover Image Visual
    const hasCover = Boolean(coverImage && coverImage.trim().length > 5);
    checks.push({
      id: 'cover-img',
      label: 'Gambar Sampul Artikel',
      passed: hasCover,
      tip: hasCover
        ? 'Gambar sampul visual tersedia untuk thumbnail & Google Images.'
        : 'Unggah gambar sampul berkualitas tinggi.',
      weight: 10,
    });
    if (hasCover) score += 10;

    // 7. Keyword in Content Body
    const keywordInBody = Boolean(mainTag && content.toLowerCase().includes(mainTag));
    checks.push({
      id: 'keyword-body',
      label: mainTag ? `Mencantumkan Kata Kunci ("${mainTag}") di Isi` : 'Kepadatan Kata Kunci di Isi',
      passed: keywordInBody,
      tip: keywordInBody
        ? `Kata kunci "${mainTag}" disebutkan dalam teks artikel.`
        : `Sebutkan kata kunci "${mainTag}" beberapa kali dalam paragraf pertama/isi artikel.`,
      weight: 10,
    });
    if (keywordInBody) score += 10;

    const finalScore = Math.min(100, Math.max(0, score));
    return { score: finalScore, checks };
  };

  const seoAnalysis = getSeoAnalysis();

  const handleSave = () => {
    onSavePost({
      id: initialPost?.id || `post-${Date.now()}`,
      title: title || 'Artikel Tanpa Judul',
      seoTitle: seoTitle || title || 'Artikel Tanpa Judul',
      slug: slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      category,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      excerpt: excerpt || title,
      seoDescription: seoDescription || excerpt || title,
      content,
      coverImage,
      status,
      scheduledAt: status === 'scheduled' ? scheduledAt : undefined,
      publishedAt: initialPost?.publishedAt || new Date().toISOString(),
      readingTime: readingTimeMinutes,
      aiScore: aiScore ?? 10,
      humanized: true,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Editor Header Title & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
              WordPress WYSIWYG & AI Studio
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mt-1">
            <Edit3 className="w-5 h-5 text-rose-600" />
            <span>Editor Visual WP & AI Auto-Scheduler</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Nulis artikel ala WordPress visual WYSIWYG, atur lebar gambar langsung, dan auto-generate jadwal posting AI.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Auto Batch AI Schedule Button */}
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white shadow-md hover:brightness-110 transition flex items-center gap-1.5 active:scale-95"
            title="Auto-generate 3-10 artikel AI campuran & jadwalkan posting otomatis"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-200 animate-bounce" />
            <span>⚡ Mix AI Auto-Batch & Jadwal Posting</span>
          </button>

          {/* Single AI Draft Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow hover:opacity-95 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Draf AI Topik</span>
          </button>

          <button
            onClick={() => setShowRewriteModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Rewrite AI</span>
          </button>

          <button
            onClick={handleDetectHumanize}
            disabled={isDetectingHumanizing}
            className="px-3 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isDetectingHumanizing ? 'Menganalisis...' : 'Deteksi & Humanize'}</span>
          </button>

          {/* Save Post Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Artikel</span>
          </button>
        </div>
      </div>

      {/* Batch AI Success Notification Banner */}
      {batchNotification && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{batchNotification}</span>
          </div>
          <button onClick={() => setBatchNotification(null)} className="text-amber-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Humanize Status Alert */}
      {humanizeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <span>{humanizeMessage}</span>
          <button onClick={() => setHumanizeMessage(null)} className="text-emerald-600 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Main Grid Layout: Left Visual Editor + SEO Card (lg:col-span-9), Right Settings Card (lg:col-span-3 - Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Visual/WYSIWYG Editor + SEO Audit Below */}
        <div className="lg:col-span-9 space-y-5">
          
          {/* Main Visual WYSIWYG Editor Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Clean & Unified WordPress Editor Toolbar */}
            <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Left: Quick Formatting Tools */}
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('**', '**')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="Tebal (Bold)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('*', '*')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="Miring (Italic)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n## ')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="+ Subjudul H2"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n### ')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="+ Subjudul H3"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n> ')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="+ Kutipan"
                  >
                    <Quote className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n* ')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="+ List Poin"
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('[Teks Tautan](', ')')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800 transition font-bold"
                    title="Tautan Link"
                  >
                    <Link className="w-4 h-4" />
                  </button>

                  <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1 hidden sm:block" />

                  {/* Inline Image Uploader */}
                  <button
                    type="button"
                    onClick={() =>
                      onOpenImageUploader((url, altText) => {
                        let marginStr = '16px auto';
                        if (selectedImageAlign === 'left') marginStr = '0 16px 16px 0';
                        else if (selectedImageAlign === 'right') marginStr = '0 0 16px 16px';

                        const imgHtml = `\n<img src="${url}" style="width: ${selectedImageWidth}; display: block; margin: ${marginStr}; border-radius: 12px;" alt="${altText || 'Gambar Artikel'}" />\n`;
                        insertTextAtCursor('', imgHtml);
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Sisipkan Gambar ({selectedImageWidth})</span>
                  </button>
                </div>

                {/* Right: View Mode Tabs (Visual & Text) */}
                <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('visual-wp')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activeTab === 'visual-wp' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Mode Visual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activeTab === 'write' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Mode Teks (Markdown)</span>
                  </button>
                </div>

              </div>

              {/* Ultra-Compact Image Control Options Bar */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0">
                    <Sliders className="w-3 h-3 text-rose-600" />
                    <span>Ukuran Gambar:</span>
                  </span>
                  <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {(['25%', '50%', '75%', '100%'] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedImageWidth(w)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                          selectedImageWidth === w ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {w === '25%' ? '25% (Kecil)' : w === '50%' ? '50% (Sedang)' : w === '75%' ? '75% (Besar)' : '100% (Penuh)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">Posisi:</span>
                  <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-black">
                    {(['center', 'left', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setSelectedImageAlign(align)}
                        className={`px-2 py-0.5 rounded transition ${
                          selectedImageAlign === align ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {align === 'center' ? 'Tengah' : align === 'left' ? 'Kiri (Wrap)' : 'Kanan (Wrap)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Textarea & Preview Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[460px]">
              
              {/* 1. WordPress Visual Editor Mode (Clean & Uncluttered Live Experience) */}
              {activeTab === 'visual-wp' && (
                <div className="lg:col-span-12 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                    <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Mode Visual WP: Tampilan Hasil Akhir Langsung Seperti Di Web (Clean & Real-time)</span>
                    </span>
                    <span className="text-slate-400 font-mono">{wordsCount} kata • Est. {readingTimeMinutes} mnt baca</span>
                  </div>

                  {/* Clean Visual Editor Canvas: Left Natural Content Input + Right Live Web Visual View */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Visual Text Area / Natural Writing Block */}
                    <div className="lg:col-span-5 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">Tulis / Edit Naskah Tulisan</label>
                        <span className="text-[10px] text-slate-400">Auto-render ke Visual</span>
                      </div>
                      <textarea
                        id="markdown-textarea"
                        rows={22}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ketik isi artikel di sini. Gunakan tombol 'Sisipkan Gambar' di atas untuk memasukkan foto secara visual tanpa repot koding..."
                        className="w-full p-4 font-sans text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner leading-relaxed"
                      />
                    </div>

                    {/* WP Visual Paper Preview (Pure Live Web Render - Clean & Uncluttered) */}
                    <div className="lg:col-span-7 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Hasil Visual WP (Tampilan Langsung Web Published)</span>
                        </label>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                          100% Persis Web
                        </span>
                      </div>

                      {/* Live Web Paper Card */}
                      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 overflow-y-auto max-h-[580px] shadow-sm space-y-5">
                        
                        {/* Title Header Preview */}
                        <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider inline-block">
                            {category || 'Kategori Artikel'}
                          </span>
                          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                            {title || 'Judul Artikel Anda Terpampang Di Sini'}
                          </h1>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Oleh Redaksi EraInspirasi</span>
                            <span>•</span>
                            <span>{readingTimeMinutes} Menit Baca</span>
                          </div>
                        </div>

                        {/* Article Content Rendered Cleanly */}
                        <article className="prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed space-y-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {content}
                          </ReactMarkdown>
                        </article>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'write' && (
                <div className="lg:col-span-12 flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                    <span>Source Text Kode / Markdown</span>
                    <span className="text-slate-400 font-mono">{wordsCount} kata • Est. {readingTimeMinutes} mnt baca</span>
                  </div>
                  <textarea
                    id="markdown-textarea"
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ketik isi artikel dalam format Teks / Markdown..."
                    className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner leading-relaxed"
                  />
                </div>
              )}

            </div>

          </div>

          {/* Skor Optimasi SEO Card (Placed directly under the editor column) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl flex items-center justify-center font-black text-sm text-white ${
                  seoAnalysis.score >= 80
                    ? 'bg-emerald-600 shadow-lg shadow-emerald-600/30'
                    : seoAnalysis.score >= 50
                    ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                    : 'bg-rose-600 shadow-lg shadow-rose-600/30'
                }`}>
                  <TrendingUp className="w-5 h-5 mr-1" />
                  <span>{seoAnalysis.score}/100</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                    <span>Skor Optimasi SEO Artikel</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      seoAnalysis.score >= 80
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : seoAnalysis.score >= 50
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {seoAnalysis.score >= 80 ? 'Sangat Baik' : seoAnalysis.score >= 50 ? 'Cukup Optimis' : 'Perlu Perbaikan'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Audit real-time berdasarkan standar Google SEO & SERP CTR terbaru.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSeoAudit(!showSeoAudit)}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-center"
              >
                <span>{showSeoAudit ? 'Sembunyikan Checklist' : 'Lihat Rekomendasi Detail'}</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  seoAnalysis.score >= 80
                    ? 'bg-emerald-500'
                    : seoAnalysis.score >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${seoAnalysis.score}%` }}
              />
            </div>

            {/* Checklist List */}
            {showSeoAudit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {seoAnalysis.checks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition ${
                      check.passed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-slate-800 dark:text-slate-200'
                        : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{check.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {check.tip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Compact Sidebar Metadata Card (lg:col-span-3 - Compact Width) */}
        <div className="lg:col-span-3 space-y-4 sticky top-20">
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            
            <div className="border-b border-slate-100 dark:border-slate-700/80 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-600" />
                <span>Atribut & Publikasi</span>
              </h3>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Panel
              </span>
            </div>

            {/* Judul Artikel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  if (!initialPost || !slug) {
                    setSlug(newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                  }
                }}
                placeholder="Masukkan judul artikel..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            {/* Link Share Slug Artikel & Permalinks */}
            <div className="space-y-2 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-blue-600" />
                  <span>Link Share & URL Slug Artikel</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAutoSlug}
                  className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  title="Buat ulang slug dari judul"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Auto Slug</span>
                </button>
              </div>

              {/* Slug Input */}
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="judul-artikel-anda"
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Live Share URL Preview & Copy Button */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                  Link Tautan Share Siap Pakai:
                </span>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-blue-600 dark:text-blue-400 break-all flex items-center justify-between gap-2">
                  <span className="truncate">{fullShareablePermalink}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySlugPermalink}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {copiedSlugLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Link Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link Share</span>
                      </>
                    )}
                  </button>

                  <a
                    href={fullShareablePermalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1 shrink-0"
                    title="Uji Buka Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Uji</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Status Publikasi & Scheduled Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none"
              >
                <option value="published">🚀 Dipublikasikan Langsung</option>
                <option value="draft">📝 Draf (Simpan Saja)</option>
                <option value="scheduled">⏰ Terjadwal Otomatis</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jadwal Rilis
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>
            )}

            {/* Kategori & Tag */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700/80">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none"
                >
                  <option value="Teknologi">Teknologi</option>
                  <option value="AI & Penulisan">AI & Penulisan</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Strategi Digital">Strategi Digital</option>
                  <option value="Pengembangan Diri">Pengembangan Diri</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tag (Dipisah Koma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="NextJS, WebDev, AI"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Gambar Sampul (Cover Image) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Gambar Sampul Utama
              </label>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-900">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenImageUploader((url) => {
                    setCoverImage(url);
                  })
                }
                className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Ganti Gambar Sampul</span>
              </button>
            </div>

            {/* Pengaturan SEO Meta Title & Description */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  <span>Meta Title & Meta Description SEO</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">Google SERP Snippet</span>
              </div>

              {/* SERP Preview Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 text-left">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  https://erainspirasi.com › {category.toLowerCase()} › {slug || 'judul-artikel'}
                </div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 line-clamp-1 hover:underline cursor-pointer">
                  {seoTitle || title || 'Judul Meta SEO Artikel Anda'}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {seoDescription || excerpt || 'Deskripsi meta ringkas artikel Anda akan tampil di snippet hasil pencarian Google...'}
                </div>
              </div>

              {/* Meta Title Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Title SEO</label>
                  <span className={`text-[10px] font-bold ${
                    seoTitle.length >= 50 && seoTitle.length <= 60
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {seoTitle.length} / 60 Karakter
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Meta Title khusus SEO..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Meta Description Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Description SEO</label>
                  <span className={`text-[10px] font-bold ${
                    seoDescription.length >= 120 && seoDescription.length <= 160
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {seoDescription.length} / 160 Karakter
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    setExcerpt(e.target.value);
                  }}
                  placeholder="Ringkasan khusus meta deskripsi Google (120-160 karakter)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Tombol Publish Artikel Utama */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Publish Artikel</span>
            </button>

          </div>
        </div>

      </div>

      {/* AI Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Generasi Artikel AI (Gemini 3.6)</span>
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Masukkan topik yang ingin dibahas. AI Studio akan menyusun judul, rangkuman, tag, dan draf artikel Markdown lengkap secara otomatis.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topik Artikel</label>
              <input
                type="text"
                placeholder="misal: Optimasi Kinerja Database PostgreSQL di Cloud SQL"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateAiArticle}
                disabled={isAiGenerating || !aiTopic.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyusun Artikel...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buat Draf Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Spinning / Rewrite Modal */}
      {showRewriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
                <RefreshCw className="w-5 h-5 text-indigo-500" />
                <span>Spinning & Rewrite Konten AI</span>
              </h3>
              <button onClick={() => setShowRewriteModal(false)} className="text-slate-400 font-bold">
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ubah gaya bahasa, struktur diksi, dan variasi kalimat artikel tanpa menghilangkan ide inti.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gaya Bicara (Tone)</label>
              <select
                value={rewriteTone}
                onChange={(e) => setRewriteTone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Informatif & Engaging">Informatif & Engaging</option>
                <option value="Sangat Profesional & Santun">Sangat Profesional & Santun</option>
                <option value="Santai & Naratif (Storytelling)">Santai & Naratif (Storytelling)</option>
                <option value="Ringkas & Padat (Executive Summary)">Ringkas & Padat (Executive Summary)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRewriteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                onClick={handleRewriteSpin}
                disabled={isRewriting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow"
              >
                {isRewriting ? 'Proses Rewrite...' : 'Lakukan Spinning AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Batch AI Content Generator & Scheduler Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                    Auto-Batch Konten AI & Scheduler
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Otomasi buat & jadwalkan artikel berita/blog campuran AI dalam 1-Klik
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600 font-black text-lg">
                ×
              </button>
            </div>

            {/* Batch Count Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                1. Jumlah Artikel Campuran Di-Generate:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBatchCount(num)}
                    className={`py-2.5 rounded-xl text-xs font-black transition border ${
                      batchCount === num
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {num} Artikel
                  </button>
                ))}
              </div>
            </div>

            {/* Category Mix Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                2. Pilih Kategori Campuran (Mixed Topics):
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Teknologi', 'AI & Penulisan', 'Bisnis & UMKM', 'Inspirasi', 'Nasional', 'Otomotif'].map((catName) => {
                  const isChecked = selectedBatchCategories.includes(catName);
                  return (
                    <label
                      key={catName}
                      className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBatchCategories((prev) => [...prev, catName]);
                          } else {
                            setSelectedBatchCategories((prev) => prev.filter((c) => c !== catName));
                          }
                        }}
                        className="rounded border-rose-400 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="truncate">{catName}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Schedule Interval Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>3. Interval Otomatis Jadwal Posting:</span>
              </label>
              <select
                value={batchIntervalHours}
                onChange={(e) => setBatchIntervalHours(Number(e.target.value))}
                className="w-full p-3 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value={2}>⚡ Setiap 2 Jam Sekali (Rilis Cepat)</option>
                <option value={3}>⏰ Setiap 3 Jam Sekali (Optimal)</option>
                <option value={6}>📅 Setiap 6 Jam Sekali (4 Artikel/Hari)</option>
                <option value={12}>🌅 Setiap 12 Jam Sekali (Pagi & Malam)</option>
                <option value={24}>🗓️ Harian / Every 24 Hours</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleBatchGenerate}
                disabled={isBatchGenerating || selectedBatchCategories.length === 0}
                className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-rose-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isBatchGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Meng-generate {batchCount} Artikel AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-amber-200 text-amber-200" />
                    <span>Mulai Auto-Generate & Jadwalkan ({batchCount} Artikel)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
