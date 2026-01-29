export interface Habit {
  id: string;
  title: string;
  stage: number; // 0 = Seed, 1 = Sprout, 2 = Small Tree, 3 = Big Tree
  streak: number;
  totalCompletions: number;
  lastCompletedDate: string | null; // ISO Date String YYYY-MM-DD
}

export enum PlantStage {
  SEED = 0,
  SPROUT = 1,
  SMALL_TREE = 2,
  BIG_TREE = 3,
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface TelegramWebApp {
  expand: () => void;
  ready: () => void;
  setHeaderColor?: (color: string) => void;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
  HapticFeedback: {
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export type AppTab = 'garden' | 'achievements' | 'settings';