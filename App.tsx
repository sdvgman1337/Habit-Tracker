import React, { useState, useEffect, useCallback } from 'react';
import { Habit, AppTab } from './types';
import { habitService } from './services/habitService';
import HabitItem from './components/HabitItem';
import AddHabitModal from './components/AddHabitModal';
import BottomNav from './components/BottomNav';
import AchievementsTab from './components/AchievementsTab';
import SettingsTab from './components/SettingsTab';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('garden');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const fetchHabits = async () => {
    const data = await habitService.getHabits();
    setHabits(data);
  };

  // Load habits on mount and tab change
  useEffect(() => {
    // Expand Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
      
      // Force header color
      if (window.Telegram.WebApp.setHeaderColor) {
        window.Telegram.WebApp.setHeaderColor('#ffffff');
      }
    }

    fetchHabits();
  }, [activeTab]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  const handleCreateHabit = async (title: string) => {
    await habitService.addHabit(title);
    fetchHabits();
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleCompleteHabit = useCallback(async (id: string) => {
    const updated = await habitService.completeHabit(id);
    if (updated) {
      // Optimistic update or refetch
      setHabits(prev => prev.map(h => h.id === id ? updated : h));
      
      showToast('Привычка отмечена! Ваше растение растет.');
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'achievements':
        return <AchievementsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'garden':
      default:
        return (
          <div className="px-4 py-4 pb-28 animate-fade-in">
             <div className="bg-[#2D5A27] text-white rounded-[24px] p-6 mb-6 shadow-lg shadow-[#2D5A27]/20 relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="text-3xl font-bold mb-1">
                     Мой Сад
                   </h2>
                   <p className="opacity-90 text-sm">Ухаживайте за своими привычками каждый день.</p>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             </div>

            {habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 text-center px-6 py-10 bg-white rounded-[30px] shadow-sm border border-[#E8E6DF]">
                <div className="text-7xl mb-4 transform hover:scale-110 transition-transform duration-500">🌱</div>
                <h3 className="text-xl font-bold text-[#2D5A27] mb-2">Ваш сад пуст</h3>
                <p className="text-[#2D5A27]/60 mb-6">Время посадить первое семя!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#8EB057] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#8EB057]/30"
                >
                  + Посадить привычку
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-end mb-4 px-1">
                   <h3 className="font-bold text-[#2D5A27] text-lg">Задачи на сегодня</h3>
                   <span className="text-xs text-[#2D5A27]/50 font-medium bg-[#E8E6DF] px-2 py-1 rounded-lg">
                     {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                   </span>
                </div>
                {habits.map(habit => (
                  <HabitItem 
                    key={habit.id} 
                    habit={habit} 
                    onComplete={handleCompleteHabit} 
                  />
                ))}
                
                {/* Spacer for FAB */}
                <div className="h-20"></div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] relative overflow-x-hidden font-sans">
      
      {/* Content Area */}
      {renderContent()}

      {/* Floating Action Button (Only on Garden Tab) */}
      {activeTab === 'garden' && habits.length > 0 && (
        <div className="fixed bottom-24 right-5 z-30">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-auto px-5 h-14 bg-[#2D5A27] text-white rounded-full shadow-xl shadow-[#2D5A27]/40 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <Plus size={24} />
            <span className="font-bold">+ Посадить</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <AddHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateHabit} 
      />

      {/* Toast Notification */}
      <div 
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2D5A27]/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center space-x-3 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <span>🎉</span>
        <span className="font-bold text-sm">{toast.message}</span>
      </div>
    </div>
  );
};

export default App;
