"use client"

import { useState } from "react"
import { Search, Loader2, BookOpen, Lightbulb, Quote } from "lucide-react"

interface ResearchResult {
  topic: string
  findings: string[]
  suggestedSources: string[]
  keyFacts: string[]
}

interface ResearchPanelProps {
  subject: string
  angle?: string
  onInsertSources?: (sources: string) => void
}

export default function ResearchPanel({ subject, angle, onInsertSources }: ResearchPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [error, setError] = useState("")

  async function handleResearch() {
    if (!subject) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "research", subject, angle }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        setResult(json.data)
      } else {
        setError(json.error || "Erreur de recherche")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  function handleInsert() {
    if (!result || !onInsertSources) return
    const text = [
      `Recherche : ${result.topic}`,
      "",
      "Constats :",
      ...result.findings.map((f) => `- ${f}`),
      "",
      "Sources suggerees :",
      ...result.suggestedSources.map((s) => `- ${s}`),
      "",
      "Faits cles :",
      ...result.keyFacts.map((f) => `- ${f}`),
    ].join("\n")
    onInsertSources(text)
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <BookOpen size={18} />
        <h3 className="font-semibold text-sm">Recherche IA</h3>
      </div>

      <button
        type="button"
        onClick={handleResearch}
        disabled={loading || !subject}
        className="w-full py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        Rechercher sur le sujet
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
              <Lightbulb size={12} />
              Constats
            </div>
            <ul className="space-y-1">
              {result.findings.map((f, i) => (
                <li key={i} className="text-xs text-secondary-foreground pl-3 border-l-2 border-primary/20">{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
              <Quote size={12} />
              Sources suggerees
            </div>
            <ul className="space-y-1">
              {result.suggestedSources.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium text-foreground mb-1.5">Faits cles</div>
            <ul className="space-y-1">
              {result.keyFacts.map((f, i) => (
                <li key={i} className="text-xs text-secondary-foreground bg-secondary rounded px-2 py-1">{f}</li>
              ))}
            </ul>
          </div>

          {onInsertSources && (
            <button
              type="button"
              onClick={handleInsert}
              className="text-xs text-primary font-medium hover:underline"
            >
              Inserer dans le champ sources
            </button>
          )}
        </div>
      )}
    </div>
  )
}
