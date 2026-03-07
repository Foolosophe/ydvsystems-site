import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

// ── Portfolio data ──

describe("Portfolio data", () => {
  it("PORTFOLIO_IDS includes pills-stadium", async () => {
    const { PORTFOLIO_IDS } = await import("@/lib/data")
    expect(PORTFOLIO_IDS).toContain("pills-stadium")
  })

  it("PORTFOLIO_IDS includes moteur-jeu", async () => {
    const { PORTFOLIO_IDS } = await import("@/lib/data")
    expect(PORTFOLIO_IDS).toContain("moteur-jeu")
  })

  it("all PORTFOLIO_IDS have PORTFOLIO_TECH entries", async () => {
    const { PORTFOLIO_IDS, PORTFOLIO_TECH } = await import("@/lib/data")
    for (const id of PORTFOLIO_IDS) {
      expect(PORTFOLIO_TECH[id]).toBeDefined()
      expect(PORTFOLIO_TECH[id].tags.length).toBeGreaterThan(0)
    }
  })

  it("moteur-jeu has a live URL", async () => {
    const { PORTFOLIO_TECH } = await import("@/lib/data")
    expect(PORTFOLIO_TECH["moteur-jeu"].url).toBeTruthy()
    expect(PORTFOLIO_TECH["moteur-jeu"].url).toMatch(/^https:\/\//)
  })

  it("pills-stadium has a live URL", async () => {
    const { PORTFOLIO_TECH } = await import("@/lib/data")
    expect(PORTFOLIO_TECH["pills-stadium"].url).toBeTruthy()
    expect(PORTFOLIO_TECH["pills-stadium"].url).toMatch(/^https:\/\//)
  })
})

// ── Game URLs ──

describe("Game URLs", () => {
  it("GAME_URLS has moteur-jeu entry", async () => {
    const { GAME_URLS } = await import("@/lib/data")
    expect(GAME_URLS["moteur-jeu"]).toBe("https://dracula.ydvsystems.com")
  })

  it("GAME_URLS has pills-stadium entry", async () => {
    const { GAME_URLS } = await import("@/lib/data")
    expect(GAME_URLS["pills-stadium"]).toBe("https://kart.ydvsystems.com")
  })

  it("all game URLs are HTTPS", async () => {
    const { GAME_URLS } = await import("@/lib/data")
    for (const url of Object.values(GAME_URLS)) {
      expect(url).toMatch(/^https:\/\//)
    }
  })

  it("all game URLs point to ydvsystems.com subdomains", async () => {
    const { GAME_URLS } = await import("@/lib/data")
    for (const url of Object.values(GAME_URLS)) {
      expect(url).toMatch(/\.ydvsystems\.com$/)
    }
  })
})

// ── i18n translations ──

describe("Portfolio translations", () => {
  const fr = JSON.parse(readFileSync(resolve(__dirname, "../../messages/fr.json"), "utf-8"))
  const en = JSON.parse(readFileSync(resolve(__dirname, "../../messages/en.json"), "utf-8"))

  const portfolioIds = ["ydv-systems", "moteur-jeu", "pills-stadium", "prompt-parfait", "audit-ia-entreprise", "blog-parkinson"]

  for (const id of portfolioIds) {
    it(`FR has translations for ${id}`, () => {
      expect(fr.data.portfolio[id]).toBeDefined()
      expect(fr.data.portfolio[id].title).toBeTruthy()
      expect(fr.data.portfolio[id].description).toBeTruthy()
      expect(fr.data.portfolio[id].type).toBeTruthy()
    })

    it(`EN has translations for ${id}`, () => {
      expect(en.data.portfolio[id]).toBeDefined()
      expect(en.data.portfolio[id].title).toBeTruthy()
      expect(en.data.portfolio[id].description).toBeTruthy()
      expect(en.data.portfolio[id].type).toBeTruthy()
    })
  }

  it("FR has playOnline key", () => {
    expect(fr.portfolio.playOnline).toBeTruthy()
  })

  it("EN has playOnline key", () => {
    expect(en.portfolio.playOnline).toBeTruthy()
  })

  it("FR has play page keys", () => {
    expect(fr.portfolio.play.launchGame).toBeTruthy()
    expect(fr.portfolio.play.backToPortfolio).toBeTruthy()
    expect(fr.portfolio.play.fullscreen).toBeTruthy()
    expect(fr.portfolio.play.metaTitle).toBeTruthy()
    expect(fr.portfolio.play.metaDescription).toBeTruthy()
  })

  it("EN has play page keys", () => {
    expect(en.portfolio.play.launchGame).toBeTruthy()
    expect(en.portfolio.play.backToPortfolio).toBeTruthy()
    expect(en.portfolio.play.fullscreen).toBeTruthy()
    expect(en.portfolio.play.metaTitle).toBeTruthy()
    expect(en.portfolio.play.metaDescription).toBeTruthy()
  })
})

// ── Components existence ──

describe("Portfolio components exist", () => {
  const files = [
    "app/[locale]/portfolio/page.tsx",
    "app/[locale]/portfolio/play/[slug]/page.tsx",
    "components/sections/PortfolioPreview.tsx",
  ]

  for (const file of files) {
    it(`${file} exists and is not empty`, () => {
      const content = readFileSync(resolve(process.cwd(), file), "utf-8")
      expect(content.length).toBeGreaterThan(50)
    })
  }
})

// ── Portfolio page content ──

describe("Portfolio page imports", () => {
  it("portfolio page imports GAME_URLS", () => {
    const content = readFileSync(resolve(process.cwd(), "app/[locale]/portfolio/page.tsx"), "utf-8")
    expect(content).toContain("GAME_URLS")
    expect(content).toContain("Gamepad2")
    expect(content).toContain("playOnline")
  })

  it("play page imports GAME_URLS and GAME_SLUGS mapping", () => {
    const content = readFileSync(resolve(process.cwd(), "app/[locale]/portfolio/play/[slug]/page.tsx"), "utf-8")
    expect(content).toContain("GAME_URLS")
    expect(content).toContain("GAME_SLUGS")
    expect(content).toContain("dracula")
    expect(content).toContain("kart")
  })
})
