import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val && typeof val === "object" && !Array.isArray(val)) {
      keys.push(...getAllKeys(val as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

describe("i18n key parity", () => {
  const fr = JSON.parse(readFileSync(resolve(__dirname, "../../messages/fr.json"), "utf-8"))
  const en = JSON.parse(readFileSync(resolve(__dirname, "../../messages/en.json"), "utf-8"))

  const frKeys = getAllKeys(fr)
  const enKeys = getAllKeys(en)

  it("FR and EN have the same number of keys", () => {
    expect(frKeys.length).toBe(enKeys.length)
  })

  it("no keys missing in EN", () => {
    const missingInEn = frKeys.filter((k) => !enKeys.includes(k))
    expect(missingInEn).toEqual([])
  })

  it("no keys missing in FR", () => {
    const missingInFr = enKeys.filter((k) => !frKeys.includes(k))
    expect(missingInFr).toEqual([])
  })

  it("no empty values in FR", () => {
    const empty = frKeys.filter((k) => {
      const val = k.split(".").reduce((o: unknown, p) => (o as Record<string, unknown>)?.[p], fr)
      return val === ""
    })
    expect(empty).toEqual([])
  })

  it("no empty values in EN", () => {
    const empty = enKeys.filter((k) => {
      const val = k.split(".").reduce((o: unknown, p) => (o as Record<string, unknown>)?.[p], en)
      return val === ""
    })
    expect(empty).toEqual([])
  })
})
