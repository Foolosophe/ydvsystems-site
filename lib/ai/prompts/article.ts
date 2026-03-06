export interface ArticleBrief {
  subject: string
  angle?: string
  audience?: string
  keyPoints?: string
  sources?: string
  tone?: string
  length: "short" | "medium" | "long"
  category: string
}

export interface OutlineSection {
  title: string
  description: string
}

const LENGTH_MAP = {
  short: { words: "500-700", paragraphs: "4-6", sections: "2-3" },
  medium: { words: "1000-1400", paragraphs: "8-12", sections: "4-6" },
  long: { words: "1800-2200", paragraphs: "14-18", sections: "6-8" },
} as const

const AUDIENCE_MAP: Record<string, string> = {
  pme: "dirigeants de PME et TPE, non-techniques, sensibles au ROI et a la productivite",
  dsi: "DSI et responsables IT, familiers avec les outils numeriques, attentifs a la securite et l'integration",
  insertion: "professionnels de l'insertion (CIP, CDDI, directeurs SIAE), sensibles a l'accompagnement humain et aux obligations reglementaires",
  rh: "responsables RH et recrutement, interesses par les soft skills, la marque employeur et l'automatisation du recrutement",
  devs: "developpeurs et profils techniques, apprécient le code, les benchmarks et les architectures concretes",
  general: "grand public curieux, pas de jargon, beaucoup d'exemples concrets et de vulgarisation",
}

const TONE_MAP: Record<string, string> = {
  professionnel: "Ton formel et expert. Phrases structurees, vocabulaire precis, credibilite. Evite le tutoiement.",
  conversationnel: "Ton direct et engageant. Tutoie le lecteur, pose des questions rhetoriques, utilise des analogies simples.",
  technique: "Ton de tutoriel. Inclus des extraits de code, des schemas de donnees, des commandes CLI. Sois precis et actionnable.",
  storytelling: "Ton narratif. Commence par une anecdote ou un cas reel, utilise le recit pour illustrer les concepts. Le lecteur doit se projeter.",
}

// ——— STEP 1 : GENERER LE PLAN ———

export function buildOutlinePrompt(brief: ArticleBrief): string {
  const len = LENGTH_MAP[brief.length]
  const audienceDesc = AUDIENCE_MAP[brief.audience || "general"] || brief.audience
  const toneDesc = TONE_MAP[brief.tone || "professionnel"] || brief.tone

  return `Tu es un stratege de contenu pour YdvSystems, une entreprise de developpement web et IA specialisee dans l'insertion professionnelle.

**MISSION :** Genere un plan structure pour un article de blog.

**BRIEF :**
- Sujet : ${brief.subject}
${brief.angle ? `- Angle / These : ${brief.angle}` : ""}
- Public cible : ${audienceDesc}
- Ton : ${toneDesc}
- Categorie : ${brief.category}
${brief.keyPoints ? `\n**POINTS CLES A COUVRIR (obligatoires) :**\n${brief.keyPoints}` : ""}
${brief.sources ? `\n**SOURCES A INTEGRER :**\n${brief.sources}` : ""}

**CONTRAINTES :**
- Le plan doit contenir ${len.sections} sections (h2)
- Chaque section a un titre accrocheur et une description de 1-2 phrases expliquant ce qu'elle couvrira
- L'ordre doit etre logique et progressif (du contexte vers l'action)
- Si des sources sont fournies, indique dans quelle section les integrer
${brief.angle ? `- Le fil rouge de l'article est : "${brief.angle}"` : ""}

**FORMAT DE REPONSE :** Un tableau JSON valide avec des objets {title, description} :
[
  {"title": "Titre de la section 1", "description": "Ce que cette section couvrira..."},
  {"title": "Titre de la section 2", "description": "Ce que cette section couvrira..."}
]
`
}

// ——— STEP 2 : REDIGER L'ARTICLE DEPUIS LE PLAN ———

export function buildArticleFromOutlinePrompt(
  brief: ArticleBrief,
  outline: OutlineSection[],
): string {
  const len = LENGTH_MAP[brief.length]
  const audienceDesc = AUDIENCE_MAP[brief.audience || "general"] || brief.audience
  const toneDesc = TONE_MAP[brief.tone || "professionnel"] || brief.tone

  const outlineStr = outline
    .map((s, i) => `${i + 1}. **${s.title}** — ${s.description}`)
    .join("\n")

  return `Tu es un redacteur expert pour YdvSystems, une entreprise de developpement web et IA specialisee dans l'insertion professionnelle.

**MISSION :** Redige un article de blog complet EN SUIVANT EXACTEMENT le plan ci-dessous.

**BRIEF :**
- Sujet : ${brief.subject}
${brief.angle ? `- Angle / These : ${brief.angle}` : ""}
- Public cible : ${audienceDesc}
- Ton : ${toneDesc}
- Categorie : ${brief.category}
${brief.sources ? `\n**SOURCES A INTEGRER :**\n${brief.sources}\nIntegre ces sources naturellement dans le texte avec des citations (<blockquote>) ou des references en gras.` : ""}

**PLAN A SUIVRE (dans cet ordre exact) :**
${outlineStr}

**CONTRAINTES DE LONGUEUR (OBLIGATOIRE) :**
- L'article DOIT contenir entre ${len.words} mots. Contrainte stricte.
- Chaque section doit etre substantielle (${len.paragraphs} paragraphes au total)
- Si l'article est trop court, developpe les arguments, ajoute des exemples concrets, des cas d'usage.

**CONSIGNES DE STYLE :**
- ${toneDesc}
- Ecris en francais
- Chaque section du plan = un h2
- Utilise des h3 pour les sous-parties si pertinent
- Pas de h1 (le titre est separe)
- Pas de formules creuses ni de remplissage
- Privilegie les exemples concrets, les chiffres, les cas reels
${brief.angle ? `- Le fil rouge : "${brief.angle}" — reviens-y dans chaque section` : ""}

**FORMAT DE REPONSE :** Un objet JSON valide avec exactement ces cles :
{
  "title": "Titre accrocheur de l'article (50-80 caracteres)",
  "content": "<h2>...</h2><p>...</p>...",
  "excerpt": "Resume en 1-2 phrases (max 300 caracteres)"
}

Le champ "content" doit etre du HTML valide : h2, h3, p, ul/li, ol/li, blockquote, strong, em, pre/code.
`
}

// ——— FALLBACK : ancien prompt simple (compatibilite) ———

export function buildGenerateArticlePrompt(
  subject: string,
  length: "short" | "medium" | "long",
  category: string,
  keywords?: string,
): string {
  return buildArticleFromOutlinePrompt(
    { subject, length, category },
    [{ title: subject, description: keywords || "Contenu principal" }],
  )
}

// ——— TITRES ———

export function buildTitlesPrompt(text: string): string {
  return `A partir du texte suivant, propose exactement 3 titres d'articles accrocheurs et distincts.

**Texte :** ${text}

**Format de reponse :** Un tableau JSON valide (sans backticks) avec exactement 3 chaines :
["Titre 1", "Titre 2", "Titre 3"]
`
}

// ——— ASSISTANCE TEXTE ———

export function buildAssistPrompt(
  action: "reformulate" | "complete" | "shorten" | "expand",
  text: string,
): string {
  const instructions = {
    reformulate: "Reformule le texte suivant en gardant le meme sens mais avec un style different. Ameliore la clarte et la fluidite.",
    complete: "Complete le texte suivant de maniere naturelle et coherente. Ajoute 2-3 phrases supplementaires.",
    shorten: "Raccourcis le texte suivant en gardant les informations essentielles. Reduis d'environ 40%.",
    expand: "Developpe le texte suivant en ajoutant des details, des exemples ou des explications. Double environ la longueur.",
  }

  return `${instructions[action]}

**Texte :** ${text}

**Regle :** Reponds UNIQUEMENT avec le texte resultat, sans guillemets, sans explication, sans markdown.
`
}
