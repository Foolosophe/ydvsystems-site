import { GoogleGenerativeAI } from "@google/generative-ai"

const globalForGemini = globalThis as unknown as { gemini: GoogleGenerativeAI | undefined }

export function getGemini(): GoogleGenerativeAI {
  if (globalForGemini.gemini) return globalForGemini.gemini

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante")

  const client = new GoogleGenerativeAI(apiKey)
  if (process.env.NODE_ENV !== "production") globalForGemini.gemini = client
  return client
}

export const MODEL = "gemini-2.0-flash"
