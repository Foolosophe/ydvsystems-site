import type { MetadataRoute } from "next"
import { SOLUTION_SLUGS } from "./[locale]/solutions/data"
import { BLOG_SLUGS } from "./[locale]/blog/data"
import { routing } from "@/i18n/routing"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ydvsystems.com"
  const lastUpdated = new Date("2026-03-03")
  const locales = routing.locales

  function localizedEntry(
    path: string,
    options: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number },
  ): MetadataRoute.Sitemap[number] {
    return {
      url: `${baseUrl}/fr${path}`,
      lastModified: lastUpdated,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, `${baseUrl}/${locale}${path}`]),
        ),
      },
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    localizedEntry("", { changeFrequency: "weekly", priority: 1.0 }),
    localizedEntry("/prestations", { changeFrequency: "monthly", priority: 0.9 }),
    localizedEntry("/solutions", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/prix", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/blog", { changeFrequency: "weekly", priority: 0.4 }),
    localizedEntry("/mentions-legales", { changeFrequency: "yearly", priority: 0.3 }),
  ]

  const solutionPages: MetadataRoute.Sitemap = SOLUTION_SLUGS.map((slug) =>
    localizedEntry(`/solutions/${slug}`, { changeFrequency: "monthly", priority: 0.8 }),
  )

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) =>
    localizedEntry(`/blog/${slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  )

  return [...staticPages, ...solutionPages, ...blogPages]
}
