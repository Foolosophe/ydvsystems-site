import { z } from "zod"

// --- Zod schema ---
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  projectType: z.string().max(50).optional().default(""),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot — must be empty
})

// --- HTML escape (XSS prevention) ---
export function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// --- In-memory rate limiter ---
const rateLimit = new Map<string, { count: number; first: number }>()
const RATE_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_MAX = 3

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now - entry.first > RATE_WINDOW) {
    rateLimit.set(ip, { count: 1, first: now })
    return false
  }

  entry.count++
  return entry.count > RATE_MAX
}

export function resetRateLimit() {
  rateLimit.clear()
}
