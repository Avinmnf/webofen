"use client";
import { WaveBackground } from "./WaveBackground";

interface HeroSectionProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  handleAnalyze: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const HeroSection = ({ url, setUrl, loading, handleAnalyze }: HeroSectionProps) => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600/90 to-blue-700/90 text-white relative overflow-hidden">
      <WaveBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                آنالیز حرفه‌ای
                <span className="block text-blue-200 animate-pulse">وبسایت شما</span>
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 mt-4 leading-relaxed max-w-3xl">
                با ابزار پیشرفته آنالیز ما، سلامت فنی، سئو و عملکرد وبسایت خود را به طور کامل بررسی کنید و راهکارهای بهبود را دریافت نمایید.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4 max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                <input
  type="text"
  placeholder="https://example.com"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  required
  className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 focus:scale-[1.02]"
/>

                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px] hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال بررسی...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      شروع آنالیز
                    </>
                  )}
                </button>
              </div>
              <p className="text-blue-200 text-sm flex items-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                آنالیز کامل سئو، عملکرد، امنیت و دسترسی
              </p>
            </form>
          </div>

          <div className="lg:w-1/3 flex justify-center animate-float">
            <div className="relative w-full max-w-xs">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-30 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/analyze/analyze-unscreen.gif"
                  alt="analyze"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};