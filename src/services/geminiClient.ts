import { GoogleGenAI } from '@google/genai';

// Helper to clean JSON response from Gemini code block markers
const cleanJsonResponse = (rawText: string) => {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
};

export async function testGeminiKeyDirect(apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Tes koneksi API Key Gemini. Respon singkat 1 kata "Terhubung".',
  });
  return {
    success: true,
    message: 'Koneksi ke Google Gemini AI Berhasil! (Client Direct Mode)',
    sample: response.text?.trim(),
  };
}

export async function generateArticleDirect(apiKey: string, body: { topic: string; category?: string; tone?: string; keywords?: string[] }) {
  const { topic, category = 'Nasional', tone = 'Informatif & Journalistic', keywords = [] } = body;
  const ai = new GoogleGenAI({ apiKey });

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
Buatkan artikel berita berformat pers standar profesional Indonesia mengenai topik: "${topic}".
Kategori: "${category}".
Gaya Bahasa: "${tone}".
Kata Kunci SEO: ${cleanKeywords.length > 0 ? cleanKeywords.join(', ') : 'sesuaikan murni dengan topik ' + topic}.
Tanggal Hari Ini: ${dateFormatted}.

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

Format keluaran HARUS dalam JSON valid (tanpa markdown pembungkus):
{
  "title": "Judul Berita Faktual, Menarik, dan SEO Friendly (60-70 karakter)",
  "content": "Isi lengkap berita berformat Markdown yang menyertakan Dateline & Tanggal (${dateFormatted}), lead 5W+1H, tag gambar AI inline, serta link internal/eksternal.",
  "excerpt": "Ringkasan berita 2 kalimat lugas (120-150 karakter) memuat tanggal ${dateFormatted} dan fakta utama.",
  "category": "${category}",
  "tags": ["Berita Terkini", "EraInspirasi", "Pers"],
  "seoTitle": "Judul Meta SEO",
  "seoDescription": "Deskripsi Meta SEO",
  "imagePrompt": "Professional editorial news photography depicting ${topic}, 8k resolution, press news style"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = cleanJsonResponse(response.text || '{}');
  const seed = Math.floor(Math.random() * 100000);
  const coverImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian press editorial news cover photography ' + (parsed.imagePrompt || topic))}?width=1200&height=675&nologo=true&seed=${seed}`;

  return { 
    success: true, 
    coverImage: coverImageUrl,
    ...parsed 
  };
}

export async function rewriteSpinDirect(apiKey: string, body: { content: string; mode?: string; tone?: string }) {
  const { content, mode = 'rewrite', tone = 'Professional' } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah pakar Content Rewriter & Copywriter. Lakukan ${mode === 'spin' ? 'Article Spinning (variasi kata & struktur tanpa mengubah makna)' : 'Paraphrase & Rewrite (Penyempurnaan gaya bahasa & keterbacaan)'} untuk teks berikut.
Gaya Bahasa: ${tone}.

Teks Asli:
"""
${content}
"""

Format keluaran HARUS dalam JSON valid dengan struktur persis seperti berikut (tanpa markdown):
{
  "original": "Teks asli yang dimasukkan",
  "result": "Hasil penulisan ulang / spinning yang sangat natural, rapi, dan bebas plagiarisme",
  "variationCount": 3,
  "keywordsExtracted": ["KataKunci1", "KataKunci2", "KataKunci3"],
  "seoScore": 92
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = cleanJsonResponse(response.text || '{}');
  return { success: true, ...parsed };
}

export async function detectHumanizeDirect(apiKey: string, body: { content: string }) {
  const { content } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah spesialis AI Content Detector & Humanizer. Analisis teks berikut untuk mendeteksi tingkat pola AI vs penulisan Manusia, lalu hasilkan versi "Humanized" yang terdengar 100% ditulis oleh manusia dengan emosi, variasi kalimat natural, dan alur bercerita yang hangat.

Teks untuk dianalisis:
"""
${content}
"""

Format keluaran HARUS dalam JSON valid:
{
  "aiScore": 85,
  "humanScore": 15,
  "analysis": "Teks menggunakan struktur kalimat monoton khas AI dengan kata-kata repetitif.",
  "humanizedContent": "Versi teks yang sudah diubah menjadi sangat natural, seperti gaya manusia tulen."
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = cleanJsonResponse(response.text || '{}');
  return { success: true, ...parsed };
}

export async function seoOptimizeDirect(apiKey: string, body: { title: string; content: string }) {
  const { title, content } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah Pakar SEO Senior & Content Strategist. Analisis dan optimalkan judul serta isi artikel berikut untuk mesin pencari Google.

Judul Saat Ini: "${title}"
Konten Saat Ini:
"""
${content}
"""

Berikan hasil optimasi SEO lengkap dalam format JSON:
{
  "seoScore": 88,
  "suggestedTitle": "Judul Meta SEO Terbaik yang mengandung kata kunci & mengundang klik",
  "metaDescription": "Deskripsi meta 140-160 karakter yang sempurna untuk snippet Google",
  "keywords": ["kata kunci 1", "kata kunci 2", "kata kunci 3"],
  "schemaJsonLd": "{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"...\\"}",
  "readabilityNotes": "Catatan keterbacaan dan saran perbaikan paragraf",
  "headingStructure": ["H1: ...", "H2: ...", "H2: ..."]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = cleanJsonResponse(response.text || '{}');
  return { success: true, ...parsed };
}

export async function generateAltDirect(apiKey: string, body: { imageName: string; topic?: string }) {
  const { imageName, topic } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Buatkan atribut ALT text SEO yang deskriptif dan ramah pembaca layar (screen reader) untuk gambar blog dengan nama file "${imageName}" dan konteks artikel "${topic || 'Teknologi Modern'}". Balas singkat dalam 1 kalimat (max 12 kata).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });

  return { success: true, altText: response.text?.trim().replace(/^"|"$/g, '') || imageName };
}

export async function batchGenerateDirect(apiKey: string, body: { count?: number; categories?: string[]; intervalHours?: number }) {
  const { 
    count = 3, 
    categories = ['Nasional', 'Politik', 'Ekonomi & Bisnis', 'Teknologi', 'Otomotif', 'Olahraga', 'Gaya Hidup', 'Hiburan'], 
    intervalHours = 3 
  } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah sistem Redaksi AI Auto-Scheduler Berita Pers Indonesia (EraInspirasi.com).
Hasilkan persis ${count} artikel berita standar jurnalistik nasional yang bervariasi secara otomatis dari pilihan kategori berikut: ${categories.join(', ')}.

PETUNJUK FORMAT BERITA STANDAR PERS & JURNALISTIK:
1. LEAD & DATELINE (5W+1H): Setiap artikel diawali dengan dateline cetak tebal, misal: "**JAKARTA, ERAINSPIRASI** — ..." atau "**BANDUNG, ERAINSPIRASI** — ..." dengan prinsip 5W+1H di paragraf pertama.
2. PIRAMIDA TERBALIK: Fakta utama di awal, kutipan narasumber/pakar di tengah (*"..." kata...*), latar belakang & konteks di akhir.
3. LINK OTOMATIS:
   - Untuk LINK INTERNAL markdown, WAJIB gunakan JUDUL ARTIKEL BERITA LENGKAP sebagai teks link-nya (BUKAN kata generik), contoh: "[Pemerintah Targetkan Pertumbuhan Ekonomi Nasional Tahun Ini](/kategori/nasional)".
   - Sisipkan minimal 1 link eksternal markdown ke sumber otoritas resmi seperti "[Sumber Resmi Wikipedia](https://id.wikipedia.org)", "[Portal Google News](https://news.google.com)", atau "[Portal BMKG](https://www.bmkg.go.id)".
4. VARIASI TOPIK BANYAK BERITA UMUM PERS (TANPA BIAS CODING / AI):
   - Pastikan topik beragam (Nasional, Politik, Ekonomi, Otomotif, Olahraga, Gaya Hidup, Hiburan) dan DILARANG menulis tentang AI atau Web Dev.

Format keluaran HARUS berupa array JSON valid berisi ${count} objek artikel:
[
  {
    "title": "Judul Berita Faktual & SEO Friendly",
    "content": "Isi artikel berita lengkap format Markdown sesuai aturan pers...",
    "excerpt": "Ringkasan berita 2 kalimat...",
    "category": "${categories[0] || 'Nasional'}",
    "tags": ["Tag1", "Tag2"],
    "seoTitle": "Judul SEO Meta",
    "seoDescription": "Deskripsi SEO Meta"
  }
]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsedArray = cleanJsonResponse(response.text || '[]');
  const now = new Date();
  const sampleImages = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  ];

  const posts = parsedArray.map((p: any, idx: number) => {
    const scheduledTime = new Date(now.getTime() + idx * intervalHours * 3600000);
    const cleanTitle = p.title || `Berita Terkini ${idx + 1}`;
    const cleanSlug = cleanTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return {
      id: `post-${Date.now()}-${idx}`,
      title: cleanTitle,
      slug: cleanSlug,
      content: p.content || '',
      excerpt: p.excerpt || '',
      category: p.category || categories[idx % categories.length] || 'Nasional',
      tags: p.tags || ['Berita Terkini', 'EraInspirasi'],
      coverImage: sampleImages[idx % sampleImages.length],
      author: {
        name: 'EraInspirasi Redaksi Pers',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        role: 'Redaktur Utama',
      },
      publishedAt: scheduledTime.toISOString(),
      status: 'scheduled',
      seoTitle: p.seoTitle || p.title,
      seoDescription: p.seoDescription || p.excerpt,
    };
  });

  return { success: true, posts };
}
