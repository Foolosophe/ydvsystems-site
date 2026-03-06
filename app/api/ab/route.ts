import { NextRequest, NextResponse } from "next/server"
import { pickTitle, recordImpression, recordClick } from "@/lib/ab/titleTest"

/** GET — selectionne un variant pour affichage public */
export async function GET(req: NextRequest) {
  const articleId = parseInt(req.nextUrl.searchParams.get("articleId") || "", 10)
  if (isNaN(articleId)) return NextResponse.json({ error: "articleId requis" }, { status: 400 })

  const result = await pickTitle(articleId)
  if (!result) return NextResponse.json({ data: null })

  // Enregistrer l'impression
  await recordImpression(result.variantId)

  return NextResponse.json({ data: result })
}

/** POST — enregistre un clic */
export async function POST(req: NextRequest) {
  const { variantId } = await req.json()
  if (!variantId || typeof variantId !== "number") {
    return NextResponse.json({ error: "variantId requis" }, { status: 400 })
  }

  await recordClick(variantId)

  return NextResponse.json({ ok: true })
}
