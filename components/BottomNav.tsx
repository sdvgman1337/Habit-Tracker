import React from 'react';
import { Sprout, Trophy, Settings } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const handleTabClick = (tab: AppTab) => {
    if (activeTab !== tab) {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
      onTabChange(tab);
    }
  };

  const navItems = [
    { id: 'garden', label: 'Мой Сад', icon: Sprout },
    { id: 'achievements', label: 'Достижения', icon: Trophy },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E6DF] pb-safe pt-2 px-6 z-40 shadow-lg rounded-t-[30px]">
      <div className="flex justify-between items-center max-w-md mx-auto h-20 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as AppTab)}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
            >
              <div className={`
                p-2 rounded-2xl mb-1 transition-all duration-300
                ${isActive ? 'bg-[#2D5A27] text-white shadow-md shadow-[#2D5A27]/20' : 'text-[#A0AEC0]'}
              `}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-[#2D5A27]' : 'text-[#A0AEC0]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
