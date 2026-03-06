"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2 } from "lucide-react"

interface PublishButtonProps {
  articleId: number
  status: string
}

export default function PublishButton({ articleId, status }: PublishButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handlePublish() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/publish`, {
        method: "POST",
      })
      if (res.ok) {
        router.push(`/admin/articles/${articleId}/share`)
      } else {
        const json = await res.json()
        setError(json.error || "Erreur de publication")
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

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-destructive">{error}</span>}
      <button
        onClick={handlePublish}
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
