import { describe, it, expect } from "vitest"
import { blocksToHtml } from "@/lib/blog/content"
import { calculateReadTime } from "@/lib/blog/readTime"

describe("blocksToHtml", () => {
  it("converts h2 headings", () => {
    expect(blocksToHtml(["## Mon titre"])).toBe("<h2>Mon titre</h2>")
  })

  it("converts h3 headings", () => {
    expect(blocksToHtml(["### Sous-titre"])).toBe("<h3>Sous-titre</h3>")
  })

  it("converts paragraphs", () => {
    expect(blocksToHtml(["Un paragraphe simple."])).toBe(
      "<p>Un paragraphe simple.</p>"
    )
  })

  it("converts code blocks", () => {
    const input = ["```typescript\nconst x = 1\n```"]
    const result = blocksToHtml(input)
    expect(result).toBe("<pre><code>const x = 1</code></pre>")
  })

  it("escapes HTML in content", () => {
    const result = blocksToHtml(["<script>alert('xss')</script>"])
    expect(result).not.toContain("<script>")
    expect(result).toContain("&lt;script&gt;")
  })

  it("handles multiple blocks", () => {
    const blocks = ["## Titre", "Un paragraphe.", "### Sous-titre"]
    const result = blocksToHtml(blocks)
    expect(result).toBe(
      "<h2>Titre</h2>\n<p>Un paragraphe.</p>\n<h3>Sous-titre</h3>"
    )
  })

  it("returns empty string for empty array", () => {
    expect(blocksToHtml([])).toBe("")
  })
})

describe("calculateReadTime", () => {
  it("returns 1 for short content", () => {
    expect(calculateReadTime("<p>Hello world</p>")).toBe(1)
  })

  it("calculates based on 200 wpm", () => {
    const words = Array(400).fill("mot").join(" ")
    expect(calculateReadTime(`<p>${words}</p>`)).toBe(2)
  })

  it("strips HTML tags before counting", () => {
    const html = "<h2>Titre</h2><p>Un deux trois quatre cinq</p>"
    const result = calculateReadTime(html)
    expect(result).toBe(1)
  })

  it("rounds up", () => {
    const words = Array(201).fill("mot").join(" ")
    expect(calculateReadTime(`<p>${words}</p>`)).toBe(2)
  })
})
