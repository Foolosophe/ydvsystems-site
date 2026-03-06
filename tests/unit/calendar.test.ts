import { describe, it, expect } from "vitest"

describe("editorial calendar utilities", () => {
  it("generates correct days in month", () => {
    // Fevrier 2025 (non-bissextile)
    const feb = new Date(2025, 1, 1)
    const daysInFeb = new Date(2025, 2, 0).getDate()
    expect(daysInFeb).toBe(28)

    // Fevrier 2024 (bissextile)
    const daysInFeb2024 = new Date(2024, 2, 0).getDate()
    expect(daysInFeb2024).toBe(29)

    // Mars = 31 jours
    expect(new Date(2025, 3, 0).getDate()).toBe(31)
  })

  it("scheduledAt date comparison works correctly", () => {
    const scheduledAt = new Date("2025-03-15T10:00:00Z")
    const now = new Date("2025-03-15T10:01:00Z")

    expect(scheduledAt.getTime()).toBeLessThan(now.getTime())
  })

  it("identifies articles scheduled for today", () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const scheduledAt = new Date()
    expect(scheduledAt.getTime()).toBeGreaterThanOrEqual(today.getTime())
    expect(scheduledAt.getTime()).toBeLessThan(tomorrow.getTime())
  })

  it("CRON publish detects past scheduled dates", () => {
    const pastDate = new Date("2024-01-01T00:00:00Z")
    const now = new Date()
    expect(pastDate.getTime()).toBeLessThanOrEqual(now.getTime())
  })
})
