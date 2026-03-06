import { describe, it, expect } from "vitest"
import { generateChecklist, checklistProgress } from "@/lib/ai/checklist"

describe("generateChecklist", () => {
  it("generates items for a minimal article", () => {
    const items = generateChecklist("T", "<p>court</p>", "e", null, null, null)
    expect(items.length).toBeGreaterThan(5)
  })

  it("auto-checks title length when valid", () => {
    const items = generateChecklist(
      "Un titre suffisamment long pour etre valide ici",
      "<h2>Section</h2><p>Contenu</p>",
      "Un extrait valide",
      null,
      null,
      null
    )
    const titleItem = items.find((i) => i.id === "title_length")
    expect(titleItem?.checked).toBe(true)
  })

  it("fails title check when too short", () => {
    const items = generateChecklist("Court", "<p>x</p>", "Extrait valide", null, null, null)
    const titleItem = items.find((i) => i.id === "title_length")
    expect(titleItem?.checked).toBe(false)
  })

  it("checks meta description presence", () => {
    const withMeta = generateChecklist("Titre", "<p>x</p>", "Extrait", "Une meta description assez longue pour valider le check", null, null)
    const withoutMeta = generateChecklist("Titre", "<p>x</p>", "Extrait", null, null, null)
    expect(withMeta.find((i) => i.id === "meta_description")?.checked).toBe(true)
    expect(withoutMeta.find((i) => i.id === "meta_description")?.checked).toBe(false)
  })

  it("includes manual checks that are unchecked by default", () => {
    const items = generateChecklist("Titre", "<p>x</p>", "Extrait", null, null, null)
    const manual = items.filter((i) => !i.auto)
    expect(manual.length).toBeGreaterThan(0)
    expect(manual.every((i) => !i.checked)).toBe(true)
  })
})

describe("checklistProgress", () => {
  it("returns 0 for empty list", () => {
    expect(checklistProgress([])).toBe(0)
  })

  it("returns 100 when all checked", () => {
    const items = [
      { id: "a", label: "A", checked: true, auto: true },
      { id: "b", label: "B", checked: true, auto: false },
    ]
    expect(checklistProgress(items)).toBe(100)
  })

  it("returns 50 when half checked", () => {
    const items = [
      { id: "a", label: "A", checked: true, auto: true },
      { id: "b", label: "B", checked: false, auto: false },
    ]
    expect(checklistProgress(items)).toBe(50)
  })
})
