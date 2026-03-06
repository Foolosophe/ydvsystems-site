import { NextRequest, NextResponse } from "next/server"
import { resolveTests } from "@/lib/ab/resolve"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("authorization")
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const resolved = await resolveTests()

  return NextResponse.json({ resolved })
}
