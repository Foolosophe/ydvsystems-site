export function buildSocialPrompt(
  platforms: string[],
  articleTitle: string,
  articleExcerpt: string,
  articleUrl: string,
): string {
  const platformInstructions = platforms
    .map((p) => {
      switch (p) {
        case "FACEBOOK":
          return `- FACEBOOK: 150-300 mots. Ton conversationnel et engageant. Utilise des emojis naturels. Inclus le lien vers l'article.`
        case "INSTAGRAM":
          return `- INSTAGRAM: 80-150 mots. Accroche forte en premiere ligne. Termine par un bloc de 30 hashtags optimises separes par des espaces.`
        case "TWITTER":
          return `- TWITTER: Maximum 280 caracteres (STRICT, inclus le lien). Ton direct et percutant. Inclus le lien "${articleUrl}".`
        case "LINKEDIN":
          return `- LINKEDIN: 150-250 mots. Ton expert et structure. Maximum 5 hashtags professionnels a la fin. Inclus le lien vers l'article.`
        case "EMAIL":
          return `- EMAIL: Retourne un objet JSON avec "subject" (max 60 caracteres) et "body" (environ 200 mots). Ton chaleureux et incitatif.`
        default:
          return ""
      }
    })
    .filter(Boolean)
    .join("\n")

  return `Tu es un expert en communication digitale et reseaux sociaux pour YdvSystems, une entreprise de developpement web et IA.

Genere des posts pour les plateformes suivantes, bases sur cet article de blog :

**Titre :** ${articleTitle}
**Resume :** ${articleExcerpt}
**Lien :** ${articleUrl}

**Consignes par plateforme :**
${platformInstructions}

**Regle absolue :** Reponds UNIQUEMENT avec un objet JSON valide, sans backticks ni markdown. Les cles sont les noms des plateformes en majuscules. Les valeurs sont des chaines de caracteres, sauf EMAIL qui est un objet avec "subject" et "body".

Exemple de format :
{"FACEBOOK": "texte...", "TWITTER": "texte..."}
`
}
