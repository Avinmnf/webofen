// /components/dashboard/products/TabNavigation.tsx
import React from 'react';
import {
  PlayCircle,
  Edit2,
  AlertOctagon,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.count === 0;
        
        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
              isActive
                ? `bg-white ${tab.color} shadow-sm`
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isDisabled}
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs ${tab.bgColor} px-2 py-0.5 rounded-full`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;