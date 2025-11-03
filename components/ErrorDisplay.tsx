interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  const isSuccess = error.includes("🎉");
  
  return (
    <div className={`mb-6 p-4 border rounded-xl flex items-start animate-shake ${
      isSuccess
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"
    }`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mt-0.5 ml-2 flex-shrink-0 ${
        isSuccess ? "text-green-500" : "text-red-500"
      }`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <p className={isSuccess ? "text-green-700" : "text-red-700"}>{error}</p>
    </div>
  );
}