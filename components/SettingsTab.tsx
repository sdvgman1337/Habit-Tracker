import React, { useState } from 'react';
import { User, Bell, Moon, ChevronRight, Github } from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

  return (
    <div className="px-4 pb-28 pt-6 animate-fade-in">
      
      {/* Profile Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E8E6DF] flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-[#2D5A27] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-[#2D5A27]/20 overflow-hidden">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{user?.first_name?.[0] || 'G'}</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2D5A27]">
            {user ? `${user.first_name} ${user.last_name || ''}` : 'Садовник'}
          </h2>
          <p className="text-[#2D5A27]/60 text-sm">@{user?.username || 'gardener'}</p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-[#2D5A27]/50 uppercase tracking-wider mb-3 ml-2">Настройки приложения</h3>
      
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#E8E6DF]">
        <div className="flex items-center justify-between p-4 border-b border-[#E8E6DF] active:bg-[#F2F0E9] transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#8EB057]/10 flex items-center justify-center text-[#8EB057]">
              <Bell size={18} />
            </div>
            <span className="font-medium text-[#2D5A27]">Уведомления</span>
          </div>
          <div 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${notifications ? 'bg-[#8EB057]' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 active:bg-[#F2F0E9] transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27]">
              <Moon size={18} />
            </div>
            <span className="font-medium text-[#2D5A27]">Темная тема</span>
          </div>
          <span className="text-xs text-[#2D5A27]/50 font-medium">Авто (Telegram)</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[#2D5A27]/40 text-xs">HabitGarden v1.0.0</p>
        <p className="text-[#2D5A27]/30 text-[10px] mt-1">Made with 🌱 for Telegram</p>
      </div>

    </div>
  );
};

export default SettingsTab;
