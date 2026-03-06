"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import ArticleList from "@/components/admin/ArticleList"

interface Article {
  id: number
  title: string
  slug: string
  category: string
  status: string
  viewCount: number
  publishedAt: string | null
  updatedAt: string
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => {
        if (!r.ok) throw new Error("Erreur serveur")
        return r.json()
      })
      .then((json) => setArticles(json.data || []))
      .catch(() => setError("Impossible de charger les articles"))
      .finally(() => setLoading(false))
  }, [])

  async function handleArchive(id: number) {
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" })
    if (res.ok) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "ARCHIVED" } : a))
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerez vos articles de blog</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors shadow-sm btn-glow"
        >
          <PenSquare size={16} />
          Nouvel article
        </Link>
      </div>

      {error && <p className="text-sm text-destructive bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <ArticleList articles={articles} onArchive={handleArchive} />
      )}
    </div>
  )
}
