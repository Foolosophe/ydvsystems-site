import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { parseArticleId } from "@/lib/schemas/blog"

type RouteParams = { params: Promise<{ id: string }> }

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["REVIEW", "PUBLISHED"],
  REVIEW: ["DRAFT", "PUBLISHED"],
  PUBLISHED: [],
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { id } = await params
    const articleId = parseArticleId(id)
    if (!articleId) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    })
    if (!existing) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    // Lire le targetStatus du body (fallback: PUBLISHED pour compatibilite)
    let targetStatus = "PUBLISHED"
    try {
      const body = await req.json()
      if (body.targetStatus) targetStatus = body.targetStatus
    } catch {
      // pas de body = ancien comportement = publier directement
    }

    const allowed = VALID_TRANSITIONS[existing.status] || []
    if (!allowed.includes(targetStatus)) {
      return NextResponse.json(
        { error: `Transition ${existing.status} → ${targetStatus} non autorisee` },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = { status: targetStatus }
    if (targetStatus === "PUBLISHED" && !existing.publishedAt) {
      data.publishedAt = new Date()
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data,
    })

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("POST /api/admin/articles/[id]/publish error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
