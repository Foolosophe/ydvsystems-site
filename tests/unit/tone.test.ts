import { describe, it, expect } from "vitest"
import { buildToneContext, type ToneProfile } from "@/lib/ai/tone"

describe("buildToneContext", () => {
  it("includes brand voice when provided", () => {
    const profile: ToneProfile = { brandVoice: "Direct et expert", keywords: "", examples: "", avoidWords: "" }
    const ctx = buildToneContext(profile)
    expect(ctx).toContain("VOIX DE MARQUE")
    expect(ctx).toContain("Direct et expert")
  })

  it("includes keywords when provided", () => {
    const profile: ToneProfile = { brandVoice: "", keywords: "IA, insertion", examples: "", avoidWords: "" }
    const ctx = buildToneContext(profile)
    expect(ctx).toContain("MOTS-CLES DE MARQUE")
    expect(ctx).toContain("IA, insertion")
  })

  it("includes examples when provided", () => {
    const profile: ToneProfile = { brandVoice: "", keywords: "", examples: "Exemple de phrase type.", avoidWords: "" }
    const ctx = buildToneContext(profile)
    expect(ctx).toContain("EXEMPLES DE STYLE")
  })

  it("includes avoid words when provided", () => {
    const profile: ToneProfile = { brandVoice: "", keywords: "", examples: "", avoidWords: "disruptif, leverager" }
    const ctx = buildToneContext(profile)
    expect(ctx).toContain("MOTS/EXPRESSIONS A EVITER")
    expect(ctx).toContain("disruptif")
  })

  it("combines all fields", () => {
    const profile: ToneProfile = {
      brandVoice: "Expert",
      keywords: "IA",
      examples: "Exemple",
      avoidWords: "buzzword",
    }
    const ctx = buildToneContext(profile)
    expect(ctx).toContain("GUIDE DE STYLE")
    expect(ctx).toContain("Expert")
    expect(ctx).toContain("IA")
    expect(ctx).toContain("Exemple")
    expect(ctx).toContain("buzzword")
  })

  it("omits empty sections", () => {
    const profile: ToneProfile = { brandVoice: "Test", keywords: "", examples: "", avoidWords: "" }
    const ctx = buildToneContext(profile)
    expect(ctx).not.toContain("MOTS-CLES")
    expect(ctx).not.toContain("EXEMPLES")
    expect(ctx).not.toContain("EVITER")
  })
})
