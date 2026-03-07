import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock prisma before importing routes
vi.mock("@/lib/db", () => {
  const publishedArticles = [
    {
      id: 1,
      title: "Article publie",
      slug: "article-publie",
      content: "<p>Contenu</p>",
      excerpt: "Extrait",
      category: "Tech",
      status: "PUBLISHED",
      aiAssisted: false,
      viewCount: 5,
      publishedAt: new Date("2026-01-01"),
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: 2,
      title: "Deuxieme article",
      slug: "deuxieme-article",
      content: "<p>Contenu 2</p>",
      excerpt: "Extrait 2",
      category: "IA",
      status: "PUBLISHED",
      aiAssisted: false,
      viewCount: 3,
      publishedAt: new Date("2026-02-01"),
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-01"),
    },
  ]

  const archivedArticle = {
    id: 3,
    title: "Archive",
    slug: "article-archive",
    content: "<p>Archive</p>",
    excerpt: "Archive",
    category: "Old",
    status: "ARCHIVED",
    aiAssisted: false,
    viewCount: 0,
    publishedAt: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  }

  const allArticles = [...publishedArticles, archivedArticle]

  return {
    prisma: {
      article: {
        findMany: vi.fn(({ where } = {} as Record<string, unknown>) => {
          if (where?.status === "PUBLISHED") {
            return Promise.resolve(publishedArticles)
          }
          return Promise.resolve(allArticles)
        }),
        findUnique: vi.fn(
          ({ where }: { where: Record<string, unknown> }) => {
            const article = allArticles.find(
              (a) =>
                (where.slug && a.slug === where.slug && (!where.status || a.status === where.status)) ||
                (where.id && a.id === where.id)
            )
            // For public route: filter by status if provided in where
            if (where.slug && where.status === "PUBLISHED") {
              const found = publishedArticles.find((a) => a.slug === where.slug)
              return Promise.resolve(found || null)
            }
            return Promise.resolve(article || null)
          }
        ),
        create: vi.fn((args: { data: Record<string, unknown> }) =>
          Promise.resolve({ id: 10, ...args.data, createdAt: new Date(), updatedAt: new Date() })
        ),
        update: vi.fn(
          (args: {
            where: { id?: number; slug?: string }
            data: Record<string, unknown>
          }) => {
            const article = allArticles.find(
              (a) =>
                (args.where.id && a.id === args.where.id) ||
                (args.where.slug && a.slug === args.where.slug)
            )
            if (!article) return Promise.reject(new Error("Not found"))
            return Promise.resolve({ ...article, ...args.data })
          }
        ),
        count: vi.fn(() => Promise.resolve(allArticles.length)),
        aggregate: vi.fn(() =>
          Promise.resolve({ _sum: { viewCount: 8 } })
        ),
      },
      articleView: {
        create: vi.fn(() => Promise.resolve({ id: 1 })),
      },
      draft: {
        create: vi.fn((args: { data: Record<string, unknown> }) =>
          Promise.resolve({ id: 1, ...args.data, updatedAt: new Date() })
        ),
      },
    },
  }
})

// Mock requireAdmin to allow requests by default
vi.mock("@/lib/auth/helpers", () => ({
  requireAdmin: vi.fn(() => Promise.resolve(null)),
}))

import { NextRequest } from "next/server"
import { GET as getBlog } from "@/app/api/blog/route"
import { GET as getBlogSlug } from "@/app/api/blog/[slug]/route"
import { GET as getAdminArticles, POST as postAdminArticle } from "@/app/api/admin/articles/route"
import { DELETE as deleteAdminArticle } from "@/app/api/admin/articles/[id]/route"
import { POST as postDraft } from "@/app/api/admin/drafts/route"
import { requireAdmin } from "@/lib/auth/helpers"

function makeRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost:3000"), options as never)
}

function makeParams<T>(value: T): { params: Promise<T> } {
  return { params: Promise.resolve(value) }
}

describe("Public blog API", () => {
  it("GET /api/blog returns only PUBLISHED articles", async () => {
    const res = await getBlog(makeRequest("/api/blog"))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data).toHaveLength(2)
    expect(json.data.every((a: { status?: string }) => !a.status || a.status !== "ARCHIVED")).toBe(true)
  })

  it("GET /api/blog/[slug] returns 404 for unknown slug", async () => {
    const res = await getBlogSlug(
      makeRequest("/api/blog/inexistant"),
      makeParams({ slug: "inexistant" })
    )
    expect(res.status).toBe(404)
  })

  it("GET /api/blog/[slug] returns 404 for archived article", async () => {
    const res = await getBlogSlug(
      makeRequest("/api/blog/article-archive"),
      makeParams({ slug: "article-archive" })
    )
    expect(res.status).toBe(404)
  })
})

describe("Admin articles API", () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockResolvedValue(null)
  })

  it("POST /api/admin/articles without session returns 401", async () => {
    const { NextResponse } = await import("next/server")
    vi.mocked(requireAdmin).mockResolvedValueOnce(
      NextResponse.json({ error: "Non autorise" }, { status: 401 })
    )

    const res = await postAdminArticle(
      makeRequest("/api/admin/articles", {
        method: "POST",
        body: JSON.stringify({
          title: "Test",
          content: "Contenu de test assez long",
          excerpt: "Extrait de test assez long",
          category: "Test",
        }),
      })
    )
    expect(res.status).toBe(401)
  })

  it("POST /api/admin/articles with invalid payload returns 400", async () => {
    const res = await postAdminArticle(
      makeRequest("/api/admin/articles", {
        method: "POST",
        body: JSON.stringify({ title: "ab" }),
      })
    )
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Donnees invalides")
  })

  it("POST /api/admin/articles with valid data returns 201", async () => {
    const res = await postAdminArticle(
      makeRequest("/api/admin/articles", {
        method: "POST",
        body: JSON.stringify({
          title: "Nouvel article de test",
          content: "Contenu suffisamment long pour passer la validation Zod",
          excerpt: "Extrait suffisamment long aussi",
          category: "Tech",
        }),
      })
    )
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.title).toBe("Nouvel article de test")
  })

  it("DELETE /api/admin/articles/[id] archives without deleting", async () => {
    const res = await deleteAdminArticle(
      makeRequest("/api/admin/articles/1", { method: "DELETE" }),
      makeParams({ id: "1" })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.status).toBe("ARCHIVED")
  })
})

describe("Drafts API", () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockResolvedValue(null)
  })

  it("POST /api/admin/drafts creates a draft without creating an article", async () => {
    const res = await postDraft(
      makeRequest("/api/admin/drafts", {
        method: "POST",
        body: JSON.stringify({
          title: "Brouillon test",
          content: "Contenu brouillon",
          category: "Test",
        }),
      })
    )
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.title).toBe("Brouillon test")
    expect(json.data.articleId).toBeNull()
  })
})
