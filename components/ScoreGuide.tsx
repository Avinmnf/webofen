export function ScoreGuide() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl p-6 h-auto sticky top-6 border border-blue-100 animate-slide-up">
      <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        راهنمای امتیاز ها
      </h3>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
          <span>امتیاز بالای 90%: عالی</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></div>
          <span>امتیاز 70% تا 90%: خوب</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 ml-2"></div>
          <span>امتیاز 50% تا 70%: متوسط</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div>
          <span>امتیاز زیر 50%: نیاز به بهبود</span>
        </div>
      </div>
    </div>
  );
}