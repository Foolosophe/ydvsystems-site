import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { regenerateSection } from "@/lib/ai/section"
import { prisma } from "@/lib/db"
import { z } from "zod"

const SectionSchema = z.object({
  articleId: z.number().int().positive().optional(),
  heading: z.string().min(1),
  sectionContent: z.string().min(1),
  fullContent: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = SectionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 })
    }

    const { articleId, heading, sectionContent, fullContent } = result.data

    const newContent = await regenerateSection(heading, sectionContent, fullContent)

    // Sauvegarder la version precedente
    if (articleId) {
      const existing = await prisma.sectionVersion.findMany({
        where: { articleId, heading },
        orderBy: { version: "desc" },
        take: 1,
      })
      const nextVersion = existing.length > 0 ? existing[0].version + 1 : 1

      await prisma.sectionVersion.create({
        data: {
          articleId,
          heading,
          content: sectionContent,
          version: nextVersion,
        },
      })
    }

    return NextResponse.json({ data: newContent })
  } catch (err) {
    console.error("POST /api/admin/ai/section error:", err)
    return NextResponse.json({ error: "Erreur de regeneration" }, { status: 500 })
  }
}
