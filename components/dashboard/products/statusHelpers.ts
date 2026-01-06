import React from 'react'; // Add this if not already imported
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    AlertTriangle
} from "lucide-react";

export interface StatusConfig {
    icon: React.ReactNode;
    color: string;
    text: string;
}

export const getStatusConfig = (status?: string): StatusConfig => {
    const configs: Record<string, StatusConfig> = {
        pending: {
            icon: React.createElement(Clock, { className: "w-4 h-4" }),
            color: "text-gray-600 bg-gray-100",
            text: "در انتظار"
        },
        in_progress: {
            icon: React.createElement(Clock, { className: "w-4 h-4 animate-pulse" }),
            color: "text-blue-600 bg-blue-50",
            text: "در حال انجام"
        },
        completed: {
            icon: React.createElement(CheckCircle, { className: "w-4 h-4" }),
            color: "text-emerald-600 bg-emerald-50",
            text: "تکمیل شده"
        },
        cancelled: {
            icon: React.createElement(XCircle, { className: "w-4 h-4" }),
            color: "text-red-600 bg-red-50",
            text: "لغو شده"
        },
        out_of_time: {
            icon: React.createElement(AlertCircle, { className: "w-4 h-4" }),
            color: "text-amber-600 bg-amber-50",
            text: "تاخیر خورده"
        },
    };

    return configs[status || 'pending'] || configs.pending;
};
  export const isDelayed = (item: any): boolean => {
    if (item.adminStatus === "completed") return false;
    if (item.adminStatus === "out_of_time") return true;
    if (!item.startTime) return false;
    return !!item.delayed;
  };
  
  export const shouldShowProgressBar = (item: any): boolean => {
    // Don't show progress bar for completed, cancelled, or out_of_time items
    if (item.adminStatus === "completed" || 
        item.adminStatus === "cancelled" || 
        item.adminStatus === "out_of_time") {
      return false;
    }
    
    // Only show progress bar for items that are in progress and have started
    return (item.adminStatus === "in_progress" && !!item.startTime) ||
           (isDelayed(item) && !!item.startTime);
  };
  export const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    if (typeof document === 'undefined') {
      return html.replace(/<[^>]*>/g, '');
    }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.replace(/\s+/g, ' ').trim();
  };