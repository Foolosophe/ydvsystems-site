import { test, expect } from "@playwright/test"

const PAGES_WITH_JSONLD = [
  { url: "/fr/prestations", type: "ProfessionalService" },
  { url: "/fr/solutions", type: "ItemList" },
  { url: "/fr/blog", type: "CollectionPage" },
]

test.describe("SEO", () => {
  test("each page has a <title>", async ({ page }) => {
    const pages = ["/fr", "/fr/prestations", "/fr/solutions", "/fr/portfolio", "/fr/blog", "/fr/prix", "/fr/contact"]

    for (const url of pages) {
      await page.goto(url)
      const title = await page.title()
      expect(title, `${url} should have a title`).toBeTruthy()
      expect(title.length, `${url} title should not be empty`).toBeGreaterThan(0)
    }
  })

  test("each page has a meta description", async ({ page }) => {
    const pages = ["/fr", "/fr/prestations", "/fr/solutions", "/fr/portfolio", "/fr/blog", "/fr/prix", "/fr/contact"]

    for (const url of pages) {
      await page.goto(url)
      const description = await page.locator('meta[name="description"]').getAttribute("content")
      expect(description, `${url} should have a meta description`).toBeTruthy()
    }
  })

  for (const { url, type } of PAGES_WITH_JSONLD) {
    test(`${url} has valid JSON-LD of type ${type}`, async ({ page }) => {
      await page.goto(url)
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
      expect(scripts.length, `${url} should have JSON-LD`).toBeGreaterThan(0)

      // Find the script with the expected @type (layout may inject Organization first)
      const found = scripts.some((s) => {
        const parsed = JSON.parse(s)
        return parsed["@context"] === "https://schema.org" && parsed["@type"] === type
      })
      expect(found, `${url} should have JSON-LD of type ${type}`).toBe(true)
    })
  }

  test("homepage has hreflang alternates", async ({ page }) => {
    await page.goto("/fr")
    const hreflangs = await page.locator('link[rel="alternate"][hreflang]').all()
    // Should have at least fr and en alternates
    expect(hreflangs.length).toBeGreaterThanOrEqual(2)
  })
})
