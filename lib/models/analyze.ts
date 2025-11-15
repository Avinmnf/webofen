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

export interface AnalyzeResult {
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
    issues?: Issue[]; // اضافه کردن issues به extra
  };
  // اضافه کردن فیلد result برای داده‌های nested
  result?: {
    issues?: Issue[];
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
    };
    categories?: any;
    audits?: any;
    metrics?: any;
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

export interface ProductRecommendationsProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}