import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type RouteParams = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    const article = await prisma.article.findUnique({
      where: { slug, status: "PUBLISHED" },
    })

    if (!article) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("GET /api/blog/[slug] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })

    await prisma.articleView.create({
      data: { articleId: article.id },
    })

    return NextResponse.json({ data: { viewCount: article.viewCount + 1 } })
  } catch (err) {
    console.error("PATCH /api/blog/[slug] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
