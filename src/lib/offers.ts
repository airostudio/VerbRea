export interface Offer {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emblem: string;
}

/** Companion assessments offered as upsells after purchase. */
export const OFFERS: Offer[] = [
  {
    id: "numerical",
    name: "Numerical Reasoning Mastery",
    tagline: "Data sufficiency, ratios, and quantitative judgment under time pressure.",
    description:
      "The same speed-and-accuracy methodology, applied to numerical and data-interpretation reasoning used in GMAT and executive assessment batteries.",
    emblem: "/images/emblem-precision.webp",
  },
  {
    id: "abstract",
    name: "Abstract Reasoning Mastery",
    tagline: "Pattern recognition and non-verbal logic — the fluid-intelligence layer.",
    description:
      "Measures how quickly you detect underlying rules in unfamiliar visual sequences, the core skill assessed in SHL and Korn Ferry diagrammatic batteries.",
    emblem: "/images/emblem-deductive.webp",
  },
  {
    id: "situational",
    name: "Executive Situational Judgement",
    tagline: "Workplace scenario judgment calibrated to leadership assessment centers.",
    description:
      "Evaluates decision-making under ambiguity using the scenario format found in executive and graduate-scheme assessment centers.",
    emblem: "/images/emblem-critical.webp",
  },
];
