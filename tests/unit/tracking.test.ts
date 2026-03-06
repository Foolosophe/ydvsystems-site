import { describe, it, expect } from "vitest"

describe("AI tracking cost calculation", () => {
  const COST_PER_M_INPUT = 0.075
  const COST_PER_M_OUTPUT = 0.30

  function estimateCost(tokensIn: number, tokensOut: number): number {
    return (tokensIn / 1_000_000) * COST_PER_M_INPUT + (tokensOut / 1_000_000) * COST_PER_M_OUTPUT
  }

  it("calculates zero cost for zero tokens", () => {
    expect(estimateCost(0, 0)).toBe(0)
  })

  it("calculates cost for 1M input tokens", () => {
    expect(estimateCost(1_000_000, 0)).toBeCloseTo(0.075)
  })

  it("calculates cost for 1M output tokens", () => {
    expect(estimateCost(0, 1_000_000)).toBeCloseTo(0.30)
  })

  it("calculates combined cost correctly", () => {
    // 500k input + 200k output
    const cost = estimateCost(500_000, 200_000)
    const expected = (500_000 / 1_000_000) * 0.075 + (200_000 / 1_000_000) * 0.30
    expect(cost).toBeCloseTo(expected)
  })

  it("output tokens cost more than input tokens", () => {
    const inputCost = estimateCost(1_000_000, 0)
    const outputCost = estimateCost(0, 1_000_000)
    expect(outputCost).toBeGreaterThan(inputCost)
  })
})
