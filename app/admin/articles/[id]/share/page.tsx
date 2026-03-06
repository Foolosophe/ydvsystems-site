"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import SocialSharePanel from "@/components/admin/SocialSharePanel"

interface Article {
  id: number
  title: string
  slug: string
  status: string
}

export default function ShareArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setArticle(json.data)
        else setError("Article non trouve")
      })
      .catch(() => setError("Erreur de connexion"))
      .finally(() => setLoaded(true))
  }, [id])

  if (!loaded) return <p className="text-muted-foreground">Chargement...</p>
  if (error || !article) return (
    <div className="flex items-center gap-2 text-destructive bg-red-50 px-4 py-3 rounded-lg">
      <AlertTriangle size={16} />
      <p className="text-sm">{error || "Article non trouve"}</p>
    </div>
  )
  if (article.status !== "PUBLISHED") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm">Cet article doit etre publie avant de pouvoir etre partage.</p>
        <Link href={`/admin/articles/${id}`} className="text-sm text-primary hover:underline mt-2 inline-block">
          Retour a l&apos;article
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/admin/articles/${id}`} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partager</h1>
          <p className="text-sm text-muted-foreground">{article.title}</p>
        </div>
      </div>

      <SocialSharePanel articleId={article.id} articleSlug={article.slug} />
    </div>
  )
}
