import { Habit } from '../types';

// Helper to get Telegram ID safely
const getTelegramId = (): string => {
  // In development, if not inside Telegram, use a test ID
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return '1000'; // Test User ID
  }
  return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
};

const HEADERS = () => ({
  'Content-Type': 'application/json',
  'X-Telegram-User-ID': getTelegramId(),
});

export const habitService = {
  getHabits: async (): Promise<Habit[]> => {
    try {
      const response = await fetch('/api/habits', {
        headers: HEADERS(),
      });
      
      // Check if response is JSON (prevents crashing if proxy fails and returns HTML)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
         throw new Error("Received non-JSON response from API (check vite proxy)");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("HabitService Error:", error);
      return [];
    }
  },

  addHabit: async (title: string): Promise<Habit | null> => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: HEADERS(),
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to add habit');
      return await response.json();
    } catch (error) {
      console.error("HabitService Error:", error);
      return null;
    }
  },

  completeHabit: async (id: string): Promise<Habit | null> => {
    try {
      const response = await fetch(`/api/habits/${id}/complete`, {
        method: 'POST',
        headers: HEADERS(),
      });
      if (!response.ok) throw new Error('Failed to complete habit');
      return await response.json();
    } catch (error) {
      console.error("HabitService Error:", error);
      return null;
    }
  },

  deleteHabit: async (id: string): Promise<void> => {
    try {
      await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
        headers: HEADERS(),
      });
    } catch (error) {
      console.error("HabitService Error:", error);
    }
  },

  getStats: async (): Promise<{ totalHabits: number; totalCompletions: number; maxStreak: number; masterTrees: number }> => {
    const habits = await habitService.getHabits();
    
    const totalCompletions = habits.reduce((acc, h) => acc + (h.totalCompletions || 0), 0);
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    const masterTrees = habits.filter(h => h.stage === 3).length; // 3 is BIG_TREE

    return {
      totalHabits: habits.length,
      totalCompletions,
      maxStreak,
      masterTrees
    };
  }
};