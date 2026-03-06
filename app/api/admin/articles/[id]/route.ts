import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { UpdateArticleSchema, parseArticleId } from "@/lib/schemas/blog"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { id } = await params
    const articleId = parseArticleId(id)
    if (!articleId) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { drafts: true, socialPosts: true },
    })

    if (!article) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("GET /api/admin/articles/[id] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { id } = await params
    const articleId = parseArticleId(id)
    if (!articleId) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const body = await req.json()
    const result = UpdateArticleSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    })
    if (!existing) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 })
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: result.data,
    })

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("PUT /api/admin/articles/[id] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { status: "ARCHIVED" },
    })

    return NextResponse.json({ data: article })
  } catch (err) {
    console.error("DELETE /api/admin/articles/[id] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
