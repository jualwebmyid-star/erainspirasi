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

app.use(express.json({ limit: '10mb' }));

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

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1.5. Test Gemini API Key Connection Endpoint
app.post('/api/gemini/test-key', async (req, res) => {
  try {
    const ai = getGeminiClient(req);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Tes koneksi API Key Gemini. Respon singkat 1 kata "Terhubung".',
    });
    res.json({ success: true, message: 'Koneksi ke Google Gemini AI Berhasil!', sample: response.text?.trim() });
  } catch (error: any) {
    console.error('Error testing Gemini API key:', error);
    res.status(400).json({ success: false, error: formatGeminiError(error, 'Koneksi API Key Gemini gagal.') });
  }
});

// 2. AI Article Generator Endpoint
app.post('/api/gemini/generate-article', async (req, res) => {
  try {
    const { topic, category, tone = 'Informatif & Engaging', keywords = [] } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topik artikel wajib diisi.' });
    }

    const ai = getGeminiClient(req);

    const prompt = `Anda adalah penulis konten blog profesional Indonesia & spesialis SEO.
Buatkan artikel blog lengkap berformat Markdown berdasarkan informasi berikut:
Topik: "${topic}"
Kategori: "${category || 'Teknologi'}"
Nada Bicara (Tone): "${tone}"
Kata Kunci Utama: ${keywords.join(', ') || 'terkait topik'}

Respon HANYA dalam format JSON valid dengan struktur schema berikut:
{
  "title": "Judul Artikel yang Menarik & SEO Friendly (50-60 karakter)",
  "excerpt": "Ringkasan/Rangkuman singkat (120-150 karakter)",
  "content": "Isi lengkap artikel berformat Markdown dengan beberapa Subheading (H2, H3), list bullet/number, blockquote, dan blok kode (bila relevan). Minimal 400 kata.",
  "tags": ["tag1", "tag2", "tag3"],
  "seoTitle": "Meta Title SEO",
  "seoDescription": "Meta Description SEO yang relevan",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "readingTime": 4
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = cleanAndParseJson(jsonText);
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal menghasilkan artikel dengan AI.') });
  }
});

// 3. AI Rewrite & Spinning Endpoint
app.post('/api/gemini/rewrite-spin', async (req, res) => {
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
      model: 'gemini-2.5-flash',
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
app.post('/api/gemini/detect-humanize', async (req, res) => {
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
      model: 'gemini-2.5-flash',
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
app.post('/api/gemini/seo-optimize', async (req, res) => {
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
      model: 'gemini-2.5-flash',
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
app.post('/api/gemini/generate-alt', async (req, res) => {
  try {
    const { imageName, topic } = req.body;
    const ai = getGeminiClient(req);

    const prompt = `Buatkan atribut ALT text SEO yang deskriptif dan ramah pembaca layar (screen reader) untuk gambar blog dengan nama file "${imageName}" dan konteks artikel "${topic || 'Teknologi Modern'}". Balas singkat dalam 1 kalimat (max 12 kata).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const altText = (response.text || 'Gambar pendukung artikel').trim().replace(/^"/, '').replace(/"$/, '');
    res.json({ success: true, altText });
  } catch (error: any) {
    res.json({ success: true, altText: `Ilustrasi visual untuk ${req.body.topic || 'artikel blog'}` });
  }
});

// 7. Auto Batch AI Content Generator & Scheduler Endpoint
app.post('/api/gemini/batch-generate-schedule', async (req, res) => {
  try {
    const { count = 3, categories = ['Teknologi', 'AI & Penulisan', 'Bisnis & UMKM', 'Inspirasi', 'Nasional', 'Otomotif'], intervalHours = 3 } = req.body;

    const ai = getGeminiClient(req);

    const prompt = `Anda adalah sistem AI Auto-Content Creator untuk portal berita & blog berita Indonesia (EraInspirasi.com).
Buatkan persis ${count} artikel berita/blog terkini yang variatif dari pilihan kategori berikut: ${categories.join(', ')}.
Setiap artikel harus ditulis secara mendalam, santun, terverifikasi, dan bebas frasa AI klise.

Respon HANYA dalam format JSON valid sebagai Array dari Object dengan struktur:
[
  {
    "title": "Judul Artikel yang Menarik & SEO Friendly",
    "excerpt": "Ringkasan artikel 2-3 kalimat",
    "content": "Isi artikel lengkap berformat Markdown dengan beberapa H2, H3, poin bullet, dan paragraf informatif (minimal 350 kata). Sertakan pula 1 tag gambar markdown seperti: <img src=\\"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80\\" style=\\"width: 75%; display: block; margin: 16px auto; rounded-xl\\" alt=\\"Ilustrasi Topik\\" />",
    "category": "Salah satu kategori pilihan di atas",
    "tags": ["tag1", "tag2", "tag3"],
    "coverImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "readingTime": 4
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const jsonText = response.text || '[]';
    const articlesArray = cleanAndParseJson(jsonText);

    // Calculate progressive scheduled release dates
    const now = new Date();
    const scheduledArticles = articlesArray.map((item: any, index: number) => {
      const scheduledTime = new Date(now.getTime() + (index + 1) * intervalHours * 60 * 60 * 1000);
      const slug = (item.title || `artikel-ai-${index + 1}`)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return {
        id: `post-auto-batch-${Date.now()}-${index}`,
        title: item.title,
        slug,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category || categories[index % categories.length],
        tags: item.tags || ['AutoAI', 'EraInspirasi'],
        coverImage: item.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        authorName: 'AI Redaksi Auto-Scheduler',
        authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        publishedAt: scheduledTime.toISOString(),
        scheduledAt: scheduledTime.toISOString().slice(0, 16),
        status: 'scheduled',
        readingTime: item.readingTime || 4,
        viewCount: 0,
        likesCount: 0,
        commentsCount: 0,
        aiScore: 12,
        humanized: true,
      };
    });

    res.json({ success: true, posts: scheduledArticles });
  } catch (error: any) {
    console.error('Error in batch auto-generate schedule:', error);
    res.status(500).json({ error: formatGeminiError(error, 'Gagal menghasilkan batch artikel AI.') });
  }
});

// 7. OAuth Auth URL endpoint for AI Studio Preview Environment
app.get('/api/auth/url', (_req, res) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/auth/callback`;

  // Provide OAuth URL simulation / actual OAuth provider authorize structure
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID || 'lumina-client-demo-123',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read:user user:email',
  });

  const providerUrl = process.env.OAUTH_PROVIDER_URL || 'https://github.com/login/oauth/authorize';
  res.json({ url: `${providerUrl}?${params}`, redirectUri });
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

// Helper to dynamically inject Open Graph (OG) meta tags into index.html for WhatsApp & Social Media Crawlers
function getDynamicOgHtml(rawHtml: string, req: express.Request): string {
  const postParam = (req.query.post || req.query.article || req.query.slug || req.query.p || '') as string;

  let title = 'EraInspirasi - Portal Berita, Edukasi & Inspirasi';
  let description = 'Portal berita digital terdepan Indonesia dengan informasi terkini, artikel edukasi, dan inspirasi publik.';
  let image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';

  const host = req.get('host') || 'erainspirasi.com';
  const protocol = req.protocol || 'https';
  const fullUrl = `${protocol}://${host}${req.originalUrl}`;

  if (postParam) {
    const post = INITIAL_POSTS.find(
      (p) => p.slug === postParam || p.id === postParam || p.slug.toLowerCase() === postParam.toLowerCase()
    );

    if (post) {
      title = post.seoTitle || post.title;
      description = post.seoDescription || post.excerpt || post.title;
      image = post.coverImage || image;
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

  let html = rawHtml;
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${safeTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${safeDesc}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${image}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${fullUrl}" />`);

  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${safeDesc}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${image}" />`);

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Lumina Blog & AI Content OS berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
