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

vi.mock("@/lib/db", () => ({
  prisma: {
    article: {
      findUnique: vi.fn(() =>
        Promise.resolve({
          title: "Article test",
          excerpt: "Un article de test sur l'IA",
          slug: "article-test",
        })
      ),
    },
    setting: {
      findMany: vi.fn(() => Promise.resolve([])),
    },
    aiUsage: {
      create: vi.fn(() => Promise.resolve()),
    },
  },
}))

import { generateSocialPosts } from "@/lib/ai/social"

describe("generateSocialPosts", () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it("gere le JSON wrappé en markdown (comportement reel Gemini)", async () => {
    const json = JSON.stringify({
      FACEBOOK: "Post Facebook",
      LINKEDIN: "Post LinkedIn #IA",
    })
    mockGenerateContent.mockResolvedValue({
      response: { text: () => `\`\`\`json\n${json}\n\`\`\`` },
    })

    const result = await generateSocialPosts(1, ["FACEBOOK", "LINKEDIN"])
    expect(result.FACEBOOK).toBe("Post Facebook")
    expect(result.LINKEDIN).toBe("Post LinkedIn #IA")
  })

  it("filtre les plateformes non demandees", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            FACEBOOK: "Post Facebook",
            TWITTER: "Tweet non demande",
          }),
      },
    })

    const result = await generateSocialPosts(1, ["FACEBOOK"])
    expect(result).toHaveProperty("FACEBOOK")
    expect(result).not.toHaveProperty("TWITTER")
  })

  it("gere le format EMAIL avec subject/body", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            EMAIL: {
              subject: "Nouvel article",
              body: "Bonjour, decouvrez notre article...",
            },
          }),
      },
    })

    const result = await generateSocialPosts(1, ["EMAIL"])
    const email = result.EMAIL as { subject: string; body: string }
    expect(email.subject).toBe("Nouvel article")
    expect(email.body).toContain("Bonjour")
  })

  it("utilise le siteUrl passe en parametre", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ TWITTER: "Tweet" }) },
    })

    await generateSocialPosts(1, ["TWITTER"], "https://staging.ydvsystems.com")
    const promptArg = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain("staging.ydvsystems.com")
  })

  it("throw si Gemini retourne du JSON invalide", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "Je ne peux pas generer ces posts." },
    })

    await expect(generateSocialPosts(1, ["FACEBOOK"])).rejects.toThrow("JSON invalide")
  })

  it("throw si l'article n'existe pas", async () => {
    const { prisma } = await import("@/lib/db")
    vi.mocked(prisma.article.findUnique).mockResolvedValueOnce(null)

    await expect(generateSocialPosts(999, ["FACEBOOK"])).rejects.toThrow("Article introuvable")
  })
})
