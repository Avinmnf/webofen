import { useState } from 'react';

export function HowItWorks() {
  const [selectedImage, setSelectedImage] = useState(null);

  const processSteps = [
    {
      step: "۱",
      title: "دریافت آدرس",
      description: "آدرس سایت شما دریافت و اعتبارسنجی می‌ شود",
      icon: "🌐",
      color: "blue"
    },
    {
      step: "۲",
      title: "آنالیز فنی",
      description: "سرعت، سئو و امنیت سایت بررسی می‌ شود",
      icon: "⚡",
      color: "purple"
    },
    {
      step: "۳",
      title: "شناسایی مشکلات",
      description: "مشکلات و نقاط ضعف شناسایی می‌ شوند",
      icon: "🔍",
      color: "orange"
    },
    {
      step: "۴",
      title: "پیشنهاد راهکار",
      description: "راهکار ها و محصولات مرتبط پیشنهاد می‌ شود",
      icon: "💡",
      color: "green"
    }
  ];

  const analysisAreas = [
    {
      area: "عملکرد",
      issues: ["سرعت لود", "بهینه‌ سازی تصاویر", "رندرینگ"],
      solutions: ["هاست پرسرعت", "CDN", "بهینه‌ ساز تصاویر"]
    },
    {
      area: "سئو",
      issues: ["متا تگ‌ ها", "ساختار سایت", "محتوا"],
      solutions: ["مشاوره سئو", "ابزار آنالیز", "تولید محتوا"]
    },
    {
      area: "امنیت",
      issues: ["HTTPS", "SSL", "هدر های امنیتی"],
      solutions: ["گواهی SSL", "فایروال", "اسکن امنیتی"]
    }
  ];

  const openImageModal = (imageSrc:any) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      
      {/* Modal برای نمایش عکس بزرگ */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={closeImageModal}
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="نمونه گزارش بزرگ شده" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* هدر */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          چگونه سایت شما آنالیز می‌ شود؟
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          در ۴ مرحله ساده، مشکلات سایت شناسایی و راهکار های دقیق ارائه می‌ شود
        </p>
      </div>

      {/* مراحل */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-20">
        {processSteps.map((step, index) => (
          <div key={step.step} className="relative group">
            {index < processSteps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-100 -z-10" />
            )}

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-blue-100 transition-all duration-300 transform group-hover:-translate-y-2">
              
              <div className={`w-16 h-16 rounded-2xl bg-${step.color}-100 flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{step.icon}</span>
              </div>

              <div className="mb-3">
                <div className={`inline-flex items-center gap-2 bg-${step.color}-400 text-${step.color}-700 px-3 py-1 rounded-full text-sm font-medium mb-3`}>
                  <span>مرحله</span>
                  <span className="font-bold">{step.step}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* بخش‌های آنالیز */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {analysisAreas.map((area) => (
          <div
            key={area.area}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{area.area}</h3>
                <p className="text-gray-500 text-sm">مشکلات شایع و راهکار ها</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm">⚠️</span>
                  <span className="text-xs font-medium">مشکلات</span>
                </div>
                <div className="space-y-2">
                  {area.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span className="text-xs text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-sm">💡</span>
                  <span className="text-xs font-medium">راهکار ها</span>
                </div>
                <div className="space-y-2">
                  {area.solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-700">{solution}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نمونه گزارش واقعی */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>📊</span>
            نمونه گزارش آنالیز
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            نمونه‌ای از خروجی واقعی آنالیز
          </h3>
          <p className="text-gray-600">برای دیدن تصویر در اندازه بزرگ، روی آن کلیک کنید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div 
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => openImageModal("/analyze/Screenshot 2025-11-26 104643.png")}
          >
            <img
              src="/analyze/Screenshot 2025-12-01 140440.png"
              alt="نمونه گزارش بخش اول"
              className="w-full h-auto"
            />
          </div>

          <div 
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => openImageModal("/analyze/Screenshot 2025-11-26 111322.png")}
          >
            <img
              src="/analyze/Screenshot 2025-11-26 111322.png"
              alt="نمونه گزارش بخش دوم"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">آماده بهبود سایت خود هستید؟</h3>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            آنالیز رایگان شروع کنید و گزارش دقیق دریافت نمایید
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
            <a href="/analyze">شروع آنالیز رایگان</a>
          </button>
        </div>
      </div>
    </div>
  );
}