import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const ALL_PAGES = [
  "/fr",
  "/fr/prestations",
  "/fr/solutions",
  "/fr/portfolio",
  "/fr/blog",
  "/fr/prix",
  "/fr/contact",
  "/fr/mentions-legales",
]

test.describe("Axe accessibility audit", () => {
  for (const url of ALL_PAGES) {
    test(`${url} has no critical a11y violations`, async ({ page }) => {
      await page.goto(url)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

      // Critical violations = test failure (buttons without names, missing labels, etc.)
      const critical = results.violations.filter(
        (v) => v.impact === "critical"
      )

      // Serious violations = logged as warnings (color-contrast on brand colors)
      const serious = results.violations.filter(
        (v) => v.impact === "serious"
      )

      if (serious.length > 0) {
        const summary = serious.map(
          (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
        ).join("\n")
        console.warn(`A11y warnings on ${url}:\n${summary}`)
      }

      if (critical.length > 0) {
        const summary = critical.map(
          (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
        ).join("\n")
        expect(critical.length, `A11y violations on ${url}:\n${summary}`).toBe(0)
      }
    })
  }
})

test.describe("Accessibility", () => {
  test("each page has exactly one h1", async ({ page }) => {
    for (const url of ALL_PAGES) {
      await page.goto(url)
      const h1Count = await page.locator("h1").count()
      expect(h1Count, `${url} should have exactly one h1`).toBe(1)
    }
  })

  test("heading hierarchy is valid (no skipped levels)", async ({ page }) => {
    await page.goto("/fr")
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").allTextContents()
    expect(headings.length).toBeGreaterThan(0)

    // Get heading levels in order
    const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((els) =>
      els.map((el) => parseInt(el.tagName.replace("H", "")))
    )

    // First heading should be h1
    expect(levels[0]).toBe(1)

    // No heading should skip more than one level
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1]
      expect(diff, `heading level jump from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1)
    }
  })

  test("nav links have aria-current on active page", async ({ page }) => {
    await page.goto("/fr/prestations")
    const activeLink = page.locator('nav a[aria-current="page"]')
    await expect(activeLink.first()).toBeVisible()
  })

  test("images have alt text", async ({ page }) => {
    await page.goto("/fr")
    const images = await page.locator("img").all()
    for (const img of images) {
      const alt = await img.getAttribute("alt")
      expect(alt, "all images should have alt text").not.toBeNull()
    }
  })

  test("form inputs have associated labels", async ({ page }) => {
    await page.goto("/fr/contact")
    // Check that inputs with ids have labels pointing to them
    const nameLabel = page.locator('label[for="name"]')
    const emailLabel = page.locator('label[for="email"]')
    const messageLabel = page.locator('label[for="message"]')

    await expect(nameLabel).toBeVisible()
    await expect(emailLabel).toBeVisible()
    await expect(messageLabel).toBeVisible()
  })
})
