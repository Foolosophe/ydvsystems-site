"use client"

export type ArticleLength = "short" | "medium" | "long"

interface LengthSelectorProps {
  value: ArticleLength
  onChange: (length: ArticleLength) => void
}

const LENGTHS = [
  { id: "short" as const, label: "Court", detail: "500-700 mots" },
  { id: "medium" as const, label: "Moyen", detail: "1000-1400 mots" },
  { id: "long" as const, label: "Long", detail: "1800-2200 mots" },
]

export default function LengthSelector({ value, onChange }: LengthSelectorProps) {
  return (
    <div className="flex gap-2">
      {LENGTHS.map(({ id, label, detail }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all duration-200 ${
            value === id
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border text-secondary-foreground hover:border-primary/30 hover:bg-secondary"
          }`}
        >
          <span className="font-medium">{label}</span>
          <span className="block text-xs text-muted-foreground">{detail}</span>
        </button>
      ))}
    </div>
  )
}
