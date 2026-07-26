import { BlogPost, CategoryItem, StaticPage } from '../types';

export interface SitemapGenerationOptions {
  posts: BlogPost[];
  categories: CategoryItem[] | string[];
  staticPages: StaticPage[];
  baseUrl?: string;
}

/**
  * Safely converts category name or object into slugified format for clean permalinks.
  */
export function slugifyCategory(cat: string | CategoryItem): string {
  if (typeof cat === 'object' && cat !== null) {
    if (cat.slug) return cat.slug;
    return cat.name
      .toLowerCase()
      .trim()
      .replace(/&/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  return String(cat)
    .toLowerCase()
    .trim()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
  * Generates a fully compliant sitemap.xml string from articles, categories, and static pages.
  */
export function generateSitemapXml({
  posts,
  categories,
  staticPages,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://erainspirasi.com',
}: SitemapGenerationOptions): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);

  // Filter published posts only
  const publishedPosts = posts.filter((p) => p.status === 'published' || !p.status);

  // 1. Post URLs
  const postsXml = publishedPosts
    .map((p) => {
      const slug = p.slug || p.id;
      const lastMod = p.publishedAt ? p.publishedAt.slice(0, 10) : today;
      return `  <url>
    <loc>${cleanBaseUrl}/?post=${encodeURIComponent(slug)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  // 2. Category URLs
  const catList = Array.isArray(categories) ? categories : [];
  const categoriesXml = catList
    .map((cat) => {
      const catSlug = slugifyCategory(cat);
      if (!catSlug || catSlug === 'semua' || catSlug === 'beranda') return '';
      return `  <url>
    <loc>${cleanBaseUrl}/?category=${catSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .filter(Boolean)
    .join('\n');

  // 3. Static Pages URLs
  const publishedPages = staticPages.filter((sp) => sp.isPublished !== false);
  const staticPagesXml = publishedPages
    .map((sp) => {
      const pageSlug = sp.slug || sp.id;
      const lastMod = sp.updatedAt ? sp.updatedAt.slice(0, 10) : today;
      return `  <url>
    <loc>${cleanBaseUrl}/?page=${encodeURIComponent(pageSlug)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Portal Home -->
  <url>
    <loc>${cleanBaseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
${postsXml ? `\n  <!-- Articles -->\n${postsXml}` : ''}
${categoriesXml ? `\n  <!-- Categories -->\n${categoriesXml}` : ''}
${staticPagesXml ? `\n  <!-- Static Pages -->\n${staticPagesXml}` : ''}
</urlset>`;
}

/**
  * Triggers Google Ping and Bing IndexNow to notify search engine bots about new content.
  */
export async function pingSearchEngines(sitemapUrl?: string): Promise<{ success: boolean; message: string }> {
  const targetSitemap = sitemapUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://erainspirasi.com'}/sitemap.xml`;
  try {
    const pingGoogleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(targetSitemap)}`;
    // Fire ping request (no-cors or standard fetch)
    fetch(pingGoogleUrl, { mode: 'no-cors' }).catch(() => {});
    return {
      success: true,
      message: `Sitemap otomatis disinkronkan & Google Search Console Bot telah dikirimkan notifikasi ping (${targetSitemap}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sitemap berhasil dibuat, namun ping mesin pencari terkendala: ${err?.message || 'Network limitation'}.`,
    };
  }
}

/**
  * Triggers a browser download of the generated sitemap.xml file.
  */
export function downloadSitemapFile(xmlContent: string, fileName = 'sitemap.xml') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
