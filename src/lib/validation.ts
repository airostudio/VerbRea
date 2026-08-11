import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
});

export const answerRecordSchema = z.object({
  questionId: z.string(),
  selectedIndex: z.number().int().min(-1).max(3),
  timeUsedSec: z.number().min(0).max(600),
});

export const checkoutRequestSchema = z.object({
  lead: leadSchema,
  answers: z.array(answerRecordSchema).min(1),
});
