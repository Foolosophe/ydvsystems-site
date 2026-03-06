import { describe, it, expect } from "vitest"
import { calculateCTR } from "@/lib/ab/titleTest"

describe("calculateCTR", () => {
  it("returns 0 when no views", () => {
    expect(calculateCTR(0, 0)).toBe(0)
  })

  it("calculates CTR correctly", () => {
    expect(calculateCTR(100, 5)).toBeCloseTo(0.05)
  })

  it("returns 1 when all views are clicks", () => {
    expect(calculateCTR(50, 50)).toBe(1)
  })

  it("handles large numbers", () => {
    expect(calculateCTR(1_000_000, 25_000)).toBeCloseTo(0.025)
  })
})

describe("A/B title selection logic", () => {
  it("weighted selection favors less viewed variants", () => {
    // Simuler la logique de selection ponderee
    const variants = [
      { id: 1, views: 100, title: "A" },
      { id: 2, views: 10, title: "B" },
    ]

    const maxViews = Math.max(...variants.map((v) => v.views), 1)
    const weights = variants.map((v) => maxViews - v.views + 1)

    // Le variant B (10 vues) doit avoir un poids plus eleve
    expect(weights[1]).toBeGreaterThan(weights[0])
    expect(weights[0]).toBe(1) // 100 - 100 + 1
    expect(weights[1]).toBe(91) // 100 - 10 + 1
  })

  it("equal views produce equal weights", () => {
    const variants = [
      { id: 1, views: 50 },
      { id: 2, views: 50 },
    ]

    const maxViews = Math.max(...variants.map((v) => v.views), 1)
    const weights = variants.map((v) => maxViews - v.views + 1)

    expect(weights[0]).toBe(weights[1])
  })
})
