"use client"

import { useState } from "react"
import { Languages, Loader2, CheckCircle2 } from "lucide-react"

const LOCALES = [
  { code: "en", label: "Anglais" },
  { code: "es", label: "Espagnol" },
  { code: "de", label: "Allemand" },
] as const

interface TranslateButtonProps {
  articleId: number
}

export default function TranslateButton({ articleId }: TranslateButtonProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  async function handleTranslate(locale: string) {
    setLoading(locale)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, locale }),
      })
      const json = await res.json()
      if (res.ok) {
        setDone((prev) => new Set(prev).add(locale))
      } else {
        setError(json.error || "Erreur")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-3">
      <div className="flex items-center gap-2 text-primary">
        <Languages size={18} />
        <h3 className="font-semibold text-sm">Traduction</h3>
      </div>

      <div className="space-y-2">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleTranslate(code)}
            disabled={loading !== null}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              done.has(code)
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-border text-secondary-foreground hover:border-primary hover:bg-primary/5"
            } disabled:opacity-50`}
          >
            <span>{label}</span>
            {loading === code ? (
              <Loader2 size={14} className="animate-spin" />
            ) : done.has(code) ? (
              <CheckCircle2 size={14} />
            ) : null}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
