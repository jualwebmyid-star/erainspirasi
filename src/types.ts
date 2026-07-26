export type UserRole = 'admin' | 'contributor' | 'guest' | 'reader';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  provider: 'google' | 'github' | 'email' | 'guest' | 'system';
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
  likes: number;
  parentId?: string | null;
  userRole?: UserRole;
  replies?: Comment[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: UserRole;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'trash';
  publishedAt: string;
  scheduledAt?: string;
  readingTime: number; // in minutes
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  aiScore?: number; // 0 - 100 AI likelihood score
  humanized?: boolean;
}

export type SocialPlatform = 'x' | 'linkedin' | 'facebook' | 'instagram' | 'threads';

export interface SocialPost {
  id: string;
  articleId: string;
  articleTitle: string;
  platforms: SocialPlatform[];
  caption: string;
  scheduledTime: string;
  status: 'queued' | 'posted' | 'failed';
  engagementStats: {
    clicks: number;
    shares: number;
    likes: number;
  };
}

export interface AnalyticsData {
  realTimeVisitors: number;
  totalPageviews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgDuration: string;
  trafficHistory: {
    date: string;
    pageviews: number;
    visitors: number;
    socialClicks: number;
  }[];
  topArticles: {
    id: string;
    title: string;
    views: number;
    shares: number;
  }[];
  deviceBreakdown: {
    device: string;
    percentage: number;
  }[];
  referralSources: {
    source: string;
    count: number;
  }[];
}

export interface ImageOptimizationResult {
  originalName: string;
  originalSizeKB: number;
  optimizedSizeKB: number;
  compressionRatio: number; // e.g. 68%
  dimensions: { width: number; height: number };
  format: 'webp' | 'png' | 'jpg';
  url: string;
  altText: string;
}

export interface SEOAudit {
  score: number; // 0 - 100
  titleLengthOk: boolean;
  metaDescriptionOk: boolean;
  headingStructureOk: boolean;
  keywordDensity: number; // e.g. 2.4%
  imageAltCount: number;
  missingAltCount: number;
  recommendations: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
  iconName?: string;
  location?: 'header' | 'footer' | 'both';
}

export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string;
  type: 'category' | 'page' | 'custom';
  targetId?: string;
  order: number;
  isVisible: boolean;
}

export interface StaticPageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  updatedAt: string;
  isPublished: boolean;
  location?: 'header' | 'footer' | 'both';
}

export interface BannerConfig {
  imageUrl: string;
  targetUrl: string;
  altText: string;
  isEnabled: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoUrl?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  whatsappContact?: string;
  headerBanner?: BannerConfig;
  sidebarBanner?: BannerConfig;
  feedRow3Banner?: BannerConfig;
  facebookAppId?: string;
  facebookPageAccessToken?: string;
  twitterApiKey?: string;
  twitterApiSecret?: string;
  instagramAccessToken?: string;
}

