import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { generateSeoSuggestions } from "@/lib/ai/seo"
import { z } from "zod"

const SeoSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().min(3),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = SeoSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 })
    }

    const suggestions = await generateSeoSuggestions(result.data.title, result.data.content, result.data.excerpt)
    return NextResponse.json({ data: suggestions })
  } catch (err) {
    console.error("POST /api/admin/ai/seo error:", err)
    return NextResponse.json({ error: "Erreur de generation SEO" }, { status: 500 })
  }
}
