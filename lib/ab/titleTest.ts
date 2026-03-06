import { prisma } from "@/lib/db"

/** Selectionne un titre par rotation ponderee (moins de vues = plus de chances) */
export async function pickTitle(articleId: number): Promise<{ variantId: number; title: string } | null> {
  const variants = await prisma.titleVariant.findMany({
    where: { articleId, isActive: true },
  })

  if (variants.length === 0) return null

  // S'il y a un gagnant, toujours le retourner
  const winner = variants.find((v) => v.isWinner)
  if (winner) return { variantId: winner.id, title: winner.title }

  // Selection ponderee : inverser les vues pour favoriser les moins vus
  const maxViews = Math.max(...variants.map((v) => v.views), 1)
  const weights = variants.map((v) => maxViews - v.views + 1)
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  let random = Math.random() * totalWeight
  for (let i = 0; i < variants.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return { variantId: variants[i].id, title: variants[i].title }
    }
  }

  // Fallback
  return { variantId: variants[0].id, title: variants[0].title }
}

/** Enregistre une impression (vue) pour un variant */
export async function recordImpression(variantId: number): Promise<void> {
  await prisma.titleVariant.update({
    where: { id: variantId },
    data: { views: { increment: 1 } },
  })
}

/** Enregistre un clic pour un variant */
export async function recordClick(variantId: number): Promise<void> {
  await prisma.titleVariant.update({
    where: { id: variantId },
    data: { clicks: { increment: 1 } },
  })
}

/** Retourne le CTR (click-through rate) d'un variant */
export function calculateCTR(views: number, clicks: number): number {
  if (views === 0) return 0
  return clicks / views
}
