import { useState } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/seo";

// Define types for FAQ items
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

// Define type for schema question
interface SchemaQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

const FAQPage = () => {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const faqCategories: FAQCategory[] = [
    {
      title: "حساب کاربری و ثبت‌نام",
      icon: "👤",
      items: [
        {
          question: "چگونه در وبوفن ثبت‌نام کنم؟",
          answer:
            'برای ثبت‌نام در وبوفن، روی دکمه "ثبت‌نام" کلیک کرده و اطلاعات مورد نیاز شامل نام و نام خانوادگی، ایمیل، شماره تلفن و رمز عبور را وارد کنید. پس از تکمیل اطلاعات، حساب کاربری شما ایجاد خواهد شد.',
        },
        {
          question: "آیا ثبت‌نام در وبوفن رایگان است؟",
          answer:
            "بله، ثبت‌نام و استفاده از خدمات پایه وبوفن مانند سیستم آنالیز ما، کاملاً رایگان است. برای برخی خدمات پیشرفته ممکن است هزینه‌هایی اعمال شود که به طور شفاف اعلام می‌گردد.",
        },
        {
          question: "رمز عبور خود را فراموش کرده‌ام، چه کار کنم؟",
          answer:
            'در صفحه ورود، روی گزینه "فراموشی رمز عبور" کلیک کنید. ایمیل خود را وارد کرده و لینک بازنشانی رمز عبور را دریافت نمایید. با دنبال کردن مراحل، می‌توانید رمز عبور جدید تعیین کنید.',
        },
        {
          question: "چگونه ایمیل حساب کاربری خود را تغییر دهم؟",
          answer:
            'برای تغییر ایمیل، به بخش تنظیمات حساب کاربری در داشبورد مراجعه کرده و گزینه "تغییر ایمیل" را انتخاب کنید. پس از وارد کردن ایمیل جدید، کد تأیید را دریافت و وارد نمایید.',
        },
      ],
    },
    {
      title: "ورود و امنیت",
      icon: "🔒",
      items: [
        {
          question: "چگونه با شماره تلفن وارد شوم؟",
          answer:
            'در صفحه ورود، گزینه "ورود با شماره تلفن" را انتخاب کنید. شماره تلفن خود را وارد کرده و کد تأیید ارسال شده را وارد نمایید تا وارد حساب کاربری شوید.',
        },
        {
          question: "آیا اطلاعات من در وبوفن امن است؟",
          answer:
            "بله، ما از استانداردهای بالای امنیتی استفاده می‌کنیم. تمام اطلاعات شما به صورت رمزنگاری شده ذخیره می‌شود و از پروتکل‌های امنیتی پیشرفته برای محافظت از داده‌های شما استفاده می‌کنیم.",
        },
      ],
    },
    {
      title: "خدمات و امکانات",
      icon: "🛠️",
      items: [
        {
          question: "وبوفن چه خدماتی ارائه می‌دهد؟",
          answer:
            "خدمات وبوفن شامل طراحی و توسعه انواع وب‌سایت‌ها، پیاده‌سازی سیستم‌های اختصاصی، سئو و بهینه‌سازی، تولید محتوا، پشتیبانی فنی و ارائه مشاوره دیجیتال مارکتینگ است",
        },
        {
          question: "چگونه می‌توانم از خدمات پشتیبانی استفاده کنم؟",
          answer:
            'جهت ارتباط و پشتیبانی میتوانید از طریق شماره های درج شده در سایت و یا مراجعه به داشبورد و ارسال تیکت، با ما در ارتباط باشید',
        },
      ],
    },
    {
      title: "پرداخت و اشتراک",
      icon: "💳",
      items: [
        {
          question: "روش‌های پرداخت در وبوفن کدامند؟",
          answer:
            "ما از درگاه‌های پرداخت امن بانکی پشتیبانی می‌کنیم. امکان پرداخت با کارت‌های عضو شتاب، کیف پول‌های الکترونیکی و سایر روش‌های پرداخت محلی وجود دارد.",
        },
      ],
    },
  ];

  const popularQuestions: FAQItem[] = [
    {
      question: "چگونه حساب کاربری خود را حذف کنم؟",
      answer:
        'برای حذف حساب کاربری، به بخش تنظیمات حساب مراجعه کرده و گزینه "حذف حساب" را انتخاب کنید. توجه داشته باشید این عمل غیرقابل بازگشت است.',
    },
    {
      question: "حداقل سیستم مورد نیاز برای استفاده از وبوفن چیست؟",
      answer:
        "وبوفن بر روی تمام مرورگرهای مدرن و دستگاه‌های مختلف قابل اجراست. آخرین نسخه مرورگرهای Chrome, Firefox, Safari و Edge توصیه می‌شود.",
    },
    {
      question: "آیا محدودیت جغرافیایی برای استفاده از وبوفن وجود دارد؟",
      answer:
        "خیر، وبوفن از سراسر جهان در دسترس است. البته برخی خدمات ممکن است بسته به منطقه جغرافیایی متفاوت باشند.",
    },
  ];

  // Generate FAQ Schema
  function generateFAQSchema() {
    // Collect all questions from all categories with explicit type
    const allQuestions: SchemaQuestion[] = [];
    
    faqCategories.forEach(category => {
      category.items.forEach(item => {
        allQuestions.push({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        });
      });
    });

    // Add popular questions
    popularQuestions.forEach(item => {
      allQuestions.push({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      name: "سوالات متداول وبوفن",
      description: "پاسخ به سوالات متداول درباره خدمات وبوفن شامل حساب کاربری، امنیت، خدمات، پرداخت و سایر موضوعات",
      mainEntity: allQuestions
    };
  }

  // Generate Breadcrumb Schema
  function generateBreadcrumbSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "صفحه اصلی",
          item: "https://webofen.com"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "سوالات متداول",
          item: "https://webofen.com/faq"
        }
      ]
    };
  }

  // Generate all schemas
  const faqSchema = generateFAQSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const allSchemas = [faqSchema, breadcrumbSchema];

  // Filter FAQs based on search term
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const filteredPopularQuestions = popularQuestions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO
        title="سوالات متداول | وبوفن"
        description="پاسخ به سوالات متداول درباره وبوفن - راهنمای استفاده از خدمات، حساب کاربری، امنیت، پرداخت و حل مشکلات"
        keywords="سوالات متداول وبوفن, راهنمای وبوفن, پشتیبانی وبوفن, FAQ, سوالات پرتکرار"
        canonical="https://webofen.com/faq"
        ogType="website"
        ogImage="https://webofen.com/images/og-faq.jpg"
        structuredData={allSchemas}
        section="پشتیبانی"
        tags={["سوالات متداول", "راهنمای کاربری", "پشتیبانی", "FAQ", "کمک"]}
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-[1250px] m-auto">
          {/* Breadcrumb Navigation */}
          <div className="px-4 py-3">
            <nav className="text-sm text-gray-600" aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="hover:text-[#29b0cb] transition-colors cursor-pointer"
                  >
                    صفحه اصلی
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-[#0364af] font-medium" aria-current="page">
                  سوالات متداول
                </li>
              </ol>
            </nav>
          </div>

          {/* Header */}
          <section className="my-10 w-full rounded-2xl flex">
            {/* Left content */}
            <div className="relative w-full md:w-[60%] rounded-lg overflow-visible">
              <div className="relative">
                <h1 className="text-[#0364af] text-4xl font-semibold">
                  سوالات متداول
                </h1>
                <div className="relative">
                  <p className="text-gray-600 leading-8 mt-2">
                    پاسخ به پرتکرارترین سوالات شما درباره وبوفن
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در سوالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6FD6E5] focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredCategories.reduce(
                  (total, category) => total + category.items.length,
                  0
                ) + filteredPopularQuestions.length}{" "}
                نتیجه پیدا شد
              </p>
            )}
          </div>

          {/* Popular Questions */}
          {filteredPopularQuestions.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                سوالات پرطرفدار
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPopularQuestions.map((item, index) => {
                  const globalIndex = 100 + index; // Offset to avoid conflicts
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#6FD6E5] transition-all duration-200"
                      onClick={() => toggleItem(globalIndex)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-800 text-sm mb-3 flex-1">
                          {item.question}
                        </h3>
                        <div
                          className={`mr-2 transform transition-transform duration-200 flex-shrink-0 ${
                            openItems.includes(globalIndex) ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="w-4 h-4 text-[#6FD6E5]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {openItems.includes(globalIndex) && (
                        <div className="text-gray-600 text-sm leading-relaxed mt-3 pr-4 border-r-2 border-[#6FD6E5]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div>
                        <h2 className="text-xl font-medium text-gray-900">
                          {category.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Questions */}
                <div className="divide-y divide-gray-100">
                  {category.items.map((item, itemIndex) => {
                    const globalIndex = categoryIndex * 10 + itemIndex;
                    return (
                      <div
                        key={itemIndex}
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-md mb-3">
                              {item.question}
                            </h3>
                            {openItems.includes(globalIndex) && (
                              <div className="text-gray-600 leading-relaxed text-right pr-4 border-r-2 border-[#6FD6E5]">
                                {item.answer}
                              </div>
                            )}
                          </div>
                          <div
                            className={`mr-4 transform transition-transform duration-200 flex-shrink-0 ${
                              openItems.includes(globalIndex)
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            <svg
                              className="w-5 h-5 text-[#6FD6E5]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {searchTerm && filteredCategories.length === 0 && filteredPopularQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-gray-500">
                متاسفانه هیچ سوالی با عبارت "{searchTerm}" پیدا نشد.
              </p>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-20 bg-[#1d546b] rounded-2xl p-8 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-4">
                پاسخ خود را پیدا نکردید؟
              </h3>
              <p className="text-white/80 mb-8 leading-relaxed">
                تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/contact")}
                  className="px-8 py-3 bg-white text-[#27b5cb] font-base rounded-xl hover:bg-gray-50 transition-colors shadow cursor-pointer"
                >
                  تماس با پشتیبانی
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 border cursor-pointer border-white/30 text-white font-base rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  بازگشت به خانه
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;