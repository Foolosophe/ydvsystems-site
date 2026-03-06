/** Strip HTML tags and count words */
export function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

/** Estimate reading time in minutes (200 words/min) */
export function readingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}
