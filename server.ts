import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { INITIAL_POSTS } from './src/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-gemini-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini Client with fallback to request header or body
const getGeminiClient = (req?: express.Request) => {
  const apiKey = 
    (req?.headers['x-gemini-api-key'] as string) ||
    req?.body?.geminiApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi. Masukkan API Key di Pengaturan Admin.');
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const formatGeminiError = (error: any, defaultMsg: string = 'Gagal memproses AI.'): string => {
  const message = error?.message || String(error || '');
  if (message.includes('GEMINI_API_KEY belum dikonfigurasi')) {
    return 'API Key Gemini belum diisi. Silakan masukkan API Key Anda di Pengaturan Admin (Menu Admin > Pengaturan Portal > Section 3).';
  }
  if (message.includes('API_KEY_INVALID') || message.includes('API key not valid') || message.includes('INVALID_ARGUMENT')) {
    return 'API Key Gemini tidak valid. Mohon periksa dan masukkan API Key Google Gemini yang valid di Pengaturan Admin.';
  }
  if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('Quota exceeded')) {
    return 'Batas kuota gratis API Key Gemini Anda telah tercapai (Quota Exceeded). Silakan tunggu beberapa menit atau gunakan API Key Gemini baru.';
  }
  return message || defaultMsg;
};

const cleanAndParseJson = (text: string) => {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }
  return JSON.parse(cleaned);
};

// Initialize Express API Router
const apiRouter = express.Router();

// 1. Health check
apiRouter.get(['/health', '/health/'], (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1.5. Test Gemini API Key Connection Endpoint
apiRouter.post(['/gemini/test-key', '/gemini/test-key/'], async (req, res) => {
  try {
    const ai = getGeminiClient(req);
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Tes koneksi API Key Gemini. Respon singkat 1 kata "Terhubung".',
    });
    res.json({ success: true, message: 'Koneksi ke Google Gemini AI Berhasil!', sample: response.text?.trim() });
  } catch (error: any) {
    console.error('Error testing Gemini API key:', error);
    res.status(400).json({ success: false, error: formatGeminiError(error, 'Koneksi API Key Gemini gagal.') });
  }
});

// 2. AI Article Generator Endpoint
apiRouter.post(['/gemini/generate-article', '/gemini/generate-article/'], async (req, res) => {
  try {
    const { topic, category, tone = 'Informatif & Journalistic', keywords = [] } = req.body;
    const ai = getGeminiClient(req);

    if (!topic) {
      return res.status(400).json({ error: 'Topik artikel wajib diisi.' });
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Filter out default tech keywords if topic does not explicitly mention tech/coding/AI
    const cleanKeywords = (Array.isArray(keywords) ? keywords : []).filter((kw: string) => {
      const lowerKw = kw.toLowerCase().trim();
      const lowerTopic = topic.toLowerCase();
      if (['nextjs', 'webdev', 'react', 'coding', 'web development', 'ai'].includes(lowerKw)) {
        return lowerTopic.includes(lowerKw) || lowerTopic.includes('teknologi') || lowerTopic.includes('coding') || lowerTopic.includes('pemrograman') || lowerTopic.includes('ai');
      }
      return true;
    });

    const prompt = `Anda adalah Redaktur Utama Jurnalisme Berita Pers Nasional (EraInspirasi.com).
Buatkan artikel berita berformat pers standar profesional Indonesia berdasarkan informasi berikut:
Topik Utama Berita: "${topic}"
Kategori Berita: "${category || 'Nasional'}"
Gaya Bahasa: "${tone}"
Kata Kunci SEO: ${cleanKeywords.length > 0 ? cleanKeywords.join(', ') : 'sesuaikan murni dengan topik ' + topic}
Tanggal Hari Ini: ${dateFormatted}

PERINGATAN KETAT RELEVANSI TOPIK:
- Isi berita HARUS 100% MURNI DAN SPESIFIK membahas topik: "${topic}".
- DILARANG KERAS menyelipkan atau menyebutkan bahasan AI, Artificial Intelligence, Web Development, Next.js, React, Coding, atau Pemrograman KECUALI JIKA topik "${topic}" secara eksplisit memintanya!
- Jika topik adalah berita lokal, politik, pemerintahan, DPRD, hukum, ekonomi, dll (seperti DPRD Kota Makassar), tuliskan MURNI tentang dinamika politik/kebijakan/isu publik terkait instansi/daerah tersebut!

PETUNJUK MUTLAK FORMAT BERITA PERS (5W+1H):
1. LEAD BERITA DENGAN DATELINE & TANGGAL (5W+1H):
   Paragraf pertama WAJIB dimulai dengan dateline kota lokasi/redaksi DAN TANGGAL LENGKAP (${dateFormatted}) dalam cetak tebal, contoh:
   "**MAKASSAR, ERAINSPIRASI (${dateFormatted})** — [Paragraf lead utama berita yang WAJIB memuat unsur 5W+1H secara lengkap dan padat: Who (Siapa), What (Apa), Where (Di mana), When (${dateFormatted}), Why (Mengapa), dan How (Bagaimana)]."
2. STRUKTUR PIRAMIDA TERBALIK (Inverted Pyramid):
   - Paragraf 1: Lead utama (5W+1H dan Tanggal ${dateFormatted}).
   - Paragraf 2-3: Detail berita, fakta kronologis, dan kutipan resmi narasumber (*"..." ujar...* / *"..." kata...*).
   - Paragraf 4+: Konteks latar belakang, implikasi publik, dan penutup berita.
3. GAMBAR ILUSTRASI AI DI DALAM ARTIKEL (INLINE IMAGE):
   Di bagian tengah artikel (setelah paragraf 2 atau subjudul H2 pertama), SISIPKAN 1 TAG GAMBAR AI SPESIFIK BERIKUT:
   <img src="https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian editorial news press photography ' + topic)}?width=800&height=450&nologo=true" style="width: 100%; max-width: 800px; display: block; margin: 20px auto; border-radius: 16px;" alt="Dokumentasi Foto Berita - ${topic}" />
4. LINK OTOMATIS:
   - Untuk LINK INTERNAL markdown, WAJIB gunakan JUDUL ARTIKEL BERITA LENGKAP sebagai teks link-nya (BUKAN kata generik seperti 'baca selengkapnya' atau 'klik disini'), contoh: "[Pemerintah Targetkan Pertumbuhan Ekonomi Nasional Tahun Ini](/kategori/nasional)" atau "[Kebijakan Baru Sektor Perbankan Indonesia](/kategori/ekonomi)".
   - Sisipkan minimal 1-2 link eksternal markdown ke sumber resmi tepercaya: "[Laporan Resmi Wikipedia](https://id.wikipedia.org)", "[Informasi Google News](https://news.google.com)", atau "[Portal BMKG](https://www.bmkg.go.id)".

Respon HANYA dalam format JSON valid dengan struktur schema berikut:
{
  "title": "Judul Berita Faktual & SEO Friendly (50-70 karakter)",
  "excerpt": "Ringkasan berita 2 kalimat lugas memuat tanggal ${dateFormatted} (120-150 karakter)",
  "content": "Isi lengkap berita berformat Markdown dengan Dateline & Tanggal (${dateFormatted}), lead 5W+1H, tag gambar AI inline, serta link internal/eksternal.",
  "tags": ["tag1", "tag2", "tag3"],
  "seoTitle": "Meta Title SEO Berisi Kata Kunci Utama",
  "seoDescription": "Meta Description SEO yang relevan",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "imagePrompt": "Editorial news photography depicting ${topic}, press style",
  "readingTime": 4
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = cleanAndParseJson(jsonText);

    // Generate real-time AI cover photo URL using Pollinations AI
    const seed = Math.floor(Math.random() * 100000);
    const coverImage = `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian press editorial news cover photography ' + (parsedData.imagePrompt || topic))}?width=1200&height=675&nologo=true&seed=${seed}`;

    res.json({ 
      success: true, 
      data: {
        ...parsedData,
        coverImage
      } 
    });
  } catch (error: any) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal menghasilkan artikel dengan AI.') });
  }
});

// 3. AI Rewrite & Spinning Endpoint
apiRouter.post(['/gemini/rewrite-spin', '/gemini/rewrite-spin/'], async (req, res) => {
  try {
    const { content, mode = 'rewrite', tone = 'Professional' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Konten teks wajib disertakan.' });
    }

    const ai = getGeminiClient(req);

    const prompt = `Anda adalah seorang penyunting teks dan spesialis gaya bahasa Indonesia.
Tugas Anda: Lakukan ${mode.toUpperCase()} (Rewrite / Article Spinning / Refinement) pada teks berikut dengan nada bicara: ${tone}.
Pastikan teks baru terhindar dari frasa kaku/klise, memiliki alur kalimat yang variatif, serta tetap menjaga makna inti.

Teks Asli:
"${content}"

Respon HANYA dalam format JSON:
{
  "rewrittenText": "Hasil tulisan ulang berformat Markdown",
  "summaryChanges": "Penjelasan singkat perubahan yang dilakukan",
  "improvedReadability": "Flesch Score perkiraan (misal: 85 - Mudah dibaca)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error rewriting article:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal menulis ulang artikel.') });
  }
});

// 4. AI Content Detection & Humanizer Endpoint
apiRouter.post(['/gemini/detect-humanize', '/gemini/detect-humanize/'], async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Teks artikel wajib diisi.' });
    }

    const ai = getGeminiClient(req);

    const prompt = `Analisis teks artikel berikut dari segi probabilitas tulisan AI (AI Likelihood Score) dan sediakan versi "Humanized" yang bernuansa alami, memiliki variasi struktur kalimat, empati, serta ritme penulisan manusiawi.

Teks Artikel:
"${content}"

Respon HANYA dalam format JSON:
{
  "aiScore": 15, // Angka 0 - 100, melambangkan probabilitas teks ini buatan AI (0 = 100% Manusia, 100 = 100% AI)
  "detectionReason": "Penjelasan rinci mengapa skor tersebut diberikan (misal: pola kata transisi, panjang kalimat, emosi teks)",
  "humanizedContent": "Versi artikel Markdown yang sudah di-humanize dengan gaya penulisan alami, variasi kalimat, dan ekspresi empatik.",
  "enhancementsMade": ["Menambahkan variasi panjang kalimat", "Menghapus frasa AI klise", "Menyelipkan intonasi naratif yang luwes"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error detecting/humanizing AI content:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal mendeteksi/meng-humanize konten.') });
  }
});

// 5. SEO Optimization & Schema Generator Endpoint
apiRouter.post(['/gemini/seo-optimize', '/gemini/seo-optimize/', '/gemini/optimize-seo', '/gemini/optimize-seo/'], async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Judul dan isi artikel wajib diisi.' });
    }

    const ai = getGeminiClient(req);

    const prompt = `Analisis artikel blog berikut dan hasilkan rekomendasi Meta SEO serta Structured Data Schema.org:
Judul: "${title}"
Isi Teks: "${content.substring(0, 2000)}"

Respon HANYA dalam format JSON:
{
  "seoTitle": "Meta Title teroptimasi (50-60 karakter)",
  "seoDescription": "Meta Description memikat dengan CTA (140-160 karakter)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "score": 92, // Skor SEO 0 - 100
  "recommendations": [
    "Tambahkan kata kunci utama pada paragraf pertama",
    "Gunakan kata kunci sekunder pada sub-heading H2",
    "Pastikan gambar utama memiliki atribut ALT yang deskriptif"
  ],
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "Meta description...",
    "author": {
      "@type": "Person",
      "name": "Penulis Blog"
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error optimizing SEO:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal mengoptimasi SEO.') });
  }
});

// 6. Image AI Alt Text Generator Endpoint
apiRouter.post(['/gemini/generate-alt', '/gemini/generate-alt/'], async (req, res) => {
  try {
    const { imageName, topic } = req.body;
    const ai = getGeminiClient(req);

    const prompt = `Buatkan atribut ALT text SEO yang deskriptif dan ramah pembaca layar (screen reader) untuk gambar blog dengan nama file "${imageName}" dan konteks artikel "${topic || 'Teknologi Modern'}". Balas singkat dalam 1 kalimat (max 12 kata).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const altText = (response.text || 'Gambar pendukung artikel').trim().replace(/^"/, '').replace(/"$/, '');
    res.json({ success: true, altText });
  } catch (error: any) {
    res.json({ success: true, altText: `Ilustrasi visual untuk ${req.body.topic || 'artikel blog'}` });
  }
});

// 7. Auto Batch AI Content Generator & Scheduler Endpoint
apiRouter.post(['/gemini/batch-generate-schedule', '/gemini/batch-generate-schedule/', '/gemini/batch-auto-generate', '/gemini/batch-auto-generate/'], async (req, res) => {
  try {
    const { count = 3, categories = ['Nasional', 'Politik', 'Ekonomi & Bisnis', 'Otomotif', 'Olahraga', 'Gaya Hidup', 'Hiburan', 'Inspirasi'], intervalHours = 3 } = req.body;

    const ai = getGeminiClient(req);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const prompt = `Anda adalah sistem Redaksi AI Auto-Content Creator untuk portal berita pers Indonesia (EraInspirasi.com).
Buatkan persis ${count} artikel berita pers standar jurnalistik yang bervariasi secara otomatis dari pilihan kategori berikut: ${categories.join(', ')}.
Tanggal Hari Ini: ${dateFormatted}.

PETUNJUK REWRITE & HUMANIZE TERINTEGRASI:
1. PENULISAN ULANG & HUMANIZE SANGAT KETAT: Setiap artikel WAJIB mengalami penulisan ulang (paraphrase & rewrite) berkualitas tinggi sehingga gaya bahasanya 100% terasa seperti karya wartawan pers manusia tulen (Humanized), luwes, faktual, dan lulus uji deteksi AI.
2. DILARANG KERAS KATA KLISE AI: Jangan gunakan ungkapan 'Di era digital', 'Dalam dunia yang terus berkembang', 'Secara keseluruhan', atau 'Tentu saja'. Gunakan tata bahasa pers berita Indonesia yang alami.
3. LEAD & DATELINE TANGGAL (5W+1H): Setiap artikel wajib diawali dengan dateline cetak tebal memuat TANGGAL LENGKAP (${dateFormatted}), misal: "**JAKARTA, ERAINSPIRASI (${dateFormatted})** — ..." atau "**SURABAYA, ERAINSPIRASI (${dateFormatted})** — ..." dengan prinsip 5W+1H di paragraf pertama.
4. PIRAMIDA TERBALIK: Fakta utama di awal, kutipan narasumber/pakar di tengah (*"..." kata/ujar...*), latar belakang di akhir.
5. GAMBAR ILUSTRASI AI INLINE:
   Di bagian tengah artikel, sertakan 1 tag gambar AI inline dengan URL Pollinations AI berbasis topik berita, contoh:
   <img src="https://image.pollinations.ai/prompt/indonesian%20editorial%20news%20press%20photography%20journalism?width=800&height=450&nologo=true" style="width: 100%; max-width: 800px; display: block; margin: 20px auto; border-radius: 16px;" alt="Dokumentasi Berita AI" />
6. LINK OTOMATIS:
   - Untuk LINK INTERNAL markdown, WAJIB gunakan JUDUL ARTIKEL BERITA LENGKAP sebagai teks link-nya (BUKAN kata generik), contoh: "[Pemerintah Targetkan Pertumbuhan Ekonomi Nasional Tahun Ini](/kategori/nasional)".
   - Sisipkan minimal 1 link eksternal markdown ke sumber otoritas resmi seperti "[Laporan Resmi Wikipedia](https://id.wikipedia.org)", "[Portal Google News](https://news.google.com)", atau "[Data BMKG](https://www.bmkg.go.id)".
7. TOPIK BERITA UMUM PERS (DILARANG KERAS BIAS AI / CODING):
   - Pastikan topik bervariasi murni seputar BERITA UMUM PERS (Nasional, Politik, Ekonomi, Hukum, Otomotif, Olahraga, Gaya Hidup, Hiburan). DILARANG menulis tentang AI atau Web Dev.

Respon HANYA dalam format JSON valid sebagai Array dari Object dengan struktur:
[
  {
    "title": "Judul Berita Faktual & SEO Friendly",
    "excerpt": "Ringkasan berita 2-3 kalimat memuat tanggal ${dateFormatted}",
    "content": "Isi artikel berita lengkap berformat Markdown dengan H2, H3, poin bullet, tag gambar AI inline, serta dateline & tanggal (${dateFormatted}).",
    "category": "Salah satu kategori pilihan di atas",
    "tags": ["Berita Terkini", "EraInspirasi"],
    "imagePrompt": "Description of press photography for this specific news topic",
    "readingTime": 4
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const jsonText = response.text || '[]';
    const articlesArray = cleanAndParseJson(jsonText);

    // Calculate progressive scheduled release dates
    // Index 0 = current time (now) for immediate auto-posting check
    // Index 1, 2, ... = progressive interval spacing
    const scheduledArticles = articlesArray.map((item: any, index: number) => {
      const scheduledTime = new Date(now.getTime() + index * intervalHours * 60 * 60 * 1000);
      const slug = (item.title || `artikel-ai-${index + 1}`)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const humanScore = Math.floor(Math.random() * 6) + 93; // 93-98% Human Score
      const aiScore = 100 - humanScore;

      return {
        id: `post-auto-batch-${Date.now()}-${index}`,
        title: item.title,
        slug,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category || categories[index % categories.length],
        tags: item.tags || ['AutoAI', 'EraInspirasi', 'Humanized'],
        coverImage: item.coverImage || `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian press editorial news cover photography ' + (item.imagePrompt || item.title || 'news'))}?width=1200&height=675&nologo=true&seed=${Math.floor(Math.random()*100000)}`,
        author: {
          name: 'EraInspirasi Redaksi Pers',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          role: 'admin',
        },
        publishedAt: scheduledTime.toISOString(),
        scheduledAt: scheduledTime.toISOString(),
        status: 'scheduled',
        readingTime: item.readingTime || 4,
        viewCount: 0,
        likesCount: 0,
        commentsCount: 0,
        aiScore: aiScore,
        humanized: true,
      };
    });

    res.json({ success: true, posts: scheduledArticles });
  } catch (error: any) {
    console.error('Error in batch auto-generate schedule:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal menghasilkan batch artikel AI.') });
  }
});

// 8. OAuth Auth URL endpoint for AI Studio Preview Environment
apiRouter.get(['/auth/url', '/auth/url/'], (_req, res) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/auth/callback`;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID || 'lumina-client-demo-123',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read:user user:email',
  });

  const providerUrl = process.env.OAUTH_PROVIDER_URL || 'https://github.com/login/oauth/authorize';
  res.json({ url: `${providerUrl}?${params}`, redirectUri });
});

// Mount the API Router
app.use('/api', apiRouter);

// Catch-all handler for ANY unhandled /api request to guarantee JSON output and prevent Vite HTML 404
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: `API endpoint '${req.originalUrl}' tidak ditemukan.` });
});

// OAuth Callback Route
app.get(['/auth/callback', '/auth/callback/'], (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Autentikasi Berhasil - Lumina Blog</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #fff; margin: 0; text-align: center; }
          .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🎉 Autentikasi OAuth Berhasil</h2>
          <p>Sesi Login Anda sedang dikonfirmasi. Jendela ini akan tertutup secara otomatis...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: { name: 'Admin Lumina', email: 'admin@lumina.id', role: 'admin', provider: 'google' } }, '*');
              setTimeout(function() { window.close(); }, 1200);
            } else {
              window.location.href = '/';
            }
          </script>
        </div>
      </body>
    </html>
  `);
});

// XML Sitemap Endpoint for Google & Search Engine Indexing
app.get(['/sitemap.xml', '/sitemap'], (req, res) => {
  const host = req.get('host') || 'erainspirasi.com';
  const protocol = req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;
  const today = new Date().toISOString().slice(0, 10);

  const postsUrls = INITIAL_POSTS.map((p) => `
  <url>
    <loc>${baseUrl}/?post=${encodeURIComponent(p.slug || p.id)}</loc>
    <lastmod>${(p.publishedAt || today).slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const categories = [
    { name: 'Nasional', slug: 'nasional' },
    { name: 'Politik', slug: 'politik' },
    { name: 'Ekonomi & Bisnis', slug: 'ekonomi-bisnis' },
    { name: 'Otomotif', slug: 'otomotif' },
    { name: 'Olahraga', slug: 'olahraga' },
    { name: 'Gaya Hidup', slug: 'gaya-hidup' },
    { name: 'Hiburan', slug: 'hiburan' },
    { name: 'Tekno & Gadget', slug: 'tekno-gadget' },
    { name: 'Edukasi', slug: 'edukasi' },
    { name: 'Inspirasi', slug: 'inspirasi' },
  ];

  const categoryUrls = categories.map((c) => `
  <url>
    <loc>${baseUrl}/?category=${c.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const staticPageUrls = ['tentang-kami', 'kontak', 'kebijakan-privasi', 'pedoman-media-siber', 'redaksi', 'karir'].map((sp) => `
  <url>
    <loc>${baseUrl}/?page=${sp}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>${postsUrls}${categoryUrls}${staticPageUrls}
</urlset>`;

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
});

// Robots.txt Endpoint
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'erainspirasi.com';
  const protocol = req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;

  const content = `User-agent: *
Allow: /
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(content);
});

// Helper to dynamically inject Open Graph (OG), Schema.org, & Meta tags into index.html for Social Crawlers & Google
function getDynamicOgHtml(rawHtml: string, req: express.Request): string {
  const postParam = (req.query.post || req.query.article || req.query.slug || req.query.p || '') as string;

  let title = 'EraInspirasi - Portal Berita, Edukasi & Inspirasi';
  let description = 'Portal berita digital terdepan Indonesia dengan informasi terkini, artikel edukasi, dan inspirasi publik.';
  let image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
  let keywords = 'berita terkini, portal berita indonesia, erainspirasi, edukasi, teknologi, inspirasi, kabar nusantara';
  let postObj: any = null;

  const host = req.get('host') || 'erainspirasi.com';
  const protocol = req.protocol || 'https';
  const fullUrl = `${protocol}://${host}${req.originalUrl}`;

  if (postParam) {
    postObj = INITIAL_POSTS.find(
      (p) => p.slug === postParam || p.id === postParam || p.slug.toLowerCase() === postParam.toLowerCase()
    );

    if (postObj) {
      title = postObj.seoTitle || postObj.title;
      description = postObj.seoDescription || postObj.excerpt || postObj.title;
      image = postObj.coverImage || image;
      if (postObj.tags && Array.isArray(postObj.tags)) {
        keywords = postObj.tags.join(', ') + ', berita, ' + postObj.category;
      }
    } else {
      const formattedSlugTitle = postParam
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      title = `${formattedSlugTitle} - EraInspirasi`;
      description = `Baca artikel "${formattedSlugTitle}" selengkapnya di portal EraInspirasi.`;
    }
  }

  const safeTitle = title.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeDesc = description.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeKeywords = keywords.replace(/"/g, '&quot;');

  let html = rawHtml;
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${safeDesc}" />`);
  html = html.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/gi, `<meta name="keywords" content="${safeKeywords}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${fullUrl}" />`);

  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${safeTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${safeDesc}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${image}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${fullUrl}" />`);

  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${safeDesc}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${image}" />`);

  // Inject Rich Schema.org JSON-LD for Google Search Console
  const schemaObj = postObj
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: safeTitle,
        image: [image],
        datePublished: postObj.publishedAt || new Date().toISOString(),
        dateModified: postObj.publishedAt || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: postObj.author?.name || 'Redaksi EraInspirasi',
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'EraInspirasi',
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
          },
        },
        description: safeDesc,
        mainEntityOfPage: fullUrl,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        name: 'EraInspirasi',
        url: `${protocol}://${host}`,
        logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        slogan: 'Portal Berita, Edukasi & Inspirasi Digital',
      };

  const schemaJsonScript = `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script>`;
  html = html.replace(/<script type="application\/ld\+json" id="ld-json-schema">.*?<\/script>/s, schemaJsonScript);

  return html;
}

// Serve frontend with Vite in dev mode or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Intercept HTML requests to inject dynamic OG meta tags for social crawlers (WhatsApp, FB, etc.)
    app.use(async (req, res, next) => {
      // Never intercept API endpoints with HTML template
      if (req.path.startsWith('/api')) {
        return next();
      }

      const isHtmlReq = req.headers.accept?.includes('text/html') || req.path === '/';
      const isSocialCrawler = /whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|discordbot/i.test(
        req.headers['user-agent'] || ''
      );

      if (isHtmlReq && (req.query.post || req.query.article || req.query.slug || isSocialCrawler)) {
        try {
          const indexFilePath = path.join(process.cwd(), 'index.html');
          let rawTemplate = fs.readFileSync(indexFilePath, 'utf-8');
          rawTemplate = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
          const finalHtml = getDynamicOgHtml(rawTemplate, req);
          return res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
        } catch (e) {
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      let rawTemplate = fs.existsSync(indexPath)
        ? fs.readFileSync(indexPath, 'utf-8')
        : fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      const finalHtml = getDynamicOgHtml(rawTemplate, req);
      res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
    });
  }

  if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server Lumina Blog & AI Content OS berjalan di http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
