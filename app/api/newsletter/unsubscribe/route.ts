import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return new NextResponse(page("Lien invalide", "Le lien de desinscription est invalide."), { headers: { "Content-Type": "text/html" } })
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { token } })

    if (!subscriber) {
      return new NextResponse(page("Lien invalide", "Ce lien de desinscription n'existe pas."), { headers: { "Content-Type": "text/html" } })
    }

    await prisma.subscriber.update({
      where: { token },
      data: { unsubscribedAt: new Date() },
    })

    return new NextResponse(
      page("Desinscription confirmee", "Vous ne recevrez plus de notifications pour les nouveaux articles. Vous pouvez vous reinscrire a tout moment depuis le blog."),
      { headers: { "Content-Type": "text/html" } }
    )
  } catch (err) {
    console.error("Newsletter unsubscribe error:", err)
    return new NextResponse(page("Erreur", "Une erreur est survenue. Veuillez reessayer."), { headers: { "Content-Type": "text/html" } })
  }
}

function page(title: string, message: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title} — YdvSystems</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#1e293b}
.card{text-align:center;max-width:400px;padding:40px;background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
h1{color:#00bcd4;font-size:1.5rem}a{color:#00bcd4}</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p><a href="https://ydvsystems.com/fr/blog">Retour au blog</a></div></body></html>`
}
