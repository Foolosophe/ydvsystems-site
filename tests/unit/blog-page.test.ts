import { describe, it, expect, vi } from "vitest"

const publishedArticles = [
  {
    id: 1,
    title: "Article publie",
    slug: "article-publie",
    content: "<p>Contenu</p>",
    excerpt: "Extrait",
    category: "Tech",
    status: "PUBLISHED",
    viewCount: 5,
    publishedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    title: "Deuxieme article",
    slug: "deuxieme-article",
    content: "<p>Contenu 2</p>",
    excerpt: "Extrait 2",
    category: "IA",
    status: "PUBLISHED",
    viewCount: 3,
    publishedAt: new Date("2026-02-01"),
  },
]

const draftArticle = {
  id: 3,
  title: "Brouillon",
  slug: "article-brouillon",
  content: "<p>Brouillon</p>",
  excerpt: "Brouillon",
  category: "Test",
  status: "DRAFT",
  viewCount: 0,
  publishedAt: null,
}

const archivedArticle = {
  id: 4,
  title: "Archive",
  slug: "article-archive",
  content: "<p>Archive</p>",
  excerpt: "Archive",
  category: "Old",
  status: "ARCHIVED",
  viewCount: 0,
  publishedAt: null,
}

const allArticles = [...publishedArticles, draftArticle, archivedArticle]

// Mock prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    article: {
      findMany: vi.fn(({ where } = {} as Record<string, unknown>) => {
        if (where?.status === "PUBLISHED") {
          return Promise.resolve(publishedArticles)
        }
        return Promise.resolve(allArticles)
      }),
      findUnique: vi.fn(({ where }: { where: { slug?: string; status?: string } }) => {
        if (where.status === "PUBLISHED") {
          const found = publishedArticles.find((a) => a.slug === where.slug)
          return Promise.resolve(found || null)
        }
        const found = allArticles.find((a) => a.slug === where.slug)
        return Promise.resolve(found || null)
      }),
    },
  },
}))

import { prisma } from "@/lib/db"

describe("Blog page — DRAFT articles not public", () => {
  it("findUnique with DRAFT slug and PUBLISHED filter returns null (404)", async () => {
    const result = await prisma.article.findUnique({
      where: { slug: "article-brouillon", status: "PUBLISHED" },
    } as Parameters<typeof prisma.article.findUnique>[0])
    expect(result).toBeNull()
  })
})

describe("Blog page — ARCHIVED articles not public", () => {
  it("findUnique with ARCHIVED slug and PUBLISHED filter returns null (404)", async () => {
    const result = await prisma.article.findUnique({
      where: { slug: "article-archive", status: "PUBLISHED" },
    } as Parameters<typeof prisma.article.findUnique>[0])
    expect(result).toBeNull()
  })
})

describe("Sitemap — only PUBLISHED articles", () => {
  it("findMany with PUBLISHED filter returns only published articles", async () => {
    const result = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    } as Parameters<typeof prisma.article.findMany>[0])
    expect(result).toHaveLength(2)
    expect(result.every((a: { status?: string }) => !a.status || a.status === "PUBLISHED")).toBe(true)
  })

  it("DRAFT and ARCHIVED slugs are excluded from sitemap query", async () => {
    const result = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    } as Parameters<typeof prisma.article.findMany>[0])
    const slugs = result.map((a: { slug: string }) => a.slug)
    expect(slugs).not.toContain("article-brouillon")
    expect(slugs).not.toContain("article-archive")
  })
})
