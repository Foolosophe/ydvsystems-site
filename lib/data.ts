// Données techniques du site YdvSystems
// Les textes affichables sont dans messages/{locale}.json

// --- SOLUTIONS SaaS ---

export const SOLUTIONS = [
  {
    slug: "insertion",
    name: "YDV Insertion",
    color: "#14b8a6",
    textColor: "text-teal-600",
    bgColor: "bg-teal-50",
    status: "prod" as const,
    priceValue: 59,
    priceMonthly: 71,
    url: "https://insertion.ydvsystems.com",
  },
  {
    slug: "formation",
    name: "YDV Formation",
    color: "#6366f1",
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    status: "prod" as const,
    priceValue: 49,
    priceMonthly: 59,
    url: "https://insertion.ydvsystems.com",
  },
  {
    slug: "coaching",
    name: "YDV Coaching",
    color: "#10b981",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    status: "soon" as const,
    priceValue: 39,
    priceMonthly: 47,
    url: null,
  },
  {
    slug: "manager",
    name: "YDV Manager",
    color: "#f59e0b",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    status: "soon" as const,
    priceValue: 29,
    priceMonthly: 35,
    url: null,
  },
]

// --- SERVICES FREELANCE ---

export const SERVICE_IDS = [
  "dev-sur-mesure",
  "integration-ia",
  "atelier-ia",
  "audit-ia",
  "automatisation",
  "cross-platform",
  "jeux-narratifs",
  "accessibilite",
] as const

export const SERVICE_ICONS: Record<string, string> = {
  "dev-sur-mesure": "Code2",
  "integration-ia": "Brain",
  "atelier-ia": "GraduationCap",
  "audit-ia": "ClipboardCheck",
  "automatisation": "Workflow",
  "cross-platform": "MonitorSmartphone",
  "jeux-narratifs": "Gamepad2",
  "accessibilite": "Heart",
}

export const SERVICE_TECH_TAGS: Record<string, string[]> = {
  "dev-sur-mesure": ["Next.js", "tRPC", "PostgreSQL", "TypeScript"],
  "integration-ia": ["Claude", "GPT-4", "Gemini", "API"],
  "atelier-ia": [],
  "audit-ia": [],
  "automatisation": ["n8n", "Supabase", "Brevo", "Stripe"],
  "cross-platform": ["Tauri", "Electron", "Capacitor", "React"],
  "jeux-narratifs": ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
  "accessibilite": ["React", "Node.js"],
}

export const SERVICE_PREVIEW_IDS = SERVICE_IDS.slice(0, 4)

// --- PORTFOLIO ---

export const PORTFOLIO_IDS = [
  "ydv-systems",
  "moteur-jeu",
  "prompt-parfait",
  "audit-ia-entreprise",
  "blog-parkinson",
] as const

export const PORTFOLIO_PREVIEW_IDS = PORTFOLIO_IDS.slice(0, 3)

export const PORTFOLIO_TECH: Record<string, { tags: string[]; url: string | null; urlLabel: string | null }> = {
  "ydv-systems": {
    tags: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "IA"],
    url: "https://insertion.ydvsystems.com",
    urlLabel: "insertion.ydvsystems.com",
  },
  "moteur-jeu": {
    tags: ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
    url: null,
    urlLabel: null,
  },
  "prompt-parfait": {
    tags: ["Electron", "Capacitor", "JavaScript", "PWA"],
    url: "https://lepromptparfait.pro",
    urlLabel: "lepromptparfait.pro",
  },
  "audit-ia-entreprise": {
    tags: ["React", "Express", "SQLite", "Claude", "GPT-4", "Gemini"],
    url: null,
    urlLabel: null,
  },
  "blog-parkinson": {
    tags: ["Next.js", "Express", "SQLite", "Claude", "Whisper"],
    url: "https://lesmotsdemarilyn.ydvsystems.com",
    urlLabel: "lesmotsdemarilyn.ydvsystems.com",
  },
}

// --- STACK ---

export const STACK_CATEGORY_KEYS = [
  "frontend",
  "backend",
  "databases",
  "ai",
  "devops",
  "crossPlatform",
  "tools",
] as const

export const STACK_TECHS: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Three.js"],
  backend: ["Node.js", "tRPC", "Prisma", "REST API", "Express"],
  databases: ["PostgreSQL", "SQLite", "Redis"],
  ai: ["Claude (Anthropic)", "GPT-4", "Gemini", "Multi-provider"],
  devops: ["Docker", "Hetzner", "GitHub Actions", "PM2"],
  crossPlatform: ["Electron", "Tauri", "Capacitor (iOS/Android)"],
  tools: ["n8n", "Supabase", "Brevo", "Stripe"],
}

// --- STATS ---

export const STATS = [
  { value: "10+" },
  { value: "4 253" },
  { value: "9" },
  { value: "4" },
]

export const STACK_BADGES = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "Prisma", "tRPC", "IA", "Tailwind",
]
