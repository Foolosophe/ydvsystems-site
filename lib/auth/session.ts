import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export interface SessionData {
  isAdmin?: boolean
}

function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET est requis en production")
  }
  return secret || "dev-only-fallback-secret-32-chars!"
}

const SESSION_OPTIONS = {
  password: getSessionPassword(),
  cookieName: "ydv_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: Number(process.env.SESSION_MAX_AGE) || 2592000,
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)
}

export async function getSessionFromRequest(req: NextRequest, res: NextResponse) {
  return getIronSession<SessionData>(req, res, SESSION_OPTIONS)
}

export { SESSION_OPTIONS }
