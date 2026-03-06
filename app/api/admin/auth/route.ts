import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/auth/session"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")

    if (action === "logout") {
      const session = await getSession()
      session.destroy()
      return NextResponse.json({ data: { success: true } })
    }

    // Login
    const body = await req.json()
    const password = typeof body?.password === "string" ? body.password.trim() : ""

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      )
    }

    const hash = process.env.ADMIN_PASSWORD_HASH
    if (!hash) {
      console.error("ADMIN_PASSWORD_HASH not configured")
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }

    const valid = await bcrypt.compare(password, hash)
    if (!valid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      )
    }

    const session = await getSession()
    session.isAdmin = true
    await session.save()

    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    console.error("Auth error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
