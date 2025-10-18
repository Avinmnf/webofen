import React from "react";
import Image from "next/image";
import OptimizationPage from "@/pages/dashboard/optimization";

interface Feature {
  icon: string;
  text: string;
  alt: string;
}

interface BacklinkfeaturesProps {
  slug: string;
}

function Backlinkfeatures({ slug }: BacklinkfeaturesProps) {
  const featuresMap: Record<string, Feature[]> = {
    backlink: [
      {
        icon: "/productsvg/link.svg",
        text: "لینک سازی در منابع قدرتمند",
        alt: "لینک سازی در منابع قدرتمند",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "کمک به افزایش اعتبار دامنه",
        alt: "افزایش اعتبار دامنه",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "سایت های معتبر با دامین ریت بالای 50",
        alt: "سایت معتبر با دامین ریت بالا",
      },
      {
        icon: "/productsvg/web.svg",
        text: "زمان تحویل تا 30 روز کاری",
        alt: "زمان تحویل",
      },
    ],
    security: [
      {
        icon: "/productsvg/link.svg",
        text: "بستن راه های نفوذ",
        alt: "بستن راه های نفوذ",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "ایجاد امنیت کامل",
        alt: "ایجاد امنیت کامل",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "گزارش کار و تست های نفوذ",
        alt: "گزارش کار و تست نفوذ",
      },
      {
        icon: "/productsvg/web.svg",
        text: "تحویل 15 تا 30 روز کاری",
        alt: "زمان تحویل",
      },
    ],
    content: [
      {
        icon: "/productsvg/link.svg",
        text: "بدون استفاده از هوش مصنوعی",
        alt: "بدون استفاده از هوش مصنوعی",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "رعایت اصول نگارشی و ساختار",
        alt: "رعایت اصول نگارشی",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "بررسی کیورد های موضوعی و رعایت آن",
        alt: "بررسی کیوردهای موضوعی",
      },
      {
        icon: "/productsvg/web.svg",
        text: "مدت زمان انجام 4 روز کاری",
        alt: "مدت زمان انجام",
      },
    ],
    Optimization: [
      {
        icon: "/productsvg/link.svg",
        text: "تنظیمات پایه سئو داخلی سایت",
        alt: "تنظیمات سئو داخلی",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "بهینه سازی سرعت سایت",
        alt: "بهینه سازی سرعت سایت",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "تنظیم اسکیما برای صفحات مختلف",
        alt: "تنظیم اسکیما",
      },
      {
        icon: "/productsvg/web.svg",
        text: "زمان تحویل تا 30روز کاری",
        alt: "زمان تحویل",
      },
    ],
    reportage: [
      {
        icon: "/productsvg/link.svg",
        text: "استراتژی رپورتاژ آگهی",
        alt: "استراتژی رپورتاژ",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "پیشنهاد خرید طبق بودجه شما",
        alt: "پیشنهاد خرید",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "تولید محتوا کامل به همراه تصویر",
        alt: "تولید محتوا",
      },
      {
        icon: "/productsvg/web.svg",
        text: "اعلام مدت زمان انجام پس از بررسی اولیه",
        alt: "مدت زمان انجام",
      },
    ],
    "keyword-cluster": [
      {
        icon: "/productsvg/link.svg",
        text: "خوشه بندی کامل صنف شما",
        alt: "خوشه بندی کامل",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "ارائه کلاسترتخصصی طبق بازار هدف",
        alt: "ارائه کلاستر تخصصی",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "کمک به روند تولید محتوا واستراتژی ان",
        alt: "کمک به تولید محتوا و استراتژی",
      },
      {
        icon: "/productsvg/web.svg",
        text: "زمان انجام حداکثر 14روز کاری",
        alt: "زمان انجام",
      },
    ],
    "internal-linking": [
      {
        icon: "/productsvg/link.svg",
        text: "انجام لینک سازی دستی داخلی",
        alt: "لینک سازی دستی داخلی",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "مطابق با هدف گذاری کسب و کار شما",
        alt: "هدف گذاری کسب و کار",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "تاثیر بر افزایش رتبه کلمات کلیدی",
        alt: "افزایش رتبه کلمات کلیدی",
      },
      {
        icon: "/productsvg/web.svg",
        text: "اعلام مدت زمان انجام پس از بررسی اولیه",
        alt: "مدت زمان انجام",
      },
    ],
    "screaming-frog": [
      {
        icon: "/productsvg/link.svg",
        text: "بهینه سازی ارور های تکنیکالی",
        alt: "بهینه سازی ارورها",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "کمک به بهبود رتبه",
        alt: "بهبود رتبه",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "کمک به افزایش اعتبار سایت",
        alt: "افزایش اعتبار سایت",
      },
      {
        icon: "/productsvg/web.svg",
        text: "زمان تحویل نهایتاً 30 روز کاری",
        alt: "زمان تحویل",
      },
    ],
    "rank-domain": [
      {
        icon: "/productsvg/link.svg",
        text: "افزایش DA تضمینی",
        alt: "افزایش DA",
      },
      {
        icon: "/productsvg/boo.svg",
        text: "تضمین کیفیت و عدم مشکل روی رنکینگ",
        alt: "تضمین کیفیت",
      },
      {
        icon: "/productsvg/chart.svg",
        text: "استفاده از روش های اصولی",
        alt: "روش های اصولی",
      },
      {
        icon: "/productsvg/web.svg",
        text: "مدت زمان افزایش DA متغیر خواهد بود",
        alt: "مدت زمان افزایش DA",
      },
    ],
  };

  const features = featuresMap[slug] || [];

  return (
    <div className="flex flex-col gap-2 mt-4 text-sm">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="bg-blue-800 rounded-xl p-2">
            <Image
              src={feature.icon}
              width={18}
              height={18}
              alt={feature.alt}
            />
          </span>
          {feature.text}
        </div>
      ))}
    </div>
  );
}

export default Backlinkfeatures;
