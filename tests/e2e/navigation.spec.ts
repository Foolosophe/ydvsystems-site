import { test, expect } from "@playwright/test"

const FR_PAGES = [
  "/fr",
  "/fr/prestations",
  "/fr/solutions",
  "/fr/portfolio",
  "/fr/blog",
  "/fr/prix",
  "/fr/contact",
  "/fr/mentions-legales",
]

test.describe("Navigation", () => {
  test("all FR pages return 200", async ({ page }) => {
    for (const url of FR_PAGES) {
      const res = await page.goto(url)
      expect(res?.status(), `${url} should return 200`).toBe(200)
    }
  })

  test("all EN pages return 200", async ({ page }) => {
    const enPages = FR_PAGES.map((p) => p.replace("/fr", "/en"))
    for (const url of enPages) {
      const res = await page.goto(url)
      expect(res?.status(), `${url} should return 200`).toBe(200)
    }
  })

  test("nav links work from homepage", async ({ page }) => {
    await page.goto("/fr")
    // Check that main nav links exist
    const nav = page.locator("nav")
    await expect(nav).toBeVisible()

    // Click on Prestations link
    await page.locator('nav a[href*="prestations"]').first().click()
    await expect(page).toHaveURL(/prestations/)
    await expect(page.locator("h1")).toBeVisible()
  })

  test("language switch FR → EN", async ({ page }) => {
    await page.goto("/fr")

    // Find and click the language selector (the button with aria-label for language)
    const langButton = page.locator('button[aria-label]').filter({ hasText: /Français|English/ }).first()
    if (await langButton.isVisible()) {
      await langButton.click()
      // Click English option
      const enOption = page.getByText("English").first()
      await enOption.click()
      await expect(page).toHaveURL(/\/en/)
    }
  })
})
