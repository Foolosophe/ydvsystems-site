import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { SaveDraftSchema } from "@/lib/schemas/blog"

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = SaveDraftSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { articleId, title, content, category } = result.data

    const draft = await prisma.draft.create({
      data: {
        articleId: articleId ?? null,
        title,
        content,
        category,
      },
    })

    return NextResponse.json({ data: draft }, { status: 201 })
  } catch (err) {
    console.error("POST /api/admin/drafts error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
