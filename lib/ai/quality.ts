import { countWords } from "@/lib/blog/wordCount"

export interface QualityReport {
  score: number // 0-100
  wordCount: number
  readability: number // Flesch FR 0-100
  headingCount: number
  paragraphCount: number
  hasLinks: boolean
  hasBlockquotes: boolean
  issues: QualityIssue[]
}

export interface QualityIssue {
  type: "error" | "warning" | "info"
  label: string
}

/** Flesch Reading Ease adapted for French (Kandel & Moles) */
function fleschFR(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0 || sentences.length === 0) return 0

  // Approximate syllable count for French
  const syllables = words.reduce((sum, w) => {
    const cleaned = w.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ]/g, "")
    if (!cleaned) return sum
    // Count vowel groups as syllables
    const groups = cleaned.match(/[aeiouyàâäéèêëïîôùûüÿœæ]+/gi)
    return sum + Math.max(1, groups ? groups.length : 1)
  }, 0)

  const asl = words.length / sentences.length // average sentence length
  const asw = syllables / words.length // average syllables per word

  // Kandel & Moles formula for French
  const score = 207 - 1.015 * asl - 73.6 * asw
  return Math.max(0, Math.min(100, Math.round(score)))
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").trim()
}

export function analyzeQuality(html: string): QualityReport {
  const text = stripHtml(html)
  const wordCount = countWords(html)
  const readability = fleschFR(text)

  const headingCount = (html.match(/<h[23][^>]*>/gi) || []).length
  const paragraphCount = (html.match(/<p[^>]*>/gi) || []).length
  const hasLinks = /<a\s/i.test(html)
  const hasBlockquotes = /<blockquote/i.test(html)

  const issues: QualityIssue[] = []

  // Word count checks
  if (wordCount < 300) {
    issues.push({ type: "error", label: "Article trop court (< 300 mots)" })
  } else if (wordCount < 600) {
    issues.push({ type: "warning", label: "Article court (< 600 mots) — risque SEO" })
  }

  // Structure checks
  if (headingCount === 0) {
    issues.push({ type: "error", label: "Aucun sous-titre (h2/h3)" })
  } else if (headingCount < 2) {
    issues.push({ type: "warning", label: "Un seul sous-titre — structurez davantage" })
  }

  if (paragraphCount < 3) {
    issues.push({ type: "warning", label: "Peu de paragraphes — ameliorez la lisibilite" })
  }

  // Readability
  if (readability < 30) {
    issues.push({ type: "warning", label: "Texte difficile a lire (Flesch < 30)" })
  } else if (readability > 70) {
    issues.push({ type: "info", label: "Texte tres accessible (Flesch > 70)" })
  }

  // Content enrichment
  if (!hasLinks) {
    issues.push({ type: "info", label: "Aucun lien — ajoutez des references" })
  }
  if (!hasBlockquotes && wordCount > 800) {
    issues.push({ type: "info", label: "Pas de citations — enrichissez avec des blockquotes" })
  }

  // Calculate overall score
  let score = 50

  // Word count contribution (0-25)
  if (wordCount >= 1000) score += 25
  else if (wordCount >= 600) score += 15
  else if (wordCount >= 300) score += 5

  // Structure contribution (0-25)
  if (headingCount >= 3) score += 15
  else if (headingCount >= 2) score += 10
  else if (headingCount >= 1) score += 5
  if (paragraphCount >= 5) score += 10
  else if (paragraphCount >= 3) score += 5

  // Readability contribution (-10 to +15)
  if (readability >= 40 && readability <= 70) score += 15
  else if (readability >= 30) score += 5
  else score -= 10

  // Enrichment bonus (0-10)
  if (hasLinks) score += 5
  if (hasBlockquotes) score += 5

  score = Math.max(0, Math.min(100, score))

  return { score, wordCount, readability, headingCount, paragraphCount, hasLinks, hasBlockquotes, issues }
}
