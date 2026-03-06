"use client"

import { PenLine, Sparkles, Wand2 } from "lucide-react"

export type ArticleMode = "libre" | "assiste" | "genere"

interface ModeSelectorProps {
  value: ArticleMode
  onChange: (mode: ArticleMode) => void
}

const MODES = [
  {
    id: "libre" as const,
    label: "Libre",
    description: "Redigez vous-meme",
    icon: PenLine,
  },
  {
    id: "assiste" as const,
    label: "Assiste",
    description: "Gemini vous aide",
    icon: Sparkles,
  },
  {
    id: "genere" as const,
    label: "Genere",
    description: "Gemini redige",
    icon: Wand2,
  },
]

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MODES.map(({ id, label, description, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
            value === id
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-white text-secondary-foreground hover:border-primary/30 hover:bg-secondary"
          }`}
        >
          <Icon size={24} />
          <span className="font-medium text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </button>
      ))}
    </div>
  )
}
