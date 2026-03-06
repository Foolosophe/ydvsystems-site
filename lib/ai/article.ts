import sanitizeHtml from "sanitize-html"
import { getGemini, MODEL } from "./gemini"
import {
  buildGenerateArticlePrompt,
  buildOutlinePrompt,
  buildArticleFromOutlinePrompt,
  buildTitlesPrompt,
  buildAssistPrompt,
  type ArticleBrief,
  type OutlineSection,
} from "./prompts/article"
import { extractJson, safeParseJson } from "./utils"

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "pre", "code"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    code: ["class"],
    pre: ["class"],
  },
}

/** Genere un plan structure a partir d'un brief */
export async function generateOutline(brief: ArticleBrief): Promise<OutlineSection[]> {
  const prompt = buildOutlinePrompt(brief)
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const text = extractJson(result.response.text())

  const sections = safeParseJson<OutlineSection[]>(text, "generateOutline")

  if (!Array.isArray(sections) || sections.length === 0) {
    throw new Error("Reponse Gemini invalide: tableau de sections attendu")
  }

  for (const section of sections) {
    if (!section.title) {
      throw new Error("Reponse Gemini invalide: section sans titre")
    }
  }

  return sections
}

/** Genere un article complet a partir d'un brief + plan valide */
export async function generateArticleFromOutline(
  brief: ArticleBrief,
  outline: OutlineSection[],
): Promise<{ title: string; content: string; excerpt: string }> {
  const prompt = buildArticleFromOutlinePrompt(brief, outline)
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<{ title: string; content: string; excerpt: string }>(text, "generateArticleFromOutline")

  if (!parsed.title || !parsed.content || !parsed.excerpt) {
    throw new Error("Reponse Gemini incomplete: champs manquants (title/content/excerpt)")
  }

  return {
    title: parsed.title,
    content: sanitizeHtml(parsed.content, SANITIZE_OPTIONS),
    excerpt: parsed.excerpt.slice(0, 300),
  }
}

/** Ancien flow simple (compatibilite) */
export async function generateArticle(
  subject: string,
  length: "short" | "medium" | "long",
  category: string,
  keywords?: string,
): Promise<{ title: string; content: string; excerpt: string }> {
  const prompt = buildGenerateArticlePrompt(subject, length, category, keywords)
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<{ title: string; content: string; excerpt: string }>(text, "generateArticle")

  if (!parsed.title || !parsed.content || !parsed.excerpt) {
    throw new Error("Reponse Gemini incomplete: champs manquants (title/content/excerpt)")
  }

  return {
    title: parsed.title,
    content: sanitizeHtml(parsed.content, SANITIZE_OPTIONS),
    excerpt: parsed.excerpt.slice(0, 300),
  }
}

export async function generateTitles(text: string): Promise<string[]> {
  const prompt = buildTitlesPrompt(text)
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const raw = extractJson(result.response.text())

  const titles = safeParseJson<string[]>(raw, "generateTitles")

  if (!Array.isArray(titles)) {
    throw new Error("Reponse Gemini invalide: tableau attendu pour les titres")
  }

  return titles.slice(0, 3)
}

export async function assistText(
  action: "reformulate" | "complete" | "shorten" | "expand",
  text: string,
): Promise<string> {
  const prompt = buildAssistPrompt(action, text)
  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
