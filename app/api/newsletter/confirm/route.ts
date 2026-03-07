import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/fr/blog?newsletter=error", req.url))
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { token } })

    if (!subscriber) {
      return NextResponse.redirect(new URL("/fr/blog?newsletter=invalid", req.url))
    }

    if (subscriber.confirmedAt) {
      return NextResponse.redirect(new URL("/fr/blog?newsletter=already", req.url))
    }

    await prisma.subscriber.update({
      where: { token },
      data: { confirmedAt: new Date() },
    })

    return NextResponse.redirect(new URL("/fr/blog?newsletter=confirmed", req.url))
  } catch (err) {
    console.error("Newsletter confirm error:", err)
    return NextResponse.redirect(new URL("/fr/blog?newsletter=error", req.url))
  }
}
