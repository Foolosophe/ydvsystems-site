import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Resend } from "resend"
import crypto from "crypto"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  email: z.string().email(),
})

const rateLimitMap = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
    const now = Date.now()
    const last = rateLimitMap.get(ip)
    if (last && now - last < 60_000) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    rateLimitMap.set(ip, now)

    const body = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const { email } = result.data

    const existing = await prisma.subscriber.findUnique({ where: { email } })
    if (existing?.confirmedAt && !existing.unsubscribedAt) {
      return NextResponse.json({ success: true, message: "already_subscribed" })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ydvsystems.com"
    const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${token}`

    if (existing) {
      await prisma.subscriber.update({
        where: { email },
        data: { token, unsubscribedAt: null },
      })
    } else {
      await prisma.subscriber.create({
        data: { email, token },
      })
    }

    await resend.emails.send({
      from: "YdvSystems Blog <contact@ydvsystems.com>",
      to: email,
      subject: "Confirmez votre inscription au blog YdvSystems",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #00bcd4;">Confirmez votre inscription</h2>
          <p>Vous avez demande a recevoir les nouveaux articles du blog YdvSystems.</p>
          <p>Cliquez sur le bouton ci-dessous pour confirmer :</p>
          <a href="${confirmUrl}" style="display: inline-block; background: #00bcd4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Confirmer mon inscription
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Si vous n'avez pas demande cette inscription, ignorez cet email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Newsletter subscribe error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
