import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, projectType, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: "YdvSystems Contact <contact@ydvsystems.com>",
      to: process.env.CONTACT_EMAIL ?? "contact@ydvsystems.com",
      replyTo: email,
      subject: `[YdvSystems] Nouveau message de ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #00bcd4; border-bottom: 2px solid #00bcd4; padding-bottom: 8px;">
            Nouveau message depuis ydvsystems.com
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #475569; width: 140px;">Nom</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 8px; font-weight: bold; color: #475569;">Email</td>
              <td style="padding: 8px;"><a href="mailto:${email}" style="color: #00bcd4;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #475569;">Type de projet</td>
              <td style="padding: 8px;">${projectType || "Non précisé"}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 3px solid #00bcd4; padding: 16px; border-radius: 4px; margin-top: 16px;">
            <p style="font-weight: bold; color: #475569; margin-top: 0;">Message :</p>
            <p style="color: #1e293b; white-space: pre-wrap; margin-bottom: 0;">${message}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            Envoyé depuis ydvsystems.com
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
