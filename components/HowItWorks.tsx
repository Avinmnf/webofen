export function HowItWorks() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "بررسی عملکرد",
      description: "سرعت لود، بهینه‌سازی تصاویر و رندرینگ صفحه را تحلیل می‌کند",
      color: "blue",
      delay: "0s"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "آنالیز سئو",
      description: "ساختار سایت، متا تگ‌ها، سرعت و بهینه‌سازی موتورهای جستجو",
      color: "green",
      delay: "0.1s"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "بررسی امنیت",
      description: "HTTPS، هدرهای امنیتی و آسیب‌پذیری‌های احتمالی را بررسی می‌کند",
      color: "blue",
      delay: "0.2s"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">چگونه آنالیز کار می‌ کند؟</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">ابزار آنالیز ما بیش از ۵۰ پارامتر مختلف را بررسی می‌کند تا گزارش کاملی از وضعیت وبسایت شما ارائه دهد</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-up hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: item.delay }}
          >
            <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}