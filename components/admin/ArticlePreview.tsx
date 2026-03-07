"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import { countWords, readingTime } from "@/lib/blog/wordCount"

interface ArticlePreviewProps {
  title: string
  content: string
  category: string
  excerpt: string
  coverImage?: string
}

export default function ArticlePreview({ title, content, category, excerpt, coverImage }: ArticlePreviewProps) {
  const words = countWords(content)
  const readTime = readingTime(words)
  const today = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-xs text-muted-foreground bg-secondary border border-border rounded-lg px-3 py-1.5 mb-6 inline-block">
        Apercu — rendu identique au blog public
      </div>

      <article>
        {coverImage && (
          <img
            src={coverImage}
            alt={title || "Couverture"}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}
        <header className="mb-10">
          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-4">
            {category || "Categorie"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            {title || "Titre de l'article"}
          </h1>
          {excerpt && (
            <p className="text-secondary-foreground text-lg mb-4 leading-relaxed">{excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {today}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} min
            </span>
          </div>
        </header>

        <div
          className="prose-custom space-y-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-secondary-foreground [&_p]:leading-relaxed [&_pre]:bg-secondary [&_pre]:border [&_pre]:border-border [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:text-sm [&_code]:text-foreground [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: content || "<p>Commencez a rediger pour voir l'apercu...</p>" }}
        />

        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              YD
            </div>
            <div>
              <p className="font-semibold text-foreground">Yohann Dandeville</p>
              <p className="text-sm text-muted-foreground">Fondateur & Developpeur — YdvSystems</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
