interface SuccessAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onViewResults: () => void;
}

export function SuccessAlert({ isOpen, onClose, onViewResults }: SuccessAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-50 bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full animate-scale-in shadow-2xl border border-green-200 relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🎉 آنالیز کامل شد!
          </h3>
          <p className="text-gray-600 mb-6">
            نتیجه آنالیز وب‌سایت شما آماده است. برای مشاهده روی دکمه زیر بزنید.
          </p>

          <button
            onClick={onViewResults}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            مشاهده نتایج
          </button>

          <button
            onClick={onClose}
            className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}