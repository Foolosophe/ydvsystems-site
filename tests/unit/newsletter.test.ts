import { describe, it, expect, afterAll } from "vitest"
import path from "path"
import crypto from "crypto"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { z } from "zod"

const dbPath = path.resolve(process.cwd(), "data/blog.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

const subscribeSchema = z.object({
  email: z.string().email(),
})

afterAll(async () => {
  // Clean up test subscribers
  await prisma.subscriber.deleteMany({
    where: { email: { startsWith: "test-newsletter-" } },
  })
  await prisma.$disconnect()
})

describe("Newsletter - subscribe schema validation", () => {
  it("accepts a valid email", () => {
    const result = subscribeSchema.safeParse({ email: "user@example.com" })
    expect(result.success).toBe(true)
  })

  it("rejects an invalid email", () => {
    const result = subscribeSchema.safeParse({ email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects empty email", () => {
    const result = subscribeSchema.safeParse({ email: "" })
    expect(result.success).toBe(false)
  })

  it("rejects missing email", () => {
    const result = subscribeSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("Newsletter - Subscriber model", () => {
  const testEmail = `test-newsletter-${Date.now()}@example.com`
  const testToken = crypto.randomBytes(32).toString("hex")

  it("creates a subscriber", async () => {
    const sub = await prisma.subscriber.create({
      data: { email: testEmail, token: testToken },
    })
    expect(sub.id).toBeGreaterThan(0)
    expect(sub.email).toBe(testEmail)
    expect(sub.token).toBe(testToken)
    expect(sub.confirmedAt).toBeNull()
    expect(sub.unsubscribedAt).toBeNull()
  })

  it("enforces unique email", async () => {
    await expect(
      prisma.subscriber.create({
        data: { email: testEmail, token: crypto.randomBytes(32).toString("hex") },
      })
    ).rejects.toThrow()
  })

  it("enforces unique token", async () => {
    await expect(
      prisma.subscriber.create({
        data: { email: `test-newsletter-unique-${Date.now()}@example.com`, token: testToken },
      })
    ).rejects.toThrow()
  })

  it("finds subscriber by email", async () => {
    const sub = await prisma.subscriber.findUnique({ where: { email: testEmail } })
    expect(sub).not.toBeNull()
    expect(sub!.token).toBe(testToken)
  })

  it("finds subscriber by token", async () => {
    const sub = await prisma.subscriber.findUnique({ where: { token: testToken } })
    expect(sub).not.toBeNull()
    expect(sub!.email).toBe(testEmail)
  })

  it("confirms subscription", async () => {
    const sub = await prisma.subscriber.update({
      where: { token: testToken },
      data: { confirmedAt: new Date() },
    })
    expect(sub.confirmedAt).not.toBeNull()
  })

  it("filters confirmed subscribers", async () => {
    const confirmed = await prisma.subscriber.findMany({
      where: { confirmedAt: { not: null }, unsubscribedAt: null },
    })
    const found = confirmed.find((s) => s.email === testEmail)
    expect(found).toBeDefined()
  })

  it("unsubscribes a subscriber", async () => {
    const sub = await prisma.subscriber.update({
      where: { token: testToken },
      data: { unsubscribedAt: new Date() },
    })
    expect(sub.unsubscribedAt).not.toBeNull()
  })

  it("excludes unsubscribed from active list", async () => {
    const active = await prisma.subscriber.findMany({
      where: { confirmedAt: { not: null }, unsubscribedAt: null },
    })
    const found = active.find((s) => s.email === testEmail)
    expect(found).toBeUndefined()
  })

  it("re-subscribes by clearing unsubscribedAt and updating token", async () => {
    const newToken = crypto.randomBytes(32).toString("hex")
    const sub = await prisma.subscriber.update({
      where: { email: testEmail },
      data: { token: newToken, unsubscribedAt: null },
    })
    expect(sub.unsubscribedAt).toBeNull()
    expect(sub.token).toBe(newToken)

    const active = await prisma.subscriber.findMany({
      where: { confirmedAt: { not: null }, unsubscribedAt: null },
    })
    const found = active.find((s) => s.email === testEmail)
    expect(found).toBeDefined()
  })
})

describe("Newsletter - i18n keys", () => {
  it("FR has all required newsletter keys", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fr = require("../../messages/fr.json")
    const newsletter = fr.blog.newsletter
    expect(newsletter.title).toBeTruthy()
    expect(newsletter.description).toBeTruthy()
    expect(newsletter.placeholder).toBeTruthy()
    expect(newsletter.button).toBeTruthy()
    expect(newsletter.success).toBeTruthy()
    expect(newsletter.alreadySubscribed).toBeTruthy()
    expect(newsletter.error).toBeTruthy()
  })

  it("EN has all required newsletter keys", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const en = require("../../messages/en.json")
    const newsletter = en.blog.newsletter
    expect(newsletter.title).toBeTruthy()
    expect(newsletter.description).toBeTruthy()
    expect(newsletter.placeholder).toBeTruthy()
    expect(newsletter.button).toBeTruthy()
    expect(newsletter.success).toBeTruthy()
    expect(newsletter.alreadySubscribed).toBeTruthy()
    expect(newsletter.error).toBeTruthy()
  })
})

describe("Newsletter - send schema validation", () => {
  const sendSchema = z.object({
    articleId: z.number(),
  })

  it("accepts valid articleId", () => {
    const result = sendSchema.safeParse({ articleId: 1 })
    expect(result.success).toBe(true)
  })

  it("rejects string articleId", () => {
    const result = sendSchema.safeParse({ articleId: "abc" })
    expect(result.success).toBe(false)
  })

  it("rejects missing articleId", () => {
    const result = sendSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
