/** Nettoie la reponse Gemini pour extraire le JSON (retire ```json ... ```) */
export function extractJson(raw: string): string {
  let text = raw.trim()
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) {
    text = match[1].trim()
  }
  return text
}

/** Parse JSON avec message d'erreur explicite */
export function safeParseJson<T>(text: string, context: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`JSON invalide (${context}): ${text.slice(0, 200)}`)
  }
}
