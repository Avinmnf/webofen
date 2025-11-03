interface StatusDisplayProps {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
}

export function StatusDisplay({ message, type = 'info' }: StatusDisplayProps) {
  const config = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '🔍' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '❌' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '⚠️' },
  }[type];

  return (
    <div className={`mb-6 p-4 border rounded-xl flex items-start animate-fade-in ${config.bg} ${config.border}`}>
      <span className="ml-2 text-lg">{config.icon}</span>
      <p className={`font-medium ${config.text}`}>{message}</p>
    </div>
  );
}