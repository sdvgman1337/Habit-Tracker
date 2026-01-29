import React, { useMemo, useState, useEffect } from 'react';
import { Habit, PlantStage } from '../types';
import { habitService } from '../services/habitService';
import { PLANT_STAGES } from '../constants';
import { Trophy, Sprout, Star } from 'lucide-react';

const AchievementsTab: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    totalCompletions: 0,
    maxStreak: 0,
    masterTrees: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedHabits, fetchedStats] = await Promise.all([
          habitService.getHabits(),
          habitService.getStats()
        ]);
        setHabits(fetchedHabits);
        setStats(fetchedStats);
      } catch (error) {
        console.error('Failed to fetch achievements data:', error);
      }
    };
    fetchData();
  }, []);

  // Sort habits by stage (descending) then by total completions
  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => b.stage - a.stage || b.totalCompletions - a.totalCompletions);
  }, [habits]);

  return (
    <div className="px-4 pb-28 pt-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#2D5A27] mb-4">Статистика</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 p-4 rounded-[20px] border border-[#E8E6DF] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-10 h-10 bg-[#8EB057]/10 rounded-full flex items-center justify-center text-[#8EB057] mb-2">
              <CheckIcon />
            </div>
            <span className="text-3xl font-bold text-[#2D5A27]">{stats.totalCompletions}</span>
            <span className="text-xs text-[#2D5A27]/60 uppercase tracking-wide font-bold mt-1">Всего выполнено</span>
          </div>
          <div className="bg-white/60 p-4 rounded-[20px] border border-[#E8E6DF] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-10 h-10 bg-[#E67E22]/10 rounded-full flex items-center justify-center text-[#E67E22] mb-2">
              <Star size={20} fill="currentColor" />
            </div>
            <span className="text-3xl font-bold text-[#2D5A27]">{stats.maxStreak}</span>
            <span className="text-xs text-[#2D5A27]/60 uppercase tracking-wide font-bold mt-1">Лучшая серия</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#2D5A27] mb-4 flex items-center">
        <Sprout className="mr-2" size={24} />
        Ваш Гербарий
      </h2>

      {habits.length === 0 ? (
        <div className="text-center py-10 bg-white/40 rounded-[24px] border border-dashed border-[#2D5A27]/20">
          <p className="text-[#2D5A27]/50">Пока пусто. Начните выращивать привычки!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sortedHabits.map((habit) => {
            const plantInfo = PLANT_STAGES[habit.stage as keyof typeof PLANT_STAGES];
            const isMaster = habit.stage === PlantStage.BIG_TREE;

            return (
              <div key={habit.id} className="bg-white rounded-[24px] p-4 flex flex-col items-center text-center shadow-sm border border-[#E8E6DF] relative overflow-hidden">
                {isMaster && (
                  <div className="absolute top-0 right-0 bg-[#E67E22] text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                    MASTER
                  </div>
                )}
                <div className="text-5xl mb-3 mt-2 filter drop-shadow-sm transform hover:scale-110 transition-transform cursor-pointer">
                  {plantInfo.emoji}
                </div>
                <h3 className="font-bold text-[#2D5A27] text-sm line-clamp-1 mb-1">{habit.title}</h3>
                <p className="text-xs text-[#2D5A27]/60 bg-[#F2F0E9] px-2 py-0.5 rounded-md">
                  {plantInfo.label}
                </p>
                <div className="mt-3 w-full bg-[#F2F0E9] h-1.5 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-[#8EB057] rounded-full" 
                    style={{ width: `${(habit.stage / 3) * 100}%` }}
                   ></div>
                </div>
              </div>
            );
          })}
          
          {/* Locked silhouette placeholder to show gamification */}
          <div className="bg-[#F2F0E9]/50 rounded-[24px] p-4 flex flex-col items-center text-center border border-dashed border-[#2D5A27]/20 opacity-60">
            <div className="text-5xl mb-3 mt-2 grayscale opacity-20">🌲</div>
            <h3 className="font-bold text-[#2D5A27]/40 text-sm">???</h3>
            <p className="text-[10px] text-[#2D5A27]/40 mt-1">Скоро откроется</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default AchievementsTab;