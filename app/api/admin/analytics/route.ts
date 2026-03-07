import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { getUsageSummary, type UsageSummary } from "@/lib/ai/tracking"

async function fetchParkinsonAnalytics(days: number): Promise<UsageSummary | null> {
  const baseUrl = process.env.PARKINSON_BLOG_URL || "http://localhost:3002"
  const secret = process.env.PARKINSON_ANALYTICS_SECRET || "ydv-parkinson-analytics"

  try {
    const res = await fetch(`${baseUrl}/api/analytics/ai?days=${days}`, {
      headers: { "x-analytics-secret": secret },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30", 10)

    const [ydvSummary, parkinsonSummary] = await Promise.all([
      getUsageSummary(days),
      fetchParkinsonAnalytics(days),
    ])

    return NextResponse.json({
      data: ydvSummary,
      parkinson: parkinsonSummary,
    })
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
