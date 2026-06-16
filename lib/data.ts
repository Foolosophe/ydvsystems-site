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
    priceValue: 63,
    priceMonthly: 79,
    url: "https://insertion.ydvsystems.com",
  },
  {
    slug: "formation",
    name: "YDV Formation",
    color: "#6366f1",
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    status: "prod" as const,
    priceValue: 55,
    priceMonthly: 69,
    url: "https://formation.ydvsystems.com",
  },
  {
    slug: "coaching",
    name: "YDV Coaching",
    color: "#10b981",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    status: "prod" as const,
    priceValue: 47,
    priceMonthly: 59,
    url: "https://coaching.ydvsystems.com",
  },
  {
    slug: "manager",
    name: "YDV Manager",
    color: "#f59e0b",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    status: "prod" as const,
    priceValue: 39,
    priceMonthly: 49,
    url: "https://manager.ydvsystems.com",
  },
]

// --- SERVICES FREELANCE ---

export const SERVICE_IDS = [
  "dev-sur-mesure",
  "integration-ia",
  "atelier-ia",
  "audit-ia",
  "automatisation",
  "retainer",
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
  "retainer": "CalendarClock",
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
  "retainer": [],
  "cross-platform": ["Tauri", "Electron", "Capacitor", "React"],
  "jeux-narratifs": ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
  "accessibilite": ["React", "Node.js"],
}

export const SERVICE_PREVIEW_IDS = SERVICE_IDS.slice(0, 4)

// --- PORTFOLIO ---

export const PORTFOLIO_IDS = [
  "ydv-systems",
  "presence-pro",
  "moteur-jeu",
  "pills-stadium",
  "prompt-parfait",
  "audit-ia-entreprise",
  "blog-parkinson",
] as const

export const PORTFOLIO_CATEGORIES: Record<string, "pro" | "perso"> = {
  "ydv-systems": "pro",
  "presence-pro": "pro",
  "prompt-parfait": "pro",
  "audit-ia-entreprise": "pro",
  "blog-parkinson": "pro",
  "moteur-jeu": "perso",
  "pills-stadium": "perso",
}

export const PORTFOLIO_PREVIEW_IDS = ["ydv-systems", "moteur-jeu", "prompt-parfait"] as const

export const GAME_URLS: Record<string, string> = {
  "moteur-jeu": "https://dracula.ydvsystems.com",
  "pills-stadium": "https://kart.ydvsystems.com",
}

export const PORTFOLIO_TECH: Record<string, { tags: string[]; url: string | null; urlLabel: string | null }> = {
  "ydv-systems": {
    tags: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "IA", "RBAC"],
    url: "https://ydvsystems.com/solutions",
    urlLabel: "ydvsystems.com/solutions",
  },
  "presence-pro": {
    tags: ["Astro", "React", "TypeScript", "Tailwind", "Drizzle", "PostgreSQL"],
    url: "https://presence-pro.ydvsystems.com",
    urlLabel: "presence-pro.ydvsystems.com",
  },
  "moteur-jeu": {
    tags: ["React", "TypeScript", "Tauri", "Capacitor", "Web Audio API"],
    url: "https://dracula.ydvsystems.com",
    urlLabel: "dracula.ydvsystems.com",
  },
  "pills-stadium": {
    tags: ["Three.js", "JavaScript", "WebGL", "Node.js"],
    url: "https://kart.ydvsystems.com",
    urlLabel: "kart.ydvsystems.com",
  },
  "prompt-parfait": {
    tags: ["Electron", "Capacitor", "JavaScript", "PWA"],
    url: "https://lepromptparfait.pro",
    urlLabel: "lepromptparfait.pro",
  },
  "audit-ia-entreprise": {
    tags: ["React", "Express", "SQLite", "Claude", "GPT-4", "Gemini"],
    url: "https://diagnosticia.ydvsystems.com",
    urlLabel: "diagnosticia.ydvsystems.com",
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
  frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Astro", "Tailwind CSS", "shadcn/ui", "Three.js", "WebGL", "Web Audio API", "GSAP"],
  backend: ["Node.js", "tRPC", "Prisma", "Drizzle", "Zod", "bcrypt", "JWT", "REST API", "Express"],
  databases: ["PostgreSQL", "SQLite", "Redis"],
  ai: ["Claude (Anthropic)", "GPT-4", "Gemini", "Whisper", "Multi-provider"],
  devops: ["Docker", "Coolify", "Nginx", "Let's Encrypt", "Hetzner", "GitHub Actions", "PM2", "Sentry", "Borgbackup"],
  crossPlatform: ["Electron", "Tauri", "Capacitor (iOS/Android)", "PWA"],
  tools: ["n8n", "Supabase", "Brevo", "Stripe", "Cal.com", "Umami", "Cloudflare Turnstile", "Meta WhatsApp API", "pnpm", "Turborepo", "Vitest", "Playwright"],
}

// --- STATS ---

export const STATS = [
  { value: "10+" },
  { value: "7 225" },
  { value: "9" },
  { value: "4" },
]

export const STACK_BADGES = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "Prisma", "tRPC", "IA", "Tailwind",
]
