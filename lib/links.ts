const BASE_URL = "https://ydvsystems.com"

/**
 * Rend le chemin interne d'une URL qui pointe vers le site lui-meme, sinon null.
 *
 * Certaines fiches du portfolio renvoient vers une page du site (ydvsystems.com/solutions,
 * /motion-design). Rendues comme des liens externes, elles ouvraient un nouvel onglet :
 * nouvelle session, donc l'ecran de chargement rejouait alors qu'on n'avait pas quitte le site.
 */
export function internalPath(url: string | null | undefined): string | null {
  if (!url) return null
  if (url === BASE_URL) return "/"
  if (!url.startsWith(`${BASE_URL}/`)) return null
  const path = url.slice(BASE_URL.length)
  // On ecarte les prefixes de langue : la navigation next-intl s'en charge.
  return path.replace(/^\/(fr|en)(?=\/|$)/, "") || "/"
}
