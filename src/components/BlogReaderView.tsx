import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  Tag, 
  Calendar, 
  ArrowRight,
  Filter,
  Flame,
  CheckCircle,
  Mail,
  Send,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { BlogPost, SiteSettings } from '../types';
import { VisitorStatsWidget } from './VisitorStatsWidget';

interface BlogReaderViewProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
  siteSettings?: SiteSettings;
}

export const BlogReaderView: React.FC<BlogReaderViewProps> = ({
  posts,
  onSelectPost,
  selectedCategory: propsCategory = 'Semua',
  onSelectCategory,
  siteSettings,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Main Hero Slider state
  const [activeSlide, setActiveSlide] = useState(0);

  // 3-Thumbnail Mini Carousel state
  const [miniCarouselIndex, setMiniCarouselIndex] = useState(0);

  // Lazy Load State for older articles
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const selectedCategory = onSelectCategory ? propsCategory : internalCategory;
  const handleCategorySelect = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
    setSelectedTag(null);
    setVisibleCount(4); // reset lazy load on category switch
  };

  // Extract unique categories & tags
  const categories = ['Semua', ...Array.from(new Set(posts.map((p) => p.category)))];
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Filter posts based on category, search, and tag
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTag && matchesSearch;
  });

  // Lazy load subset
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Featured Hero Slider items: prioritize published posts marked as isFeatured, sorted by publishedAt
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const featuredHeadlinePosts = publishedPosts.filter((p) => p.isFeatured);
  const heroSliderPosts = featuredHeadlinePosts.length > 0
    ? featuredHeadlinePosts.slice(0, 5)
    : publishedPosts.slice(0, 5);

  // 3-Thumbnail Mini Carousel posts (items for mini slider)
  const miniCarouselPool = posts.length >= 3 ? posts : posts;
  const totalMiniSlides = Math.max(1, miniCarouselPool.length - 2);

  const handleNextMini = () => {
    setMiniCarouselIndex((prev) => (prev + 1) % totalMiniSlides);
  };

  const handlePrevMini = () => {
    setMiniCarouselIndex((prev) => (prev === 0 ? totalMiniSlides - 1 : prev - 1));
  };

  // 3 active items for the mini carousel
  const visibleMiniPosts = miniCarouselPool.slice(miniCarouselIndex, miniCarouselIndex + 3);

  // Auto slide main carousel timer
  useEffect(() => {
    if (heroSliderPosts.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSliderPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSliderPosts.length]);

  // Popular posts sorted by views
  const popularPosts = [...posts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);

  // Categories ranked by total article views (Paling Banyak Dibaca)
  const categoriesWithStats = Array.from(new Set(posts.map((p) => p.category)))
    .map((catName) => {
      const catPosts = posts.filter((p) => p.category === catName);
      const totalViews = catPosts.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
      return {
        name: catName,
        count: catPosts.length,
        views: totalViews,
      };
    })
    .sort((a, b) => b.views - a.views);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Category Pills & Quick Filter Toolbar (Compact on Mobile) */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        
        {/* Horizontal Category Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-rose-600 shrink-0 mr-0.5" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat && !selectedTag
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Search Input (Hidden on Mobile to keep header clean & compact) */}
        <div className="hidden md:block relative w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berita & artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tag Active Filter Badge */}
      {selectedTag && (
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold">Tag Terpilih:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
            #{selectedTag}
            <button onClick={() => setSelectedTag(null)} className="ml-1 text-slate-400 hover:text-rose-900 dark:hover:text-white">
              ×
            </button>
          </span>
        </div>
      )}

      {/* Main Content Stream & Sidebar (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Articles List & Hero Sliders (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* EraInspirasi Interactive Main Slider / Hero Carousel - Matched to Article Column Width */}
          {!searchQuery && selectedCategory === 'Semua' && !selectedTag && heroSliderPosts.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl group">
              
              {/* Active Slide Display */}
              {heroSliderPosts.map((slidePost, idx) => {
                if (idx !== activeSlide) return null;
                return (
                  <div
                    key={slidePost.id}
                    className="relative aspect-[16/10] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] flex flex-col justify-end p-4 sm:p-8 px-9 sm:px-12 transition-all duration-700 max-w-full overflow-hidden"
                  >
                    <img
                      src={slidePost.coverImage}
                      alt={slidePost.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/20" />

                    <div className="relative z-10 max-w-2xl space-y-1.5 sm:space-y-2.5 w-full">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black bg-rose-600 text-white shadow-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <Flame className="w-3 h-3 fill-current" />
                          HEADLINE TERUTAMA
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold bg-white/20 backdrop-blur-md text-white shrink-0">
                          {slidePost.category}
                        </span>
                      </div>

                      <h2
                        onClick={() => onSelectPost(slidePost)}
                        className="text-sm sm:text-2xl md:text-3xl font-black text-white hover:text-rose-400 cursor-pointer transition-colors leading-tight sm:leading-tight drop-shadow line-clamp-2 max-w-full break-words"
                      >
                        {slidePost.title}
                      </h2>

                      <p className="text-slate-300 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-2 leading-snug sm:leading-relaxed max-w-full break-words">
                        {slidePost.excerpt}
                      </p>

                      <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-xs text-slate-300 border-t border-white/10 w-full">
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[11px] truncate max-w-[60%] sm:max-w-none">
                          <img
                            src={slidePost.author.avatar}
                            alt={slidePost.author.name}
                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover ring-1 sm:ring-2 ring-rose-500 shrink-0"
                          />
                          <span className="font-semibold text-white truncate max-w-[80px] sm:max-w-none">{slidePost.author.name}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{new Date(slidePost.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-medium text-slate-300">
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                            {slidePost.viewCount}
                          </span>
                          
                          <button
                            onClick={() => onSelectPost(slidePost)}
                            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] sm:text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1 active:scale-95 shrink-0"
                          >
                            <span>Baca</span>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Carousel Left / Right Navigation Controls */}
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? heroSliderPosts.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-all shadow-lg border border-white/10 opacity-80 hover:opacity-100"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % heroSliderPosts.length)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-all shadow-lg border border-white/10 opacity-80 hover:opacity-100"
                title="Slide Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Carousel Pagination Dots */}
              <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 z-20 flex items-center gap-1 sm:gap-1.5">
                {heroSliderPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      idx === activeSlide ? 'w-4 sm:w-6 bg-rose-600' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>

            </div>
          )}

          {/* 3-THUMBNAIL CAROUSEL SECTION (DESKTOP & MOBILE - 3 SMALL COLUMNS IN MOBILE) */}
          {!searchQuery && selectedCategory === 'Semua' && !selectedTag && visibleMiniPosts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 sm:p-1.5 rounded-xl bg-rose-600 text-white shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      SOROTAN BERITA UTAMA
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
                      Rekomendasi visual pilihan redaksi EraInspirasi hari ini
                    </p>
                  </div>
                </div>

                {/* Carousel Prev/Next Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMini}
                    className="p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-300 transition shadow-sm active:scale-95"
                    title="Geser Kiri"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={handleNextMini}
                    className="p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-300 transition shadow-sm active:scale-95"
                    title="Geser Kanan"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Thumbnail Grid Cards: ALWAYS 3 SMALL COLUMNS EVEN ON MOBILE */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {visibleMiniPosts.map((post) => (
                  <div
                    key={`mini-${post.id}`}
                    onClick={() => onSelectPost(post)}
                    className="group cursor-pointer bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-800 transition-all duration-300 flex flex-col justify-between space-y-1.5 sm:space-y-2.5 shadow-xs hover:shadow-md"
                  >
                    <div className="relative w-full h-16 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-rose-600 text-white uppercase tracking-wider shadow">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-tight sm:leading-snug">
                        {post.title}
                      </h4>

                      <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span className="hidden sm:flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Baca</span>
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          <div className="flex items-center justify-between pb-3 border-b-2 border-rose-600">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span>BERITA TERBARU & INSPIRASI</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Menampilkan {visiblePosts.length} dari {filteredPosts.length} Artikel
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <Search className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Tidak ada berita ditemukan
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Coba gunakan kata kunci pencarian lain atau pilih kategori di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {visiblePosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  
                  {/* Article Card */}
                  <div
                    onClick={() => onSelectPost(post)}
                    className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start"
                  >
                    {/* Image Thumbnail */}
                    <div className="w-full sm:w-52 h-40 shrink-0 rounded-xl overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow uppercase">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Article Details */}
                    <div className="flex-1 space-y-2 flex flex-col justify-between h-full min-w-0">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readingTime} mnt baca</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                          {post.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mt-1">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Author, Views & "Selengkapnya" Action Button */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{post.author.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-semibold text-slate-500 text-[11px]">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {post.viewCount}
                          </span>

                          {/* Tombol Selengkapnya / Read More */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPost(post);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
                          >
                            <span>Selengkapnya</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner Iklan di Baris Ke-3 Artikel (index === 2) */}
                  {index === 2 && (siteSettings?.feedRow3Banner?.isEnabled !== false) && (
                    <div className="my-6 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                      {siteSettings?.feedRow3Banner?.imageUrl ? (
                        <a
                          href={siteSettings.feedRow3Banner.targetUrl || 'https://erainspirasi.com/iklan'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block hover:opacity-95 transition"
                        >
                          <img
                            src={siteSettings.feedRow3Banner.imageUrl}
                            alt={siteSettings.feedRow3Banner.altText || 'Banner Sponsor Baris 3'}
                            className="w-full h-auto max-h-[320px] sm:max-h-[420px] object-cover sm:object-fill rounded-2xl"
                          />
                        </a>
                      ) : (
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-rose-50/90 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-md">
                              <span>IKLAN</span>
                              <span className="text-[9px]">BARIS 3</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider">
                                  BANNER SPONSOR
                                </span>
                                <span className="text-xs text-slate-500 font-semibold">Ruang Iklan In-Feed Baris Ke-3</span>
                              </div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                                Banner Sponsor Pilihan Redaksi EraInspirasi.com
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Pasang iklan bisnis, promosi, atau kampanye merek Anda di sini.
                              </p>
                            </div>
                          </div>
                          <a
                            href={siteSettings?.feedRow3Banner?.targetUrl || 'https://erainspirasi.com/iklan'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-md transition-all active:scale-95"
                          >
                            Hubungi Redaksi
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                </React.Fragment>
              ))}

              {/* MUAT LEBIH BANYAK ARTIKEL BUTTON */}
              {visibleCount < filteredPosts.length ? (
                <div className="pt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 font-extrabold text-xs shadow-sm transition-all duration-200 disabled:opacity-75 active:scale-95 group"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600 group-hover:text-white" />
                        <span>Memuat Artikel...</span>
                      </>
                    ) : (
                      <>
                        <span>Muat Lebih Banyak Artikel</span>
                        <ArrowRight className="w-4 h-4 text-rose-600 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                filteredPosts.length > 0 && (
                  <div className="pt-6 text-center">
                    <span className="inline-block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200/80 dark:border-slate-800">
                      ✓ Semua {filteredPosts.length} artikel telah selesai ditampilkan
                    </span>
                  </div>
                )
              )}

            </div>
          )}
        </div>

        {/* Right Column: Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: 🔥 BERITA TERPOPULER */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-rose-600">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-rose-600 fill-current" />
                <span>PALING POPULER</span>
              </h4>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                TOP 5
              </span>
            </div>

            <div className="space-y-3.5">
              {popularPosts.map((post, index) => {
                const rankColor = 
                  index === 0 ? 'bg-rose-600 text-white' :
                  index === 1 ? 'bg-amber-500 text-white' :
                  index === 2 ? 'bg-indigo-600 text-white' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

                return (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group cursor-pointer flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <span className={`w-6 h-6 rounded-lg ${rankColor} font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                      {index + 1}
                    </span>

                    <div className="space-y-1 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="text-rose-600 font-semibold">{post.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewCount} views
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget KATEGORI POPULER (Paling Banyak Dibaca) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b-2 border-rose-600">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <Filter className="w-4 h-4 text-rose-600" />
                <span>KATEGORI TERPOPULER</span>
              </h4>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                DIBACA
              </span>
            </div>

            <div className="space-y-1.5">
              {categoriesWithStats.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-xs font-bold ${
                    selectedCategory === cat.name
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-800 dark:text-slate-200 hover:text-rose-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center shrink-0 ${
                      selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full font-extrabold ${
                      selectedCategory === cat.name
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}>
                      {cat.count} Artikel
                    </span>
                    <span className="flex items-center gap-0.5 opacity-80 font-mono">
                      <Eye className="w-3 h-3" />
                      {cat.views.toLocaleString('id-ID')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 2: 🏷️ TOPIK HANGAT / TAG CLOUD */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide pb-2 border-b border-slate-200 dark:border-slate-800">
              <Tag className="w-4 h-4 text-rose-600" />
              <span>TOPIK TRENDING</span>
            </h4>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                    selectedTag === tag
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Widget 3: 📊 STATISTIK PENGUNJUNG WEB */}
          <VisitorStatsWidget variant="sidebar" />

          {/* Widget 4: 📬 BULLETIN ERAINSPIRASI */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950 text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-rose-500/20 blur-xl pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[10px] font-black uppercase tracking-wider">
                <Mail className="w-3 h-3" />
                BULLETIN DIGITAL
              </div>

              <h4 className="text-base font-black text-white leading-tight">
                Langganan Berita & Inspirasi Terkini
              </h4>

              <p className="text-slate-300 text-xs leading-relaxed">
                Dapatkan artikel inspiratif, edukasi karir, dan tren teknologi langsung di email Anda setiap minggu.
              </p>

              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Terima kasih! Anda berhasil berlangganan.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="Masukkan email Anda..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>Daftar Gratis</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

