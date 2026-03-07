"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, ClipboardCheck } from "lucide-react"

interface PublishButtonProps {
  articleId: number
  status: string
  checklistProgress?: number
}

export default function PublishButton({ articleId, status, checklistProgress = 100 }: PublishButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleAction(targetStatus: string) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetStatus }),
      })
      if (res.ok) {
        if (targetStatus === "PUBLISHED") {
          router.push(`/admin/articles/${articleId}/share`)
        } else {
          router.refresh()
          window.location.reload()
        }
      } else {
        const json = await res.json()
        setError(json.error || "Erreur")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  if (status === "PUBLISHED") {
    return (
      <button
        onClick={() => router.push(`/admin/articles/${articleId}/share`)}
        className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-colors flex items-center gap-2"
      >
        <Send size={16} />
        Partager
      </button>
    )
  }

  if (status === "REVIEW") {
    const canPublish = checklistProgress >= 100
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-destructive">{error}</span>}
        <button
          onClick={() => handleAction("DRAFT")}
          disabled={loading}
          className="px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Retour brouillon
        </button>
        <button
          onClick={() => handleAction("PUBLISHED")}
          disabled={loading || !canPublish}
          title={!canPublish ? "Completez la checklist pour publier" : undefined}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm btn-glow"
        >
          <span key={loading ? "loading" : "idle"}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </span>
          Publier
        </button>
      </div>
    )
  }

  // DRAFT — publier directement
  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-destructive">{error}</span>}
      <button
        onClick={() => handleAction("PUBLISHED")}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm btn-glow"
      >
        <span key={loading ? "loading" : "idle"}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </span>
        Publier
      </button>
    </div>
  )
}
