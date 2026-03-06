import { describe, it, expect } from "vitest"
import { analyzeQuality } from "@/lib/ai/quality"

describe("analyzeQuality", () => {
  it("returns low score for empty content", () => {
    const report = analyzeQuality("")
    expect(report.wordCount).toBe(0)
    expect(report.score).toBeLessThan(50)
  })

  it("flags short articles", () => {
    const report = analyzeQuality("<p>Un texte tres court.</p>")
    expect(report.issues.some((i) => i.type === "error" && i.label.includes("trop court"))).toBe(true)
  })

  it("counts headings", () => {
    const html = "<h2>Section 1</h2><p>Texte.</p><h2>Section 2</h2><p>Texte.</p><h3>Sous-partie</h3><p>Texte.</p>"
    const report = analyzeQuality(html)
    expect(report.headingCount).toBe(3)
  })

  it("detects links", () => {
    const withLinks = '<p>Voir <a href="https://example.com">ici</a>.</p>'
    const withoutLinks = "<p>Pas de lien.</p>"
    expect(analyzeQuality(withLinks).hasLinks).toBe(true)
    expect(analyzeQuality(withoutLinks).hasLinks).toBe(false)
  })

  it("detects blockquotes", () => {
    const html = "<blockquote>Citation importante</blockquote><p>Texte.</p>"
    expect(analyzeQuality(html).hasBlockquotes).toBe(true)
  })

  it("gives higher score to well-structured articles", () => {
    const poor = "<p>Court.</p>"
    const good = Array.from({ length: 5 }, (_, i) =>
      `<h2>Section ${i + 1}</h2>` + Array.from({ length: 4 }, () => "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>").join("")
    ).join("") + '<p>Voir <a href="https://example.com">source</a>.</p><blockquote>Citation.</blockquote>'

    const poorReport = analyzeQuality(poor)
    const goodReport = analyzeQuality(good)
    expect(goodReport.score).toBeGreaterThan(poorReport.score)
  })

  it("readability score is between 0 and 100", () => {
    const html = "<p>Le developpement web moderne necessite une comprehension approfondie des technologies actuelles.</p>"
    const report = analyzeQuality(html)
    expect(report.readability).toBeGreaterThanOrEqual(0)
    expect(report.readability).toBeLessThanOrEqual(100)
  })

  it("score is capped at 100", () => {
    const massive = Array.from({ length: 10 }, (_, i) =>
      `<h2>Section ${i + 1}</h2>` + Array.from({ length: 6 }, () => "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation.</p>").join("")
    ).join("") + '<a href="#">lien</a><blockquote>cite</blockquote>'

    const report = analyzeQuality(massive)
    expect(report.score).toBeLessThanOrEqual(100)
  })
})
