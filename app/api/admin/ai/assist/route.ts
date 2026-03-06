import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { AssistTextSchema } from "@/lib/schemas/blog"
import { assistText, generateTitles } from "@/lib/ai/article"

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const result = AssistTextSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { action, text } = result.data

    if (action === "titles") {
      const titles = await generateTitles(text)
      return NextResponse.json({ data: titles.join("\n") })
    }

    const output = await assistText(action, text)
    return NextResponse.json({ data: output })
  } catch (err) {
    console.error("POST /api/admin/ai/assist error:", err)
    return NextResponse.json({ error: "Erreur d'assistance" }, { status: 500 })
  }
}
