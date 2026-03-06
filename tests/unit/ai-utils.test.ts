import { describe, it, expect } from "vitest"
import { extractJson, safeParseJson } from "@/lib/ai/utils"

describe("extractJson", () => {
  it("retourne du JSON brut tel quel", () => {
    const input = '{"title": "Test"}'
    expect(extractJson(input)).toBe('{"title": "Test"}')
  })

  it("extrait le JSON depuis un bloc ```json ... ```", () => {
    const input = '```json\n{"title": "Test"}\n```'
    expect(extractJson(input)).toBe('{"title": "Test"}')
  })

  it("extrait le JSON depuis un bloc ``` ... ``` sans language tag", () => {
    const input = '```\n["a", "b", "c"]\n```'
    expect(extractJson(input)).toBe('["a", "b", "c"]')
  })

  it("gere les espaces et retours a la ligne autour", () => {
    const input = '  \n```json\n  {"key": "value"}  \n```\n  '
    expect(extractJson(input)).toBe('{"key": "value"}')
  })

  it("gere du texte avant/apres le bloc markdown", () => {
    const input = 'Voici le JSON:\n```json\n{"data": true}\n```\nFin.'
    expect(extractJson(input)).toBe('{"data": true}')
  })

  it("gere du JSON multiligne dans un bloc markdown", () => {
    const input = '```json\n{\n  "title": "Test",\n  "content": "<p>Hello</p>",\n  "excerpt": "Desc"\n}\n```'
    const result = extractJson(input)
    const parsed = JSON.parse(result)
    expect(parsed.title).toBe("Test")
    expect(parsed.content).toBe("<p>Hello</p>")
  })
})

describe("safeParseJson", () => {
  it("parse du JSON valide", () => {
    const result = safeParseJson<{ name: string }>('{"name": "test"}', "test")
    expect(result.name).toBe("test")
  })

  it("throw une erreur claire pour du JSON invalide", () => {
    expect(() => safeParseJson("pas du json", "test-context")).toThrow(
      "JSON invalide (test-context)"
    )
  })

  it("throw une erreur claire pour du JSON tronque", () => {
    expect(() => safeParseJson('{"title": "test', "truncated")).toThrow(
      "JSON invalide (truncated)"
    )
  })

  it("inclut un extrait du texte dans l'erreur", () => {
    try {
      safeParseJson("invalid content here", "ctx")
    } catch (e) {
      expect((e as Error).message).toContain("invalid content here")
    }
  })
})
