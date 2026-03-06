import { describe, it, expect } from "vitest"
import { countWords, readingTime } from "@/lib/blog/wordCount"

describe("countWords", () => {
  it("counts words in plain text", () => {
    expect(countWords("Hello world")).toBe(2)
  })

  it("strips HTML tags before counting", () => {
    expect(countWords("<p>Bonjour <strong>le monde</strong></p>")).toBe(3)
  })

  it("handles nested tags", () => {
    expect(countWords("<div><h2>Titre</h2><p>Un <em>petit</em> texte</p></div>")).toBe(4)
  })

  it("strips HTML entities (replaced by space)", () => {
    // &rsquo; becomes a space, so "L" and "intelligence" are separate words
    expect(countWords("L&rsquo;intelligence artificielle")).toBe(3)
  })

  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0)
  })

  it("returns 0 for whitespace-only HTML", () => {
    expect(countWords("<p>   </p>")).toBe(0)
  })

  it("returns 0 for tags-only input", () => {
    expect(countWords("<br/><hr/>")).toBe(0)
  })

  it("handles multiple spaces and newlines", () => {
    expect(countWords("mot   un\n\nautre   mot")).toBe(4)
  })

  it("counts a realistic article excerpt", () => {
    const html = `<h2>Introduction</h2><p>L'intelligence artificielle pose des questions fondamentales sur la conscience.</p>`
    expect(countWords(html)).toBeGreaterThan(5)
  })
})

describe("readingTime", () => {
  it("returns 1 minute minimum", () => {
    expect(readingTime(0)).toBe(1)
    expect(readingTime(50)).toBe(1)
    expect(readingTime(199)).toBe(1)
  })

  it("returns 1 for exactly 200 words", () => {
    expect(readingTime(200)).toBe(1)
  })

  it("rounds up to next minute", () => {
    expect(readingTime(201)).toBe(2)
    expect(readingTime(400)).toBe(2)
    expect(readingTime(401)).toBe(3)
  })

  it("handles long articles", () => {
    expect(readingTime(2000)).toBe(10)
  })
})
