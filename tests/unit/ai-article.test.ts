import { describe, it, expect, vi, beforeEach } from "vitest"

const mockGenerateContent = vi.fn()
vi.mock("@/lib/ai/gemini", () => ({
  getGemini: () => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  }),
  MODEL: "gemini-2.0-flash",
}))

import { generateArticle, generateTitles, assistText, generateOutline, generateArticleFromOutline } from "@/lib/ai/article"

// ——— OUTLINE (nouveau flow) ———

describe("generateOutline", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("genere un plan depuis un brief avec JSON wrappé markdown", async () => {
    const json = JSON.stringify([
      { title: "Contexte", description: "Etat des lieux" },
      { title: "Solution", description: "Comment l'IA aide" },
      { title: "Conclusion", description: "Prochaines etapes" },
    ])
    mockGenerateContent.mockResolvedValue({
      response: { text: () => `\`\`\`json\n${json}\n\`\`\`` },
    })

    const sections = await generateOutline({
      subject: "L'IA en SIAE",
      length: "medium",
      category: "IA & Insertion",
    })

    expect(sections).toHaveLength(3)
    expect(sections[0].title).toBe("Contexte")
    expect(sections[0].description).toBe("Etat des lieux")
  })

  it("inclut l'angle dans le prompt quand fourni", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify([{ title: "Section", description: "desc" }]) },
    })

    await generateOutline({
      subject: "IA",
      angle: "L'IA augmente l'humain",
      length: "short",
      category: "Tech",
    })

    const promptArg = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain("L'IA augmente l'humain")
  })

  it("inclut les sources dans le prompt", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify([{ title: "Section", description: "desc" }]) },
    })

    await generateOutline({
      subject: "IA",
      sources: "Etude DARES 2025: 28% des SIAE",
      length: "short",
      category: "Tech",
    })

    const promptArg = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain("DARES 2025")
  })

  it("inclut les points cles dans le prompt", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify([{ title: "Section", description: "desc" }]) },
    })

    await generateOutline({
      subject: "IA",
      keyPoints: "- Gains de temps\n- ROI mesurable",
      length: "short",
      category: "Tech",
    })

    const promptArg = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain("Gains de temps")
    expect(promptArg).toContain("ROI mesurable")
  })

  it("throw si Gemini retourne un tableau vide", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "[]" },
    })

    await expect(
      generateOutline({ subject: "IA", length: "short", category: "Tech" })
    ).rejects.toThrow("tableau de sections")
  })

  it("throw si une section n'a pas de titre", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify([{ title: "", description: "desc" }]) },
    })

    await expect(
      generateOutline({ subject: "IA", length: "short", category: "Tech" })
    ).rejects.toThrow("section sans titre")
  })
})

// ——— ARTICLE FROM OUTLINE (nouveau flow) ———

describe("generateArticleFromOutline", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("genere un article depuis un brief + plan", async () => {
    const json = JSON.stringify({
      title: "L'IA en SIAE : un levier",
      content: "<h2>Contexte</h2><p>Les SIAE evoluent.</p><h2>Solution</h2><p>L'IA aide.</p>",
      excerpt: "L'IA transforme le suivi des beneficiaires en SIAE.",
    })
    mockGenerateContent.mockResolvedValue({
      response: { text: () => `\`\`\`json\n${json}\n\`\`\`` },
    })

    const result = await generateArticleFromOutline(
      {
        subject: "L'IA en SIAE",
        angle: "L'IA augmente l'humain",
        audience: "insertion",
        tone: "professionnel",
        length: "medium",
        category: "IA & Insertion",
      },
      [
        { title: "Contexte", description: "Etat des lieux" },
        { title: "Solution", description: "Comment l'IA aide" },
      ],
    )

    expect(result.title).toBe("L'IA en SIAE : un levier")
    expect(result.content).toContain("<h2>")
    expect(result.excerpt.length).toBeLessThanOrEqual(300)
  })

  it("passe le plan dans le prompt", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          title: "Test",
          content: "<p>Contenu</p>",
          excerpt: "Test",
        }),
      },
    })

    await generateArticleFromOutline(
      { subject: "IA", length: "short", category: "Tech" },
      [
        { title: "Section personnalisee", description: "Mon contenu" },
      ],
    )

    const promptArg = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain("Section personnalisee")
    expect(promptArg).toContain("Mon contenu")
  })

  it("sanitise le HTML genere", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          title: "Test",
          content: '<p>Texte</p><script>alert("xss")</script>',
          excerpt: "Test",
        }),
      },
    })

    const result = await generateArticleFromOutline(
      { subject: "IA", length: "short", category: "Tech" },
      [{ title: "Section", description: "desc" }],
    )

    expect(result.content).not.toContain("<script>")
  })

  it("throw si Gemini retourne un objet incomplet", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ title: "Test" }) },
    })

    await expect(
      generateArticleFromOutline(
        { subject: "IA", length: "short", category: "Tech" },
        [{ title: "Section", description: "desc" }],
      )
    ).rejects.toThrow("champs manquants")
  })
})

// ——— LEGACY FLOW ———

describe("generateArticle (legacy)", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("gere le JSON wrappé en markdown", async () => {
    const json = JSON.stringify({
      title: "L'IA au service des PME",
      content: "<h2>Introduction</h2><p>L'intelligence artificielle.</p>",
      excerpt: "Decouvrez comment l'IA peut aider votre PME.",
    })
    mockGenerateContent.mockResolvedValue({
      response: { text: () => `\`\`\`json\n${json}\n\`\`\`` },
    })

    const result = await generateArticle("L'IA pour les PME", "short", "Technique")
    expect(result.title).toBe("L'IA au service des PME")
    expect(result.content).toContain("<h2>")
  })

  it("sanitise le HTML (supprime les scripts)", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          title: "Test XSS",
          content: '<h2>Titre</h2><p>Texte</p><script>alert("xss")</script>',
          excerpt: "Test",
        }),
      },
    })

    const result = await generateArticle("Test", "short", "Test")
    expect(result.content).not.toContain("<script>")
  })

  it("tronque l'excerpt a 300 caracteres", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          title: "Test",
          content: "<p>Contenu</p>",
          excerpt: "A".repeat(500),
        }),
      },
    })

    const result = await generateArticle("Test", "short", "Test")
    expect(result.excerpt.length).toBe(300)
  })

  it("throw si Gemini retourne du JSON invalide", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "Desole, je ne peux pas generer cet article." },
    })

    await expect(generateArticle("Test", "short", "Test")).rejects.toThrow("JSON invalide")
  })
})

// ——— TITRES ———

describe("generateTitles", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("retourne max 3 titres depuis du JSON wrappé markdown", async () => {
    const json = JSON.stringify(["Titre 1", "Titre 2", "Titre 3", "Titre 4 bonus"])
    mockGenerateContent.mockResolvedValue({
      response: { text: () => `\`\`\`json\n${json}\n\`\`\`` },
    })

    const titles = await generateTitles("Un texte sur l'IA")
    expect(titles).toHaveLength(3)
    expect(titles[0]).toBe("Titre 1")
  })

  it("throw si Gemini retourne un objet au lieu d'un tableau", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ titles: ["a", "b"] }) },
    })

    await expect(generateTitles("Test")).rejects.toThrow("tableau attendu")
  })
})

// ——— ASSIST TEXT ———

describe("assistText", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("retourne le texte reformule sans parsing JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "  Le texte reformule.  " },
    })

    const result = await assistText("reformulate", "Le texte original.")
    expect(result).toBe("Le texte reformule.")
  })
})
