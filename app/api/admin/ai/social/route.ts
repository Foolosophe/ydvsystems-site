import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { GenerateSocialSchema } from "@/lib/schemas/blog"
import { generateSocialPosts } from "@/lib/ai/social"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = GenerateSocialSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { articleId, platforms } = result.data
    const siteUrl = new URL(req.url).origin
    const posts = await generateSocialPosts(articleId, platforms, siteUrl)

    // Persister les posts en DB
    for (const [platform, content] of Object.entries(posts)) {
      const contentStr = typeof content === "string" ? content : JSON.stringify(content)
      await prisma.socialPost.create({
        data: { articleId, platform, content: contentStr },
      })
    }

    return NextResponse.json({ data: posts })
  } catch (err) {
    console.error("POST /api/admin/ai/social error:", err)
    return NextResponse.json({ error: "Erreur de generation sociale" }, { status: 500 })
  }
}
