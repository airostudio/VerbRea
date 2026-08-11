export type QuestionCategory =
  | "deductive"
  | "critical"
  | "reading"
  | "precision";

export interface Question {
  id: string;
  category: QuestionCategory;
  /** Optional stimulus / passage shown above the question prompt. */
  stimulus?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Seconds allotted before auto-advance. */
  timeLimitSec: number;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number; // -1 if unanswered / timed out
  timeUsedSec: number;
}

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
}

export interface CategoryBreakdown {
  category: QuestionCategory;
  label: string;
  correct: number;
  total: number;
  accuracyPct: number;
  avgTimeSec: number;
}

export interface ScoreReport {
  mastersScore: number; // 400-800 scale
  percentile: number; // 1-99
  tier: string;
  tierDescription: string;
  accuracyPct: number;
  speedIndexPct: number; // 0-100, higher = faster relative to allotted time
  totalCorrect: number;
  totalQuestions: number;
  categories: CategoryBreakdown[];
}
