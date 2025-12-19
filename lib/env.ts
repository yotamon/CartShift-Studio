import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_FUNCTION_URL: z.string().url(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_FIREBASE_FUNCTION_URL: process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

