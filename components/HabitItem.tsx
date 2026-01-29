import React from 'react';
import { Habit } from '../types';
import { PLANT_STAGES, getTodayString } from '../constants';
import { Check, Flame } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onComplete }) => {
  const isCompletedToday = habit.lastCompletedDate === getTodayString();
  const plantInfo = PLANT_STAGES[habit.stage as keyof typeof PLANT_STAGES];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-5 mb-4 shadow-sm flex items-center justify-between border border-[#E8E6DF] transition-all hover:shadow-md">
      <div className="flex items-center space-x-5">
        {/* Plant Emoji Container - Circle shape */}
        <div className={`
          w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-inner transition-colors duration-500
          ${isCompletedToday ? 'bg-[#D4E8B8]' : 'bg-[#F2F0E9]'}
        `}>
          {plantInfo.emoji}
        </div>

        {/* Text Info */}
        <div className="flex flex-col">
          <span className="text-[#2D5A27] font-bold text-lg leading-tight">
            {habit.title}
          </span>
          <div className="flex items-center space-x-3 mt-1.5">
            <span className="text-xs text-[#2D5A27]/70 font-medium bg-[#F2F0E9] px-2.5 py-1 rounded-lg">
              {plantInfo.label}
            </span>
            {habit.streak > 0 && (
              <div className="flex items-center text-[#E67E22] text-sm font-bold">
                <Flame size={14} className="mr-0.5 fill-[#E67E22]" />
                {habit.streak}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => !isCompletedToday && onComplete(habit.id)}
        disabled={isCompletedToday}
        className={`
          w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90
          ${isCompletedToday 
            ? 'bg-[#8EB057] text-white shadow-[#8EB057]/40 shadow-lg cursor-default scale-105' 
            : 'bg-[#F2F0E9] text-[#CBD5E0] hover:bg-[#E2E8F0]'}
        `}
      >
        <Check size={24} strokeWidth={3.5} />
      </button>
    </div>
  );
};

export default HabitItem;
