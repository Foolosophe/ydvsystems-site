import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { suggestImageKeywords, searchUnsplash } from "@/lib/ai/image"
import { z } from "zod"

const ImageSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(3),
  query: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = ImageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 })
    }

    const { title, excerpt, query } = result.data

    // Si un query specifique est fourni, chercher directement
    if (query) {
      const photos = await searchUnsplash(query)
      return NextResponse.json({ data: { keywords: [query], photos } })
    }

    // Sinon, generer des suggestions de mots-cles puis chercher
    const keywords = await suggestImageKeywords(title, excerpt)
    const photos = await searchUnsplash(keywords[0])

    return NextResponse.json({ data: { keywords, photos } })
  } catch (err) {
    console.error("POST /api/admin/ai/image error:", err)
    const message = err instanceof Error ? err.message : "Erreur"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
