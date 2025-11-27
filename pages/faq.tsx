import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

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

  const faqCategories = [
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
            "بله، ثبت‌نام و استفاده از خدمات پایه وبوفن کاملاً رایگان است. برای برخی خدمات پیشرفته ممکن است هزینه‌هایی اعمال شود که به طور شفاف اعلام می‌گردد.",
        },
        {
          question: "رمز عبور خود را فراموش کرده‌ام، چه کار کنم؟",
          answer:
            'در صفحه ورود، روی گزینه "فراموشی رمز عبور" کلیک کنید. ایمیل خود را وارد کرده و لینک بازنشانی رمز عبور را دریافت نمایید. با دنبال کردن مراحل، می‌توانید رمز عبور جدید تعیین کنید.',
        },
        {
          question: "چگونه ایمیل حساب کاربری خود را تغییر دهم؟",
          answer:
            'برای تغییر ایمیل، به بخش تنظیمات حساب کاربری مراجعه کرده و گزینه "تغییر ایمیل" را انتخاب کنید. پس از وارد کردن ایمیل جدید، کد تأیید را دریافت و وارد نمایید.',
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
        {
          question: "چگونه می‌توانم امنیت حساب کاربری خود را افزایش دهم؟",
          answer:
            "استفاده از رمز عبور قمند، فعال‌سازی تأیید دو مرحله‌ای، و عدم استفاده از رمز عبور یکسان در سرویس‌های مختلف می‌تواند امنیت حساب شما را значительно افزایش دهد.",
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
            "وبوفن پلتفرمی جامع برای [خدمات شما] است. ما امکانات متنوعی از جمله [لیست خدمات] را در اختیار کاربران قرار می‌دهیم.",
        },
        {
          question: "آیا می‌توانم از چند دستگاه همزمان استفاده کنم؟",
          answer:
            "بله، شما می‌توانید از حساب کاربری خود در چند دستگاه مختلف استفاده کنید. البته برای امنیت بیشتر، توصیه می‌کنیم دستگاه‌های متصل را در بخش امنیت حساب کاربری مدیریت نمایید.",
        },
        {
          question: "چگونه می‌توانم از خدمات پشتیبانی استفاده کنم؟",
          answer:
            'از طریق بخش "تماس با پشتیبانی" در پنل کاربری یا ارسال ایمیل به support@webofun.com می‌توانید با تیم پشتیبانی ما در ارتباط باشید.',
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
        {
          question: "آیا می‌توانم اشتراک خود را لغو کنم؟",
          answer:
            "بله، در هر زمان می‌توانید اشتراک خود را از بخش مدیریت اشتراک در پنل کاربری لغو نمایید. دسترسی شما تا پایان دوره پرداخت شده فعال خواهد ماند.",
        },
        {
          question: "سیاست بازپرداخت وبوفن چگونه است؟",
          answer:
            "در صورت عدم رضایت از خدمات، تا ۷ روز پس از خرید امکان درخواست بازپرداخت وجود دارد. مبلغ پرداختی پس از کسر هزینه‌های انجام شده به حساب شما بازگردانده می‌شود.",
        },
      ],
    },
  ];

  const popularQuestions = [
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
      <Head>
        <title>سوالات متداول | وبوفن</title>
        <meta
          name="description"
          content="پاسخ به سوالات متداول درباره وبوفن - راهنمای استفاده از خدمات و حل مشکلات"
        />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="max-w-[1250px] m-auto">
          {/* Header */}
          <section className="pb-4 w-full rounded-2xl flex">
            {/* Left content */}
            <div className="relative w-full md:w-[60%] rounded-lg overflow-visible">
              <div className="relative">
                <h1 className="text-[#0364af] text-4xl font-semibold">
                  سوالات متداول
                </h1>

                {/* Container for gray box and SVG */}
                  {/* Gray box */}
                  <div className=" relative">
                    <p className="text-gray-600 leading-8">
                      پاسخ به پرتکرارترین سوالات شما درباره وبوفن
                    </p>
                  </div>
              </div>
            </div>

            {/* Right image grid */}
            <div className="w-full">
                
          {/* Popular Questions */}
          {filteredPopularQuestions.length > 0 && (
            <div className="mb-16">

              <div className="grid md:grid-cols-2 gap-4">
                {filteredPopularQuestions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                    onClick={() => toggleItem(100 + index)}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-800 text-sm leading-relaxed flex-1">
                        {item.question}
                      </h3>
                      <div
                        className={`transform transition-transform duration-200 flex-shrink-0 ml-3 ${
                          openItems.includes(100 + index) ? "rotate-180" : ""
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
                    {openItems.includes(100 + index) && (
                      <div className="mt-4 text-gray-600 leading-relaxed text-right pr-2 border-r-2 border-[#6FD6E5]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          </section>


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
                        <p className="text-gray-400 text-sm mt-1">
                          {category.items.length} سوال
                        </p>
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
                            <h3 className="font-medium text-gray-800 text-lg mb-3">
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

          {/* No Results */}
          {filteredCategories.length === 0 &&
            filteredPopularQuestions.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  نتیجه‌ای یافت نشد
                </h3>
                <p className="text-gray-500">
                  هیچ سوالی با عبارت "{searchTerm}" پیدا نشد
                </p>
              </div>
            )}

          {/* Contact Support */}
          <div className="mt-20 bg-gradient-to-br from-[#6FD6E5] to-[#27b5cb] rounded-2xl p-8 text-center text-white">
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
                  className="px-8 py-3 bg-white text-[#27b5cb] font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  تماس با پشتیبانی
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
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
