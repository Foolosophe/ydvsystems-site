import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { prisma } from "@/lib/db"
import { z } from "zod"

const UpdateSettingsSchema = z.record(z.string(), z.string())

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const settings = await prisma.setting.findMany()
  const data = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = UpdateSettingsSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 })
    }

    const entries = Object.entries(result.data)

    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    return NextResponse.json({ data: result.data })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
