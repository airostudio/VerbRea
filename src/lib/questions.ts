import type { Question } from "./types";

/**
 * Original question bank modeled on the format and cognitive demands of
 * graduate/professional verbal assessments (GRE Verbal, LSAT Logical
 * Reasoning, and executive assessment suites). All items are written for
 * VerbRea — none are reproduced from any copyrighted exam.
 */
export const CATEGORY_LABELS: Record<Question["category"], string> = {
  deductive: "Deductive Reasoning",
  critical: "Critical Reasoning",
  reading: "Reading Comprehension",
  precision: "Verbal Precision",
};

export const CATEGORY_DESCRIPTIONS: Record<Question["category"], string> = {
  deductive:
    "Apply top-down logic to premises and identify the conclusion that must be true.",
  critical:
    "Evaluate arguments for assumptions, flaws, and the evidence that strengthens or weakens them.",
  reading:
    "Extract meaning, tone, and supported inference from dense, unfamiliar material at speed.",
  precision:
    "Select the exact word or relationship that a context demands — efficiency under time pressure.",
};

export const QUESTIONS: Question[] = [
  // ---------- Deductive Reasoning ----------
  {
    id: "ded-1",
    category: "deductive",
    prompt:
      "All certified arborists are licensed by the state. No one licensed by the state is exempt from insurance requirements. Which conclusion must be true?",
    options: [
      "Everyone exempt from insurance requirements is a certified arborist.",
      "Some certified arborists are exempt from insurance requirements.",
      "No certified arborist is exempt from insurance requirements.",
      "Everyone licensed by the state is a certified arborist.",
    ],
    correctIndex: 2,
    explanation:
      "All A are B; no B is C. Therefore no A is C: no certified arborist is exempt from insurance requirements.",
    timeLimitSec: 60,
  },
  {
    id: "ded-2",
    category: "deductive",
    prompt:
      "If a contract is executed under seal, it does not require consideration. This contract required consideration. What must be true?",
    options: [
      "This contract was not executed under seal.",
      "This contract was executed under seal.",
      "All contracts require consideration.",
      "No contracts are executed under seal.",
    ],
    correctIndex: 0,
    explanation:
      "This is modus tollens: if P then not-Q; Q is true, so P must be false — the contract was not executed under seal.",
    timeLimitSec: 60,
  },
  {
    id: "ded-3",
    category: "deductive",
    prompt:
      "Every member of the audit committee has read the compliance report. Priya has not read the compliance report. What must be true?",
    options: [
      "Priya is a member of the audit committee.",
      "No one has read the compliance report.",
      "The audit committee has not read the report.",
      "Priya is not a member of the audit committee.",
    ],
    correctIndex: 3,
    explanation:
      "All committee members read the report; Priya has not, so by modus tollens she cannot be a member.",
    timeLimitSec: 60,
  },
  {
    id: "ded-4",
    category: "deductive",
    prompt:
      "Some engineers at the firm hold a PE license. All PE license holders must complete continuing education annually. Which conclusion must be true?",
    options: [
      "All engineers at the firm hold a PE license.",
      "At least one engineer at the firm must complete continuing education annually.",
      "Most engineers at the firm hold a PE license.",
      "No engineer without a PE license takes continuing education.",
    ],
    correctIndex: 1,
    explanation:
      "Since some engineers hold a PE license, and all PE holders must complete continuing education, at least those engineers must — a valid existential chain.",
    timeLimitSec: 60,
  },
  {
    id: "ded-5",
    category: "deductive",
    prompt:
      "If the merger is approved, shareholders will receive a premium. Shareholders did not receive a premium. What must be true?",
    options: [
      "The merger was approved.",
      "Shareholders rejected the premium.",
      "The premium was delayed, not cancelled.",
      "The merger was not approved.",
    ],
    correctIndex: 3,
    explanation:
      "Modus tollens again: the consequent (premium paid) is false, so the antecedent (merger approved) must also be false.",
    timeLimitSec: 60,
  },
  {
    id: "ded-6",
    category: "deductive",
    prompt:
      "No first-year associates are permitted to bill clients directly. Jordan billed a client directly. What must be true?",
    options: [
      "Jordan is a first-year associate.",
      "Jordan is not a first-year associate.",
      "All associates bill clients directly.",
      "Billing clients directly is permitted for everyone.",
    ],
    correctIndex: 1,
    explanation:
      "No first-year associate bills directly; Jordan did, so Jordan cannot be a first-year associate.",
    timeLimitSec: 60,
  },

  // ---------- Critical Reasoning ----------
  {
    id: "crit-1",
    category: "critical",
    stimulus:
      "A city council notes that in the two years after installing streetlights downtown, reported crime fell 15%. The council concludes the streetlights caused the decrease.",
    prompt: "Which finding, if true, would most weaken the council's argument?",
    options: [
      "During the same two years, the city also added 20 additional police officers for downtown patrols.",
      "The streetlights use energy-efficient LED bulbs.",
      "Crime in the downtown area had been rising steadily for a decade before the lights were installed.",
      "Residents surveyed said they feel safer walking downtown at night.",
    ],
    correctIndex: 0,
    explanation:
      "An alternative cause for the same effect — more police patrols — undermines the claim that the streetlights specifically caused the drop.",
    timeLimitSec: 75,
  },
  {
    id: "crit-2",
    category: "critical",
    stimulus:
      "In a clinical trial, patients taking Drug X reported 40% fewer migraines than before the trial began. The manufacturer concludes Drug X reduces migraine frequency.",
    prompt: "Which finding would most strengthen the manufacturer's conclusion?",
    options: [
      "Drug X has a novel chemical structure not used in prior migraine treatments.",
      "The trial included patients from twelve different countries.",
      "A matched placebo group in the same trial showed no reduction in migraine frequency, and no patient changed any other medication or habit.",
      "Migraine frequency naturally varies from month to month in most patients.",
    ],
    correctIndex: 2,
    explanation:
      "Ruling out the placebo effect and confounding lifestyle changes isolates Drug X as the cause of the improvement, directly strengthening the causal claim.",
    timeLimitSec: 75,
  },
  {
    id: "crit-3",
    category: "critical",
    stimulus:
      "The new toll bridge will be profitable only if it attracts at least 10,000 vehicles per day. Traffic engineers project that commuter demand alone will bring 12,000 vehicles per day once the connecting highway opens. The company concludes the bridge will be profitable.",
    prompt: "The company's conclusion depends on which assumption?",
    options: [
      "The bridge will remain profitable indefinitely.",
      "No competing bridge will ever be built nearby.",
      "Commuters prefer bridges to highways.",
      "The connecting highway will in fact open.",
    ],
    correctIndex: 3,
    explanation:
      "The 12,000-vehicle projection is conditioned on the highway opening; if it doesn't, the projection — and the conclusion built on it — collapses. That makes it a necessary assumption.",
    timeLimitSec: 75,
  },
  {
    id: "crit-4",
    category: "critical",
    stimulus:
      "Employees who voluntarily take the company's optional wellness course report 30% fewer sick days than those who don't. Management concludes that making the course mandatory for all employees will reduce absenteeism company-wide.",
    prompt: "Which of the following identifies a flaw in management's reasoning?",
    options: [
      "It fails to state how many employees have taken the course so far.",
      "It fails to consider that employees who already choose to take the course may be healthier or more conscientious than those who don't.",
      "It assumes the course is currently optional rather than mandatory.",
      "It does not specify the exact content of the wellness course.",
    ],
    correctIndex: 1,
    explanation:
      "This is a self-selection flaw: the employees who opt in may differ systematically from those who don't, so the correlation may not hold once the course is made mandatory for everyone.",
    timeLimitSec: 75,
  },
  {
    id: "crit-5",
    category: "critical",
    stimulus:
      "Even though the firm doubled its marketing budget last quarter, the number of new client sign-ups remained flat.",
    prompt: "Which of the following, if true, best resolves this apparent discrepancy?",
    options: [
      "The firm's marketing budget was smaller in the prior year than in the year before that.",
      "New client sign-ups are tracked in a different database than the marketing budget.",
      "Most of the increased budget funded brand-awareness campaigns with no direct sign-up call to action, rather than conversion-focused advertising.",
      "The firm's competitors also increased their marketing budgets last quarter.",
    ],
    correctIndex: 2,
    explanation:
      "If the added spend went toward awareness rather than conversion, flat sign-ups are unsurprising — this explains the discrepancy rather than deepening it.",
    timeLimitSec: 75,
  },
  {
    id: "crit-6",
    category: "critical",
    stimulus:
      "In every department where remote work was permitted more than three days per week last year, employee turnover fell by at least 10% within the year. In the Finance department, remote work was permitted five days per week last year.",
    prompt: "Which of the following is most strongly supported by these statements?",
    options: [
      "Turnover in the Finance department fell by at least 10% within the year.",
      "Finance department employees prefer remote work to in-office work.",
      "Every department will eventually permit five-day remote work.",
      "Remote work is the only factor that affects employee turnover.",
    ],
    correctIndex: 0,
    explanation:
      "Finance meets the stated condition (more than three remote days), and the pattern held in every such department, so the same outcome is the most strongly supported prediction.",
    timeLimitSec: 75,
  },

  // ---------- Reading Comprehension ----------
  {
    id: "read-1a",
    category: "reading",
    stimulus:
      "Economists studying hiring practices have long noted that employers, unable to directly observe a candidate's ability before hiring, often rely on costly, visible signals — an elite degree, a demanding internship, a professional certification — as proxies for underlying competence. The signal is valuable to employers precisely because it is expensive for low-ability candidates to fake: only genuinely capable candidates can obtain it at reasonable cost. Critics of this signaling model argue that it wastes resources on credentials that teach little of direct value to the job itself, functioning as a filter rather than as preparation.",
    prompt: "Which best states the primary purpose of the passage?",
    options: [
      "To explain why costly credentials function as signals of ability and to note a criticism of that function.",
      "To argue that elite degrees should be abolished as hiring criteria.",
      "To prove that internships teach no job-relevant skills.",
      "To compare hiring practices across different industries.",
    ],
    correctIndex: 0,
    explanation:
      "The passage first explains the mechanics of signaling theory, then presents — without fully endorsing — a critique of it. That balance is best captured by option A.",
    timeLimitSec: 90,
  },
  {
    id: "read-1b",
    category: "reading",
    stimulus:
      "Economists studying hiring practices have long noted that employers, unable to directly observe a candidate's ability before hiring, often rely on costly, visible signals — an elite degree, a demanding internship, a professional certification — as proxies for underlying competence. The signal is valuable to employers precisely because it is expensive for low-ability candidates to fake: only genuinely capable candidates can obtain it at reasonable cost. Critics of this signaling model argue that it wastes resources on credentials that teach little of direct value to the job itself, functioning as a filter rather than as preparation.",
    prompt: "The passage suggests that a signal would lose its value to employers if:",
    options: [
      "It became more widely required across industries.",
      "It was replaced by a cheaper alternative credential.",
      "Low-ability candidates could obtain it as easily as high-ability candidates.",
      "Employers began interviewing candidates in person.",
    ],
    correctIndex: 2,
    explanation:
      "The passage states the signal's value depends on it being expensive for low-ability candidates to fake; if it became easy for anyone to obtain, it would no longer distinguish ability.",
    timeLimitSec: 90,
  },
  {
    id: "read-2a",
    category: "reading",
    stimulus:
      "In clinical trials, patients who merely believe they are receiving an active treatment often show measurable improvement, a phenomenon researchers attribute partly to expectation itself rather than to any pharmacological effect. This placebo response complicates the evaluation of new drugs: a treatment that outperforms no intervention at all may still fail to outperform a placebo, revealing that its apparent benefit was largely psychological. Well-designed trials therefore compare new treatments against a placebo rather than against nothing, isolating the drug's effect from the effect of mere expectation.",
    prompt: "Which best captures the author's main point?",
    options: [
      "Placebo effects prove that most medications are unnecessary.",
      "Comparing a treatment only against no intervention can overstate its true effect, so placebo-controlled comparison is necessary.",
      "Patients should be told when they are receiving a placebo.",
      "Expectation has no measurable effect on clinical outcomes.",
    ],
    correctIndex: 1,
    explanation:
      "The passage's core claim is methodological: because expectation alone can produce improvement, trials must control for it with a placebo comparison to isolate the drug's real effect.",
    timeLimitSec: 90,
  },
  {
    id: "read-2b",
    category: "reading",
    stimulus:
      "In clinical trials, patients who merely believe they are receiving an active treatment often show measurable improvement, a phenomenon researchers attribute partly to expectation itself rather than to any pharmacological effect. This placebo response complicates the evaluation of new drugs: a treatment that outperforms no intervention at all may still fail to outperform a placebo, revealing that its apparent benefit was largely psychological. Well-designed trials therefore compare new treatments against a placebo rather than against nothing, isolating the drug's effect from the effect of mere expectation.",
    prompt:
      "Which finding, if true, would most directly undermine the passage's claim about why placebo-controlled trials are necessary?",
    options: [
      "A large study found that patients disliked receiving a placebo.",
      "A large study found that most new drugs fail their trials.",
      "A large study found that doctors prefer prescribing established drugs.",
      "A large study found that outcomes in placebo groups were statistically indistinguishable from outcomes in untreated groups.",
    ],
    correctIndex: 3,
    explanation:
      "If placebo and no-treatment groups produce the same outcomes, the placebo effect the passage describes would not exist, removing the stated reason for placebo-controlled design.",
    timeLimitSec: 90,
  },
  {
    id: "read-3a",
    category: "reading",
    stimulus:
      "Textualist judges maintain that a statute means what its enacted language would have conveyed to an ordinary reader at the time of passage, regardless of what individual legislators privately intended. Purposivist judges, by contrast, read ambiguous provisions in light of the broader problem Congress evidently sought to solve, even when the literal text admits a narrower reading. Neither camp claims that legislative intent is irrelevant; they disagree chiefly about where that intent is properly located — in the public meaning of the words enacted, or in the evident purpose behind them.",
    prompt: "The author's tone toward the two interpretive camps is best described as:",
    options: [
      "Dismissive of purposivism as unworkable.",
      "Even-handed, presenting each position's reasoning without endorsing either.",
      "Strongly critical of textualism as overly rigid.",
      "Openly mocking of both schools of thought.",
    ],
    correctIndex: 1,
    explanation:
      "The passage states each side's view in neutral, parallel terms and explicitly notes what they share, without favoring either — a balanced, expository tone.",
    timeLimitSec: 90,
  },
  {
    id: "read-3b",
    category: "reading",
    stimulus:
      "Textualist judges maintain that a statute means what its enacted language would have conveyed to an ordinary reader at the time of passage, regardless of what individual legislators privately intended. Purposivist judges, by contrast, read ambiguous provisions in light of the broader problem Congress evidently sought to solve, even when the literal text admits a narrower reading. Neither camp claims that legislative intent is irrelevant; they disagree chiefly about where that intent is properly located — in the public meaning of the words enacted, or in the evident purpose behind them.",
    prompt: "Which is the best-supported inference from the passage?",
    options: [
      "Purposivist judges consider legislative intent to be irrelevant.",
      "Textualist judges never consider the problem Congress sought to solve.",
      "The two camps agree on how every statute should be interpreted.",
      "A textualist and a purposivist could reach different conclusions when a statute's text is ambiguous.",
    ],
    correctIndex: 3,
    explanation:
      "Since the camps locate intent differently and purposivists explicitly favor a broader reading for ambiguous text, they can diverge in outcome precisely in ambiguous cases.",
    timeLimitSec: 90,
  },

  // ---------- Verbal Precision ----------
  {
    id: "prec-1",
    category: "precision",
    prompt:
      "Despite the committee's ______ efforts to reach consensus, the final vote remained deeply divided.",
    options: ["desultory", "perfunctory", "concerted", "apathetic"],
    correctIndex: 2,
    explanation:
      "\"Despite\" signals contrast with a real, unified effort — \"concerted\" (combined, determined) fits; the other options describe half-hearted effort, which wouldn't need \"despite.\"",
    timeLimitSec: 30,
  },
  {
    id: "prec-2",
    category: "precision",
    prompt:
      "The CEO's remarks were intentionally ______, leaving analysts uncertain whether merger talks had resumed.",
    options: ["equivocal", "candid", "unequivocal", "forthright"],
    correctIndex: 0,
    explanation:
      "\"Equivocal\" means deliberately ambiguous — the only option consistent with analysts being left \"uncertain.\"",
    timeLimitSec: 30,
  },
  {
    id: "prec-3",
    category: "precision",
    prompt: "PRODIGAL is to THRIFT as ______ is to ______.",
    options: [
      "taciturn : silence",
      "verbose : brevity",
      "generous : charity",
      "meticulous : care",
    ],
    correctIndex: 1,
    explanation:
      "A prodigal person lacks thrift. Only \"verbose : brevity\" is the same lacks-the-quality relationship; the other pairs describe a person who possesses the paired trait.",
    timeLimitSec: 30,
  },
  {
    id: "prec-4",
    category: "precision",
    prompt:
      "The auditor's report was notable for its ______: it avoided vague generalities and specified exact figures for every discrepancy.",
    options: ["ambiguity", "brevity", "specificity", "neutrality"],
    correctIndex: 2,
    explanation:
      "\"Specificity\" precisely matches the description of exact figures and avoidance of vague language.",
    timeLimitSec: 30,
  },
  {
    id: "prec-5",
    category: "precision",
    prompt:
      "Although the negotiations appeared ______ at the outset, both delegations ultimately reached an agreement within hours.",
    options: ["promising", "straightforward", "amicable", "intractable"],
    correctIndex: 3,
    explanation:
      "\"Although\" signals contrast with the quick, ultimately successful agreement — \"intractable\" (seemingly unresolvable) sets up that contrast; the other options don't create tension with the outcome.",
    timeLimitSec: 30,
  },
  {
    id: "prec-6",
    category: "precision",
    prompt: "TEMPER is to ANGER as ______ is to ______.",
    options: [
      "curb : enthusiasm",
      "provoke : anger",
      "ignite : passion",
      "sustain : interest",
    ],
    correctIndex: 0,
    explanation:
      "\"Temper\" means to moderate or reduce the intensity of anger. Only \"curb : enthusiasm\" shares that reduce-the-intensity relationship; the other pairs describe increasing or maintaining the emotion.",
    timeLimitSec: 30,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
