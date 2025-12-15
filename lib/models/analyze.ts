// lib/models/analyze.ts

// 🔥 اضافه کردن رابط‌های امنیتی جدید
export interface SecurityIssue {
  type: 'https' | 'ssl' | 'headers' | 'csp' | 'mixed-content' | 'other';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

export interface SecurityAnalysis {
  isHttps: boolean;
  hasValidSSL: boolean;
  securityScore: number;
  securityIssues: SecurityIssue[];
  recommendations: string[];
  productRecommendations?: string[]; // 🔥 اضافه شده برای توصیه‌های محصولات
}

export interface Issue {
  id?: string;
  auditId?: string; // برای سازگاری با AnalyzeResult
  title: string;
  description: string;
  impact: string;
  selector?: string;
  occurrences?: number;
  category?: string; // اضافه شده برای دسته‌بندی
  severity?: string; // اضافه شده برای سطح اهمیت
  solution?: string; // اضافه کردن فیلد راه حل
}

// رابط جدید برای داده‌های سایت‌مپ
export interface SitemapAnalysis {
  sitemapExists: boolean;
  sitemapUrls: string[];
  totalLinks: number;
  sitemapLinks: Array<{
    url: string;
    sitemap: string;
  }>;
}

export interface AnalyzeResult {
  url: string;
  title?: string;
  meta?: {
    title?: string;
    ogTitle?: string;
    description?: string;
  };
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  issues: Array<{
    auditId: string;
    title: string;
    impact: string;
    description: string;
    id?: string;
    selector?: string;
    occurrences?: number;
    category?: string;
    severity?: string;
  }>;
  metrics: Record<string, any>;
  headings?: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    total: number;
  };
  analysisIssues?: Issue[];
  
  // اضافه کردن sitemapAnalysis به AnalyzeResult
  sitemapAnalysis?: SitemapAnalysis;

  // 🔥 اضافه کردن brokenLinksCount به AnalyzeResult
  brokenLinksCount?: number;

  // 🔥 اضافه کردن securityAnalysis به AnalyzeResult
  securityAnalysis?: SecurityAnalysis;

  extra?: {
    brokenLinks: string[];
    imagesWithoutAlt: number;
    externalLinks: number;
    headingsCount?: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
      total: number;
    };
    issues?: Issue[]; // برای سازگاری با قبلی
    analysisIssues?: Issue[];
    // اضافه کردن sitemapAnalysis در extra برای سازگاری
    sitemapAnalysis?: SitemapAnalysis;
    // 🔥 اضافه کردن brokenLinksCount در extra
    brokenLinksCount?: number;
    // 🔥 اضافه کردن securityAnalysis در extra
    securityAnalysis?: SecurityAnalysis;
  };
  
  // اضافه کردن فیلد result برای داده‌های nested
  result?: {
    issues?: Issue[];
    analysisIssues?: Issue[];
    
    // اضافه کردن sitemapAnalysis در result
    sitemapAnalysis?: SitemapAnalysis;

    // 🔥 اضافه کردن brokenLinksCount در result
    brokenLinksCount?: number;

    // 🔥 اضافه کردن securityAnalysis در result
    securityAnalysis?: SecurityAnalysis;

    comprehensiveData?: {
      issues?: Issue[];
      headings?: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
        total: number;
      };
      brokenLinks?: string[];
      imagesWithoutAlt?: number;
      externalLinks?: number;
      // اضافه کردن sitemapAnalysis در comprehensiveData
      sitemapAnalysis?: SitemapAnalysis;
      // 🔥 اضافه کردن brokenLinksCount در comprehensiveData
      brokenLinksCount?: number;
      // 🔥 اضافه کردن securityAnalysis در comprehensiveData
      securityAnalysis?: SecurityAnalysis;
    };
    categories?: any;
    audits?: any;
    metrics?: any;
    
    // اضافه کردن extra درون result
    extra?: {
      analysisIssues?: Issue[];
      brokenLinks?: string[];
      imagesWithoutAlt?: number;
      externalLinks?: number;
      headingsCount?: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
        total: number;
      };
      issues?: Issue[];
      // اضافه کردن sitemapAnalysis در extra درون result
      sitemapAnalysis?: SitemapAnalysis;
      // 🔥 اضافه کردن brokenLinksCount در extra درون result
      brokenLinksCount?: number;
      // 🔥 اضافه کردن securityAnalysis در extra درون result
      securityAnalysis?: SecurityAnalysis;
    };
  };
  
  // اضافه کردن فیلد translations برای دیکشنری فارسی
  translations?: Record<string, { title: string; description: string }>;
}

export interface SimpleProduct {
  id: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  slug?: string;
  variants?: Array<{ price?: number; stock?: number }>;
  category?: { id: string; title?: string };
}

export const tabLabels: Record<string, string> = {
  all: "همه خطا ها",
  critical: "بحرانی",
  serious: "جدی",
  moderate: "متوسط",
  minor: "جزئی",
  performance: "عملکرد",
  debugdata: "داده‌ های خطایابی",
  table: "جدول",
  list: "لیست",
  opportunity: "فرصت بهبود",
  other: "سایر",
  security: "امنیت" // 🔥 اضافه شده برای دسته‌بندی امنیت
};

export const scoreDescriptions: Record<string, string> = {
  performance: "سرعت و عملکرد وبسایت",
  accessibility: "دسترسی‌پذیری برای همه کاربران",
  bestPractices: "رعایت استانداردهای توسعه وب",
  seo: "بهینه‌سازی برای موتورهای جستجو",
  security: "امنیت و محافظت از داده‌ها" // 🔥 اضافه شده برای امنیت
};

export interface ApiAnalysisResult {
  id: string;
  url: string;
  status: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  createdAt: string;
  result?: any;
  name?: string;
  phoneNumber?: string;
  // اضافه کردن sitemapAnalysis به ApiAnalysisResult
  sitemapAnalysis?: SitemapAnalysis;
  // 🔥 اضافه کردن brokenLinksCount به ApiAnalysisResult
  brokenLinksCount?: number;
  // 🔥 اضافه کردن securityAnalysis به ApiAnalysisResult
  securityAnalysis?: SecurityAnalysis;
}

export interface Analysis {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  result?: any;
  name?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
  // اضافه کردن sitemapAnalysis به Analysis
  sitemapAnalysis?: SitemapAnalysis;
  // 🔥 اضافه کردن brokenLinksCount به Analysis
  brokenLinksCount?: number;
  // 🔥 اضافه کردن securityAnalysis به Analysis
  securityAnalysis?: SecurityAnalysis;
}

export interface ApiAnalyzeData {
  url: string;
  title?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  issues: Array<{
    auditId: string;
    title: string;
    impact: string;
    description: string;
    selector?: string;
    occurrences?: number;
    category?: string;
    severity?: string;
  }>;
  metrics: Record<string, any>;
  headings?: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    total: number;
  };
  // اضافه کردن sitemapAnalysis به ApiAnalyzeData
  sitemapAnalysis?: SitemapAnalysis;
  // 🔥 اضافه کردن brokenLinksCount به ApiAnalyzeData
  brokenLinksCount?: number;
  // 🔥 اضافه کردن securityAnalysis به ApiAnalyzeData
  securityAnalysis?: SecurityAnalysis;
  
  extra?: {
    brokenLinks: string[];
    imagesWithoutAlt: number;
    externalLinks: number;
    headingsCount?: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
      total: number;
    };
    // اضافه کردن sitemapAnalysis در extra
    sitemapAnalysis?: SitemapAnalysis;
    // 🔥 اضافه کردن brokenLinksCount در extra
    brokenLinksCount?: number;
    // 🔥 اضافه کردن securityAnalysis در extra
    securityAnalysis?: SecurityAnalysis;
  };
  
  // اضافه کردن translations به ApiAnalyzeData
  translations?: Record<string, { title: string; description: string }>;
}

// انواع جدید برای داده‌های Lighthouse
export interface LighthouseResults {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  result: any;
  headings?: HeadingAnalysis;
  // اضافه کردن sitemapAnalysis به LighthouseResults
  sitemapAnalysis?: SitemapAnalysis;
  // 🔥 اضافه کردن brokenLinksCount به LighthouseResults
  brokenLinksCount?: number;
  // 🔥 اضافه کردن securityAnalysis به LighthouseResults
  securityAnalysis?: SecurityAnalysis;
}

export interface HeadingAnalysis {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  total: number;
}

// types/analysis.ts
export interface SitemapAnalysis {
  totalLinks: number;
  sitemapExists: boolean;
  sitemapUrls: string[];
  sitemapLinks: Array<{ url: string; sitemap: string }>;
}

export interface Analysis {
  id: string;
  url: string;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  brokenLinksCount?: number;
  name?: string;
  phoneNumber?: string;
  createdAt: string;
  sitemapAnalysis?: SitemapAnalysis;
}

export interface UserDashboard {
  phoneNumber: string;
  name?: string;
  totalAnalyses: number;
  lastAnalysis: string;
  analyses: Analysis[];
  stats: {
    averagePerformance: number;
    averageAccessibility: number;
    averageSEO: number;
    averageBestPractices: number;
    totalBrokenLinks: number;
    totalSitemapLinks: number;
  };
}

export interface AnalysisStats {
  totalUsers: number;
  totalAnalyses: number;
  users: UserDashboard[];
}

export interface JobData {
  analysisId: string;
  url: string;
  name?: string;
  phoneNumber?: string;
}

// انواع برای کامپوننت‌ها
export interface AnalysisScoresProps {
  result: AnalyzeResult;
  animatedScores: Record<string, number>;
}

export interface IssuesListProps {
  result: AnalyzeResult;
  issues?: Array<{
    auditId: string;
    title: string;
    impact: string;
    description: string;
    id?: string;
    selector?: string;
    occurrences?: number;
    category?: string;
    severity?: string;
  }>;
}

export interface CoreMetricsProps {
  result: AnalyzeResult;
}

export interface WebsiteOverviewProps {
  result: AnalyzeResult;
}

// به روزرسانی ProductRecommendationsProps برای دریافت sitemapData، brokenLinksCount و securityAnalysis
export interface ProductRecommendationsProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  sitemapData?: SitemapAnalysis;
  // 🔥 اضافه کردن brokenLinksCount به ProductRecommendationsProps
  brokenLinksCount?: number;
  // 🔥 اضافه کردن securityAnalysis به ProductRecommendationsProps
  securityAnalysis?: SecurityAnalysis;
  isDuplicate?: boolean;
}

// اضافه کردن انواع جدید برای تحلیل سایت‌مپ
export interface SitemapLink {
  url: string;
  sitemap: string;
  lastmod?: string;
  priority?: number;
  changefreq?: string;
}

// نوع برای کامپوننت‌های مرتبط با سایت‌مپ
export interface SitemapAnalysisProps {
  sitemapData?: SitemapAnalysis;
  className?: string;
}

// نوع برای پیشنهادات تولید محتوا
export interface ContentProductionSuggestionProps {
  currentLinks: number;
  targetLinks?: number;
  analysisId?: string;
  userName?: string;
  userPhone?: string;
  className?: string;
}

// 🔥 اضافه کردن انواع جدید برای تحلیل امنیتی
export interface SecurityAnalysisProps {
  securityAnalysis?: SecurityAnalysis;
  className?: string;
}

export interface SecurityIssuesListProps {
  securityIssues: SecurityIssue[];
  className?: string;
}

// 🔥 اضافه کردن نوع برای کامپوننت نمایش امتیاز امنیتی
export interface SecurityScoreProps {
  securityScore: number;
  isHttps: boolean;
  hasValidSSL: boolean;
  className?: string;
}

// 🔥 اضافه کردن نوع برای کامپوننت توصیه‌های امنیتی
export interface SecurityRecommendationsProps {
  securityAnalysis: SecurityAnalysis;
  className?: string;
}

// 🔥 اضافه کردن نوع برای کامپوننت محصولات امنیتی
export interface SecurityProductsProps {
  securityAnalysis: SecurityAnalysis;
  className?: string;
}

// 🔥 اضافه کردن ثابت‌های مربوط به امنیت
export const securityImpactLabels: Record<string, string> = {
  high: "بحرانی",
  medium: "متوسط", 
  low: "کم"
};

export const securityIssueTypes: Record<string, string> = {
  https: "پروتکل HTTPS",
  ssl: "گواهی SSL",
  headers: "هدر های امنیتی",
  csp: "سیاست امنیت محتوا",
  'mixed-content': "محتوای مختلط",
  other: "سایر مشکلات امنیتی"
};

// 🔥 اضافه کردن تابع کمکی برای رنگ‌بندی امتیاز امنیتی
export const getSecurityScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
};

// 🔥 اضافه کردن تابع کمکی برای رنگ‌بندی شدت مشکل امنیتی
export const getSecuritySeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
  switch (severity) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'low':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};