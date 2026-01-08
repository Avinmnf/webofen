"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Crown, History, X, ShoppingBag, Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Filter, Calendar, FileText, DollarSign, Info, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HistoryFilterType = "all" | "completed" | "cancelled" | "out_of_time";

interface ProductDashboardWrapperProps {
  title: string;
  children: React.ReactNode;
  isVIP: boolean;
  onOpenHistory: () => void;
  historyItems?: any[];
  historyFilter?: HistoryFilterType;
  onHistoryFilterChange?: (filter: HistoryFilterType) => void;
}

const HistoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: any[];
  activeFilter: HistoryFilterType;
  onFilterChange: (filter: HistoryFilterType) => void;
}> = ({ isOpen, onClose, title, items, activeFilter, onFilterChange }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter items based on current filter - This must come BEFORE any conditional returns
  const filteredHistoryItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter(item => item.adminStatus === activeFilter);
  }, [items, activeFilter]);

  const filters = useMemo(() => [
    { 
      id: 'all' as HistoryFilterType, 
      label: 'همه سفارش‌ها', 
      icon: <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: items.length
    },
    { 
      id: 'completed' as HistoryFilterType, 
      label: 'تکمیل شده', 
      icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: items.filter(item => item.adminStatus === 'completed').length
    },
    { 
      id: 'cancelled' as HistoryFilterType, 
      label: 'لغو شده', 
      icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: items.filter(item => item.adminStatus === 'cancelled').length
    },
    { 
      id: 'out_of_time' as HistoryFilterType, 
      label: 'دیرکرده', 
      icon: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: items.filter(item => item.adminStatus === 'out_of_time').length
    },
  ], [items]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-gradient-to-r from-emerald-500 to-teal-400', 
          icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
          label: 'تکمیل شده',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          accentColor: '#10b981'
        };
      case 'cancelled':
        return { 
          color: 'bg-gradient-to-r from-rose-500 to-pink-400', 
          icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
          label: 'لغو شده',
          bgColor: 'bg-rose-50',
          textColor: 'text-rose-700',
          accentColor: '#f43f5e'
        };
      case 'out_of_time':
        return { 
          color: 'bg-gradient-to-r from-amber-500 to-orange-400', 
          icon: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />,
          label: 'دیرکرده',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          accentColor: '#f59e0b'
        };
      default:
        return { 
          color: 'bg-gradient-to-r from-gray-500 to-gray-400', 
          icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
          label: 'در حال بررسی',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          accentColor: '#6b7280'
        };
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-emerald-500/20 to-teal-400/10';
      case 'cancelled':
        return 'from-rose-500/20 to-pink-400/10';
      case 'out_of_time':
        return 'from-amber-500/20 to-orange-400/10';
      default:
        return 'from-gray-500/20 to-gray-400/10';
    }
  };

  const handleCardClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const formatPrice = (price: number) => {
    return price?.toLocaleString('fa-IR');
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusInfo = getStatusInfo(status);
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} border border-opacity-30`}
        style={{ borderColor: statusInfo.accentColor }}
      >
        {statusInfo.icon}
        <span className="text-xs font-medium">{statusInfo.label}</span>
      </motion.div>
    );
  };

  const OrderCard = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.adminStatus);
    const isHovered = hoveredCard === item.id;
  
    return (
      <div
        onMouseEnter={() => setHoveredCard(item.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick(item)}
        className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:border-gray-300 transform-gpu"
      >
        {/* Animated gradient border */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(item.adminStatus)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl -z-10`}
        />
        
        {/* Status indicator line */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-full -z-10"
          style={{ 
            background: statusInfo.color,
          }} 
        />
  
        <div className="relative p-3 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <StatusBadge status={item.adminStatus} />
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 sm:py-1 rounded">
                  #{item.orderId?.slice(-8) || item.id?.slice(-8)}
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
                {item.productTitle}
              </h3>
            </div>
            
            <div className="p-1 sm:p-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
  
          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>تاریخ خرید:</span>
                <span className="font-medium text-gray-900 mr-1">
                  {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              
              {item.completionTime && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>تاریخ تکمیل:</span>
                  <span className="font-medium text-gray-900 mr-1">
                    {new Date(item.completionTime).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              )}
            </div>
  
            {/* Attributes Preview */}
            {item.attributes && item.attributes.length > 0 && (
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>ویژگی‌ها:</span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {item.attributes.slice(0, 2).map((attr: any, idx: number) => (
                    <div key={idx} className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 rounded-lg transition-all duration-200 group-hover:bg-gray-200">
                      <span className="text-xs text-gray-600">{attr.name}</span>
                      <span className="text-xs font-medium text-gray-900">{attr.value}</span>
                    </div>
                  ))}
                  {item.attributes.length > 2 && (
                    <span className="text-xs text-gray-500 px-2 py-0.5 sm:py-1 transition-all duration-200 group-hover:bg-gray-100">
                      +{item.attributes.length - 2} بیشتر
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
  
          {/* Footer with Price and CTA */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 sm:gap-2">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                  مبلغ پرداختی
                </div>
                <div className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-0.5 sm:gap-1 transition-colors duration-200 group-hover:text-gray-800">
                  {formatPrice(item.price)}
                  <span className="text-xs sm:text-sm font-normal text-gray-600">تومان</span>
                </div>
              </div>
            </div>
            
            <button
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#f78c0a] rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">مشاهده جزئیات</span>
              <span className="sm:hidden">جزئیات</span>
            </button>
          </div>
  
          {/* Completion Report Preview */}
          {item.completionReport && isHovered && (
            <div className="pt-3 sm:pt-4 border-t border-gray-100 animate-fadeIn">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">گزارش تکمیل</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {stripHtmlTags(item.completionReport)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DetailModal = () => (
    <AnimatePresence>
      {showDetailModal && selectedItem && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={handleCloseDetailModal}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#5ac7d7] text-white p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">جزئیات سفارش</h2>
                    <p className="text-xs sm:text-sm opacity-90 mt-1">{selectedItem.productTitle}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">اطلاعات زمانی</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">تاریخ خرید:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {new Date(selectedItem.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      {selectedItem.completionTime && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">تاریخ تکمیل:</span>
                          <span className="text-xs font-medium text-gray-900">
                            {new Date(selectedItem.completionTime).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="p-1 sm:p-2 bg-emerald-100 rounded-lg">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">اطلاعات مالی</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">مبلغ پرداختی:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {formatPrice(selectedItem.price)} تومان
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">تعداد:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {selectedItem.quantity || 1} عدد
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="p-1 sm:p-2 bg-amber-100 rounded-lg">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">وضعیت سفارش</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">وضعیت:</span>
                        <StatusBadge status={selectedItem.adminStatus} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">کد پیگیری:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {selectedItem.orderId?.slice(-8) || selectedItem.id?.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attributes */}
                {selectedItem.attributes && selectedItem.attributes.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-6 rounded-xl border border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                      ویژگی‌های سفارش
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {selectedItem.attributes.map((attr: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-[#5ac7d7] transition-colors"
                        >
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{attr.name}:</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{attr.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completion Report */}
                {selectedItem.completionReport && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-6 rounded-xl border border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                      گزارش تکمیل سفارش
                    </h3>
                    <div className="bg-white text-black rounded-lg border border-gray-200 p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto">
                      <div
                        className="prose prose-xs sm:prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedItem.completionReport }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>آخرین به‌روزرسانی: {new Date().toLocaleTimeString('fa-IR')}</span>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#1d546b] cursor-pointer rounded-lg hover:shadow-lg transition-shadow"
                >
                  بستن
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Now we can safely return null after all hooks have been called
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-2 sm:inset-4 z-50 overflow-hidden"
          >
            <div className="h-full bg-white w-full sm:w-11/12 md:w-10/12 lg:w-8/12 m-auto rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[#1d546b] text-white">
                <div className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                        <History className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold">تاریخچه سفارش‌ها</h2>
                        <p className="text-xs sm:text-sm opacity-90 mt-1">تمام سفارش‌های ثبت‌شده در {title}</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {filters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${activeFilter === filter.id
                          ? 'bg-white text-[#1d546b] shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                      >
                        {filter.icon}
                        <span className="hidden sm:inline">{filter.label}</span>
                        <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                        <span className={`px-1 sm:px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.id ? 'bg-[#1d546b]/10' : 'bg-white/20'}`}>
                          {filter.count}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-3 sm:p-6">
                  {filteredHistoryItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 sm:py-16"
                    >
                      <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <History className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">سفارشی یافت نشد</h3>
                      <p className="text-xs sm:text-gray-600 max-w-md mx-auto">
                        {activeFilter === 'all'
                          ? 'هنوز سفارشی در این بخش ثبت نکرده‌اید.'
                          : `سفارش ${filters.find(f => f.id === activeFilter)?.label}‌ای در تاریخچه شما وجود ندارد.`}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                      {filteredHistoryItems.map((item: any, index: number) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <OrderCard item={item} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{filteredHistoryItems.length}</span> سفارش نمایش داده شده
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={onClose}
                      className="px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <DetailModal />
        </>
      )}
    </AnimatePresence>
  );
};

const ProductDashboardWrapper: React.FC<ProductDashboardWrapperProps> = ({
  title,
  children,
  isVIP,
  onOpenHistory,
  historyItems = [],
  historyFilter = 'all',
  onHistoryFilterChange = () => { },
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    onOpenHistory();
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleFilterChange = (filter: HistoryFilterType) => {
    onHistoryFilterChange(filter);
  };

  // Filter items in the parent component for initial modal state
  const filteredHistoryItems = useMemo(() => {
    if (historyFilter === 'all') return historyItems;
    return historyItems.filter(item => item.adminStatus === historyFilter);
  }, [historyItems, historyFilter]);

  return (
    <>
      <div className="h-full overflow-auto bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div>
                  <h1 className="text-lg sm:text-2xl font-semibold text-gray-700">مدیریت سفارش‌های {title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {isVIP && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-[#f78c0a] to-[#ff9d2e] text-white rounded-lg shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">کاربر ویژه</span>
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenHistory}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-[#0364af] rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  مشاهده تاریخچه
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {children}
        </div>
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        title={title}
        items={historyItems} // Pass all items, let HistoryModal handle filtering
        activeFilter={historyFilter}
        onFilterChange={handleFilterChange}
      />
    </>
  );
};

export default ProductDashboardWrapper;