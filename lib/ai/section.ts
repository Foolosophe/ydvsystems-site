import { getGemini, MODEL } from "./gemini"
import { getToneContext } from "./tone"
import { trackUsage } from "./tracking"
import sanitizeHtml from "sanitize-html"

function trackGemini(action: string, result: { response: { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } } }) {
  const meta = result.response.usageMetadata
  if (meta) {
    trackUsage(action, MODEL, meta.promptTokenCount || 0, meta.candidatesTokenCount || 0)
  }
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "pre", "code"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    code: ["class"],
    pre: ["class"],
  },
}

/** Extrait les sections h2 d'un HTML */
export function extractSections(html: string): { heading: string; content: string }[] {
  const sections: { heading: string; content: string }[] = []
  // Split par h2, en gardant le h2
  const parts = html.split(/(?=<h2[^>]*>)/i)

  for (const part of parts) {
    const headingMatch = part.match(/<h2[^>]*>(.*?)<\/h2>/i)
    if (headingMatch) {
      sections.push({
        heading: headingMatch[1].replace(/<[^>]*>/g, "").trim(),
        content: part,
      })
    }
  }

  return sections
}

/** Regenere une section h2 isolement */
export async function regenerateSection(
  heading: string,
  currentContent: string,
  fullArticleContext: string,
): Promise<string> {
  const tone = await getToneContext()
  const contextPreview = fullArticleContext.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500)

  const prompt = `Tu es un redacteur expert. Regenere UNIQUEMENT la section suivante d'un article de blog.

**SECTION A REGENERER :**
Titre : ${heading}
Contenu actuel :
${currentContent}

**CONTEXTE DE L'ARTICLE (les autres sections, pour coherence) :**
${contextPreview}

**CONSIGNES :**
- Garde le meme titre h2
- Reecris le contenu de cette section de maniere differente et amelioree
- Garde la meme longueur approximative
- Ameliore la clarte, les exemples, la structure
- Utilise des h3 si pertinent
- Ecris en francais

**FORMAT :** Reponds UNIQUEMENT avec le HTML de la section (commence par <h2>, pas de JSON, pas de backticks).
${tone}`

  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  trackGemini("section_regen", result)
  let text = result.response.text().trim()

  // Nettoyer les backticks markdown si presents
  text = text.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim()

  return sanitizeHtml(text, SANITIZE_OPTIONS)
}

/** Remplace une section dans le HTML complet */
export function replaceSection(
  fullHtml: string,
  oldHeading: string,
  newSectionHtml: string,
): string {
  const sections = fullHtml.split(/(?=<h2[^>]*>)/i)
  const result: string[] = []

  for (const part of sections) {
    const headingMatch = part.match(/<h2[^>]*>(.*?)<\/h2>/i)
    if (headingMatch) {
      const heading = headingMatch[1].replace(/<[^>]*>/g, "").trim()
      if (heading === oldHeading) {
        result.push(newSectionHtml)
        continue
      }
    }
    result.push(part)
  }

  return result.join("")
}
