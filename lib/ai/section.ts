import { getGemini, MODEL } from "./gemini"
import { getToneContext } from "./tone"
import { trackUsage } from "./tracking"
import sanitizeHtml from "sanitize-html"

// Re-export client-safe functions
export { extractSections, replaceSection } from "./section-utils"

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
