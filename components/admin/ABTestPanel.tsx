"use client"

import { useEffect, useState } from "react"
import { FlaskConical, Plus, Trophy, Trash2, Loader2 } from "lucide-react"

interface Variant {
  id: number
  title: string
  views: number
  clicks: number
  isWinner: boolean
  isActive: boolean
  createdAt: string
}

export default function ABTestPanel({ articleId, currentTitle }: { articleId: number; currentTitle: string }) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchVariants()
  }, [articleId])

  async function fetchVariants() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ab/${articleId}`)
      const json = await res.json()
      if (json.data) setVariants(json.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    const title = newTitle.trim() || currentTitle
    if (!title) return
    setAdding(true)
    try {
      await fetch(`/api/admin/ab/${articleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      setNewTitle("")
      await fetchVariants()
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(variantId: number) {
    await fetch(`/api/admin/ab/${articleId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId }),
    })
    await fetchVariants()
  }

  function ctr(views: number, clicks: number): string {
    if (views === 0) return "—"
    return ((clicks / views) * 100).toFixed(1) + "%"
  }

  const hasTest = variants.length >= 2
  const winner = variants.find((v) => v.isWinner)

  return (
    <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-5">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">A/B Testing titres</h3>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Chargement...</p>
      ) : (
        <>
          {winner && (
            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-green-50 border border-green-200">
              <Trophy size={14} className="text-green-600" />
              <span className="text-xs text-green-700 font-medium">Gagnant determine !</span>
            </div>
          )}

          {variants.length > 0 && (
            <div className="space-y-2 mb-4">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
                    v.isWinner
                      ? "border-green-300 bg-green-50"
                      : v.isActive
                        ? "border-border bg-secondary"
                        : "border-border bg-secondary/50 opacity-60"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{v.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                      <span>{v.views} vues</span>
                      <span>{v.clicks} clics</span>
                      <span className="font-medium text-foreground">CTR {ctr(v.views, v.clicks)}</span>
                      {v.isWinner && <Trophy size={12} className="text-green-600" />}
                    </div>
                  </div>
                  {!v.isWinner && (
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!winner && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={variants.length === 0 ? currentTitle : "Nouveau titre variant..."}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:bg-(--accent-hover) transition-colors disabled:opacity-50"
                >
                  {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Ajouter
                </button>
              </div>
              {!hasTest && variants.length > 0 && (
                <p className="text-xs text-muted-foreground">Ajoutez au moins 2 variants pour demarrer le test.</p>
              )}
              {hasTest && (
                <p className="text-xs text-muted-foreground">
                  Test actif — resolution automatique apres 48h et 30 vues/variant minimum.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
