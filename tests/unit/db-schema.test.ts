import { describe, it, expect, beforeAll, afterAll } from "vitest"
import path from "path"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const dbPath = path.resolve(process.cwd(), "data/blog.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

afterAll(async () => {
  await prisma.$disconnect()
})

describe("Database schema", () => {
  it("connects without error", async () => {
    const result = await prisma.article.count()
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it("has at least 3 seeded articles", async () => {
    const count = await prisma.article.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  it("has the correct slugs", async () => {
    const articles = await prisma.article.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    })
    const slugs = articles.map((a) => a.slug)
    expect(slugs).toContain("ia-suivi-beneficiaires-siae")
    expect(slugs).toContain("qualiopi-2026-changements")
    expect(slugs).toContain("multi-provider-ia-architecture")
  })

  it("enforces unique slugs", async () => {
    await expect(
      prisma.article.create({
        data: {
          title: "Duplicate",
          slug: "ia-suivi-beneficiaires-siae",
          content: "<p>test</p>",
          excerpt: "test excerpt",
          category: "Test",
        },
      })
    ).rejects.toThrow()
  })

  it("allows a draft without publishedAt", async () => {
    const article = await prisma.article.create({
      data: {
        title: "Brouillon",
        slug: "test-draft-no-published-at",
        content: "<p>brouillon</p>",
        excerpt: "test",
        category: "Test",
        status: "DRAFT",
      },
    })
    expect(article.publishedAt).toBeNull()

    await prisma.article.delete({ where: { id: article.id } })
  })

  it("allows an orphan draft (no articleId)", async () => {
    const draft = await prisma.draft.create({
      data: {
        title: "Brouillon orphelin",
        content: "<p>contenu</p>",
        category: "Test",
      },
    })
    expect(draft.articleId).toBeNull()
    expect(draft.id).toBeGreaterThan(0)

    await prisma.draft.delete({ where: { id: draft.id } })
  })
})
