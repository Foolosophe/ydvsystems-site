"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import SocialPlatformCard from "./SocialPlatformCard"

const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "TWITTER", "LINKEDIN", "EMAIL"] as const

interface SocialSharePanelProps {
  articleId: number
  articleSlug: string
}

export default function SocialSharePanel({ articleId, articleSlug }: SocialSharePanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [posts, setPosts] = useState<Record<string, string | { subject: string; body: string }>>({})
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [error, setError] = useState("")

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")
  const articleUrl = `${siteUrl}/fr/blog/${articleSlug}`

  function togglePlatform(platform: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(platform)) next.delete(platform)
      else next.add(platform)
      return next
    })
  }

  async function handleGenerate() {
    if (selected.size === 0) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          platforms: Array.from(selected),
        }),
      })

      const json = await res.json()
      if (res.ok && json.data) {
        setPosts(json.data)
      } else {
        setError(json.error || "Erreur de generation")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate(platform: string) {
    setRegenerating(platform)
    setError("")
    try {
      const res = await fetch("/api/admin/ai/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, platforms: [platform] }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        setPosts((prev) => ({ ...prev, ...json.data }))
      } else {
        setError(json.error || "Erreur de regeneration")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Plateformes</h3>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                selected.has(p)
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border text-secondary-foreground hover:border-primary/30 hover:bg-secondary"
              }`}
            >
              {p === "TWITTER" ? "Twitter / X" : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || selected.size === 0}
        className="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm btn-glow"
      >
        <span key={loading ? "loading" : "idle"}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
        </span>
        <span>Generer les posts</span>
      </button>

      {error && <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {Object.keys(posts).length > 0 && (
        <div className="space-y-4">
          {Object.entries(posts).map(([platform, content]) => (
            <SocialPlatformCard
              key={platform}
              platform={platform}
              content={content}
              articleUrl={articleUrl}
              onRegenerate={handleRegenerate}
              regenerating={regenerating === platform}
            />
          ))}
        </div>
      )}
    </div>
  )
}
