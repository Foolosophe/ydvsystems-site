import { NextRequest, NextResponse } from "next/server"

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_ID
const UMAMI_USERNAME = process.env.UMAMI_USERNAME
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD

let cachedToken: { value: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value
  }

  const res = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
  })

  if (!res.ok) throw new Error(`Umami login failed: ${res.status}`)
  const { token } = await res.json()

  // Cache token for 55 minutes (Umami tokens last 1h)
  cachedToken = { value: token, expiresAt: Date.now() + 55 * 60 * 1000 }
  return token
}

const PERIODS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
}

async function umamiGet(token: string, path: string, params?: Record<string, string>) {
  const url = new URL(`${UMAMI_URL}/api${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Umami API ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  if (!UMAMI_URL || !UMAMI_USERNAME || !UMAMI_PASSWORD || !WEBSITE_ID) {
    return NextResponse.json({ error: "Umami non configure" }, { status: 500 })
  }

  const period = req.nextUrl.searchParams.get("period") || "30d"
  const ms = PERIODS[period] || PERIODS["30d"]
  const endAt = Date.now()
  const startAt = endAt - ms

  const params = {
    startAt: String(startAt),
    endAt: String(endAt),
  }

  try {
    const token = await getToken()

    const [rawStats, rawPages] = await Promise.all([
      umamiGet(token, `/websites/${WEBSITE_ID}/stats`, params),
      umamiGet(token, `/websites/${WEBSITE_ID}/metrics`, {
        ...params,
        type: "path",
        limit: "10",
      }),
    ])

    // Normalize Umami v2 flat format → { value, prev } format
    const comp = rawStats.comparison || {}
    const stats = {
      pageviews: { value: rawStats.pageviews ?? 0, prev: comp.pageviews ?? 0 },
      visitors: { value: rawStats.visitors ?? 0, prev: comp.visitors ?? 0 },
      visits: { value: rawStats.visits ?? 0, prev: comp.visits ?? 0 },
      bounces: { value: rawStats.bounces ?? 0, prev: comp.bounces ?? 0 },
      totaltime: { value: rawStats.totaltime ?? 0, prev: comp.totaltime ?? 0 },
    }

    // Normalize metrics: Umami v2 uses { x, y } already
    const pages = rawPages.map((p: { x: string; y: number }) => ({ x: p.x, y: p.y }))

    return NextResponse.json({ stats, pages, period })
  } catch (err) {
    // Reset cached token on error in case it expired
    cachedToken = null
    const message = err instanceof Error ? err.message : "Erreur Umami"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
