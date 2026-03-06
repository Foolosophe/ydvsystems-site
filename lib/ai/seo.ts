import { getGemini, MODEL } from "./gemini"
import { buildSeoPrompt } from "./prompts/seo"
import { extractJson, safeParseJson } from "./utils"
import { getToneContext } from "./tone"
import { trackUsage } from "./tracking"

function trackGemini(action: string, result: { response: { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } } }) {
  const meta = result.response.usageMetadata
  if (meta) {
    trackUsage(action, MODEL, meta.promptTokenCount || 0, meta.candidatesTokenCount || 0)
  }
}

export interface SeoSuggestions {
  metaDescription: string
  slug: string
  keywords: string
  seoTitle: string
}

export async function generateSeoSuggestions(
  title: string,
  content: string,
  excerpt: string,
): Promise<SeoSuggestions> {
  const tone = await getToneContext()
  const prompt = buildSeoPrompt(title, content, excerpt) + tone
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  trackGemini("seo", result)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<SeoSuggestions>(text, "generateSeoSuggestions")

  if (!parsed.metaDescription || !parsed.slug || !parsed.keywords) {
    throw new Error("Reponse Gemini incomplete: champs SEO manquants")
  }

  return {
    metaDescription: parsed.metaDescription.slice(0, 160),
    slug: parsed.slug,
    keywords: parsed.keywords,
    seoTitle: parsed.seoTitle || title,
  }
}
