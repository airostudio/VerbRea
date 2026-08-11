"use client";

import type { AnswerRecord, LeadInfo } from "./types";

const LEAD_KEY = "verbrea:lead";
const ANSWERS_KEY = "verbrea:answers";

export function saveLead(lead: LeadInfo) {
  sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
}

export function loadLead(): LeadInfo | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(LEAD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LeadInfo;
  } catch {
    return null;
  }
}

export function saveAnswers(answers: AnswerRecord[]) {
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadAnswers(): AnswerRecord[] | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnswerRecord[];
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(LEAD_KEY);
  sessionStorage.removeItem(ANSWERS_KEY);
}
