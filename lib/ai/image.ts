import { getGemini, MODEL } from "./gemini"
import { extractJson, safeParseJson } from "./utils"

/** Genere des mots-cles de recherche d'image a partir du titre et de l'extrait */
export async function suggestImageKeywords(title: string, excerpt: string): Promise<string[]> {
  const prompt = `A partir de cet article de blog, suggere 3 recherches d'images en anglais pour trouver une photo de couverture pertinente sur Unsplash.

**Titre :** ${title}
**Extrait :** ${excerpt}

**Regles :**
- Chaque recherche = 2-4 mots en anglais
- Evite les termes trop generiques ("technology", "business")
- Privilegie des termes visuels et concrets

**Format :** Un tableau JSON de 3 chaines, sans backticks :
["recherche 1", "recherche 2", "recherche 3"]`

  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  const text = extractJson(result.response.text())
  const parsed = safeParseJson<string[]>(text, "suggestImageKeywords")

  if (!Array.isArray(parsed)) return [title.split(" ").slice(0, 3).join(" ")]
  return parsed.slice(0, 3)
}

export interface UnsplashPhoto {
  id: string
  url: string
  thumbUrl: string
  alt: string
  author: string
  authorUrl: string
}

/** Recherche des photos sur Unsplash */
export async function searchUnsplash(query: string, perPage = 9): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) throw new Error("UNSPLASH_ACCESS_KEY non configure")

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  })

  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`)

  const data = await res.json()

  return (data.results || []).map((photo: Record<string, unknown>) => {
    const urls = photo.urls as Record<string, string>
    const user = photo.user as Record<string, unknown>
    const links = user.links as Record<string, string>
    return {
      id: photo.id as string,
      url: urls.regular,
      thumbUrl: urls.small,
      alt: (photo.alt_description as string) || "",
      author: (user.name as string) || "",
      authorUrl: links.html || "",
    }
  })
}
