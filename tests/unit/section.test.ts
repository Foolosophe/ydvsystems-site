import { describe, it, expect } from "vitest"
import { extractSections, replaceSection } from "@/lib/ai/section"

describe("extractSections", () => {
  it("extracts h2 sections from HTML", () => {
    const html = "<h2>Intro</h2><p>Texte intro</p><h2>Corps</h2><p>Texte corps</p>"
    const sections = extractSections(html)
    expect(sections).toHaveLength(2)
    expect(sections[0].heading).toBe("Intro")
    expect(sections[1].heading).toBe("Corps")
  })

  it("returns empty array when no h2", () => {
    const html = "<p>Pas de sous-titres</p>"
    expect(extractSections(html)).toHaveLength(0)
  })

  it("handles nested tags in headings", () => {
    const html = "<h2><strong>Titre gras</strong></h2><p>Texte</p>"
    const sections = extractSections(html)
    expect(sections[0].heading).toBe("Titre gras")
  })

  it("includes section content", () => {
    const html = "<h2>Section</h2><p>Paragraphe 1</p><p>Paragraphe 2</p>"
    const sections = extractSections(html)
    expect(sections[0].content).toContain("Paragraphe 1")
    expect(sections[0].content).toContain("Paragraphe 2")
  })
})

describe("replaceSection", () => {
  it("replaces the correct section", () => {
    const html = "<h2>A</h2><p>Old A</p><h2>B</h2><p>Old B</p>"
    const result = replaceSection(html, "A", "<h2>A</h2><p>New A</p>")
    expect(result).toContain("New A")
    expect(result).toContain("Old B")
    expect(result).not.toContain("Old A")
  })

  it("leaves other sections unchanged", () => {
    const html = "<h2>X</h2><p>Keep X</p><h2>Y</h2><p>Keep Y</p>"
    const result = replaceSection(html, "Z", "<h2>Z</h2><p>New Z</p>")
    expect(result).toContain("Keep X")
    expect(result).toContain("Keep Y")
  })

  it("handles content before first h2", () => {
    const html = "<p>Intro</p><h2>Section</h2><p>Body</p>"
    const result = replaceSection(html, "Section", "<h2>Section</h2><p>New body</p>")
    expect(result).toContain("Intro")
    expect(result).toContain("New body")
    expect(result).not.toContain("Body")
  })
})
