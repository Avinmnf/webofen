"use client";

export const ProgressWithTime = ({ progress, elapsedTime }: { progress: number; elapsedTime: number }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2 space-x-reverse">
        <span className="text-white font-medium">پیشرفت کلی</span>
        <div className="flex items-center space-x-1 space-x-reverse bg-white/20 rounded-full px-2 py-1">
          <svg className="w-3 h-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-200 text-xs">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      <span className="text-blue-200 font-bold text-lg">{progress}%</span>
    </div>
  );
};