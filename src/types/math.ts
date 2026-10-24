export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-number' | 'comparison' | 'column-calc' | 'word-problem';
  options?: string[];
  correctAnswer: string | number;
  explanationSteps: string[];
  hintLevel1: string;
  hintLevel2: string;
  misconceptionFeedback?: string;
  difficulty: 1 | 2 | 3 | 4; // 1: Nhận biết, 2: Thông hiểu, 3: Vận dụng, 4: Thử thách
  skillTag: string;
  visualIllustration?: {
    type: 'apples' | 'number-line' | 'bundles' | 'scale' | 'jugs' | 'shapes' | 'clock' | 'calendar' | 'custom';
    data?: any;
  };
}

export interface RealLifeApplication {
  id: string;
  title: string;
  scenario: string;
  question: string;
  correctAnswer: string | number;
  hint: string;
  solutionSteps: string[];
}

export interface Lesson {
  id: number;
  topicId: number;
  title: string;
  shortTitle: string;
  pageNumber: number;
  objectives: string[];
  explore: {
    title: string;
    description: string;
    visualType: 'bundles' | 'number-line' | 'split-combine' | 'scale-balance' | 'liters' | 'geometric' | 'clock' | 'calendar' | 'story';
    visualData?: any;
    steps: {
      stepNumber: number;
      label: string;
      description: string;
    }[];
    interactivePrompt: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
  summaryCard: {
    rules: string[];
    formula?: string;
    sampleExample: string;
    commonMistakes: string;
    memoryTip: string;
  };
  guidedExercises: ExerciseQuestion[];
  selfPracticeExercises: ExerciseQuestion[];
  realLifeApplications: RealLifeApplication[];
  summaryPoints: string[];
}

export interface Topic {
  id: number;
  name: string;
  title: string;
  description: string;
  color: string;
  accentColor: string;
  bgColor: string;
  icon: string;
  lessonCount: number;
  startLessonId: number;
  endLessonId: number;
}

export interface UserProgress {
  studentName: string;
  avatar: string;
  totalStars: number;
  completedLessonIds: number[];
  currentLessonId: number;
  answeredQuestionsCount: number;
  firstTryCorrectCount: number;
  neededHintCount: number;
  wrongQuestionsList: {
    questionId: string;
    lessonId: number;
    questionText: string;
    wrongAnswers: (string | number)[];
    timestamp: number;
  }[];
  skillMastery: Record<string, { correct: number; total: number }>;
  soundEnabled: boolean;
  reducedMotion: boolean;
  lastStudiedDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isOffline?: boolean;
}
