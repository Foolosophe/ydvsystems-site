import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { CreateArticleSchema, ARTICLE_STATUSES } from "@/lib/schemas/blog"

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    if (status) {
      if (!(ARTICLE_STATUSES as readonly string[]).includes(status)) {
        return NextResponse.json({ error: "Status invalide" }, { status: 400 })
      }
      where.status = status
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ data: articles })
  } catch (err) {
    console.error("GET /api/admin/articles error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = CreateArticleSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { title, slug, content, excerpt, category, aiAssisted } = result.data

    const articleSlug =
      slug ||
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    const existing = await prisma.article.findUnique({
      where: { slug: articleSlug },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Ce slug existe deja" },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: { title, slug: articleSlug, content, excerpt, category, aiAssisted, status: "DRAFT" },
    })

    return NextResponse.json({ data: article }, { status: 201 })
  } catch (err) {
    console.error("POST /api/admin/articles error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
