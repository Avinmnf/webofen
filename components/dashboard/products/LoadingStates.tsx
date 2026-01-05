import React from 'react';
import { Package, AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "در حال بارگذاری سفارش‌ها",
  message = "لطفاً چند لحظه صبر کنید..."
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 mx-auto border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        <div>
          <p className="text-gray-700 font-medium">{title}</p>
          <p className="text-gray-500 text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطا در بارگذاری</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              تلاش مجدد
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoginRequiredState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ابتدا وارد شوید</h3>
          <p className="text-gray-600 text-sm">
            برای مشاهده سفارش‌های بک لینک، لطفاً ابتدا وارد حساب کاربری خود شوید.
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ message?: string }> = ({ 
  message = "سفارشی ثبت نشده" 
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <Package className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-lg text-gray-900 mb-2">{message}</p>
    </div>
  );
};