import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { parseArticleId } from "@/lib/schemas/blog"

type RouteParams = { params: Promise<{ id: string }> }

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

    if (existing.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Article deja publie" },
        { status: 400 }
      )
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    })

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("POST /api/admin/articles/[id]/publish error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
