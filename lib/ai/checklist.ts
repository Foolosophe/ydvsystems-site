import { countWords } from "@/lib/blog/wordCount"

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  auto: boolean // verifie automatiquement
}

/** Genere une checklist de relecture basee sur l'analyse du contenu */
export function generateChecklist(
  title: string,
  content: string,
  excerpt: string,
  metaDescription: string | null,
  keywords: string | null,
  coverImage: string | null,
): ChecklistItem[] {
  const wordCount = countWords(content)
  const hasH2 = /<h2/i.test(content)
  const hasLinks = /<a\s/i.test(content)
  const hasImages = /<img/i.test(content) || !!coverImage

  return [
    {
      id: "title_length",
      label: "Titre entre 30 et 80 caracteres",
      checked: title.length >= 30 && title.length <= 80,
      auto: true,
    },
    {
      id: "excerpt_exists",
      label: "Extrait renseigne",
      checked: excerpt.length >= 10,
      auto: true,
    },
    {
      id: "word_count",
      label: "Article d'au moins 500 mots",
      checked: wordCount >= 500,
      auto: true,
    },
    {
      id: "has_headings",
      label: "Contient des sous-titres (h2)",
      checked: hasH2,
      auto: true,
    },
    {
      id: "has_links",
      label: "Contient au moins un lien",
      checked: hasLinks,
      auto: true,
    },
    {
      id: "has_cover",
      label: "Image de couverture definie",
      checked: hasImages,
      auto: true,
    },
    {
      id: "meta_description",
      label: "Meta description SEO renseignee",
      checked: !!metaDescription && metaDescription.length >= 50,
      auto: true,
    },
    {
      id: "keywords_set",
      label: "Mots-cles SEO definis",
      checked: !!keywords && keywords.length > 0,
      auto: true,
    },
    // Checks manuels
    {
      id: "proofread",
      label: "Relecture orthographique effectuee",
      checked: false,
      auto: false,
    },
    {
      id: "facts_verified",
      label: "Faits et sources verifies",
      checked: false,
      auto: false,
    },
    {
      id: "tone_consistent",
      label: "Ton coherent avec la marque",
      checked: false,
      auto: false,
    },
  ]
}

/** Calcule le pourcentage de completion */
export function checklistProgress(items: ChecklistItem[]): number {
  if (items.length === 0) return 0
  const checked = items.filter((i) => i.checked).length
  return Math.round((checked / items.length) * 100)
}
