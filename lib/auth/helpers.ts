import { NextRequest, NextResponse } from "next/server"
import { getSession } from "./session"

/**
 * Checks admin session. Returns null if authorized, or a 401 Response if not.
 */
export async function requireAdmin(
  _req: NextRequest
): Promise<NextResponse | null> {
  try {
    const session = await getSession()
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }
    return null
  } catch {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }
}
