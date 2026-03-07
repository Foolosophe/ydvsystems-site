import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { generateOutline, generateArticleFromOutline, generateArticle } from "@/lib/ai/article"
import { researchTopic } from "@/lib/ai/research"
import { z } from "zod"

const OutlineSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
})

const BriefSchema = z.object({
  subject: z.string().min(3).max(300),
  angle: z.string().max(300).optional(),
  audience: z.string().optional(),
  keyPoints: z.string().max(8000).optional(),
  sources: z.string().max(8000).optional(),
  tone: z.string().optional(),
  length: z.enum(["short", "medium", "long"]),
  category: z.string().min(1),
  action: z.enum(["outline", "article", "research"]),
  outline: z.array(OutlineSectionSchema).optional(),
})

// Legacy schema (ancien flow simple)
const LegacySchema = z.object({
  subject: z.string().min(5).max(200),
  keywords: z.string().optional(),
  length: z.enum(["short", "medium", "long"]),
  category: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()

    // Recherche autonome
    if (body.action === "research") {
      const subject = body.subject
      const angle = body.angle
      if (!subject || typeof subject !== "string") {
        return NextResponse.json({ error: "Sujet requis" }, { status: 400 })
      }
      const research = await researchTopic(subject, angle)
      return NextResponse.json({ data: research })
    }

    // Nouveau flow (brief + action)
    if (body.action === "outline" || body.action === "article") {
      const result = BriefSchema.safeParse(body)

      if (!result.success) {
        return NextResponse.json(
          { error: "Donnees invalides", details: result.error.flatten() },
          { status: 400 }
        )
      }

      const { action, outline, ...brief } = result.data

      if (action === "outline") {
        const sections = await generateOutline(brief)
        return NextResponse.json({ data: sections })
      }

      if (action === "article") {
        if (!outline || outline.length === 0) {
          return NextResponse.json({ error: "Plan requis pour generer l'article" }, { status: 400 })
        }
        const article = await generateArticleFromOutline(brief, outline)
        return NextResponse.json({ data: article })
      }
    }

    // Legacy flow (ancien formulaire simple)
    const result = LegacySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { subject, length, category, keywords } = result.data
    const article = await generateArticle(subject, length, category, keywords)
    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("POST /api/admin/ai/generate error:", err)
    const message = err instanceof Error ? err.message : "Erreur de generation"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
