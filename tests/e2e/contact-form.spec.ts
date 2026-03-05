import { test, expect } from "@playwright/test"

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/contact")
  })

  test("form is visible with all fields", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("#name")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.locator("#message")).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("honeypot field is not accessible to users", async ({ page }) => {
    // The honeypot is in a sr-only + aria-hidden container
    const container = page.locator("#website").locator("..")
    await expect(container).toHaveAttribute("aria-hidden", "true")
    // The input has tabIndex=-1, so it can't be focused via keyboard
    const tabIndex = await page.locator("#website").getAttribute("tabindex")
    expect(tabIndex).toBe("-1")
  })

  test("client validation prevents empty submission", async ({ page }) => {
    // Try to submit empty form — required fields should block it
    await page.locator('button[type="submit"]').click()
    // Form should still be visible (not submitted)
    await expect(page.locator("#name")).toBeVisible()
    // No success message should appear
    await expect(page.getByText(/envoyé|sent/i)).not.toBeVisible()
  })

  test("form fields accept input", async ({ page }) => {
    await page.fill("#name", "Test User")
    await page.fill("#email", "test@example.com")
    await page.fill("#message", "Ceci est un message de test pour vérifier le formulaire.")

    await expect(page.locator("#name")).toHaveValue("Test User")
    await expect(page.locator("#email")).toHaveValue("test@example.com")
    await expect(page.locator("#message")).toHaveValue("Ceci est un message de test pour vérifier le formulaire.")
  })
})
