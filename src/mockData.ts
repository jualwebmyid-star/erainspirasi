import { BlogPost, Comment, SocialPost, AnalyticsData } from './types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Inovasi Mobil Listrik Lokal: Industri Otomotif Nasional Siap Tembus Pasar Global',
    slug: 'inovasi-mobil-listrik-lokal-otomotif-nasional-global',
    excerpt: 'Peluncuran varian kendaraan ramah lingkungan rakitan dalam negeri dengan efisiensi baterai hingga 500 km dalam sekali pengisian daya.',
    content: `# Inovasi Mobil Listrik Lokal: Industri Otomotif Nasional Siap Tembus Pasar Global

Langkah besar otomotif Indonesia ditandai dengan hadirnya platform kendaraan listrik (EV) karya anak bangsa yang menggabungkan desain aerodinamis dan performa baterai generasi terbaru.

![Mobil Listrik Nasional](https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80)

## Keunggulan Teknologi EV Lokal:
1. **Daya Jelajah 500 KM**: Baterai Lithium Ferro-Phosphate teruji untuk cuaca tropis.
2. **Fast Charging 20 Menit**: Mengisi daya dari 10% hingga 80% di stasiun pengisian terintegrasi.
3. **Tingkat Komponen Dalam Negeri (TKDN) 75%**: Memberdayakan ratusan UMKM produsen suku cadang lokal.

> "Era mobilitas bersih telah tiba di Indonesia. Inovasi ini adalah bukti kesiapan kita menjadi pemain utama otomotif masa depan." — Direktur Industri Otomotif`,
    coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Rizky Ramadhan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin'
    },
    category: 'Otomotif',
    tags: ['Otomotif', 'MobilListrik', 'EV', 'Inovasi', 'Tekno'],
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-07-23T07:15:00Z',
    readingTime: 4,
    viewCount: 3420,
    likesCount: 289,
    commentsCount: 8,
    seoTitle: 'Mobil Listrik Nasional Indonesia | EraInspirasi Otomotif',
    seoDescription: 'Ulasan lengkap peluncuran mobil listrik buatan lokal dengan daya jelajah 500 km.',
    seoKeywords: ['Mobil Listrik', 'Otomotif Indonesia', 'EV Nasional', 'Teknologi Baterai'],
    aiScore: 10,
    humanized: true
  },
  {
    id: 'post-2',
    title: 'Transformasi AI & Gadget 2026: Smartphone Lipat dengan Kecerdasan Buatan Terintegrasi',
    slug: 'transformasi-ai-gadget-2026-smartphone-lipat',
    excerpt: 'Lompatan teknologi smartphone terkini menghadirkan chipset AI terdedikasi, kamera pro-grade, dan layar gulung tanpa lipatan.',
    content: `# Transformasi AI & Gadget 2026: Smartphone Lipat dengan Kecerdasan Buatan Terintegrasi

Pasar gadget dunia kembali bergairah dengan hadirnya inovasi layar fleksibel generasi kelima yang menghilangkan secara sempurna celah lipatan (*crease*).

![Gadget AI Smartphone](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80)

## Fitur Utama AI On-Device:
* **Terjemahan Suara Real-time**: Komunikasi 20 bahasa tanpa koneksi internet.
* **Editing Foto Generatif**: Menghapus objek dan mengatur pencahayaan studio dalam hitungan detik.
* **Manajemen Baterai Adaptif**: Ketahanan hingga 48 jam penggunaan intensif.`,
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Siti Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'contributor'
    },
    category: 'Tekno & Gadget',
    tags: ['Tekno', 'Gadget', 'Smartphone', 'AI', 'Inovasi'],
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-07-22T14:30:00Z',
    readingTime: 5,
    viewCount: 2890,
    likesCount: 210,
    commentsCount: 5,
    seoTitle: 'Review Gadget & Smartphone AI Terbaru | EraInspirasi Tekno',
    seoDescription: 'Eksplorasi teknologi smartphone lipat terbaru dengan fitur AI terintegrasi.',
    seoKeywords: ['Gadget 2026', 'Tekno', 'Smartphone AI', 'Review Gadget'],
    aiScore: 12,
    humanized: true
  },
  {
    id: 'post-3',
    title: 'Kisah Inspiratif Pengusaha Muda: Dari Kedai Sederhana Jadi Jaringan Kuliner Nusantara',
    slug: 'kisah-inspiratif-pengusaha-muda-kuliner-nusantara',
    excerpt: 'Inovasi resep warisan keluarga yang dikemas modern berhasil membuka 50 cabang dan memberdayakan ratusan petani rempah lokal.',
    content: `# Kisah Inspiratif Pengusaha Muda: Dari Kedai Sederhana Jadi Jaringan Kuliner Nusantara

Keberanian mengambil keputusan di tengah ketidakpastian menjadi pemicu sukses bisnis kuliner kekinian yang mengangkat cita rasa rempah asli Indonesia.

![Inspirasi Kuliner Bisnis](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80)

## Kunci Sukses Pengembangan Usaha:
1. **Standarisasi Rasa & Kualitas**: Menggunakan sistem dapur pusat terdistribusi.
2. **Kemitraan Petani Lokal**: Membeli pasokan cabai dan rempah langsung dari kelompok tani.
3. **Pemasaran Digital Interaktif**: Memanfaatkan promosi konten video singkat dan media sosial.`,
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Aditya Perkasa',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'contributor'
    },
    category: 'Inspirasi',
    tags: ['Inspirasi', 'KisahSukses', 'PengusahaMuda', 'Kuliner', 'Motivasi'],
    status: 'published',
    publishedAt: '2026-07-22T10:00:00Z',
    readingTime: 4,
    viewCount: 4120,
    likesCount: 390,
    commentsCount: 12,
    seoTitle: 'Kisah Inspiratif Pengusaha Kuliner Nusantara | EraInspirasi',
    seoDescription: 'Kisah sukses pendiri jaringan kuliner lokal yang memberdayakan petani rempah Indonesia.',
    seoKeywords: ['Inspirasi', 'Kisah Sukses', 'Pengusaha Muda', 'Kuliner Nusantara'],
    aiScore: 5,
    humanized: true
  },
  {
    id: 'post-4',
    title: 'Strategi Bisnis & UMKM Digital: Tembus Marketplace Global dengan Akses Permodalan Mikro',
    slug: 'strategi-bisnis-umkm-digital-marketplace-global',
    excerpt: 'Langkah praktis bagi pelaku UMKM memanfaatkan ekosistem pembayaran digital dan ekspor mikro untuk meningkatkan nilai penjualan.',
    content: `# Strategi Bisnis & UMKM Digital: Tembus Marketplace Global dengan Akses Permodalan Mikro

UMKM Indonesia memiliki potensi luar biasa sebagai pilar ekonomi nasional. Digitalisasi pencatatan keuangan dan kemudahan izin ekspor membuka jalan lebar menuju pasar internasional.

![Bisnis UMKM Digital](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80)

## Langkah Digitalisasi UMKM:
* **Digital Onboarding**: Membuka toko di platform marketplace internasional.
* **Pencatatan Keuangan Digital**: Memudahkan akses kredit usaha rakyat (KUR).
* **Branding & Packaging Premium**: Meningkatkan daya saing produk lokal.`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Rizky Ramadhan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin'
    },
    category: 'Bisnis & UMKM',
    tags: ['Bisnis', 'UMKM', 'Ekonomi', 'Digitalisasi', 'Keuangan'],
    status: 'published',
    publishedAt: '2026-07-21T16:00:00Z',
    readingTime: 4,
    viewCount: 1980,
    likesCount: 165,
    commentsCount: 3,
    seoTitle: 'Panduan Bisnis & UMKM Tembus Pasar Global | EraInspirasi Bisnis',
    seoDescription: 'Tips praktis mengembangkan bisnis UMKM melalui digitalisasi dan akses keuangan terpadu.',
    seoKeywords: ['Bisnis UMKM', 'Ekspor Mikro', 'Digitalisasi UMKM', 'Modal Usaha'],
    aiScore: 8,
    humanized: true
  },
  {
    id: 'post-5',
    title: 'Panduan Karir Masa Depan: 5 Skill Utama yang Paling Dicari Industri Tahun 2026',
    slug: 'panduan-karir-masa-depan-5-skill-utama-2026',
    excerpt: 'Pentingnya berpikir kritis, literasi data, adaptabilitas AI, dan komunikasi interpersonal untuk akselerasi karir anak muda.',
    content: `# Panduan Karir Masa Depan: 5 Skill Utama yang Paling Dicari Industri Tahun 2026

Lanskap pekerjaan mengalami transformasi cepat. Perusahaan kini tidak hanya mencari keahlian teknis, tetapi juga ketahanan mental dan fleksibilitas beradaptasi.

![Edukasi dan Karir](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)

## 5 Skill Utama:
1. **Critical Thinking & Problem Solving**
2. **AI Prompting & Automation Literacy**
3. **Emotional Intelligence & Team Synergy**
4. **Data-Driven Decision Making**
5. **Agile Continuous Learning**`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dr. Maya Indah',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: 'admin'
    },
    category: 'Edukasi & Karir',
    tags: ['Edukasi', 'Karir', 'SoftSkills', 'MasaDepan', 'Pekerjaan'],
    status: 'published',
    publishedAt: '2026-07-21T09:00:00Z',
    readingTime: 3,
    viewCount: 2450,
    likesCount: 220,
    commentsCount: 4,
    seoTitle: 'Skill Karir Dicari Industri 2026 | EraInspirasi Edukasi',
    seoDescription: 'Panduan lengkap mengembangkan keterampilan masa depan untuk sukses karir di era digital.',
    seoKeywords: ['Karir Masa Depan', 'Skill 2026', 'Edukasi Karir', 'Literasi Digital'],
    aiScore: 6,
    humanized: true
  },
  {
    id: 'post-6',
    title: 'Gaya Hidup Sehat Urban: Trik Menjaga Pola Makan NUTRISI & Tidur Berkualitas',
    slug: 'gaya-hidup-sehat-urban-pola-makan-tidur-berkualitas',
    excerpt: 'Menjaga kebugaran fisik dan kebersihan mental di tengah kesibukan pekerjaan kantor tanpa perlu biaya mahal.',
    content: `# Gaya Hidup Sehat Urban: Trik Menjaga Pola Makan NUTRISI & Tidur Berkualitas

Kesehatan adalah investasi terbaik untuk umur panjang yang bahagia. Menerapkan kebiasaan kecil setiap hari memberikan dampak besar bagi stamina harian Anda.

![Gaya Hidup Sehat Urban](https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80)

## Kebiasaan Penting:
* Minum air putih 2.5 liter per hari
* Istirahat mata setiap 45 menit di depan komputer
* Tidur teratur 7-8 jam tanpa paparan cahaya biru gawai`,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Siti Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'contributor'
    },
    category: 'Gaya Hidup',
    tags: ['GayaHidup', 'Kesehatan', 'Urban', 'Wellness', 'HidupSehat'],
    status: 'published',
    publishedAt: '2026-07-20T11:20:00Z',
    readingTime: 3,
    viewCount: 1620,
    likesCount: 140,
    commentsCount: 2,
    seoTitle: 'Gaya Hidup Sehat Urban & Kebugaran | EraInspirasi Gaya Hidup',
    seoDescription: 'Tips praktis pola hidup sehat dan kebugaran tubuh untuk masyarakat perkotaan.',
    seoKeywords: ['Gaya Hidup Sehat', 'Kebugaran', 'Urban Life', 'Kesehatan Mental'],
    aiScore: 4,
    humanized: true
  },
  {
    id: 'post-7',
    title: 'Pembangunan Infrastruktur Terpadu: Mendorong Pertumbuhan Ekonomi Wilayah Nasional',
    slug: 'pembangunan-infrastruktur-terpadu-ekonomi-wilayah-nasional',
    excerpt: 'Perluasan jaringan transportasi logistik dan pusat konektivitas digital mempercepat pemerataan pembangunan daerah di Indonesia.',
    content: `# Pembangunan Infrastruktur Terpadu: Mendorong Pertumbuhan Ekonomi Wilayah Nasional

Pemerataan ekonomi nasional ditopang oleh kesiapan sarana transportasi, ketersediaan energi bersih, dan jaringan serat optik hingga pelosok negeri.

![Pembangunan Nasional](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80)`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Rizky Ramadhan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin'
    },
    category: 'Nasional',
    tags: ['Nasional', 'Infrastruktur', 'Ekonomi', 'Pembangunan', 'Berita'],
    status: 'published',
    publishedAt: '2026-07-20T08:00:00Z',
    readingTime: 4,
    viewCount: 2150,
    likesCount: 190,
    commentsCount: 3,
    seoTitle: 'Pembangunan Infrastruktur Nasional | EraInspirasi Berita Nasional',
    seoDescription: 'Kabar terbaru pertumbuhan ekonomi dan proyek konektivitas daerah di Indonesia.',
    seoKeywords: ['Infrastruktur Nasional', 'Berita Indonesia', 'Ekonomi Daerah', 'Pembangunan'],
    aiScore: 5,
    humanized: true
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'post-1',
    authorName: 'Budi Prasetyo',
    authorEmail: 'budi@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    content: 'Artikel yang sangat berbobot! Penjelasan mengenai optimasi gambar WebP & otomatisasi pipeline postingan media sosial sangat praktis.',
    createdAt: '2026-07-22T11:20:00Z',
    status: 'approved',
    likes: 8,
    userRole: 'guest',
    replies: [
      {
        id: 'c-1-1',
        postId: 'post-1',
        authorName: 'Rizky Ramadhan',
        authorEmail: 'rizky@lumina.id',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        content: 'Terima kasih Budi! Fitur AI Content Studio di Lumina ini memang dirancang untuk mempercepat alur kerja harian.',
        createdAt: '2026-07-22T12:05:00Z',
        status: 'approved',
        likes: 4,
        parentId: 'c-1',
        userRole: 'admin'
      }
    ]
  },
  {
    id: 'c-2',
    postId: 'post-2',
    authorName: 'Anita Wijaya',
    authorEmail: 'anita@blog.id',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    content: 'Sangat setuju dengan bagian memasukkan personal anecdote. Pembaca bisa merasakannya langsung saat sebuah artikel ditulis dengan emosi manusiawi.',
    createdAt: '2026-07-21T16:40:00Z',
    status: 'approved',
    likes: 12,
    userRole: 'guest'
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'soc-1',
    articleId: 'post-1',
    articleTitle: 'Membangun Arsitektur Web Modern dengan Next.js 15 & AI Content Pipeline',
    platforms: ['x', 'linkedin', 'threads'],
    caption: '🚀 Baru Rilis! Pelajari cara membangun arsitektur blog personal super cepat dengan Next.js 15, AI Auto-Content Studio, dan otomatisasi SEO friendly. Baca selengkapnya di Lumina Blog! 👇 #WebDev #NextJS #AI',
    scheduledTime: '2026-07-23T10:00:00Z',
    status: 'queued',
    engagementStats: { clicks: 142, shares: 38, likes: 210 }
  },
  {
    id: 'soc-2',
    articleId: 'post-2',
    articleTitle: 'Strategi Humanisasi Konten AI: Menghindari Penalti Mesin Pencari',
    platforms: ['linkedin', 'facebook'],
    caption: 'Apakah artikel buatan AI Anda berisiko terkena penalti Google? Simak strategi 3 langkah menaikkan Human Tone Score & keaslian diksi tanpa kehilangan efisiensi penulisan.',
    scheduledTime: '2026-07-22T15:30:00Z',
    status: 'posted',
    engagementStats: { clicks: 289, shares: 54, likes: 340 }
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  realTimeVisitors: 42,
  totalPageviews: 18450,
  uniqueVisitors: 6200,
  bounceRate: 34.2,
  avgDuration: '3m 45s',
  trafficHistory: [
    { date: '17 Jul', pageviews: 1200, visitors: 450, socialClicks: 120 },
    { date: '18 Jul', pageviews: 1800, visitors: 620, socialClicks: 190 },
    { date: '19 Jul', pageviews: 2100, visitors: 780, socialClicks: 240 },
    { date: '20 Jul', pageviews: 2400, visitors: 910, socialClicks: 310 },
    { date: '21 Jul', pageviews: 3100, visitors: 1150, socialClicks: 420 },
    { date: '22 Jul', pageviews: 3900, visitors: 1420, socialClicks: 580 },
    { date: '23 Jul', pageviews: 4200, visitors: 1580, socialClicks: 640 }
  ],
  topArticles: [
    { id: 'post-1', title: 'Membangun Arsitektur Web Modern dengan Next.js 15', views: 1420, shares: 180 },
    { id: 'post-2', title: 'Strategi Humanisasi Konten AI: Bebas Penalti', views: 980, shares: 124 },
    { id: 'post-3', title: 'Panduan Desain Minimalis & Dark Mode', views: 650, shares: 92 }
  ],
  deviceBreakdown: [
    { device: 'Smartphone (Mobile)', percentage: 58 },
    { device: 'Desktop / Laptop', percentage: 34 },
    { device: 'Tablet', percentage: 8 }
  ],
  referralSources: [
    { source: 'Mesin Pencari (Google Organic)', count: 4200 },
    { source: 'Twitter / X', count: 2100 },
    { source: 'LinkedIn', count: 1450 },
    { source: 'Direct / Bookmark', count: 1200 },
    { source: 'Threads & Facebook', count: 850 }
  ]
};
