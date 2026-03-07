import { describe, it, expect, vi } from "vitest"
import bcrypt from "bcryptjs"

// Mock iron-session
vi.mock("iron-session", () => ({
  getIronSession: vi.fn(),
}))

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(new Map())),
}))

import { getIronSession } from "iron-session"
import { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"

function makeRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost:3000"), options as never)
}

describe("requireAdmin", () => {
  it("returns 401 if no session", async () => {
    vi.mocked(getIronSession).mockResolvedValueOnce({
      isAdmin: undefined,
      save: vi.fn(),
      destroy: vi.fn(),
    } as never)

    const result = await requireAdmin(makeRequest("/api/admin/articles"))
    expect(result).not.toBeNull()
    expect(result!.status).toBe(401)
  })

  it("returns null if session is valid", async () => {
    vi.mocked(getIronSession).mockResolvedValueOnce({
      isAdmin: true,
      save: vi.fn(),
      destroy: vi.fn(),
    } as never)

    const result = await requireAdmin(makeRequest("/api/admin/articles"))
    expect(result).toBeNull()
  })
})

describe("bcrypt password hashing", () => {
  it("validates a correct password against its hash", async () => {
    const password = "test-password-123"
    const hash = bcrypt.hashSync(password, 12)
    const valid = await bcrypt.compare(password, hash)
    expect(valid).toBe(true)
  })

  it("rejects a wrong password", async () => {
    const hash = bcrypt.hashSync("correct-password", 12)
    const valid = await bcrypt.compare("wrong-password", hash)
    expect(valid).toBe(false)
  })

  it("produces a valid bcrypt hash format", () => {
    const hash = bcrypt.hashSync("test", 12)
    expect(hash).toMatch(/^\$2[aby]?\$12\$.{53}$/)
  })
})
