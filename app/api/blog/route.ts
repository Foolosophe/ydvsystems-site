import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    const where: Record<string, unknown> = { status: "PUBLISHED" }
    if (category) where.category = category

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { publishedAt: "desc" },
    })

    return NextResponse.json({ data: articles })
  } catch (err) {
    console.error("GET /api/blog error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
