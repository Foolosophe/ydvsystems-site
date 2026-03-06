import { getGemini, MODEL } from "./gemini"
import { extractJson, safeParseJson } from "./utils"
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

export interface TranslatedArticle {
  title: string
  slug: string
  content: string
  excerpt: string
}

export async function translateArticle(
  title: string,
  content: string,
  excerpt: string,
  targetLocale: string,
): Promise<TranslatedArticle> {
  const langName = targetLocale === "en" ? "anglais" : targetLocale === "es" ? "espagnol" : targetLocale === "de" ? "allemand" : targetLocale

  const prompt = `Tu es un traducteur professionnel specialise dans le contenu web tech/digital.

**MISSION :** Traduis cet article de blog du francais vers le ${langName}.

**TITRE :** ${title}
**EXTRAIT :** ${excerpt}
**CONTENU HTML :**
${content}

**REGLES STRICTES :**
- Preserve EXACTEMENT la structure HTML (h2, h3, p, ul, li, blockquote, strong, em, pre, code)
- Ne traduis PAS les noms propres, noms de produits, termes techniques universels (API, framework, etc.)
- Adapte les expressions idiomatiques (ne traduis pas mot a mot)
- Le slug doit etre en kebab-case, sans accents, base sur le titre traduit
- L'extrait traduit doit faire max 300 caracteres

**FORMAT DE REPONSE :** Un objet JSON valide, sans backticks :
{
  "title": "Titre traduit",
  "slug": "titre-traduit-en-kebab-case",
  "content": "<h2>...</h2><p>...</p>...",
  "excerpt": "Extrait traduit (max 300 chars)"
}`

  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  trackGemini("translate", result)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<TranslatedArticle>(text, "translateArticle")

  if (!parsed.title || !parsed.content || !parsed.excerpt || !parsed.slug) {
    throw new Error("Traduction incomplete: champs manquants")
  }

  return {
    title: parsed.title,
    slug: parsed.slug,
    content: sanitizeHtml(parsed.content, SANITIZE_OPTIONS),
    excerpt: parsed.excerpt.slice(0, 300),
  }
}
