import { prisma } from "@/lib/db"

export interface ToneProfile {
  brandVoice: string
  keywords: string
  examples: string
  avoidWords: string
}

const TONE_KEYS = ["tone_brandVoice", "tone_keywords", "tone_examples", "tone_avoidWords"] as const

export async function getToneProfile(): Promise<ToneProfile | null> {
  const settings = await prisma.setting.findMany({
    where: { key: { in: [...TONE_KEYS] } },
  })

  if (settings.length === 0) return null

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  const profile: ToneProfile = {
    brandVoice: map.tone_brandVoice || "",
    keywords: map.tone_keywords || "",
    examples: map.tone_examples || "",
    avoidWords: map.tone_avoidWords || "",
  }

  if (!profile.brandVoice && !profile.keywords) return null

  return profile
}

export function buildToneContext(profile: ToneProfile): string {
  const parts: string[] = []

  if (profile.brandVoice) {
    parts.push(`**VOIX DE MARQUE :** ${profile.brandVoice}`)
  }
  if (profile.keywords) {
    parts.push(`**MOTS-CLES DE MARQUE (a integrer naturellement) :** ${profile.keywords}`)
  }
  if (profile.examples) {
    parts.push(`**EXEMPLES DE STYLE A SUIVRE :**\n${profile.examples}`)
  }
  if (profile.avoidWords) {
    parts.push(`**MOTS/EXPRESSIONS A EVITER :** ${profile.avoidWords}`)
  }

  return `\n\n**GUIDE DE STYLE (OBLIGATOIRE) :**\n${parts.join("\n")}\n`
}

export async function getToneContext(): Promise<string> {
  const profile = await getToneProfile()
  if (!profile) return ""
  return buildToneContext(profile)
}
