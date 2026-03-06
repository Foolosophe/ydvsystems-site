import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { getIronSession } from "iron-session"
import type { SessionData } from "./lib/auth/session"
import { SESSION_OPTIONS } from "./lib/auth/session"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes protection (except login page and auth API)
  if (
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth"))
  ) {
    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(req, res, SESSION_OPTIONS)

    if (!session.isAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Non autorise" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    return res
  }

  // i18n middleware for non-admin, non-api routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return intlMiddleware(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
}
