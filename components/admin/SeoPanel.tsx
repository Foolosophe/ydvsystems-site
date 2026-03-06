"use client"

import { useState } from "react"
import { Search, Loader2, Check, Copy } from "lucide-react"

interface SeoPanelProps {
  title: string
  content: string
  excerpt: string
  slug: string
  metaDescription: string
  keywords: string
  onApply: (field: "slug" | "metaDescription" | "keywords" | "title", value: string) => void
}

interface SeoSuggestions {
  metaDescription: string
  slug: string
  keywords: string
  seoTitle: string
}

export default function SeoPanel({
  title,
  content,
  excerpt,
  slug,
  metaDescription,
  keywords,
  onApply,
}: SeoPanelProps) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SeoSuggestions | null>(null)
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  async function handleGenerate() {
    if (!title || !content || !excerpt) return
    setLoading(true)
    setError("")
    setSuggestions(null)
    setApplied(new Set())

    try {
      const res = await fetch("/api/admin/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        setSuggestions(json.data)
      } else {
        setError(json.error || "Erreur")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  function apply(field: "slug" | "metaDescription" | "keywords" | "title", value: string) {
    onApply(field, value)
    setApplied((prev) => new Set(prev).add(field))
  }

  const canGenerate = title && content && excerpt

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Search size={18} />
        <h3 className="font-semibold text-sm">SEO</h3>
      </div>

      {/* Champs actuels (lecture) */}
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-muted-foreground">Slug :</span>
          <p className="text-foreground font-mono truncate">{slug || "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Meta description :</span>
          <p className="text-foreground line-clamp-2">{metaDescription || "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Mots-cles :</span>
          <p className="text-foreground">{keywords || "—"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !canGenerate}
        className="w-full py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        Analyser le SEO
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {suggestions && (
        <div className="space-y-3">
          <SuggestionRow
            label="Titre SEO"
            value={suggestions.seoTitle}
            applied={applied.has("title")}
            onApply={() => apply("title", suggestions.seoTitle)}
          />
          <SuggestionRow
            label="Meta description"
            value={suggestions.metaDescription}
            applied={applied.has("metaDescription")}
            onApply={() => apply("metaDescription", suggestions.metaDescription)}
          />
          <SuggestionRow
            label="Slug"
            value={suggestions.slug}
            applied={applied.has("slug")}
            onApply={() => apply("slug", suggestions.slug)}
            mono
          />
          <SuggestionRow
            label="Mots-cles"
            value={suggestions.keywords}
            applied={applied.has("keywords")}
            onApply={() => apply("keywords", suggestions.keywords)}
          />
        </div>
      )}
    </div>
  )
}

function SuggestionRow({
  label,
  value,
  applied,
  onApply,
  mono,
}: {
  label: string
  value: string
  applied: boolean
  onApply: () => void
  mono?: boolean
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="p-3 rounded-lg bg-secondary border border-border space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Copier"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              applied
                ? "text-green-600 bg-green-50"
                : "text-primary hover:bg-primary/10"
            }`}
          >
            {applied ? "Applique" : "Appliquer"}
          </button>
        </div>
      </div>
      <p className={`text-xs text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  )
}
