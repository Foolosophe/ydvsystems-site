import { prisma } from "@/lib/db"

// Cout approximatif Gemini 2.0 Flash par million de tokens (USD)
const COST_PER_M_INPUT = 0.075
const COST_PER_M_OUTPUT = 0.30

export async function trackUsage(
  action: string,
  model: string,
  tokensIn: number,
  tokensOut: number,
): Promise<void> {
  const costEstimate =
    (tokensIn / 1_000_000) * COST_PER_M_INPUT +
    (tokensOut / 1_000_000) * COST_PER_M_OUTPUT

  try {
    await prisma.aiUsage.create({
      data: { action, model, tokensIn, tokensOut, costEstimate },
    })
  } catch (err) {
    console.error("Failed to track AI usage:", err)
  }
}

export interface UsageSummary {
  totalCalls: number
  totalTokensIn: number
  totalTokensOut: number
  totalCost: number
  byAction: Record<string, { count: number; cost: number }>
}

export async function getUsageSummary(days = 30): Promise<UsageSummary> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const records = await prisma.aiUsage.findMany({
    where: { createdAt: { gte: since } },
  })

  const byAction: Record<string, { count: number; cost: number }> = {}

  let totalTokensIn = 0
  let totalTokensOut = 0
  let totalCost = 0

  for (const r of records) {
    totalTokensIn += r.tokensIn
    totalTokensOut += r.tokensOut
    totalCost += r.costEstimate

    if (!byAction[r.action]) {
      byAction[r.action] = { count: 0, cost: 0 }
    }
    byAction[r.action].count++
    byAction[r.action].cost += r.costEstimate
  }

  return {
    totalCalls: records.length,
    totalTokensIn,
    totalTokensOut,
    totalCost,
    byAction,
  }
}
