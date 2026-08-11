import { CATEGORY_LABELS, QUESTIONS } from "./questions";
import type {
  AnswerRecord,
  CategoryBreakdown,
  QuestionCategory,
  ScoreReport,
} from "./types";

const CATEGORY_ORDER: QuestionCategory[] = [
  "deductive",
  "critical",
  "reading",
  "precision",
];

const TIERS: { min: number; tier: string; description: string }[] = [
  {
    min: 780,
    tier: "Elite Reasoner",
    description:
      "You process language and argument structure at a level consistent with top-decile performance on graduate and executive verbal assessments — fast, accurate, and rarely misled by distractor logic.",
  },
  {
    min: 720,
    tier: "Advanced Reasoner",
    description:
      "You extract logical conclusions and evaluate arguments with strong speed and precision, on par with high-performing graduate program applicants.",
  },
  {
    min: 650,
    tier: "Proficient Reasoner",
    description:
      "You reliably reach correct conclusions but have room to sharpen either raw processing speed or precision under time pressure — closing that gap is where the largest score gains typically live.",
  },
  {
    min: 560,
    tier: "Developing Reasoner",
    description:
      "You show solid instincts on individual items but inconsistent performance across question types — targeted practice on your weaker category will move this score fastest.",
  },
  {
    min: 0,
    tier: "Foundational Reasoner",
    description:
      "Your results indicate an opportunity to build core deductive and critical-reasoning technique before timed practice will compound — accuracy improvements will move this score faster than speed drills at this stage.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Smooth percentile mapping from a 400-800 mastery score. */
function scoreToPercentile(score: number): number {
  const t = clamp((score - 400) / 400, 0, 1);
  // Ease the curve so mid-range scores don't cluster at the extremes.
  const eased = t * t * (3 - 2 * t);
  return Math.round(clamp(1 + eased * 98, 1, 99));
}

export function computeScoreReport(answers: AnswerRecord[]): ScoreReport {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  const categoryStats: Record<
    QuestionCategory,
    { correct: number; total: number; timeSum: number; timeCount: number }
  > = {
    deductive: { correct: 0, total: 0, timeSum: 0, timeCount: 0 },
    critical: { correct: 0, total: 0, timeSum: 0, timeCount: 0 },
    reading: { correct: 0, total: 0, timeSum: 0, timeCount: 0 },
    precision: { correct: 0, total: 0, timeSum: 0, timeCount: 0 },
  };

  let totalCorrect = 0;
  let speedSum = 0;

  for (const q of QUESTIONS) {
    const stat = categoryStats[q.category];
    stat.total += 1;

    const answer = answerMap.get(q.id);
    const selectedIndex = answer?.selectedIndex ?? -1;
    const timeUsedSec = clamp(answer?.timeUsedSec ?? q.timeLimitSec, 0, q.timeLimitSec);

    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) {
      stat.correct += 1;
      totalCorrect += 1;
    }

    if (selectedIndex !== -1) {
      stat.timeSum += timeUsedSec;
      stat.timeCount += 1;
      speedSum += clamp((q.timeLimitSec - timeUsedSec) / q.timeLimitSec, 0, 1);
    }
    // Timed-out / unanswered questions contribute 0 to the speed index —
    // using the full allotted time with no answer is the slowest outcome.
  }

  const categories: CategoryBreakdown[] = CATEGORY_ORDER.map((category) => {
    const stat = categoryStats[category];
    return {
      category,
      label: CATEGORY_LABELS[category],
      correct: stat.correct,
      total: stat.total,
      accuracyPct: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
      avgTimeSec: stat.timeCount ? Math.round(stat.timeSum / stat.timeCount) : 0,
    };
  });

  const totalQuestions = QUESTIONS.length;
  const accuracyPct = Math.round((totalCorrect / totalQuestions) * 100);
  const speedIndexPct = Math.round((speedSum / totalQuestions) * 100);

  const mastersScore = Math.round(
    400 + (0.7 * (accuracyPct / 100) + 0.3 * (speedIndexPct / 100)) * 400
  );
  const clampedScore = clamp(mastersScore, 400, 800);
  const percentile = scoreToPercentile(clampedScore);
  const tier = TIERS.find((t) => clampedScore >= t.min) ?? TIERS[TIERS.length - 1];

  return {
    mastersScore: clampedScore,
    percentile,
    tier: tier.tier,
    tierDescription: tier.description,
    accuracyPct,
    speedIndexPct,
    totalCorrect,
    totalQuestions,
    categories,
  };
}

/** Compact, URL/metadata-safe encoding of answers: "idx-idx-idx..." and "time-time-...". */
export function encodeAnswers(answers: AnswerRecord[]): { indices: string; times: string } {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const indices = QUESTIONS.map((q) => byId.get(q.id)?.selectedIndex ?? -1).join(",");
  const times = QUESTIONS.map((q) =>
    Math.round(clamp(byId.get(q.id)?.timeUsedSec ?? q.timeLimitSec, 0, q.timeLimitSec))
  ).join(",");
  return { indices, times };
}

export function decodeAnswers(indices: string, times: string): AnswerRecord[] {
  const idxArr = indices.split(",").map((n) => parseInt(n, 10));
  const timeArr = times.split(",").map((n) => parseInt(n, 10));
  return QUESTIONS.map((q, i) => ({
    questionId: q.id,
    selectedIndex: Number.isFinite(idxArr[i]) ? idxArr[i] : -1,
    timeUsedSec: Number.isFinite(timeArr[i]) ? timeArr[i] : q.timeLimitSec,
  }));
}
