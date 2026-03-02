// Contenu statique du site YdvSystems
// Toutes les modifications de texte se font ici.

export const SERVICES = [
  {
    id: "dev-sur-mesure",
    icon: "Code2",
    title: "Applications métier sur mesure",
    description:
      "Logiciels de gestion complexes avec permissions multi-rôles, dashboards, exports multiformats et conformité RGPD. Du prototype à la production.",
    tags: ["Next.js", "tRPC", "PostgreSQL", "TypeScript"],
    price: "À partir de 400 €/j",
    cibles: "PME, associations, startups, structures publiques",
  },
  {
    id: "integration-ia",
    icon: "Brain",
    title: "Intégration IA dans vos outils",
    description:
      "Ajout de Claude, GPT-4 ou Gemini dans votre logiciel existant. Génération de documents, chatbot métier, analyse automatique. Pattern multi-provider avec fallback.",
    tags: ["Claude", "GPT-4", "Gemini", "API"],
    price: "Mission 2-5 jours",
    cibles: "Agences web, éditeurs de logiciels, DSI PME",
  },
  {
    id: "atelier-ia",
    icon: "GraduationCap",
    title: "Atelier IA en entreprise",
    description:
      "Formation pratique demi-journée pour vos équipes. Usage de l'IA générative, prompt engineering, cas d'usage métier concrets. En présentiel ou visio.",
    tags: ["Formation", "Prompt", "IA générative"],
    price: "800 – 1 500 € / session",
    cibles: "PME, organismes de formation, chambres de commerce, RH",
  },
  {
    id: "audit-ia",
    icon: "ClipboardCheck",
    title: "Audit maturité IA entreprise",
    description:
      "Questionnaire structuré sur 14 secteurs. Score 0-100 sur 5 niveaux, rapport PDF personnalisé avec recommandations concrètes générées par IA.",
    tags: ["Diagnostic", "Rapport PDF", "14 secteurs"],
    price: "500 – 1 500 €",
    cibles: "DRH, DSI, dirigeants en transformation digitale",
  },
  {
    id: "automatisation",
    icon: "Workflow",
    title: "Automatisation de workflows",
    description:
      "Setup clé en main : CRM Supabase, emails transactionnels Brevo, notifications Discord, paiements Stripe. Documentation complète incluse. Moins de 10 €/mois d'infrastructure.",
    tags: ["n8n", "Supabase", "Brevo", "Stripe"],
    price: "500 – 1 500 €",
    cibles: "Solopreneurs, e-commerçants, startups",
  },
  {
    id: "cross-platform",
    icon: "MonitorSmartphone",
    title: "Applications Web + Desktop + Mobile",
    description:
      "Une seule codebase, quatre plateformes. Web, Windows/Mac/Linux (Tauri), iOS et Android (Capacitor). Détection automatique, stockage adapté.",
    tags: ["Tauri", "Electron", "Capacitor", "React"],
    price: "Sur devis",
    cibles: "Startups qui veulent toucher tous les supports",
  },
  {
    id: "jeux-narratifs",
    icon: "Gamepad2",
    title: "Jeux narratifs & serious games",
    description:
      "Moteur de jeu sur mesure : combat au tour par tour, inventaire, sauvegardes multi-slot, sons procéduraux, dés 3D physique réaliste, multi-plateforme natif. Vous apportez la narration, j'apporte le moteur.",
    tags: ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
    price: "5 000 – 20 000 €",
    cibles: "Éditeurs, organismes de formation, agences événementielles",
  },
  {
    id: "accessibilite",
    icon: "Heart",
    title: "Applications accessibles & inclusives",
    description:
      "Interfaces pensées pour des publics fragiles : seniors, personnes en situation de handicap, difficultés motrices ou visuelles. Philosophie « zéro stress » : grands boutons, texte lisible, aide à la rédaction par IA.",
    tags: ["React", "Accessibilité", "IA", "Node.js"],
    price: "À partir de 400 €/j",
    cibles: "EHPAD, associations handicap, structures médico-sociales",
  },
]

export const YDV_SOLUTIONS = [
  {
    name: "YDV Insertion",
    subtitle: "Structures IAE, SIAE",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    url: "https://insertion.ydvsystems.com",
    status: "prod" as const,
  },
  {
    name: "YDV Formation",
    subtitle: "Organismes Qualiopi",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    url: "https://formation.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Social",
    subtitle: "CCAS, action sociale",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    url: "https://social.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Jeunesse",
    subtitle: "Missions Locales",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    url: "https://jeunesse.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Handicap",
    subtitle: "Cap Emploi, ESAT, SAVS",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    url: "https://handicap.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Hébergement",
    subtitle: "CHRS",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    url: "https://hebergement.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Territoire",
    subtitle: "PLIE, Conseils Départementaux",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    url: "https://territoire.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Coaching",
    subtitle: "Bilan de compétences, VAE",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    url: "https://coaching.ydvsystems.com",
    status: "soon" as const,
  },
  {
    name: "YDV Apprentissage",
    subtitle: "CFA",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    url: "https://apprentissage.ydvsystems.com",
    status: "soon" as const,
  },
]

export const PORTFOLIO = [
  {
    id: "ydv-systems",
    title: "YDV Systems",
    type: "SaaS B2B",
    description:
      "Plateforme de gestion complète pour le secteur social et de la formation. 546 fichiers TypeScript, 4 374 tests, 96 modèles de base de données, 9 solutions métier.",
    tags: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "IA"],
    url: "https://insertion.ydvsystems.com",
    urlLabel: "insertion.ydvsystems.com",
  },
  {
    id: "moteur-jeu",
    title: "Moteur de jeu narratif",
    type: "Demo technique",
    description:
      "Moteur de jeu complet développé à titre personnel : 11 systèmes (combat, PSI, inventaire, sauvegarde, achievements, audio...), dés 3D avec physique réaliste custom, 4 plateformes. La narration utilisée est personnelle et non commerciale.",
    tags: ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
    url: null,
    urlLabel: null,
  },
  {
    id: "prompt-parfait",
    title: "Le Prompt Parfait",
    type: "Productivité IA",
    description:
      "Générateur de prompts IA avec 66+ templates professionnels. Système freemium multi-plateforme : Web, Electron Desktop, Android. Version 3.2.2 en production.",
    tags: ["Electron", "Capacitor", "JavaScript", "PWA"],
    url: "https://lepromptparfait.pro",
    urlLabel: "lepromptparfait.pro",
  },
  {
    id: "audit-ia-entreprise",
    title: "Audit IA Entreprise",
    type: "Outil de diagnostic B2B",
    description:
      "Plateforme d'évaluation de la maturité IA sur 14 secteurs. Score 0-100, rapport PDF généré par IA (Claude/GPT-4/Gemini), dashboard admin, 5 niveaux de maturité.",
    tags: ["React", "Express", "SQLite", "Claude", "GPT-4", "Gemini"],
    url: null,
    urlLabel: null,
  },
]

export const STACK = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  Backend: ["Node.js", "tRPC", "Prisma", "REST API", "Express"],
  "Bases de données": ["PostgreSQL", "SQLite", "Redis"],
  IA: ["Claude (Anthropic)", "GPT-4", "Gemini", "Multi-provider"],
  DevOps: ["Docker", "Vercel", "GitHub Actions", "PM2"],
  "Cross-platform": ["Electron", "Tauri", "Capacitor (iOS/Android)"],
  Outils: ["n8n", "Supabase", "Brevo", "Stripe"],
}

export const STATS = [
  { value: "10+", label: "Projets livrés" },
  { value: "4 374", label: "Tests automatisés" },
  { value: "9", label: "Secteurs couverts" },
  { value: "4", label: "Plateformes supportées" },
]

export const STACK_BADGES = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "tRPC",
  "IA",
  "Tailwind",
]

export const PROJECT_TYPES = [
  { value: "dev", label: "Mission de développement" },
  { value: "ia-integration", label: "Intégration IA" },
  { value: "atelier-ia", label: "Atelier IA / Formation" },
  { value: "audit-ia", label: "Audit maturité IA" },
  { value: "automatisation", label: "Automatisation N8N" },
  { value: "demo-ydv", label: "Démo YDV Systems" },
  { value: "autre", label: "Autre" },
]
