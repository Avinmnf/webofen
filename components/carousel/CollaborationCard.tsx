import React from 'react';
import Image from 'next/image';

interface Collaboration {
  id: number;
  logo: string;
  name: string;
  description: string;
  process: string[];
  screenshots: string[];
}

interface CollaborationCardProps {
  project: Collaboration;
  isActive: boolean;
  onClick: () => void;
}

const CollaborationCard: React.FC<CollaborationCardProps> = ({ 
  project, 
  isActive, 
  onClick 
}) => {
  return (
    <div 
      className={`
        relative w-64 h-80 md:w-80 md:h-96 rounded-2xl cursor-pointer group
        transform transition-all duration-700 ease-out overflow-visible
        ${isActive ? 'scale-102 rotate-0' : 'scale-95 rotate-1'}
        hover:scale-107 hover:rotate-0
      `}
      onClick={onClick}
    >
      {/* Main Card Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-transparent">
        
        {/* Background Gradient (only on hover) */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
        
        {/* Image Container */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full animate-float-slow">
            <Image
              src={project.logo}
              alt={`${project.name} logo`}
              fill
              className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
              priority
            />
          </div>
        </div>

        {/* Hover Overlay - Only covers the image area */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-600 ease-out flex items-end p-6">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-600 ease-out opacity-0 group-hover:opacity-100 space-y-3 w-full">
            <h3 className="text-white font-semibold text-lg mb-2">
              {project.name}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {project.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-400 text-xs font-medium">مشاهده جزئیات</span>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                <svg className="w-3 h-3 text-gray-800 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;