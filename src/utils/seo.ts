export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
}

export function updateOpenGraphTags(data: OpenGraphData) {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  const siteSuffix = 'EraInspirasi';
  document.title = data.title ? `${data.title} - ${siteSuffix}` : 'EraInspirasi - Portal Berita, Edukasi & Inspirasi';

  const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  };

  // Standard Meta Description
  setMeta('meta[name="description"]', 'name', 'description', data.description || '');

  // Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, Telegram, Discord, Slack)
  setMeta('meta[property="og:title"]', 'property', 'og:title', data.title || '');
  setMeta('meta[property="og:description"]', 'property', 'og:description', data.description || '');
  setMeta('meta[property="og:image"]', 'property', 'og:image', data.image || '');
  setMeta('meta[property="og:url"]', 'property', 'og:url', data.url || '');
  setMeta('meta[property="og:type"]', 'property', 'og:type', data.type || 'article');
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', data.siteName || 'EraInspirasi Portal');

  // Twitter Card Meta Tags (X / Twitter)
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', data.title || '');
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', data.description || '');
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', data.image || '');

  if (data.author) {
    setMeta('meta[name="author"]', 'name', 'author', data.author);
  }
  if (data.publishedTime) {
    setMeta('meta[property="article:published_time"]', 'property', 'article:published_time', data.publishedTime);
  }
}
