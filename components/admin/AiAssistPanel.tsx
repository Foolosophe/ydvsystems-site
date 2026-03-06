"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"

interface AiAssistPanelProps {
  selectedText: string
  content: string
  onInsert: (text: string) => void
}

const ACTIONS = [
  { id: "reformulate", label: "Reformuler" },
  { id: "complete", label: "Completer" },
  { id: "shorten", label: "Raccourcir" },
  { id: "expand", label: "Developper" },
  { id: "titles", label: "Suggerer 3 titres" },
] as const

export default function AiAssistPanel({ selectedText, content, onInsert }: AiAssistPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  async function handleAction(action: string) {
    if (action === "titles" ? !content : !selectedText) return
    setLoading(true)
    setResult("")

    try {
      const res = await fetch("/api/admin/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text: action === "titles" ? content : selectedText }),
      })

      const json = await res.json()
      if (res.ok && json.data) {
        setResult(json.data)
      } else {
        setResult(json.error || "Erreur")
      }
    } catch {
      setResult("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles size={18} />
        <h3 className="font-semibold text-sm">Assistance Gemini</h3>
      </div>

      {selectedText ? (
        <p className="text-xs text-muted-foreground line-clamp-2 bg-secondary rounded-lg px-3 py-2">
          &laquo; {selectedText.slice(0, 100)}
          {selectedText.length > 100 ? "..." : ""} &raquo;
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Selectionnez du texte dans l&apos;editeur
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleAction(id)}
            disabled={loading || (id === "titles" ? !content : !selectedText)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 size={14} className="animate-spin" />
          Generation en cours...
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-secondary border border-border text-sm text-foreground whitespace-pre-wrap">
            {result}
          </div>
          <button
            type="button"
            onClick={() => onInsert(result)}
            className="text-xs text-primary font-medium hover:underline"
          >
            Inserer dans l&apos;editeur
          </button>
        </div>
      )}
    </div>
  )
}
