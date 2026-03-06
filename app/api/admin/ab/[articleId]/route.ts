import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/** GET — liste les variants d'un article */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = await params
  const id = parseInt(articleId, 10)
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  const data = await prisma.titleVariant.findMany({
    where: { articleId: id },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ data })
}

/** POST — ajoute un variant */
export async function POST(req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = await params
  const id = parseInt(articleId, 10)
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  const { title } = await req.json()
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 })
  }

  const variant = await prisma.titleVariant.create({
    data: { articleId: id, title: title.trim() },
  })

  return NextResponse.json({ data: variant }, { status: 201 })
}

/** DELETE — supprime un variant */
export async function DELETE(req: NextRequest) {
  const { variantId } = await req.json()
  if (!variantId || typeof variantId !== "number") {
    return NextResponse.json({ error: "variantId requis" }, { status: 400 })
  }

  await prisma.titleVariant.delete({ where: { id: variantId } })

  return NextResponse.json({ ok: true })
}
