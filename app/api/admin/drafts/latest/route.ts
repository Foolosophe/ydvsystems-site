import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const articleId = searchParams.get("articleId")

    const where: Record<string, unknown> = {}
    if (articleId) where.articleId = Number(articleId)
    else where.articleId = null

    const draft = await prisma.draft.findFirst({
      where,
      orderBy: { updatedAt: "desc" },
    })

    if (!draft) {
      return NextResponse.json({ error: "Aucun brouillon" }, { status: 404 })
    }

    return NextResponse.json({ data: draft })
  } catch (err) {
    console.error("GET /api/admin/drafts/latest error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
