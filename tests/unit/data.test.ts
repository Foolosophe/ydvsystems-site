import { describe, it, expect } from "vitest"
import {
  SOLUTIONS,
  SERVICE_IDS,
  SERVICE_ICONS,
  SERVICE_TECH_TAGS,
  PORTFOLIO_IDS,
  PORTFOLIO_TECH,
  STACK_CATEGORY_KEYS,
  STACK_TECHS,
  STATS,
} from "@/lib/data"

describe("SOLUTIONS", () => {
  it("has at least one solution", () => {
    expect(SOLUTIONS.length).toBeGreaterThan(0)
  })

  it("has unique slugs", () => {
    const slugs = SOLUTIONS.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("each solution has required fields", () => {
    for (const s of SOLUTIONS) {
      expect(s.slug).toBeTruthy()
      expect(s.name).toBeTruthy()
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(["prod", "soon"]).toContain(s.status)
    }
  })
})

describe("SERVICE_IDS", () => {
  it("has no duplicates", () => {
    expect(new Set(SERVICE_IDS).size).toBe(SERVICE_IDS.length)
  })

  it("each service has an icon", () => {
    for (const id of SERVICE_IDS) {
      expect(SERVICE_ICONS[id]).toBeTruthy()
    }
  })

  it("each service has a tech tags entry (even if empty)", () => {
    for (const id of SERVICE_IDS) {
      expect(SERVICE_TECH_TAGS[id]).toBeDefined()
    }
  })
})

describe("PORTFOLIO_IDS", () => {
  it("has no duplicates", () => {
    expect(new Set(PORTFOLIO_IDS).size).toBe(PORTFOLIO_IDS.length)
  })

  it("each portfolio item has tech info", () => {
    for (const id of PORTFOLIO_IDS) {
      expect(PORTFOLIO_TECH[id]).toBeDefined()
      expect(PORTFOLIO_TECH[id].tags.length).toBeGreaterThan(0)
    }
  })
})

describe("STACK", () => {
  it("has at least one category", () => {
    expect(STACK_CATEGORY_KEYS.length).toBeGreaterThan(0)
  })

  it("each category has techs", () => {
    for (const key of STACK_CATEGORY_KEYS) {
      expect(STACK_TECHS[key]).toBeDefined()
      expect(STACK_TECHS[key].length).toBeGreaterThan(0)
    }
  })
})

describe("STATS", () => {
  it("has 4 stats", () => {
    expect(STATS.length).toBe(4)
  })

  it("each stat has a value", () => {
    for (const s of STATS) {
      expect(s.value).toBeTruthy()
    }
  })
})
