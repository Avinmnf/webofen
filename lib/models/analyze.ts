// در فایل @/lib/models/analyze

export interface Issue {
  id?: string;
  auditId?: string; // برای سازگاری با AnalyzeResult
  title: string;
  description: string;
  impact: string;
  selector?: string;
  occurrences?: number;
  category?: string; // اضافه شده برای دسته‌بندی
  severity?: 'critical' | 'serious' | 'moderate' | 'minor' | 'opportunity' | 'other'; // اضافه شده
}

// lib/models/analyze.ts
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
    id?: string; // اضافه شده برای سازگاری
    selector?: string; // اضافه شده برای سازگاری
    occurrences?: number; // اضافه شده برای سازگاری
    category?: string; // اضافه شده برای سازگاری
    severity?: string; // اضافه شده برای سازگاری
  }>;
  metrics: Record<string, any>;
  extra?: {
    brokenLinks: number;
    imagesWithoutAlt: number;
    headingsCount: Record<string, number>;
  };
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
}

// lib/models/analyze.ts
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

// اینترفیس برای داده‌های آنالیز شده از API
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
  }>;
  metrics: Record<string, any>;
  extra?: {
    brokenLinks: number;
    imagesWithoutAlt: number;
    headingsCount: Record<string, number>;
  };
}