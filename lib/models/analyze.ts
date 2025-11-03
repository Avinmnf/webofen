export type Issue = {
  auditId: string;
  title: string;
  impact: string;
  description: string;
};

export type AnalyzeResult = {
  url: string;
  title: string;
  scores: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  metrics: {
    FCP?: string;
    LCP?: string;
    TBT?: string;
    CLS?: string;
    SI?: string;
  };
  issues: Issue[];
};

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