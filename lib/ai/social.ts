import { getGemini, MODEL } from "./gemini"
import { buildSocialPrompt } from "./prompts/social"
import { prisma } from "@/lib/db"
import { extractJson, safeParseJson } from "./utils"

type SocialContent = string | { subject: string; body: string }

export async function generateSocialPosts(
  articleId: number,
  platforms: string[],
  siteUrl = "https://ydvsystems.com",
  locale = "fr",
): Promise<Record<string, SocialContent>> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { title: true, excerpt: true, slug: true },
  })

  if (!article) throw new Error("Article introuvable")

  const articleUrl = `${siteUrl}/${locale}/blog/${article.slug}`
  const prompt = buildSocialPrompt(platforms, article.title, article.excerpt, articleUrl)

  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<Record<string, SocialContent>>(text, "generateSocialPosts")

  const filtered: Record<string, SocialContent> = {}
  for (const platform of platforms) {
    if (parsed[platform] !== undefined) {
      filtered[platform] = parsed[platform]
    }
  }

  return filtered
}
