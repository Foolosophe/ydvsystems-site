import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_PASSWORD_HASH: z.string().min(1).optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  SESSION_MAX_AGE: z.coerce.number().int().positive().optional().default(2592000),
  GEMINI_API_KEY: z.string().min(1).optional(),
})

export const env = envSchema.parse(process.env)
