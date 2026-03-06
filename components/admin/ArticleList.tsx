"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Share2, Archive } from "lucide-react"

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

interface ArticleListProps {
  articles: Article[]
  onArchive: (id: number) => void
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  DRAFT: { label: "Brouillon", classes: "text-amber-700 bg-amber-50" },
  PUBLISHED: { label: "Publie", classes: "text-green-700 bg-green-50" },
  ARCHIVED: { label: "Archive", classes: "text-gray-500 bg-gray-100" },
}

export default function ArticleList({ articles, onArchive }: ArticleListProps) {
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all"
    ? articles
    : articles.filter((a) => a.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {["all", "DRAFT", "PUBLISHED", "ARCHIVED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
              filter === f
                ? "border-primary text-primary bg-primary/5 shadow-sm"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {f === "all" ? "Tous" : STATUS_LABELS[f]?.label || f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) divide-y divide-border">
        {filtered.map((article) => {
          const status = STATUS_LABELS[article.status] || STATUS_LABELS.DRAFT
          return (
            <div
              key={article.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-medium text-foreground truncate">{article.title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.classes}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="font-medium">{article.category}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {article.viewCount}
                  </span>
                  <span>
                    {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </Link>
                {article.status === "PUBLISHED" && (
                  <Link
                    href={`/admin/articles/${article.id}/share`}
                    className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </Link>
                )}
                {article.status !== "ARCHIVED" && (
                  <button
                    onClick={() => onArchive(article.id)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-red-50 transition-colors"
                    title="Archiver"
                  >
                    <Archive size={16} />
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun article</p>
        )}
      </div>
    </div>
  )
}
