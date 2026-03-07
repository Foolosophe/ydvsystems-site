import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  articleId: z.number(),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { id: result.data.articleId },
      select: { title: true, slug: true, excerpt: true, coverImage: true },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { confirmedAt: { not: null }, unsubscribedAt: null },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ydvsystems.com"
    const articleUrl = `${siteUrl}/fr/blog/${article.slug}`

    let sent = 0
    let errors = 0

    for (const sub of subscribers) {
      const unsubUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${sub.token}`

      try {
        await resend.emails.send({
          from: "YdvSystems Blog <contact@ydvsystems.com>",
          to: sub.email,
          subject: `Nouvel article : ${article.title}`,
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <div style="border-bottom: 2px solid #00bcd4; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #00bcd4;">YdvSystems Blog</h2>
              </div>
              ${article.coverImage ? `<img src="${article.coverImage}" alt="${article.title}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ""}
              <h1 style="font-size: 1.4rem; margin-bottom: 8px;">${article.title}</h1>
              <p style="color: #475569; line-height: 1.6;">${article.excerpt}</p>
              <a href="${articleUrl}" style="display: inline-block; background: #00bcd4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                Lire l'article
              </a>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px;">
                Vous recevez cet email car vous etes inscrit au blog YdvSystems.
                <a href="${unsubUrl}" style="color: #94a3b8;">Se desinscrire</a>
              </p>
            </div>
          `,
        })
        sent++
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err)
        errors++
      }
    }

    return NextResponse.json({ success: true, sent, errors })
  } catch (err) {
    console.error("Newsletter send error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
