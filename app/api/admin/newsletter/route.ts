import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const [total, confirmed, unsubscribed] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
      prisma.subscriber.count({ where: { unsubscribedAt: { not: null } } }),
    ])

    return NextResponse.json({
      data: { total, confirmed, unsubscribed, pending: total - confirmed - unsubscribed },
    })
  } catch (err) {
    console.error("Newsletter stats error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
