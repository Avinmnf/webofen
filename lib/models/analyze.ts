// lib/models/analyze.ts
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
  };
  
  // اضافه کردن فیلد result برای داده‌های nested
  result?: {
    issues?: Issue[];
    analysisIssues?: Issue[];
    
    // اضافه کردن sitemapAnalysis در result
    sitemapAnalysis?: SitemapAnalysis;

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
  all: "همه خطاها",
  critical: "بحرانی",
  serious: "جدی",
  moderate: "متوسط",
  minor: "جزئی",
  performance: "عملکرد",
  debugdata: "داده‌های خطایابی",
  table: "جدول",
  list: "لیست",
  opportunity: "فرصت بهبود",
  other: "سایر"
};

export const scoreDescriptions: Record<string, string> = {
  performance: "سرعت و عملکرد وبسایت",
  accessibility: "دسترسی‌پذیری برای همه کاربران",
  bestPractices: "رعایت استانداردهای توسعه وب",
  seo: "بهینه‌سازی برای موتورهای جستجو"
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

// به روزرسانی ProductRecommendationsProps برای دریافت sitemapData
export interface ProductRecommendationsProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  sitemapData?: SitemapAnalysis;
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