// OrderItemCard.tsx - Updated with automatic slug detection
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Clock, AlertTriangle, Calendar, Tag, Hash, ChevronRight, Play, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularProgressWithTimesmall from '../AnimatedProgress';
import { getStatusConfig, isDelayed, shouldShowProgressBar } from './statusHelpers';
import Image from 'next/image';

interface OrderItemCardProps {
  item: any;
  onClick: (id: string) => void;
  showWaitingBadge?: boolean;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
}

// Create a centralized image mapping configuration that can be imported anywhere
export const IMAGE_MAPPING = {
  // Map page slugs to image paths
  'backlink': '/dashboard/backlink.png',
  'seo': '/dashboard/seo.png',
  'content': '/dashboard/content.png',
  'content-writing': '/dashboard/content.png',
  'social-media': '/dashboard/social-media.png',
  'graphic-design': '/dashboard/design.png',
  'web-development': '/dashboard/web-dev.png',
  'instagram-story': '/dashboard/instagram-story.png',
  'instagram-post': '/dashboard/instagram-post.png',
  'instagram-reel': '/dashboard/instagram-reel.png',
  'youtube-thumbnail': '/dashboard/youtube-thumbnail.png',
  'youtube-short': '/dashboard/youtube-short.png',
  'facebook-post': '/dashboard/facebook-post.png',
  'twitter-post': '/dashboard/twitter-post.png',
  'linkedin-post': '/dashboard/linkedin-post.png',
  'tiktok-video': '/dashboard/tiktok-video.png',
  'marketing': '/dashboard/marketing.png',
  'technical': '/dashboard/technical.png',
  'consultation': '/dashboard/consultation.png',

  // Helper function to get current page slug dynamically
  getCurrentPageSlug: (): string | undefined => {
    if (typeof window === 'undefined') return undefined;

    // Get current pathname and extract slug
    const pathname = window.location.pathname;

    // Remove leading/trailing slashes and split
    const pathParts = pathname.replace(/^\/+|\/+$/g, '').split('/');

    // If we're in dashboard pages, get the last part
    if (pathParts.includes('dashboard') && pathParts.length > 1) {
      return pathParts[pathParts.length - 1];
    }

    // Return the last part of the path
    return pathParts[pathParts.length - 1] || undefined;
  },

  // Get image for current page
  getImageForCurrentPage: (): string | undefined => {
    const currentSlug = IMAGE_MAPPING.getCurrentPageSlug();
    if (!currentSlug) return undefined;

    const slugLower = currentSlug.toLowerCase();

    // Check for exact matches
    for (const [key, imagePath] of Object.entries(IMAGE_MAPPING)) {
      if (key !== 'getCurrentPageSlug' && key !== 'getImageForCurrentPage' &&
        key !== 'getImageForSlug' && slugLower === key.toLowerCase()) {
        return imagePath as string;
      }
    }

    // Check for partial matches
    for (const [key, imagePath] of Object.entries(IMAGE_MAPPING)) {
      if (key !== 'getCurrentPageSlug' && key !== 'getImageForCurrentPage' &&
        key !== 'getImageForSlug' && slugLower.includes(key.toLowerCase())) {
        return imagePath as string;
      }
    }

    // Check for common patterns
    if (slugLower.includes('backlink')) return '/dashboard/backlink.png';
    if (slugLower.includes('seo')) return '/dashboard/seo.png';
    if (slugLower.includes('content')) return '/dashboard/content.png';
    if (slugLower.includes('social')) return '/dashboard/social-media.png';
    if (slugLower.includes('design')) return '/dashboard/design.png';
    if (slugLower.includes('web') || slugLower.includes('development')) return '/dashboard/web-dev.png';
    if (slugLower.includes('marketing')) return '/dashboard/marketing.png';
    if (slugLower.includes('technical') || slugLower.includes('programming')) return '/dashboard/technical.png';

    return undefined;
  },

  // Alternative: Get image for specific slug
  getImageForSlug: (slug: string): string | undefined => {
    const slugLower = slug.toLowerCase();

    for (const [key, imagePath] of Object.entries(IMAGE_MAPPING)) {
      if (key !== 'getCurrentPageSlug' && key !== 'getImageForCurrentPage' &&
        key !== 'getImageForSlug' && slugLower.includes(key.toLowerCase())) {
        return imagePath as string;
      }
    }

    return undefined;
  }
} as Record<string, any>; // Type assertion to avoid TypeScript errors

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  onClick,
  showWaitingBadge = false,
  copyToClipboard,
  copiedId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentPageSlug, setCurrentPageSlug] = useState<string | undefined>(undefined);
  const statusConfig = getStatusConfig(item.adminStatus);
  const delayed = isDelayed(item);
  const showProgress = shouldShowProgressBar(item);

  // Get current page slug on component mount
  useEffect(() => {
    const slug = IMAGE_MAPPING.getCurrentPageSlug();
    setCurrentPageSlug(slug);
  }, []);

  // Get image path from mapping - AUTOMATICALLY based on current page
  const mappedImagePath = currentPageSlug ? IMAGE_MAPPING.getImageForSlug(currentPageSlug) : undefined;
  const shouldShowImage = !!mappedImagePath;
  const displayImage = mappedImagePath || item.imageUrl;

  // Pulsing animation for active orders
  useEffect(() => {
    if (item.adminStatus === 'processing' || item.adminStatus === 'pending') {
      const interval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [item.adminStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#6FD6E5';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item.id)}
      className="group relative bg-white rounded-2xl cursor-pointer overflow-hidden border border-gray-200"

    >
      {/* Main content layout */}
      <div className="flex h-full">
        {/* Left side - Information (2/3 width) */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            {/* Top section - Title and status */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
                  {item.productTitle}
                </h4>
                <motion.div
                  animate={{
                    x: isHovered ? 4 : 0,
                  }}
                >
                </motion.div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(item.adminStatus) }}
                    animate={{
                      scale: isPulsing ? [1, 1.3, 1] : 1,
                      opacity: isPulsing ? [0.7, 1, 0.7] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {statusConfig.text}
                  </span>
                </div>

                {delayed && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>تاخیر</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle section - ID and Date */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-mono">{item.id.slice(-6)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
              </div>
            </div>

            {/* Attributes section */}
            {item.attributes.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2">
                  {item.attributes.slice(0, 2).map((attr: any, idx: number) => (
                    <motion.div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-xs text-gray-500 truncate mb-1">{attr.name}</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{attr.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Submitted values */}
            {item.submittedValues?.slice(0, 1).map((val: any) => (
              <motion.div
                key={val.id}
                className="mt-auto"
                whileHover={{ x: 4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(val.value, val.id);
                }}
              >
                <div className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#5ac7d7]" />
                    <span className="text-sm text-gray-600">{val.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {val.value}
                    </span>
                    <motion.div
                      animate={{
                        rotate: copiedId === val.id ? 360 : 0,
                        scale: copiedId === val.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {copiedId === val.id ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 hover:text-[#5ac7d7] transition-colors" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Progress bar (1/3 width) */}
        <div className="w-1/3 border-r border-l border-gray-100 flex flex-col items-center justify-center p-4 relative">
          {/* Progress section */}
          <div className="relative">
            {/* Progress circle */}
            {showProgress ? (
              <div className="relative">
                <CircularProgressWithTimesmall
                  startTime={item.startTime}
                  deadline={item.deadline || undefined}
                  completionTime={item.completionTime}
                  delayed={delayed}
                  canceled={item.adminStatus === "cancelled"}
                  productImage={displayImage}
                  videoUrl={item.videoUrl}
                  productTitle={item.productTitle}
                />

                {/* Hover play button for videos */}
                <AnimatePresence>
                  {isHovered && item.videoUrl && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <div className="w-12 h-12 bg-[#5ac7d7] rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Show different content based on configuration
              <div className="w-20 h-20 rounded-full  flex items-center justify-center bg-white transition-all duration-500 overflow-hidden">
                {shouldShowImage && displayImage && !imageError ? (
                  // Show mapped image
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      height={100}
                      width={100}
                      src={displayImage}
                      alt={item.productTitle}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                    {/* Dark overlay for better visibility */}
                    <div className="absolute inset-0transition-colors duration-300" />

                    {/* FIXED: Only show clock for processing status, NOT for pending */}
                    {/* This removes clock from waiting items */}
                    {(item.adminStatus === 'processing') && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // Show clock icon only for processing items
                  // For pending items, show package icon or gradient
                  item.adminStatus === 'processing' ? (
                    <Clock className="w-8 h-8 text-gray-400 group-hover:text-[#5ac7d7] transition-colors duration-500" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {/* Optional: Add a different icon for pending items */}
                      {/* <Package className="w-6 h-6 text-gray-400" /> */}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Status indicator ring */}
            <motion.div
              className="absolute -inset-1 rounded-full border-2 pointer-events-none"
              style={{ borderColor: getStatusColor(item.adminStatus) }}
              animate={{
                opacity: isHovered ? 0.2 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Top accent border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-full w-1"
        style={{
          background: `linear-gradient(90deg, ${getStatusColor(item.adminStatus)} 0%, ${getStatusColor(item.adminStatus)}80 100%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      {/* Hover overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1d546b]/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderItemCard;