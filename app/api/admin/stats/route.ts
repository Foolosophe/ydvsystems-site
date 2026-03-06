import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const [totalArticles, publishedArticles, draftArticles, totalViews] =
      await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: "PUBLISHED" } }),
        prisma.article.count({ where: { status: "DRAFT" } }),
        prisma.article.aggregate({ _sum: { viewCount: true } }),
      ])

    return NextResponse.json({
      data: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews: totalViews._sum.viewCount ?? 0,
      },
    })
  } catch (err) {
    console.error("GET /api/admin/stats error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
