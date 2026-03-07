import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RelatedArticle {
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage: string | null
}

interface Props {
  articles: RelatedArticle[]
  title: string
  readArticleLabel: string
}

export function RelatedArticles({ articles, title, readArticleLabel }: Props) {
  if (articles.length === 0) return null

  return (
    <div className="mt-14 pt-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
            <Card className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
              {article.coverImage && (
                <div className="h-32 overflow-hidden">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 flex-1 flex flex-col">
                <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs w-fit mb-2">
                  {article.category}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-secondary-foreground leading-relaxed mb-2 flex-1 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold group-hover:gap-2 transition-all">
                  {readArticleLabel}
                  <ArrowRight size={12} />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
