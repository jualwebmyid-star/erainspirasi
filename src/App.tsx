import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdminSidebar } from './components/AdminSidebar';
import { BlogReaderView } from './components/BlogReaderView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { CmsDashboard } from './components/CmsDashboard';
import { MarkdownEditor } from './components/MarkdownEditor';
import { SocialScheduler } from './components/SocialScheduler';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SeoOptimizer } from './components/SeoOptimizer';
import { CategoryManager } from './components/CategoryManager';
import { HeaderMenuManager } from './components/HeaderMenuManager';
import { StaticPageManager } from './components/StaticPageManager';
import { StaticPageReaderView } from './components/StaticPageReaderView';
import { UserManager } from './components/UserManager';
import { OAuthModal } from './components/OAuthModal';
import { PushNotificationModal } from './components/PushNotificationModal';
import { ImageUploaderModal } from './components/ImageUploaderModal';
import { SearchModal } from './components/SearchModal';

import { 
  INITIAL_POSTS, 
  INITIAL_COMMENTS, 
  INITIAL_SOCIAL_POSTS, 
  INITIAL_ANALYTICS 
} from './mockData';
import { 
  BlogPost, 
  Comment, 
  SocialPost, 
  UserProfile, 
  CategoryItem, 
  HeaderMenuItem, 
  StaticPageItem 
} from './types';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [analytics] = useState(INITIAL_ANALYTICS);

  // Initial Article Categories State
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'c1', name: 'Tekno & Gadget', slug: 'tekno-gadget', description: 'Kabar AI, gadget terbaru, dan inovasi software', articleCount: 4, color: 'bg-indigo-600 text-white' },
    { id: 'c2', name: 'Inspirasi', slug: 'inspirasi', description: 'Kisah sukses pendiri startup dan motivasi karir', articleCount: 3, color: 'bg-rose-600 text-white' },
    { id: 'c3', name: 'Bisnis & UMKM', slug: 'bisnis-umkm', description: 'Strategi ekosistem pasar, investasi, dan keuangan', articleCount: 5, color: 'bg-emerald-600 text-white' },
    { id: 'c4', name: 'Edukasi & Karir', slug: 'edukasi-karir', description: 'Tips beasiswa, skill digital, dan sertifikasi', articleCount: 2, color: 'bg-amber-500 text-slate-900' },
    { id: 'c5', name: 'Gaya Hidup', slug: 'gaya-hidup', description: 'Kesehatan mental, produktivitas, dan kuliner', articleCount: 3, color: 'bg-purple-600 text-white' },
    { id: 'c6', name: 'Nasional', slug: 'nasional', description: 'Kebijakan publik, ekonomi makro, dan rilis pers', articleCount: 4, color: 'bg-cyan-600 text-white' },
    { id: 'c7', name: 'Otomotif', slug: 'otomotif', description: 'Kendaraan listrik lokal, tren EV, dan modifikasi', articleCount: 2, color: 'bg-slate-800 text-white' },
  ]);

  // Initial Header Menu Items State
  const [headerMenuItems, setHeaderMenuItems] = useState<HeaderMenuItem[]>([
    { id: 'm1', label: 'Beranda', url: '/', type: 'custom', order: 1, isVisible: true },
    { id: 'm2', label: 'Tekno & Gadget', url: '/kategori/tekno-gadget', type: 'category', order: 2, isVisible: true },
    { id: 'm3', label: 'Inspirasi', url: '/kategori/inspirasi', type: 'category', order: 3, isVisible: true },
    { id: 'm4', label: 'Bisnis & UMKM', url: '/kategori/bisnis-umkm', type: 'category', order: 4, isVisible: true },
    { id: 'm5', label: 'Tentang Kami', url: '/p/tentang-kami', type: 'page', order: 5, isVisible: true },
    { id: 'm6', label: 'Kebijakan Privasi', url: '/p/kebijakan-privasi', type: 'page', order: 6, isVisible: true },
    { id: 'm7', label: 'Kontak Redaksi', url: '/p/kontak-redaksi', type: 'page', order: 7, isVisible: true },
  ]);

  // Initial Static Pages State
  const [staticPages, setStaticPages] = useState<StaticPageItem[]>([
    {
      id: 'p1',
      title: 'Tentang Kami',
      slug: 'tentang-kami',
      metaDescription: 'Profil resmi, visi misi, dan jajaran redaksi portal EraInspirasi.com',
      updatedAt: '23 Juli 2026',
      isPublished: true,
      content: `# Tentang EraInspirasi.com\n\n**EraInspirasi.com** adalah portal berita, edukasi, dan inspirasi digital terdepan di Indonesia. Kami berkomitmen menyajikan liputan jurnalistik yang independen, cepat, tajam, dan terverifikasi.\n\n### Visi Kami\nMenjadi sumber rujukan informasi teknologi, bisnis UMKM, dan inspirasi karir tepercaya bagi masyarakat Indonesia.\n\n### Dewan Redaksi\n- **Pemimpin Redaksi**: Rizky Ramadhan\n- **Redaktur Pelaksana**: Siti Sarah\n- **Tim Jurnalis**: Ahmad Fauzi, Dian Sastro, Budi Santoso`,
    },
    {
      id: 'p2',
      title: 'Kebijakan Privasi',
      slug: 'kebijakan-privasi',
      metaDescription: 'Kebijakan perlindungan data pribadi pengunjung EraInspirasi.com',
      updatedAt: '23 Juli 2026',
      isPublished: true,
      content: `# Kebijakan Privasi EraInspirasi\n\nKami menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat mengunjungi portal EraInspirasi.com.\n\n1. **Pengumpulan Data**: Kami mengumpulkan email hanya ketika Anda mendaftar akun atau berlangganan notifikasi berita.\n2. **Penggunaan Cookie**: Cookie digunakan untuk mempersonalisasi pengalaman membaca Anda dan menganalisis trafik web.\n3. **Keamanan Data**: Data disimpan secara aman menggunakan protokol enkripsi standar industri.`,
    },
    {
      id: 'p3',
      title: 'Syarat & Ketentuan',
      slug: 'syarat-ketentuan',
      metaDescription: 'Ketentuan penggunaan konten dan layanan EraInspirasi.com',
      updatedAt: '23 Juli 2026',
      isPublished: true,
      content: `# Syarat & Ketentuan Penggunaan\n\nDengan mengakses EraInspirasi.com, Anda menyetujui syarat dan ketentuan berikut:\n\n- Seluruh materi artikel, foto, dan video dilindungi oleh hak cipta.\n- Pengutipan artikel diperbolehkan maksimal 20% dengan wajib menyertakan link sumber aktif ke EraInspirasi.com.\n- Dilarang mengunggah komentar yang mengandung unsur SARA, ujaran kebencian, atau spam.`,
    },
    {
      id: 'p4',
      title: 'Kontak Redaksi',
      slug: 'kontak-redaksi',
      metaDescription: 'Hubungi tim redaksi, pers, dan iklan EraInspirasi.com',
      updatedAt: '23 Juli 2026',
      isPublished: true,
      content: `# Hubungi Redaksi EraInspirasi\n\nKami terbuka untuk saran, siaran pers, kritik, dan peluang kerjasama iklan.\n\n- **Email Redaksi**: redaksi@erainspirasi.com\n- **Kerjasama Iklan**: iklan@erainspirasi.com\n- **Alamat Kantor**: Wisma Cyber Lt. 12, Jl. HR Rasuna Said, Jakarta Selatan\n- **Telepon / WhatsApp**: +62 812-3456-7890`,
    },
  ]);

  // Navigation tab & State
  const [currentTab, setCurrentTab] = useState<string>('reader');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedStaticPageSlug, setSelectedStaticPageSlug] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // User Profile Session
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-admin',
    name: 'Redaktur Utama',
    email: 'admin@erainspirasi.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    provider: 'system',
  });

  // Users List State (Firebase & Google Auth RBAC)
  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      id: 'usr-admin',
      name: 'Redaktur Utama',
      email: 'admin@erainspirasi.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      provider: 'email',
    },
    {
      id: 'usr-google-1',
      name: 'Ahmad Fauzi (Google Auth)',
      email: 'ahmadfauzi@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'contributor',
      provider: 'google',
    },
    {
      id: 'usr-reader-1',
      name: 'Dian Sastro (Pembaca)',
      email: 'dian.sastro@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'reader',
      provider: 'google',
    },
  ]);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState(true);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [imageCallback, setImageCallback] = useState<((url: string, alt: string) => void) | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleLogout = () => {
    setUser({
      id: 'usr-guest',
      name: 'Pengunjung',
      email: 'pembaca@erainspirasi.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'reader',
      provider: 'guest',
    });
    setSelectedPost(null);
    setSelectedStaticPageSlug(null);
    setCurrentTab('reader');
  };

  const handleSelectPostToRead = (post: BlogPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, viewCount: p.viewCount + 1 } : p))
    );
    setSelectedPost(post);
    setSelectedStaticPageSlug(null);
  };

  const handleOpenStaticPage = (slug: string) => {
    setSelectedStaticPageSlug(slug);
    setSelectedPost(null);
    setCurrentTab('static-page-view');
  };

  const handleAddComment = (postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      authorName: user.name,
      authorEmail: user.email,
      authorAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      status: 'approved',
      likes: 0,
      parentId,
      userRole: user.role,
    };

    setComments((prev) => [newComment, ...prev]);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  const handleSavePost = (savedPostData: Partial<BlogPost>) => {
    if (savedPostData.id && posts.some((p) => p.id === savedPostData.id)) {
      setPosts((prev) =>
        prev.map((p) => (p.id === savedPostData.id ? ({ ...p, ...savedPostData } as BlogPost) : p))
      );
    } else {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: savedPostData.title || 'Artikel Tanpa Judul',
        slug: savedPostData.slug || 'artikel-baru',
        content: savedPostData.content || '',
        excerpt: savedPostData.excerpt || '',
        coverImage: savedPostData.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        author: {
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
        category: savedPostData.category || 'Tekno & Gadget',
        tags: savedPostData.tags || ['Inovasi', 'Digital'],
        status: savedPostData.status || 'published',
        publishedAt: new Date().toISOString(),
        readingTime: savedPostData.readingTime || 3,
        viewCount: 1,
        likesCount: 0,
        commentsCount: 0,
        aiScore: savedPostData.aiScore || 10,
        humanized: true,
      };

      setPosts((prev) => [newPost, ...prev]);
    }

    setEditingPost(null);
    setCurrentTab('reader');
  };

  const handleBatchSavePosts = (newBatchPosts: BlogPost[]) => {
    setPosts((prev) => [...newBatchPosts, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenImagePicker = (callback: (url: string, alt: string) => void) => {
    setImageCallback(() => callback);
    setShowImageUploader(true);
  };

  const activeStaticPage = staticPages.find((p) => p.slug === selectedStaticPageSlug);

  const categoriesNameList = ['Beranda', ...categories.map((c) => c.name)];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* IF ADMIN: Compact Row Layout (Left Sidebar + Right Main Body) */}
      {user.role === 'admin' ? (
        <div className="flex flex-1 min-h-screen">
          {/* Permanent Left Admin Sidebar */}
          <AdminSidebar
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setSelectedPost(null);
              setSelectedStaticPageSlug(null);
              setCurrentTab(tab);
            }}
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />

          {/* Right Main Content Panel */}
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            <Header
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setSelectedPost(null);
                setSelectedStaticPageSlug(null);
                setCurrentTab(tab);
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedPost(null);
                setCurrentTab('reader');
              }}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenPush={() => setShowPushModal(true)}
              onOpenSearch={() => setShowSearchModal(true)}
              onLogout={handleLogout}
              unreadNotificationsCount={isPushSubscribed ? 2 : 0}
            />

            <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
              {currentTab === 'dashboard' && (
                <CmsDashboard
                  posts={posts}
                  comments={comments}
                  onSelectPostToEdit={(post) => {
                    setEditingPost(post);
                    setCurrentTab('editor');
                  }}
                  onDeletePost={handleDeletePost}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'editor' && (
                <MarkdownEditor
                  initialPost={editingPost}
                  onSavePost={handleSavePost}
                  onBatchSavePosts={handleBatchSavePosts}
                  onOpenImageUploader={handleOpenImagePicker}
                />
              )}

              {currentTab === 'users' && (
                <UserManager
                  usersList={usersList}
                  onUpdateUserRole={(userId, newRole) => {
                    setUsersList((prev) =>
                      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                    );
                    if (user.id === userId) {
                      setUser((prev) => ({ ...prev, role: newRole }));
                    }
                  }}
                />
              )}

              {currentTab === 'categories' && (
                <CategoryManager
                  categories={categories}
                  onAddCategory={(newCat) => setCategories((prev) => [newCat, ...prev])}
                  onUpdateCategory={(updated) =>
                    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
                  }
                  onDeleteCategory={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))}
                />
              )}

              {currentTab === 'header-menu' && (
                <HeaderMenuManager
                  menuItems={headerMenuItems}
                  categories={categories}
                  staticPages={staticPages}
                  onAddMenuItem={(item) => setHeaderMenuItems((prev) => [...prev, item])}
                  onUpdateMenuItem={(item) =>
                    setHeaderMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)))
                  }
                  onDeleteMenuItem={(id) => setHeaderMenuItems((prev) => prev.filter((m) => m.id !== id))}
                />
              )}

              {currentTab === 'static-pages' && (
                <StaticPageManager
                  staticPages={staticPages}
                  onAddPage={(page) => setStaticPages((prev) => [page, ...prev])}
                  onUpdatePage={(page) =>
                    setStaticPages((prev) => prev.map((p) => (p.id === page.id ? page : p)))
                  }
                  onDeletePage={(id) => setStaticPages((prev) => prev.filter((p) => p.id !== id))}
                  onViewPagePublic={(slug) => handleOpenStaticPage(slug)}
                />
              )}

              {currentTab === 'social' && (
                <SocialScheduler
                  socialPosts={socialPosts}
                  articles={posts}
                  onAddSocialPost={(newPost) => setSocialPosts((prev) => [newPost, ...prev])}
                />
              )}

              {currentTab === 'analytics' && <AnalyticsDashboard analytics={analytics} />}

              {currentTab === 'seo' && <SeoOptimizer article={posts[0]} />}

              {currentTab === 'reader' && (
                selectedPost ? (
                  <ArticleDetailView
                    post={selectedPost}
                    comments={comments}
                    onBack={() => setSelectedPost(null)}
                    onAddComment={handleAddComment}
                    user={user}
                  />
                ) : (
                  <BlogReaderView
                    posts={posts}
                    onSelectPost={handleSelectPostToRead}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                  />
                )
              )}

              {currentTab === 'static-page-view' && activeStaticPage && (
                <StaticPageReaderView
                  page={activeStaticPage}
                  onBackToHome={() => {
                    setSelectedStaticPageSlug(null);
                    setCurrentTab('reader');
                  }}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* PUBLIC READER LAYOUT */
        <div className="flex flex-col min-h-screen">
          <Header
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setSelectedPost(null);
              setSelectedStaticPageSlug(null);
              setCurrentTab(tab);
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedPost(null);
              setSelectedStaticPageSlug(null);
              setCurrentTab('reader');
            }}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenPush={() => setShowPushModal(true)}
            onOpenSearch={() => setShowSearchModal(true)}
            onLogout={handleLogout}
            unreadNotificationsCount={isPushSubscribed ? 2 : 0}
            categoriesList={categoriesNameList}
            headerMenuItems={headerMenuItems}
            onOpenStaticPage={handleOpenStaticPage}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {currentTab === 'static-page-view' && activeStaticPage ? (
              <StaticPageReaderView
                page={activeStaticPage}
                onBackToHome={() => {
                  setSelectedStaticPageSlug(null);
                  setCurrentTab('reader');
                }}
              />
            ) : selectedPost ? (
              <ArticleDetailView
                post={selectedPost}
                comments={comments}
                onBack={() => setSelectedPost(null)}
                onAddComment={handleAddComment}
                user={user}
              />
            ) : (
              <BlogReaderView
                posts={posts}
                onSelectPost={handleSelectPostToRead}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            )}
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white font-black text-sm px-2 py-0.5 rounded-lg">ERA</span>
                  <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                    INSPIRASI.COM
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {staticPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handleOpenStaticPage(page.slug)}
                      className="hover:text-rose-600 transition"
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>© 2026 <strong>EraInspirasi.com</strong> • PT Era Inspirasi Media Nusantara</div>
                <div className="text-slate-400">Standardisasi Pers & Jurnalistik Digital Terverifikasi</div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Modals */}
      <OAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          setUsersList((prev) => {
            const exists = prev.some((u) => u.id === updated.id || u.email === updated.email);
            if (!exists) {
              return [updated, ...prev];
            }
            return prev.map((u) => (u.id === updated.id || u.email === updated.email ? updated : u));
          });
          if (updated.role === 'admin') {
            setCurrentTab('dashboard');
          }
        }}
      />

      <PushNotificationModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        isSubscribed={isPushSubscribed}
        setIsSubscribed={setIsPushSubscribed}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        posts={posts}
        onSelectPost={(post) => {
          handleSelectPostToRead(post);
          setCurrentTab('reader');
        }}
      />

      <ImageUploaderModal
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onSelectImage={(url, alt) => {
          if (imageCallback) imageCallback(url, alt);
          setShowImageUploader(false);
        }}
      />
    </div>
  );
}
