// Technical data only — all translatable text is in messages/{locale}.json under "data.solutionPages"

export const SOLUTION_FEATURE_ICONS: Record<string, string[]> = {
  insertion: ["Users", "Calendar", "Brain", "BarChart3", "FileText", "Shield", "MapPin", "Briefcase", "ClipboardList", "Building2"],
  formation: ["BookOpen", "Calendar", "CheckSquare", "TrendingUp", "FileText", "Award", "UserCheck", "FileSignature", "Wallet", "Brain"],
  coaching: ["Target", "GraduationCap", "ClipboardCheck", "Star", "Calendar", "Eye", "FileSignature", "DoorOpen", "Brain"],
  manager: ["Users", "Building2", "Receipt", "CreditCard", "Package", "LifeBuoy", "DoorOpen", "BarChart3", "Brain"],
}

export const SOLUTION_SLUGS = ["insertion", "formation", "coaching", "manager"] as const

export const SOLUTIONS_WITH_TESTIMONIAL: readonly string[] = []
