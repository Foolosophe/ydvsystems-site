import { describe, it, expect } from "vitest"
import { buildSeoPrompt } from "@/lib/ai/prompts/seo"

describe("buildSeoPrompt", () => {
  it("includes title, content preview and excerpt", () => {
    const prompt = buildSeoPrompt("Mon titre", "<p>Contenu de test assez long pour etre inclus</p>", "Extrait court")
    expect(prompt).toContain("Mon titre")
    expect(prompt).toContain("Extrait court")
    expect(prompt).toContain("Contenu de test")
  })

  it("strips HTML from content preview", () => {
    const prompt = buildSeoPrompt("Titre", "<h2>Sous-titre</h2><p>Texte</p>", "Extrait")
    expect(prompt).not.toContain("<h2>")
    expect(prompt).toContain("Sous-titre")
  })

  it("truncates long content to 2000 chars", () => {
    const longContent = "<p>" + "a".repeat(5000) + "</p>"
    const prompt = buildSeoPrompt("Titre", longContent, "Extrait")
    // Le contenu dans le prompt devrait etre tronque
    expect(prompt.length).toBeLessThan(6000)
  })

  it("requests JSON format", () => {
    const prompt = buildSeoPrompt("Titre", "<p>Contenu</p>", "Extrait")
    expect(prompt).toContain("JSON")
    expect(prompt).toContain("metaDescription")
    expect(prompt).toContain("slug")
    expect(prompt).toContain("keywords")
    expect(prompt).toContain("seoTitle")
  })
})
