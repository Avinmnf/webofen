import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;