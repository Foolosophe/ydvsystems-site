// Technical data only — all translatable text is in messages/{locale}.json under "data.solutionPages"

export const SOLUTION_FEATURE_ICONS: Record<string, string[]> = {
  insertion: ["Users", "Calendar", "Brain", "BarChart3", "Shield", "FileText"],
  formation: ["BookOpen", "FileText", "CheckSquare", "Award"],
  coaching: ["Target", "ClipboardCheck", "FileText", "Calendar"],
  manager: ["Users", "CreditCard", "BarChart3", "Plug"],
}

export const SOLUTION_SLUGS = ["insertion", "formation", "coaching", "manager"] as const

export const SOLUTIONS_WITH_TESTIMONIAL: readonly string[] = ["insertion"]
