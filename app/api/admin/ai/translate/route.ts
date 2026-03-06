import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { translateArticle } from "@/lib/ai/translate"
import { prisma } from "@/lib/db"
import { z } from "zod"

const TranslateSchema = z.object({
  articleId: z.number().int().positive(),
  locale: z.string().min(2).max(5),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = TranslateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 })
    }

    const { articleId, locale } = result.data

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { title: true, content: true, excerpt: true },
    })

    if (!article) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    const translated = await translateArticle(article.title, article.content, article.excerpt, locale)

    // Upsert la traduction
    await prisma.articleTranslation.upsert({
      where: { articleId_locale: { articleId, locale } },
      update: {
        title: translated.title,
        slug: translated.slug,
        content: translated.content,
        excerpt: translated.excerpt,
      },
      create: {
        articleId,
        locale,
        title: translated.title,
        slug: translated.slug,
        content: translated.content,
        excerpt: translated.excerpt,
      },
    })

    return NextResponse.json({ data: translated })
  } catch (err) {
    console.error("POST /api/admin/ai/translate error:", err)
    return NextResponse.json({ error: "Erreur de traduction" }, { status: 500 })
  }
}
