import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

// --- Zod schema ---
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  projectType: z.string().max(50).optional().default(""),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot — must be empty
})

// --- HTML escape (XSS prevention) ---
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// --- In-memory rate limiter ---
const rateLimit = new Map<string, { count: number; first: number }>()
const RATE_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_MAX = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now - entry.first > RATE_WINDOW) {
    rateLimit.set(ip, { count: 1, first: now })
    return false
  }

  entry.count++
  return entry.count > RATE_MAX
}

// --- Route handler ---
export async function POST(req: NextRequest) {
  try {
    // Origin check
    const origin = req.headers.get("origin")
    if (origin && !origin.includes("ydvsystems.com") && !origin.includes("localhost")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    // Parse & validate
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { name, email, projectType, website, message } = result.data

    // Honeypot — bots fill hidden fields
    if (website) {
      // Fake success to not reveal the trap
      return NextResponse.json({ success: true })
    }

    // Escape all user input
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeProjectType = escapeHtml(projectType || "Non précisé")
    const safeMessage = escapeHtml(message)

    const { error } = await resend.emails.send({
      from: "YdvSystems Contact <contact@ydvsystems.com>",
      to: process.env.CONTACT_EMAIL ?? "contact@ydvsystems.com",
      replyTo: email,
      subject: `[YdvSystems] Nouveau message de ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #00bcd4; border-bottom: 2px solid #00bcd4; padding-bottom: 8px;">
            Nouveau message depuis ydvsystems.com
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #475569; width: 140px;">Nom</td>
              <td style="padding: 8px;">${safeName}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 8px; font-weight: bold; color: #475569;">Email</td>
              <td style="padding: 8px;"><a href="mailto:${safeEmail}" style="color: #00bcd4;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #475569;">Type de projet</td>
              <td style="padding: 8px;">${safeProjectType}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 3px solid #00bcd4; padding: 16px; border-radius: 4px; margin-top: 16px;">
            <p style="font-weight: bold; color: #475569; margin-top: 0;">Message :</p>
            <p style="color: #1e293b; white-space: pre-wrap; margin-bottom: 0;">${safeMessage}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            Envoyé depuis ydvsystems.com · IP: ${ip}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Send error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
