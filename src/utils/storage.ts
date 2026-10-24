import { UserProgress } from '../types/math';

const STORAGE_KEY = 'vuong_quoc_toan_2_progress';

export const DEFAULT_PROGRESS: UserProgress = {
  studentName: 'Bạn nhỏ',
  avatar: '🐱',
  totalStars: 15,
  completedLessonIds: [1],
  currentLessonId: 1,
  answeredQuestionsCount: 8,
  firstTryCorrectCount: 6,
  neededHintCount: 2,
  wrongQuestionsList: [],
  skillMastery: {
    'Đọc viết số': { correct: 6, total: 6 },
    'Tia số': { correct: 4, total: 5 },
    'Cộng qua 10': { correct: 8, total: 10 },
  },
  soundEnabled: true,
  reducedMotion: false,
  lastStudiedDate: new Date().toISOString().split('T')[0],
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (err) {
    console.error('Error loading progress from storage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress:', err);
  }
}

export function resetProgress(): UserProgress {
  const resetData: UserProgress = {
    ...DEFAULT_PROGRESS,
    totalStars: 0,
    completedLessonIds: [],
    currentLessonId: 1,
    answeredQuestionsCount: 0,
    firstTryCorrectCount: 0,
    neededHintCount: 0,
    wrongQuestionsList: [],
    skillMastery: {},
    lastStudiedDate: new Date().toISOString().split('T')[0],
  };
  saveProgress(resetData);
  return resetData;
}
