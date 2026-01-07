// OrderItemCard.tsx - Only changed delayed orders to look like waiting orders
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

  // Pulsing animation for active orders - Include delayed orders so they pulse like waiting orders
  useEffect(() => {
    if (item.adminStatus === 'processing' || item.adminStatus === 'pending' || delayed) {
      const interval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [item.adminStatus, delayed]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#f78c0a';
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
      className="group relative bg-white rounded-2xl cursor-pointer overflow-hidden border border-gray-200 w-full"
    >
      {/* Main content layout */}
      <div className="flex flex-col sm:flex-row h-full p-2 sm:p-3">
        {/* Left side - Information */}
        <div className="w-full sm:w-[60%] p-3 sm:p-4 order-2 sm:order-1">
          <div className="flex flex-col h-full">
            {/* Top section - Title and status */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-lg sm:text-xl line-clamp-2 flex-1 mr-2">
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
                    style={{ backgroundColor: delayed ? '#ef4444' : getStatusColor(item.adminStatus) }}
                    animate={{
                      scale: isPulsing ? [1, 1.3, 1] : 1,
                      opacity: isPulsing ? [0.7, 1, 0.7] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {delayed ? 'تاخیر خورده' : statusConfig.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle section - ID and Date */}
            <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm sm:text-md text-gray-600">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-mono text-sm sm:text-base">{item.id.slice(-6)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm sm:text-md text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-sm sm:text-base">{new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
              </div>
            </div>

            {/* Attributes section */}
            {item.attributes.length > 0 && (
              <div className="mb-3 space-y-2">
                {item.attributes.slice(0, 2).map((attr: any, idx: number) => (
                  <motion.div
                    key={idx}
                    className="bg-gray-50 rounded-lg flex justify-between p-2 sm:p-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm sm:text-md text-gray-500 truncate">{attr.name}</div>
                    <div className="text-sm sm:text-md text-gray-700 truncate">{attr.value}</div>
                  </motion.div>
                ))}
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
                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{val.label}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-end truncate min-w-0">
                      {val.value}
                    </span>
                    <motion.div
                      animate={{
                        rotate: copiedId === val.id ? 360 : 0,
                        scale: copiedId === val.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
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

        {/* Right side - Progress bar */}
        <div className="w-full sm:w-[40%] flex flex-col items-center justify-center p-3 sm:p-4 relative order-1 sm:order-2">
          {/* Progress section */}
          <div className="relative w-full max-w-[200px] mx-auto">
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
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5ac7d7] rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Show different content based on configuration
              <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden relative mx-auto">
                {shouldShowImage && displayImage && !imageError ? (
                  // Enhanced visible animation for images
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Enhanced gradient overlay with animation */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{}}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Enhanced floating animation - More visible */}
                    <motion.div
                      className="w-full h-full"
                      animate={{
                        y: [0, -6, 0],
                        rotate: [0, 1, 0, -2, 0],
                      }}
                      transition={{
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        rotate: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <Image
                        height={600}
                        width={500}
                        src={displayImage}
                        alt={item.productTitle}
                        className="w-full h-full object-cover p-2"
                        onError={() => setImageError(true)}
                      />
                    </motion.div>
                   
                    {/* Enhanced inner glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          'inset 0 2px 8px rgba(255,255,255,0.8)',
                          'inset 0 4px 12px rgba(255,255,255,0.9)',
                          'inset 0 2px 8px rgba(255,255,255,0.8)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* Enhanced status overlay for processing */}
                    {item.adminStatus === 'processing' && (
                      <>
                        {/* Highly visible pulse ring */}
                        <motion.div
                          className="absolute -inset-2 rounded-full border-2 border-[#f59e0b]"
                          animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.7, 0.3],
                            borderWidth: [2, 3, 2],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        
                        {/* Highly visible status indicator */}
                        <div className="absolute -top-2 -right-2 z-30">
                          <motion.div
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-lg border-2 border-[#f59e0b]/30"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0],
                              boxShadow: [
                                '0 4px 12px rgba(245, 158, 11, 0.3)',
                                '0 6px 20px rgba(245, 158, 11, 0.5)',
                                '0 4px 12px rgba(245, 158, 11, 0.3)',
                              ],
                            }}
                            transition={{
                              scale: {
                                duration: 1,
                                repeat: Infinity,
                              },
                              rotate: {
                                duration: 2,
                                repeat: Infinity,
                              },
                              boxShadow: {
                                duration: 1.5,
                                repeat: Infinity,
                              },
                            }}
                          >
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  // Highly visible status indicators without images
                  item.adminStatus === 'processing' ? (
                    // Highly visible processing indicator
                    <motion.div
                      className="relative w-12 h-12 sm:w-16 sm:h-16"
                      animate={{
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          background: [
                            'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
                            'linear-gradient(135deg, #fde68a 0%, #fef3c7 50%, #fde68a 100%)',
                            'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                      
                      {/* Highly visible animated ring */}
                      <motion.div
                        className="absolute -inset-2 rounded-full border-2 border-[#f59e0b]/60"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1],
                          borderWidth: [2, 4, 2],
                        }}
                        transition={{
                          rotate: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          borderWidth: {
                            duration: 1,
                            repeat: Infinity,
                          },
                        }}
                      />
                      
                      {/* Highly visible clock animation */}
                      <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center">
                        <motion.div
                          className="relative"
                          animate={{
                            rotate: [0, 15, 0, -15, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            rotate: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                            scale: {
                              duration: 1.5,
                              repeat: Infinity,
                            },
                          }}
                        >
                          <Clock className="w-6 h-6 sm:w-10 sm:h-10 text-[#f59e0b] drop-shadow-lg" />
                        </motion.div>
                      </div>
                      
                      {/* Highly visible orbiting dots */}
                      {[0, 90, 180, 270].map((degree, index) => (
                        <motion.div
                          key={index}
                          className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#5ac7d7] rounded-full shadow-lg"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${degree}deg) translate(20px sm:translate(28px)`,
                          }}
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1.4, 0.8],
                            boxShadow: [
                              '0 0 0 rgba(90, 199, 215, 0)',
                              '0 0 8px rgba(90, 199, 215, 0.8)',
                              '0 0 0 rgba(90, 199, 215, 0)',
                            ],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    // Highly visible pending/other status indicator
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full relative"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          background: [
                            'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                            'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 50%, #f8fafc 100%)',
                            'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                        }}
                      />
                      
                      {/* Highly visible shimmer effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                          backgroundSize: '50% 100%',
                        }}
                      />
                      
                      {/* Enhanced inner shadow with animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            'inset 0 2px 8px rgba(0,0,0,0.08)',
                            'inset 0 4px 12px rgba(0,0,0,0.12)',
                            'inset 0 2px 8px rgba(0,0,0,0.08)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      
                      {/* Status icon with enhanced animation - Show Package icon for delayed AND pending orders */}
                      {(item.adminStatus === 'pending' || delayed) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="relative"
                            animate={{
                              y: [0, -3, 0],
                              rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                              y: {
                                duration: 2,
                                repeat: Infinity,
                              },
                              rotate: {
                                duration: 3,
                                repeat: Infinity,
                              },
                            }}
                          >
                            <div className="absolute -inset-2 sm:-inset-3 bg-white/40 rounded-full blur-md" />
                            <Package className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600 relative z-10 drop-shadow-sm" />
                          </motion.div>
                        </div>
                      )}
            
                      {/* Animated corner accent */}
                      <motion.div
                        className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-400 to-transparent rounded-tr-full"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  )
                )}
                
                {/* Highly visible hover effect */}
                <motion.div
                  className="absolute -inset-2 rounded-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                </motion.div>
              </div>
            )}

            {/* Status indicator ring */}
            <motion.div
              className="absolute -inset-1 rounded-full border-2 pointer-events-none"
              style={{ borderColor: delayed ? '#ef4444' : getStatusColor(item.adminStatus) }}
              animate={{
                opacity: isHovered ? 0.3 : 0,
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Top accent border - Mobile friendly */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-full w-1 sm:w-1.5"
        style={{
          background: `linear-gradient(90deg, ${delayed ? '#ef4444' : getStatusColor(item.adminStatus)} 0%, ${delayed ? '#ef4444' : getStatusColor(item.adminStatus)}80 100%)`,
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