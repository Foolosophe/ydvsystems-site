import type { MetadataRoute } from "next"
import { SOLUTION_SLUGS } from "./[locale]/solutions/data"
import { localeUrl } from "@/lib/metadata"
import { prisma } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastUpdated = new Date()

  function localizedEntry(
    path: string,
    options: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number },
  ): MetadataRoute.Sitemap[number] {
    return {
      url: localeUrl("fr", path),
      lastModified: lastUpdated,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: {
          fr: localeUrl("fr", path),
          en: localeUrl("en", path),
          "x-default": localeUrl("fr", path),
        },
      },
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    localizedEntry("", { changeFrequency: "weekly", priority: 1.0 }),
    localizedEntry("/prestations", { changeFrequency: "monthly", priority: 0.9 }),
    localizedEntry("/solutions", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/vitrine-ecommerce", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/motion-design", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/prix", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/portfolio", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/a-propos", { changeFrequency: "monthly", priority: 0.7 }),
    localizedEntry("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/blog", { changeFrequency: "weekly", priority: 0.6 }),
    localizedEntry("/mentions-legales", { changeFrequency: "yearly", priority: 0.3 }),
    localizedEntry("/cgv", { changeFrequency: "yearly", priority: 0.2 }),
    localizedEntry("/cgu", { changeFrequency: "yearly", priority: 0.2 }),
    localizedEntry("/confidentialite", { changeFrequency: "yearly", priority: 0.2 }),
  ]

  const solutionPages: MetadataRoute.Sitemap = SOLUTION_SLUGS.map((slug) =>
    localizedEntry(`/solutions/${slug}`, { changeFrequency: "monthly", priority: 0.8 }),
  )

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  })

  const blogPages: MetadataRoute.Sitemap = articles.map((a) =>
    localizedEntry(`/blog/${a.slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  )

  const gamePages: MetadataRoute.Sitemap = ["dracula", "kart"].map((slug) =>
    localizedEntry(`/portfolio/play/${slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  )

  return [...staticPages, ...solutionPages, ...gamePages, ...blogPages]
}
