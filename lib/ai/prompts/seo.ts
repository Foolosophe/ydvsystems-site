export function buildSeoPrompt(title: string, content: string, excerpt: string): string {
  // On envoie un extrait du contenu pour limiter les tokens
  const contentPreview = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000)

  return `Tu es un expert SEO francophone specialise dans le contenu web tech/digital.

**MISSION :** Analyse l'article suivant et genere des suggestions SEO optimales.

**ARTICLE :**
- Titre actuel : ${title}
- Extrait : ${excerpt}
- Contenu (debut) : ${contentPreview}

**GENERE :**
1. Une meta description optimisee (max 155 caracteres, avec mot-cle principal)
2. Un slug optimise (kebab-case, court, avec mot-cle principal, sans accents)
3. 5-8 mots-cles SEO separes par des virgules (du plus important au moins important)
4. Un titre SEO alternatif (50-60 caracteres, optimise pour le CTR Google)

**FORMAT DE REPONSE :** Un objet JSON valide, sans backticks :
{
  "metaDescription": "...",
  "slug": "...",
  "keywords": "mot1, mot2, mot3",
  "seoTitle": "..."
}
`
}
