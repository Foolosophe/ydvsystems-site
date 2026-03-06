/** Fonctions pures pour manipuler les sections h2 — safe cote client */

/** Extrait les sections h2 d'un HTML */
export function extractSections(html: string): { heading: string; content: string }[] {
  const sections: { heading: string; content: string }[] = []
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
