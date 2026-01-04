import React, { useState } from 'react';
import { Copy, CheckCircle, Clock, AlertTriangle, Calendar, Tag, Hash } from 'lucide-react';
import CircularProgressWithTimesmall from '../AnimatedProgress';
import { getStatusConfig, isDelayed, shouldShowProgressBar } from './statusHelpers';

interface OrderItemCardProps {
  item: any;
  onClick: (id: string) => void;
  showWaitingBadge?: boolean;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  onClick,
  showWaitingBadge = false,
  copyToClipboard,
  copiedId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const statusConfig = getStatusConfig(item.adminStatus);
  const delayed = isDelayed(item);
  const showProgress = shouldShowProgressBar(item);

  return (
    <div
      className={`group relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 ${
        showWaitingBadge
          ? 'bg-gradient-to-br from-amber-50/50 to-white border-amber-200 hover:border-amber-300 hover:shadow-lg'
          : delayed
          ? 'bg-gradient-to-br from-red-50/30 to-white border-red-200 hover:border-red-300 hover:shadow-lg'
          : 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
      onClick={() => onClick(item.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Purchase Date */}
      <div className="flex justify-between items-center gap-2 text-xs text-gray-500 mb-5">
        <div className='flex items-center'>
        <Calendar className="w-3.5 h-3.5" />
        <span>{new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${statusConfig.color} border transition-all ${isHovered ? 'scale-105 shadow' : ''} cursor-default`}
          title={statusConfig.text}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
          <div className="flex items-center gap-1">
            {statusConfig.icon}
            <span className="leading-none font-semibold">{statusConfig.text}</span>
          </div>
        </div>
      </div>

      {/* Header with Status and Progress */}
      <div className="flex mb-6 justify-center">

        {/* Progress Visual */}
        {showProgress ? (
          <div className="relative group/progress">
            <CircularProgressWithTimesmall
              startTime={item.startTime}
              deadline={item.deadline || undefined}
              completionTime={item.completionTime}
              delayed={delayed}
              canceled={item.adminStatus === "cancelled"}
              productImage={item.imageUrl}
              videoUrl={item.videoUrl}
              productTitle={item.productTitle}
            />
          </div>
        ) : (
          <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-12 shadow-sm">
            <Clock className="w-4.5 h-4.5 text-gray-500 group-hover:text-blue-500 transition-colors" />
          </div>
        )}
      </div>

      {/* Product Title */}
      <div className="relative mb-5 text-center">
        <h4
          className="font-bold text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300 pr-2"
          title={item.productTitle}
        >
          {item.productTitle}
        </h4>
        {/* Show full title on hover indicator */}
        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Attributes */}
      {item.attributes.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Tag className="w-3 h-3" />
            <span className="font-medium">ویژگی‌ها</span>
          </div>
          <div className="flex flex-wrap gap-2 p-2">
            {item.attributes.slice(0, 3).map((attr: any, idx: number) => (
              <div key={idx} className="flex justify-between w-full items-center">
                <span className="text-xs text-gray-500 block mb-0.5">{attr.name}</span>
                <span className="px-2.5 py-1 bg-gradient-to-br  from-gray-100 to-gray-200 text-gray-800 rounded-lg text-xs font-medium ">
                  {attr.value}
                </span>
              </div>
            ))}
            {item.attributes.length > 3 && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="self-end px-2.5 py-1 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 transition-all flex items-center gap-0.5"
              >
                +{item.attributes.length - 3}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submitted Values */}
      {item.submittedValues?.slice(0, 2).map((val: any) => (
        <div
          key={val.id}
          className="flex items-center justify-between group/value hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent p-2 rounded-lg transition-all duration-200 mb-2 last:mb-3 border border-transparent hover:border-blue-100"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(val.value, val.id);
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-70" />
            <span className="text-xs text-gray-600 font-medium truncate">
              {val.label}:
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-900 font-semibold truncate max-w-[100px] group-hover/value:text-blue-600 transition-colors">
              {val.value}
            </span>
        
          </div>
        </div>
      ))}

      {/* Order ID */}
      <div className="flex items-center justify-between group/id hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-100">
        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">کد سفارش:</span>
        </div>
        <span className="text-xs text-gray-700 font-mono font-semibold">
          #{item.id.slice(-15)}
        </span>
      </div>

    

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-300/50 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default OrderItemCard;