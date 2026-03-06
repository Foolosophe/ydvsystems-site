"use client"

import { useMemo, useState } from "react"
import { extractSections, replaceSection } from "@/lib/ai/section-utils"
import { RefreshCw, Loader2, History } from "lucide-react"

interface SectionManagerProps {
  articleId?: number
  content: string
  onContentChange: (html: string) => void
}

export default function SectionManager({ articleId, content, onContentChange }: SectionManagerProps) {
  const sections = useMemo(() => extractSections(content), [content])
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState<string | null>(null)
  const [history, setHistory] = useState<{ heading: string; content: string; version: number; createdAt: string }[]>([])
  const [error, setError] = useState("")

  if (sections.length === 0) return null

  async function handleRegenerate(heading: string, sectionContent: string) {
    setRegenerating(heading)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          heading,
          sectionContent,
          fullContent: content,
        }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        const newHtml = replaceSection(content, heading, json.data)
        onContentChange(newHtml)
      } else {
        setError(json.error || "Erreur de regeneration")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setRegenerating(null)
    }
  }

  async function loadHistory(heading: string) {
    if (showHistory === heading) {
      setShowHistory(null)
      return
    }
    if (!articleId) return
    setShowHistory(heading)

    try {
      const res = await fetch(`/api/admin/articles/${articleId}`)
      const json = await res.json()
      if (json.data?.sectionVersions) {
        setHistory(
          json.data.sectionVersions
            .filter((v: { heading: string }) => v.heading === heading)
            .sort((a: { version: number }, b: { version: number }) => b.version - a.version)
        )
      }
    } catch {
      setHistory([])
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-3">
      <h3 className="font-semibold text-sm text-foreground">Sections ({sections.length})</h3>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="space-y-2">
        {sections.map(({ heading, content: sectionContent }) => (
          <div key={heading} className="p-3 rounded-lg bg-secondary border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground truncate flex-1">{heading}</span>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {articleId && (
                  <button
                    type="button"
                    onClick={() => loadHistory(heading)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Historique"
                  >
                    <History size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRegenerate(heading, sectionContent)}
                  disabled={regenerating !== null}
                  className="p-1 rounded text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                  title="Regenerer cette section"
                >
                  {regenerating === heading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                </button>
              </div>
            </div>

            {showHistory === heading && history.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-border pt-2">
                <p className="text-[10px] text-muted-foreground">Versions precedentes :</p>
                {history.map((v) => (
                  <button
                    key={v.version}
                    type="button"
                    onClick={() => {
                      const newHtml = replaceSection(content, heading, v.content)
                      onContentChange(newHtml)
                    }}
                    className="w-full text-left p-2 rounded bg-white border border-border text-[10px] text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                  >
                    v{v.version} — {new Date(v.createdAt).toLocaleDateString("fr-FR")}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
