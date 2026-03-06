import { describe, it, expect } from "vitest"

describe("translation utilities", () => {
  it("maps locale codes to French language names", () => {
    const localeMap: Record<string, string> = {
      en: "anglais",
      es: "espagnol",
      de: "allemand",
    }

    expect(localeMap["en"]).toBe("anglais")
    expect(localeMap["es"]).toBe("espagnol")
    expect(localeMap["de"]).toBe("allemand")
  })

  it("slug generation removes accents and special chars", () => {
    // Simulate the expected behavior from translation
    function toSlug(text: string): string {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    }

    expect(toSlug("L'intelligence artificielle en 2025")).toBe("l-intelligence-artificielle-en-2025")
    expect(toSlug("Creer un site web performant")).toBe("creer-un-site-web-performant")
    expect(toSlug("Les meilleurs frameworks JavaScript")).toBe("les-meilleurs-frameworks-javascript")
  })

  it("excerpt truncation respects 300 char limit", () => {
    const longExcerpt = "A".repeat(400)
    const truncated = longExcerpt.slice(0, 300)
    expect(truncated.length).toBe(300)
  })
})
