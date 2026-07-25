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
  const { topic, category = 'Umum', tone = 'Informatif & Engaging', keywords = [] } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah seorang Penulis Artikel SEO Profesional dan Jurnalis Senior. Buatlah artikel blog yang sangat menarik, mendalam, dan kaya informasi tentang topik: "${topic}".
Kategori: "${category}".
Gaya Bahasa/Tone: "${tone}".
Kata Kunci SEO yang wajib dimasukkan secara natural: ${keywords.length > 0 ? keywords.join(', ') : 'sesuaikan dengan topik'}.

Format keluaran HARUS dalam JSON valid dengan struktur persis seperti ini (tanpa markdown tambahan):
{
  "title": "Judul Artikel yang Sangat Menarik dan Clickable (60-70 karakter)",
  "content": "Isi artikel lengkap dalam format Markdown dengan Heading (H2, H3), bullet points, bold, dan paragraf rapi (minimal 400-600 kata).",
  "excerpt": "Ringkasan artikel 2 kalimat singkat (120-150 karakter) untuk deskripsi meta.",
  "category": "${category}",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "seoTitle": "Judul Meta SEO Berisi Kata Kunci Utama",
  "seoDescription": "Deskripsi Meta SEO menarik dan mengundang klik",
  "schemaMarkup": "{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"NewsArticle\\",\\"headline\\":\\"...\\",\\"description\\":\\"...\\"}"
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
  const { count = 3, categories = ['Teknologi', 'AI & Penulisan', 'Bisnis & UMKM'], intervalHours = 3 } = body;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Hasilkan ${count} artikel blog berkualitas tinggi secara otomatis.
Pilih topik dari kategori berikut: ${categories.join(', ')}.

Format keluaran HARUS berupa array JSON valid berisi ${count} objek artikel:
[
  {
    "title": "Judul Artikel 1",
    "content": "Isi artikel lengkap format Markdown...",
    "excerpt": "Ringkasan 2 kalimat...",
    "category": "${categories[0] || 'Teknologi'}",
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
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  ];

  const posts = parsedArray.map((p: any, idx: number) => {
    const scheduledTime = new Date(now.getTime() + idx * intervalHours * 3600000);
    return {
      id: `ai-batch-${Date.now()}-${idx}`,
      title: p.title || `Artikel AI ${idx + 1}`,
      content: p.content || '',
      excerpt: p.excerpt || '',
      category: p.category || categories[idx % categories.length] || 'Umum',
      tags: p.tags || ['AI Generated', 'Otomatis'],
      coverImage: sampleImages[idx % sampleImages.length],
      author: {
        name: 'EraInspirasi AI Bot',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        role: 'AI Editor in Chief',
      },
      publishedAt: scheduledTime.toISOString(),
      status: 'scheduled',
      seoTitle: p.seoTitle || p.title,
      seoDescription: p.seoDescription || p.excerpt,
    };
  });

  return { success: true, posts };
}
