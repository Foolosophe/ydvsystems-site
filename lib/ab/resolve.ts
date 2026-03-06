import { prisma } from "@/lib/db"
import { calculateCTR } from "./titleTest"

const MIN_VIEWS_PER_VARIANT = 30
const RESOLUTION_HOURS = 48

/** Resout les tests A/B dont tous les variants ont assez de vues et qui ont plus de 48h */
export async function resolveTests(): Promise<number> {
  // Trouver les articles avec des variants actifs sans gagnant
  const articles = await prisma.article.findMany({
    where: {
      titleVariants: {
        some: { isActive: true, isWinner: false },
      },
    },
    include: {
      titleVariants: {
        where: { isActive: true },
      },
    },
  })

  let resolved = 0

  for (const article of articles) {
    const variants = article.titleVariants
    if (variants.length < 2) continue

    // Verifier que le test a au moins 48h
    const oldest = Math.min(...variants.map((v) => v.createdAt.getTime()))
    const hoursElapsed = (Date.now() - oldest) / (1000 * 60 * 60)
    if (hoursElapsed < RESOLUTION_HOURS) continue

    // Verifier que chaque variant a assez de vues
    const allHaveEnoughViews = variants.every((v) => v.views >= MIN_VIEWS_PER_VARIANT)
    if (!allHaveEnoughViews) continue

    // Trouver le meilleur CTR
    let bestVariant = variants[0]
    let bestCTR = calculateCTR(variants[0].views, variants[0].clicks)

    for (let i = 1; i < variants.length; i++) {
      const ctr = calculateCTR(variants[i].views, variants[i].clicks)
      if (ctr > bestCTR) {
        bestCTR = ctr
        bestVariant = variants[i]
      }
    }

    // Marquer le gagnant et desactiver les autres
    await prisma.$transaction([
      prisma.titleVariant.update({
        where: { id: bestVariant.id },
        data: { isWinner: true },
      }),
      prisma.titleVariant.updateMany({
        where: { articleId: article.id, id: { not: bestVariant.id } },
        data: { isActive: false },
      }),
      // Mettre a jour le titre de l'article avec le gagnant
      prisma.article.update({
        where: { id: article.id },
        data: { title: bestVariant.title },
      }),
    ])

    resolved++
  }

  return resolved
}
