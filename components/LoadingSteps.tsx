"use client";

export const LoadingSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "در حال بررسی URL و اتصال به سرور...",
    "آنالیز عملکرد و سرعت وبسایت...",
    "بررسی سئو و بهینه‌سازی...",
    "آنالیز امنیت و بهترین روش‌ها...",
    "تهیه گزارش نهایی..."
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-all duration-500 ${
            index <= currentStep
              ? "bg-blue-50 border border-blue-200 text-blue-700"
              : "bg-gray-100 text-gray-500"
          } ${index === currentStep ? "scale-105 shadow-sm" : ""}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                ? "bg-blue-500 text-white animate-pulse"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index < currentStep ? "✓" : index + 1}
          </div>
          <span className="text-sm font-medium">{step}</span>
        </div>
      ))}
    </div>
  );
};