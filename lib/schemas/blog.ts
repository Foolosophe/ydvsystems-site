import { z } from "zod"

export const ARTICLE_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const
export const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "TWITTER", "LINKEDIN", "EMAIL"] as const

export const ARTICLE_CATEGORIES = [
  "IA & Automatisation",
  "Developpement Web",
  "Insertion & Social",
  "Formation & Qualiopi",
  "Produit",
  "Outils & Logiciels",
  "Tutoriels",
  "Entrepreneuriat",
  "Reglementation",
  "Tribune libre",
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]

/** Parse et valide un ID d'article depuis un param string */
export function parseArticleId(id: string): number | null {
  const num = parseInt(id, 10)
  if (isNaN(num) || num <= 0) return null
  return num
}

export const CreateArticleSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  content: z.string().min(10),
  excerpt: z.string().min(10).max(300),
  category: z.string().min(1),
  aiAssisted: z.boolean().default(false),
})

export const UpdateArticleSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().min(10).max(300).optional(),
  category: z.string().min(1).optional(),
  metaDescription: z.string().max(160).nullable().optional(),
  keywords: z.string().max(500).nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
})

export const SaveDraftSchema = z.object({
  articleId: z.number().int().positive().nullable().optional(),
  title: z.string().default(""),
  content: z.string().default(""),
  category: z.string().default(""),
})

export const GenerateArticleSchema = z.object({
  subject: z.string().min(5).max(200),
  keywords: z.string().optional(),
  length: z.enum(["short", "medium", "long"]),
  category: z.string().min(1),
})

export const AssistTextSchema = z.object({
  action: z.enum(["reformulate", "complete", "shorten", "expand", "titles"]),
  text: z.string().min(1),
})

export const GenerateSocialSchema = z.object({
  articleId: z.number().int().positive(),
  platforms: z.array(z.enum(PLATFORMS)).min(1),
})
