import { describe, it, expect, beforeEach } from "vitest"
import { contactSchema, escapeHtml, isRateLimited, resetRateLimit } from "@/lib/contact"

describe("contactSchema", () => {
  const validData = {
    name: "Jean Dupont",
    email: "jean@example.com",
    projectType: "SaaS",
    message: "Bonjour, je souhaite un devis pour un projet web.",
    website: "",
  }

  it("accepts valid data", () => {
    const result = contactSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({ ...validData, email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects short name (< 2 chars)", () => {
    const result = contactSchema.safeParse({ ...validData, name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects short message (< 10 chars)", () => {
    const result = contactSchema.safeParse({ ...validData, message: "Hi" })
    expect(result.success).toBe(false)
  })

  it("rejects honeypot filled", () => {
    const result = contactSchema.safeParse({ ...validData, website: "http://spam.com" })
    expect(result.success).toBe(false)
  })

  it("accepts missing projectType (defaults to empty string)", () => {
    const { projectType, ...rest } = validData
    const result = contactSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.projectType).toBe("")
    }
  })
})

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    )
  })

  it("escapes & and quotes", () => {
    expect(escapeHtml('R&D "test"')).toBe("R&amp;D &quot;test&quot;")
  })

  it("returns plain text unchanged", () => {
    expect(escapeHtml("Hello world")).toBe("Hello world")
  })
})

describe("isRateLimited", () => {
  beforeEach(() => {
    resetRateLimit()
  })

  it("allows first 3 requests", () => {
    expect(isRateLimited("1.2.3.4")).toBe(false)
    expect(isRateLimited("1.2.3.4")).toBe(false)
    expect(isRateLimited("1.2.3.4")).toBe(false)
  })

  it("blocks 4th request from same IP", () => {
    isRateLimited("1.2.3.4")
    isRateLimited("1.2.3.4")
    isRateLimited("1.2.3.4")
    expect(isRateLimited("1.2.3.4")).toBe(true)
  })

  it("allows requests from different IPs", () => {
    isRateLimited("1.1.1.1")
    isRateLimited("1.1.1.1")
    isRateLimited("1.1.1.1")
    expect(isRateLimited("2.2.2.2")).toBe(false)
  })
})
