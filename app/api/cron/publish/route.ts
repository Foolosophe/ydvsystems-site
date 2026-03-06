import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  // Securiser le cron via CRON_SECRET
  const secret = req.headers.get("authorization")?.replace("Bearer ", "")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  try {
    const now = new Date()

    // Trouver les articles planifies dont la date est passee
    const scheduled = await prisma.article.findMany({
      where: {
        scheduledAt: { lte: now },
        status: { not: "PUBLISHED" },
      },
    })

    const published: number[] = []
    for (const article of scheduled) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          status: "PUBLISHED",
          publishedAt: article.publishedAt || now,
        },
      })
      published.push(article.id)
    }

    return NextResponse.json({
      data: { published: published.length, ids: published },
    })
  } catch (err) {
    console.error("POST /api/cron/publish error:", err)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
