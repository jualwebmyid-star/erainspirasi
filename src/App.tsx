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
import { AdminSettings } from './components/AdminSettings';
import { OAuthModal } from './components/OAuthModal';
import { PushNotificationModal } from './components/PushNotificationModal';
import { ImageUploaderModal } from './components/ImageUploaderModal';
import { SearchModal } from './components/SearchModal';
import { VisitorStatsWidget } from './components/VisitorStatsWidget';
import { db, collection, setDoc, doc, deleteDoc, onSnapshot } from './lib/firebase';
import { updateOpenGraphTags } from './utils/seo';
import { pingSearchEngines } from './utils/sitemapGenerator';

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
  StaticPageItem,
  SiteSettings
} from './types';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [analytics] = useState(INITIAL_ANALYTICS);

  // Site Settings State (Logo, AI API Keys, Socials)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('erainspirasi_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      siteName: 'EraInspirasi',
      siteTagline: 'Portal Berita, Edukasi & Inspirasi Digital',
      logoUrl: '',
      geminiApiKey: '',
      openaiApiKey: '',
      facebookUrl: 'https://facebook.com/erainspirasi',
      instagramUrl: 'https://instagram.com/erainspirasi',
      twitterUrl: 'https://x.com/erainspirasi',
      youtubeUrl: 'https://youtube.com/@erainspirasi',
      whatsappContact: '6281234567890',
    };
  });

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('erainspirasi_settings', JSON.stringify(newSettings));
    try {
      await setDoc(doc(db, 'settings', 'site'), newSettings);
    } catch (e) {
      console.warn('Failed to save settings to Firestore:', e);
    }
  };

  const handleAddCategory = async (newCat: CategoryItem) => {
    const updated = [newCat, ...categories];
    setCategories(updated);
    try {
      await setDoc(doc(db, 'settings', 'categories'), { items: updated });
    } catch (e) {
      console.warn('Failed to add category to Firestore:', e);
    }
  };

  const handleUpdateCategory = async (updatedCat: CategoryItem) => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? updatedCat : c));
    setCategories(updated);
    try {
      await setDoc(doc(db, 'settings', 'categories'), { items: updated });
    } catch (e) {
      console.warn('Failed to update category in Firestore:', e);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    try {
      await setDoc(doc(db, 'settings', 'categories'), { items: updated });
    } catch (e) {
      console.warn('Failed to delete category in Firestore:', e);
    }
  };

  const handleAddMenuItem = async (item: HeaderMenuItem) => {
    const updated = [...headerMenuItems, item];
    setHeaderMenuItems(updated);
    try {
      await setDoc(doc(db, 'settings', 'headerMenu'), { items: updated });
    } catch (e) {
      console.warn('Failed to save header menu to Firestore:', e);
    }
  };

  const handleUpdateMenuItem = async (item: HeaderMenuItem) => {
    const updated = headerMenuItems.map((m) => (m.id === item.id ? item : m));
    setHeaderMenuItems(updated);
    try {
      await setDoc(doc(db, 'settings', 'headerMenu'), { items: updated });
    } catch (e) {
      console.warn('Failed to save header menu to Firestore:', e);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    const updated = headerMenuItems.filter((m) => m.id !== id);
    setHeaderMenuItems(updated);
    try {
      await setDoc(doc(db, 'settings', 'headerMenu'), { items: updated });
    } catch (e) {
      console.warn('Failed to save header menu to Firestore:', e);
    }
  };

  const handleAddStaticPage = async (page: StaticPageItem) => {
    setStaticPages((prev) => [page, ...prev]);
    try {
      await setDoc(doc(db, 'staticPages', page.id), page);
    } catch (e) {
      console.warn('Failed to save static page to Firestore:', e);
    }
  };

  const handleUpdateStaticPage = async (page: StaticPageItem) => {
    setStaticPages((prev) => prev.map((p) => (p.id === page.id ? page : p)));
    try {
      await setDoc(doc(db, 'staticPages', page.id), page);
    } catch (e) {
      console.warn('Failed to update static page in Firestore:', e);
    }
  };

  const handleDeleteStaticPage = async (id: string) => {
    setStaticPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'staticPages', id));
    } catch (e) {
      console.warn('Failed to delete static page from Firestore:', e);
    }
  };


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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('erainspirasi_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User Profile Session Persistence across refreshes
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('erainspirasi_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role) return parsed;
      } catch (e) {}
    }
    return {
      id: 'usr-guest',
      name: 'Pengunjung Portal',
      email: 'pembaca@erainspirasi.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'reader',
      provider: 'guest',
    };
  });

  // Keep user session synced in localStorage
  useEffect(() => {
    if (user && user.role !== 'reader' && user.provider !== 'guest') {
      localStorage.setItem('erainspirasi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('erainspirasi_user');
    }
  }, [user]);

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
      localStorage.setItem('erainspirasi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('erainspirasi_theme', 'light');
    }
  }, [darkMode]);

  // Real-time Firebase Firestore Sync for Articles
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      const postsColRef = collection(db, 'posts');
      unsubscribe = onSnapshot(postsColRef, (snapshot) => {
        if (!snapshot.empty) {
          const loadedPosts: BlogPost[] = snapshot.docs.map((docSnap) => docSnap.data() as BlogPost);
          loadedPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          setPosts(loadedPosts);
        } else {
          // Seed default posts to Firebase Firestore
          INITIAL_POSTS.forEach(async (post) => {
            try {
              await setDoc(doc(db, 'posts', post.id), post);
            } catch (err) {
              console.warn('Seeding initial post to Firebase error:', err);
            }
          });
        }
      }, (err) => {
        console.warn('Firestore snapshot listener warning:', err);
      });
    } catch (e) {
      console.warn('Firestore initialization warning:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Auto-publish scheduled articles whose scheduledAt time has arrived or passed
  useEffect(() => {
    if (posts.length === 0) return;
    const checkScheduled = () => {
      const now = new Date();
      posts.forEach(async (p) => {
        if (p.status === 'scheduled') {
          const scheduledTime = p.scheduledAt ? new Date(p.scheduledAt) : null;
          if (scheduledTime && scheduledTime.getTime() <= now.getTime()) {
            console.log(`Auto-publishing scheduled article: ${p.title}`);
            const updated: BlogPost = {
              ...p,
              status: 'published',
              publishedAt: new Date().toISOString(),
            };
            setPosts((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
            try {
              await setDoc(doc(db, 'posts', p.id), {
                status: 'published',
                publishedAt: new Date().toISOString(),
              }, { merge: true });
            } catch (err) {
              console.warn('Firebase auto-publish scheduled error:', err);
            }
          }
        }
      });
    };

    checkScheduled();
    const timer = setInterval(checkScheduled, 10000);
    return () => clearInterval(timer);
  }, [posts]);

  // Real-time Firebase Firestore Sync for Settings, Categories, Menu & Static Pages
  useEffect(() => {
    let unsubSite: () => void;
    let unsubCat: () => void;
    let unsubMenu: () => void;
    let unsubPages: () => void;

    try {
      // 1. Site Settings
      unsubSite = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          setSiteSettings(data);
          localStorage.setItem('erainspirasi_settings', JSON.stringify(data));
        } else {
          setDoc(doc(db, 'settings', 'site'), siteSettings).catch(console.warn);
        }
      });

      // 2. Categories
      unsubCat = onSnapshot(doc(db, 'settings', 'categories'), (snap) => {
        if (snap.exists() && snap.data()?.items) {
          setCategories(snap.data().items as CategoryItem[]);
        } else {
          setDoc(doc(db, 'settings', 'categories'), { items: categories }).catch(console.warn);
        }
      });

      // 3. Header Menu Items
      unsubMenu = onSnapshot(doc(db, 'settings', 'headerMenu'), (snap) => {
        if (snap.exists() && snap.data()?.items) {
          setHeaderMenuItems(snap.data().items as HeaderMenuItem[]);
        } else {
          setDoc(doc(db, 'settings', 'headerMenu'), { items: headerMenuItems }).catch(console.warn);
        }
      });

      // 4. Static Pages
      unsubPages = onSnapshot(collection(db, 'staticPages'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedPages = snapshot.docs.map((d) => d.data() as StaticPageItem);
          setStaticPages(loadedPages);
        } else {
          staticPages.forEach((page) => {
            setDoc(doc(db, 'staticPages', page.id), page).catch(console.warn);
          });
        }
      });
    } catch (e) {
      console.warn('Firestore settings initialization error:', e);
    }

    return () => {
      if (unsubSite) unsubSite();
      if (unsubCat) unsubCat();
      if (unsubMenu) unsubMenu();
      if (unsubPages) unsubPages();
    };
  }, []);

  // Deep-linking URL Slug Sync & Parser for Shareable Links (Articles, Categories, Static Pages)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // 1. Static Page Permalink Check (?page=kebijakan-privasi or ?static=... or ?p=...)
    const pageParam = params.get('page') || params.get('static');
    if (pageParam && staticPages.length > 0) {
      const cleanPageParam = decodeURIComponent(pageParam).toLowerCase().trim();
      const matchedPage = staticPages.find(
        (p) =>
          p.slug.toLowerCase() === cleanPageParam ||
          p.id.toLowerCase() === cleanPageParam ||
          p.title.toLowerCase().replace(/\s+/g, '-') === cleanPageParam
      );
      if (matchedPage) {
        setSelectedStaticPageSlug(matchedPage.slug);
        setSelectedPost(null);
        setCurrentTab('static-page-view');
        return;
      }
    }

    // 2. Category Permalink Check (?category=gaya-hidup or ?cat=gaya-hidup or ?kategori=gaya-hidup)
    const catParam = params.get('category') || params.get('cat') || params.get('kategori');
    if (catParam) {
      const cleanCatParam = decodeURIComponent(catParam).toLowerCase().trim();
      const matchedCategoryObj = categories.find(
        (c) =>
          c.slug.toLowerCase() === cleanCatParam ||
          c.name.toLowerCase() === cleanCatParam ||
          c.name.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === cleanCatParam ||
          c.id.toLowerCase() === cleanCatParam
      );
      const matchedPostCategory = posts.find(
        (p) =>
          p.category.toLowerCase() === cleanCatParam ||
          p.category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === cleanCatParam
      )?.category;

      const finalCatName = matchedCategoryObj ? matchedCategoryObj.name : (matchedPostCategory || catParam);

      setSelectedCategory(finalCatName);
      setSelectedPost(null);
      setSelectedStaticPageSlug(null);
      setCurrentTab('reader');
      return;
    }

    // 3. Article Post Permalink Check (?post=judul-artikel or ?article=... or ?p=...)
    if (posts.length > 0) {
      const postParam = params.get('post') || params.get('article') || params.get('p');
      if (postParam) {
        const cleanPostParam = decodeURIComponent(postParam).toLowerCase().trim();
        const matched = posts.find(
          (p) =>
            p.slug.toLowerCase() === cleanPostParam ||
            p.id.toLowerCase() === cleanPostParam
        );
        if (matched && (!selectedPost || selectedPost.id !== matched.id)) {
          setSelectedPost(matched);
          setSelectedStaticPageSlug(null);
          setCurrentTab('reader');
        }
      } else if (!selectedPost && !selectedStaticPageSlug) {
        // Default Portal Home Page Open Graph Tags
        updateOpenGraphTags({
          title: siteSettings.siteName || 'EraInspirasi - Portal Berita, Edukasi & Inspirasi',
          description: siteSettings.siteTagline || 'Portal berita digital terdepan Indonesia dengan informasi terkini, artikel edukasi, dan inspirasi publik.',
          image: siteSettings.logoUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
          url: window.location.origin,
          type: 'website',
          siteName: siteSettings.siteName || 'EraInspirasi Portal',
        });
      }
    }
  }, [posts, staticPages, categories, siteSettings]);

  // Update browser tab title with slogan and favicon icon
  useEffect(() => {
    if (selectedPost) {
      document.title = `${selectedPost.title} | ${siteSettings.siteName || 'EraInspirasi'}`;
    } else if (selectedStaticPageSlug) {
      const page = staticPages.find((p) => p.slug === selectedStaticPageSlug);
      if (page) {
        document.title = `${page.title} - ${siteSettings.siteName || 'EraInspirasi'}`;
      }
    } else {
      const name = siteSettings.siteName || 'EraInspirasi';
      const slogan = siteSettings.siteSlogan || siteSettings.siteTagline || 'Portal Berita Terdepan, Edukasi & Inspirasi';
      document.title = `${name} - ${slogan}`;
    }

    // Dynamic favicon icon update
    if (siteSettings.siteIcon) {
      let iconLink: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(iconLink);
      }
      iconLink.href = siteSettings.siteIcon;
    }
  }, [selectedPost, selectedStaticPageSlug, siteSettings, staticPages]);

  // Handlers
  const handleLogout = () => {
    setUser({
      id: 'usr-guest',
      name: 'Pengunjung Portal',
      email: 'pembaca@erainspirasi.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'reader',
      provider: 'guest',
    });
    handleBackToReader();
    setCurrentTab('reader');
  };

  const handleBackToReader = () => {
    setSelectedPost(null);
    setSelectedStaticPageSlug(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleSelectPostToRead = (post: BlogPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p))
    );
    setSelectedPost(post);
    setSelectedStaticPageSlug(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `?post=${post.slug || post.id}`);
    }
  };

  const handleOpenStaticPage = (slug: string) => {
    setSelectedStaticPageSlug(slug);
    setSelectedPost(null);
    setCurrentTab('static-page-view');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `?page=${encodeURIComponent(slug)}`);
    }
  };

  const getCategorySlug = (catName: string) => {
    const found = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    if (found && found.slug) return found.slug;
    return catName
      .toLowerCase()
      .trim()
      .replace(/&/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedPost(null);
    setSelectedStaticPageSlug(null);
    setCurrentTab('reader');
    if (typeof window !== 'undefined') {
      if (cat === 'Semua' || cat === 'Beranda') {
        window.history.pushState({}, '', window.location.pathname);
      } else {
        const catSlug = getCategorySlug(cat);
        window.history.pushState({}, '', `?category=${catSlug}`);
      }
    }
  };

  const handleAddComment = async (postId: string, content: string, parentId?: string) => {
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

    try {
      await setDoc(doc(db, 'comments', newComment.id), newComment);
    } catch (err) {
      console.warn('Firebase save comment warning:', err);
    }
  };

  const handleSavePost = async (savedPostData: Partial<BlogPost>) => {
    let newPost: BlogPost;
    if (savedPostData.id && posts.some((p) => p.id === savedPostData.id)) {
      const existing = posts.find((p) => p.id === savedPostData.id)!;
      newPost = { ...existing, ...savedPostData } as BlogPost;
    } else {
      newPost = {
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
        isFeatured: savedPostData.isFeatured !== undefined ? savedPostData.isFeatured : true,
        publishedAt: new Date().toISOString(),
        readingTime: savedPostData.readingTime || 3,
        viewCount: 1,
        likesCount: 0,
        commentsCount: 0,
        aiScore: savedPostData.aiScore || 10,
        humanized: true,
      };
    }

    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newPost.id);
      if (exists) {
        return prev.map((p) => (p.id === newPost.id ? newPost : p));
      } else {
        return [newPost, ...prev];
      }
    });

    try {
      await setDoc(doc(db, 'posts', newPost.id), newPost, { merge: true });
    } catch (err) {
      console.warn('Firebase save article error:', err);
    }

    // Auto-ping Google & Bing for real-time sitemap indexing
    pingSearchEngines();

    setEditingPost(null);
    setCurrentTab('reader');
  };

  const handleBatchSavePosts = async (newBatchPosts: BlogPost[]) => {
    setPosts((prev) => [...newBatchPosts, ...prev]);
    for (const p of newBatchPosts) {
      try {
        await setDoc(doc(db, 'posts', p.id), p, { merge: true });
      } catch (err) {
        console.warn('Firebase batch save article error:', err);
      }
    }
    // Auto-ping Google & Bing after batch import/generator
    pingSearchEngines();
  };

  const handleDeletePost = async (id: string) => {
    const postToDelete = posts.find((p) => p.id === id);
    if (!postToDelete) return;
    const confirmMove = window.confirm(
      `Apakah Anda yakin ingin memindahkan artikel "${postToDelete.title}" ke Trash (Sampah)?\n\nArtikel tidak akan tampil di portal publik, namun dapat dipulihkan kapan saja.`
    );
    if (!confirmMove) return;

    const trashedPost: BlogPost = { ...postToDelete, status: 'trash' };
    setPosts((prev) => prev.map((p) => (p.id === id ? trashedPost : p)));
    try {
      await setDoc(doc(db, 'posts', id), { status: 'trash' }, { merge: true });
    } catch (err) {
      console.warn('Firebase move to trash article error:', err);
    }
  };

  const handleRestorePost = async (id: string) => {
    const postToRestore = posts.find((p) => p.id === id);
    if (!postToRestore) return;
    const restoredPost: BlogPost = { ...postToRestore, status: 'draft' };
    setPosts((prev) => prev.map((p) => (p.id === id ? restoredPost : p)));
    try {
      await setDoc(doc(db, 'posts', id), { status: 'draft' }, { merge: true });
    } catch (err) {
      console.warn('Firebase restore article error:', err);
    }
  };

  const handlePermanentDeletePost = async (id: string) => {
    const postToDelete = posts.find((p) => p.id === id);
    if (!postToDelete) return;
    const confirmPermanent = window.confirm(
      `PERINGATAN: Apakah Anda benar-benar yakin ingin menghapus PERMANEN artikel "${postToDelete.title}"?\n\nTindakan ini tidak dapat dibatalkan!`
    );
    if (!confirmPermanent) return;

    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (err) {
      console.warn('Firebase permanent delete article error:', err);
    }
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
          <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
            <Header
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setSelectedPost(null);
                setSelectedStaticPageSlug(null);
                setCurrentTab(tab);
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', window.location.pathname);
                }
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
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
                  onSelectPostToRead={(post) => {
                    handleSelectPostToRead(post);
                    setCurrentTab('reader');
                  }}
                  onDeletePost={handleDeletePost}
                  onRestorePost={handleRestorePost}
                  onPermanentDeletePost={handlePermanentDeletePost}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onImportWpPosts={handleBatchSavePosts}
                />
              )}

              {currentTab === 'editor' && (
                <MarkdownEditor
                  initialPost={editingPost}
                  onSavePost={handleSavePost}
                  onBatchSavePosts={handleBatchSavePosts}
                  onOpenImageUploader={handleOpenImagePicker}
                  siteSettings={siteSettings}
                />
              )}

              {currentTab === 'settings' && (
                <AdminSettings
                  settings={siteSettings}
                  onSaveSettings={handleSaveSettings}
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
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}

              {currentTab === 'header-menu' && (
                <HeaderMenuManager
                  menuItems={headerMenuItems}
                  categories={categories}
                  staticPages={staticPages}
                  onAddMenuItem={handleAddMenuItem}
                  onUpdateMenuItem={handleUpdateMenuItem}
                  onDeleteMenuItem={handleDeleteMenuItem}
                />
              )}

              {currentTab === 'static-pages' && (
                <StaticPageManager
                  staticPages={staticPages}
                  onAddPage={handleAddStaticPage}
                  onUpdatePage={handleUpdateStaticPage}
                  onDeletePage={handleDeleteStaticPage}
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

              {currentTab === 'seo' && (
                <SeoOptimizer 
                  article={posts[0]} 
                  allPosts={posts} 
                  allCategories={categories} 
                  staticPages={staticPages} 
                />
              )}

              {currentTab === 'reader' && (
                selectedPost ? (
                  <ArticleDetailView
                    post={selectedPost}
                    comments={comments}
                    onBack={handleBackToReader}
                    onAddComment={handleAddComment}
                    user={user}
                    allPosts={posts}
                    onSelectPost={handleSelectPostToRead}
                    siteSettings={siteSettings}
                  />
                ) : (
                  <BlogReaderView
                    posts={posts}
                    onSelectPost={handleSelectPostToRead}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    siteSettings={siteSettings}
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
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', window.location.pathname);
              }
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
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
            siteSettings={siteSettings}
            posts={posts}
            onSelectPost={handleSelectPostToRead}
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
                onBack={handleBackToReader}
                onAddComment={handleAddComment}
                user={user}
                allPosts={posts}
                onSelectPost={handleSelectPostToRead}
                siteSettings={siteSettings}
              />
            ) : (

              <BlogReaderView
                posts={posts}
                onSelectPost={handleSelectPostToRead}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                siteSettings={siteSettings}
              />
            )}
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
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
