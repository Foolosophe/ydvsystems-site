import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

// ── Table of Contents ──

// Import the functions directly
import { addHeadingIds } from "@/components/blog/TableOfContents"

describe("TableOfContents - addHeadingIds", () => {
  it("adds id to h2 tags", () => {
    const html = "<h2>Mon titre</h2>"
    const result = addHeadingIds(html)
    expect(result).toBe('<h2 id="mon-titre">Mon titre</h2>')
  })

  it("adds id to h3 tags", () => {
    const html = "<h3>Sous-titre ici</h3>"
    const result = addHeadingIds(html)
    expect(result).toBe('<h3 id="sous-titre-ici">Sous-titre ici</h3>')
  })

  it("handles accented characters", () => {
    const html = "<h2>L'IA et la réalité augmentée</h2>"
    const result = addHeadingIds(html)
    expect(result).toContain('id="l-ia-et-la-realite-augmentee"')
  })

  it("strips HTML tags from heading content for id", () => {
    const html = "<h2><strong>Bold</strong> titre</h2>"
    const result = addHeadingIds(html)
    expect(result).toContain('id="bold-titre"')
  })

  it("does not overwrite existing id attributes", () => {
    const html = '<h2 id="custom-id">Titre</h2>'
    const result = addHeadingIds(html)
    expect(result).toContain('id="custom-id"')
    expect(result).not.toContain('id="titre"')
  })

  it("handles multiple headings", () => {
    const html = "<h2>Premier</h2><p>texte</p><h3>Deuxieme</h3>"
    const result = addHeadingIds(html)
    expect(result).toContain('id="premier"')
    expect(result).toContain('id="deuxieme"')
  })

  it("ignores h1, h4, h5, h6", () => {
    const html = "<h1>Titre H1</h1><h4>Titre H4</h4>"
    const result = addHeadingIds(html)
    expect(result).toBe(html)
  })
})

// ── RSS Feed structure ──

describe("RSS feed route", () => {
  it("feed.xml route file exists", () => {
    const routePath = resolve(process.cwd(), "app/feed.xml/route.ts")
    const content = readFileSync(routePath, "utf-8")
    expect(content).toContain("application/rss+xml")
    expect(content).toContain("<rss version")
    expect(content).toContain("CDATA")
  })
})

// ── i18n keys for new features ──

describe("Blog features - i18n keys", () => {
  const fr = JSON.parse(readFileSync(resolve(__dirname, "../../messages/fr.json"), "utf-8"))
  const en = JSON.parse(readFileSync(resolve(__dirname, "../../messages/en.json"), "utf-8"))

  it("FR has filter keys", () => {
    expect(fr.blog.filters.searchPlaceholder).toBeTruthy()
    expect(fr.blog.filters.allCategories).toBeTruthy()
    expect(fr.blog.filters.noResults).toBeTruthy()
    expect(fr.blog.filters.loadMore).toBeTruthy()
  })

  it("EN has filter keys", () => {
    expect(en.blog.filters.searchPlaceholder).toBeTruthy()
    expect(en.blog.filters.allCategories).toBeTruthy()
    expect(en.blog.filters.noResults).toBeTruthy()
    expect(en.blog.filters.loadMore).toBeTruthy()
  })

  it("FR has article enhancement keys", () => {
    expect(fr.blog.article.relatedArticles).toBeTruthy()
    expect(fr.blog.article.readMore).toBeTruthy()
    expect(fr.blog.article.toc).toBeTruthy()
  })

  it("EN has article enhancement keys", () => {
    expect(en.blog.article.relatedArticles).toBeTruthy()
    expect(en.blog.article.readMore).toBeTruthy()
    expect(en.blog.article.toc).toBeTruthy()
  })
})

// ── Blog categories ──

describe("Blog categories", () => {
  it("ARTICLE_CATEGORIES has at least 5 categories", async () => {
    const { ARTICLE_CATEGORIES } = await import("@/lib/schemas/blog")
    expect(ARTICLE_CATEGORIES.length).toBeGreaterThanOrEqual(5)
  })

  it("all categories are non-empty strings", async () => {
    const { ARTICLE_CATEGORIES } = await import("@/lib/schemas/blog")
    for (const cat of ARTICLE_CATEGORIES) {
      expect(cat.length).toBeGreaterThan(0)
    }
  })
})

// ── Components existence ──

describe("Blog components exist", () => {
  const components = [
    "components/blog/BlogFilters.tsx",
    "components/blog/RelatedArticles.tsx",
    "components/blog/ReadingProgressBar.tsx",
    "components/blog/TableOfContents.tsx",
    "components/blog/CodeHighlight.tsx",
    "components/NewsletterForm.tsx",
  ]

  for (const comp of components) {
    it(`${comp} exists and is not empty`, () => {
      const content = readFileSync(resolve(process.cwd(), comp), "utf-8")
      expect(content.length).toBeGreaterThan(50)
    })
  }
})

// ── Prism theme ──

describe("Prism theme CSS", () => {
  it("contains token styles", () => {
    const css = readFileSync(
      resolve(process.cwd(), "app/[locale]/blog/[slug]/prism-theme.css"),
      "utf-8"
    )
    expect(css).toContain(".token.keyword")
    expect(css).toContain(".token.string")
    expect(css).toContain(".token.comment")
    expect(css).toContain(".token.function")
  })
})
