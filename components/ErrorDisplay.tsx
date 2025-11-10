// components/ErrorDisplay.tsx - اگر دارید اصلاح کنید
interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  const isConnectionError = error.includes('connect') || error.includes('refused') || error.includes('timeout');

  return (
    <div className={`p-4 rounded-lg mb-6 ${
      isConnectionError ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${
          isConnectionError ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {isConnectionError ? '🔌' : '⚠️'}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${
            isConnectionError ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {isConnectionError ? 'Connection Error' : 'Error'}
          </h3>
          <div className={`mt-1 text-sm ${
            isConnectionError ? 'text-red-700' : 'text-yellow-700'
          }`}>
            <p>{error}</p>
            {isConnectionError && (
              <div className="mt-2">
                <p className="font-medium">Please make sure:</p>
                <ul className="list-disc list-inside mt-1 text-xs">
                  <li>The analyzer backend is running on port 4000</li>
                  <li>No other service is using port 4000</li>
                  <li>The backend service started successfully</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}