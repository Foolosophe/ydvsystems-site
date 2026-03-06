import { getGemini, MODEL } from "./gemini"
import { extractJson, safeParseJson } from "./utils"
import { trackUsage } from "./tracking"

function trackGemini(action: string, result: { response: { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } } }) {
  const meta = result.response.usageMetadata
  if (meta) {
    trackUsage(action, MODEL, meta.promptTokenCount || 0, meta.candidatesTokenCount || 0)
  }
}

export interface ResearchResult {
  topic: string
  findings: string[]
  suggestedSources: string[]
  keyFacts: string[]
}

/** Recherche autonome sur un sujet via Gemini */
export async function researchTopic(subject: string, angle?: string): Promise<ResearchResult> {
  const prompt = `Tu es un chercheur expert charge de rassembler des informations fiables sur un sujet.

**SUJET :** ${subject}
${angle ? `**ANGLE :** ${angle}` : ""}

**MISSION :**
1. Identifie les faits cles, statistiques et tendances recentes sur ce sujet
2. Suggere des sources fiables (etudes, rapports, articles de reference)
3. Formule des points d'analyse originaux

**REGLES :**
- Base-toi uniquement sur des connaissances verifiables
- Cite des chiffres precis quand possible (avec annee)
- Privilegie les sources francophones quand elles existent
- Inclus des contre-arguments ou nuances

**FORMAT DE REPONSE :** Un objet JSON valide, sans backticks :
{
  "topic": "Titre du sujet de recherche",
  "findings": ["Constat 1 avec chiffres...", "Constat 2...", "Constat 3...", "Constat 4...", "Constat 5..."],
  "suggestedSources": ["Source 1 (type, annee)", "Source 2...", "Source 3..."],
  "keyFacts": ["Fait cle 1 avec statistique...", "Fait cle 2...", "Fait cle 3..."]
}`

  const model = getGemini().getGenerativeModel({ model: MODEL })
  const result = await model.generateContent(prompt)
  trackGemini("research", result)
  const text = extractJson(result.response.text())

  const parsed = safeParseJson<ResearchResult>(text, "researchTopic")

  if (!parsed.findings || !parsed.suggestedSources) {
    throw new Error("Recherche incomplete: donnees manquantes")
  }

  return parsed
}
