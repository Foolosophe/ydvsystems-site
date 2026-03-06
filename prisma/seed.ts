import "dotenv/config"
import path from "path"
import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { blocksToHtml } from "../lib/blog/content"
import frMessages from "../messages/fr.json"

const BLOG_DATES: Record<string, string> = {
  "ia-suivi-beneficiaires-siae": "2026-03-01",
  "qualiopi-2026-changements": "2026-02-15",
  "multi-provider-ia-architecture": "2026-01-28",
}

const dbPath = path.resolve(process.cwd(), "data/blog.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const articles = frMessages.data.blogArticles as Record<
    string,
    { title: string; category: string; excerpt: string; content: string[] }
  >

  for (const [slug, article] of Object.entries(articles)) {
    const publishedAt = BLOG_DATES[slug]
      ? new Date(BLOG_DATES[slug])
      : new Date()

    await prisma.article.upsert({
      where: { slug },
      update: {
        title: article.title,
        content: blocksToHtml(article.content),
        excerpt: article.excerpt,
        category: article.category,
        publishedAt,
      },
      create: {
        title: article.title,
        slug,
        content: blocksToHtml(article.content),
        excerpt: article.excerpt,
        category: article.category,
        status: "PUBLISHED",
        publishedAt,
      },
    })
  }

  const count = await prisma.article.count()
  console.log(`Seeded ${count} articles`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
