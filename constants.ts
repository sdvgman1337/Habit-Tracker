import { PlantStage } from './types';

export const PLANT_STAGES = {
  [PlantStage.SEED]: { emoji: '🌱', label: 'Семя' },
  [PlantStage.SPROUT]: { emoji: '🌿', label: 'Росток' },
  [PlantStage.SMALL_TREE]: { emoji: '🌳', label: 'Деревце' },
  [PlantStage.BIG_TREE]: { emoji: '🌲', label: 'Могучее дерево' },
};

export const MAX_STAGE = 3;

// Helper to get today's date in YYYY-MM-DD
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getYesterdayString = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};
