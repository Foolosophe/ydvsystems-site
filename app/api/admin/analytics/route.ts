import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { getUsageSummary } from "@/lib/ai/tracking"

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30", 10)
    const summary = await getUsageSummary(days)
    return NextResponse.json({ data: summary })
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
